"""Blender 2.80+: extruye la silueta del emblema existente y produce masters reutilizables.
blender --background --python herramientas/render-escudos.py -- catalogo.json directorio-salida
No reconstruye letras con IA; la cara utiliza exactamente el PNG del catálogo.
"""
import bpy, math, os, sys, json
from mathutils import Vector

def simplify(points, epsilon=1.25):
    if len(points)<3: return points
    a,b=points[0],points[-1]
    dx,dy=b[0]-a[0],b[1]-a[1]
    den=math.hypot(dx,dy)
    ds=[abs(dy*p[0]-dx*p[1]+b[0]*a[1]-b[1]*a[0])/den if den else math.hypot(p[0]-a[0],p[1]-a[1]) for p in points]
    i=max(range(len(ds)),key=ds.__getitem__)
    if ds[i]>epsilon:return simplify(points[:i+1],epsilon)[:-1]+simplify(points[i:],epsilon)
    return [a,b]

def outline(image):
    w,h=image.size
    pixels=list(image.pixels)
    # Sample alpha on a bounded grid, preserving the original image for texture.
    scale=min(1.0,512/max(w,h)); gw,gh=max(2,int(w*scale)),max(2,int(h*scale))
    cells={(x,y) for y in range(gh) for x in range(gw) if pixels[(min(h-1,int((y+.5)/scale))*w+min(w-1,int((x+.5)/scale)))*4+3]>.5}
    edges={}
    for x,y in cells:
        for outside,a,b in [((x,y-1),(x,y),(x+1,y)),((x+1,y),(x+1,y),(x+1,y+1)),((x,y+1),(x+1,y+1),(x,y+1)),((x-1,y),(x,y+1),(x,y))]:
            if outside not in cells:edges.setdefault(a,[]).append(b)
    loops=[]
    while edges:
        start=next(iter(edges));p=start;loop=[]
        while p in edges:
            loop.append(p);q=edges[p].pop()
            if not edges[p]:del edges[p]
            p=q
            if p==start:break
        if len(loop)>3:loops.append(loop)
    def area(p):return sum(p[i][0]*p[(i+1)%len(p)][1]-p[(i+1)%len(p)][0]*p[i][1] for i in range(len(p)))/2
    result=[]
    # Each positive loop is a separate opaque island, including letters and detached stars.
    # Negative loops are transparent holes in the artwork, preserved by the face texture.
    for loop in loops:
        if area(loop)<2:continue
        mid=len(loop)//2;loop=simplify(loop[:mid+1])[:-1]+simplify(loop[mid:]+[loop[0]])[:-1]
        if len(loop)<3:continue
        for _ in range(2):
            smooth=[]
            for i,p in enumerate(loop):
                q=loop[(i+1)%len(loop)]
                smooth.extend([(.75*p[0]+.25*q[0],.75*p[1]+.25*q[1]),(.25*p[0]+.75*q[0],.25*p[1]+.75*q[1])])
            loop=smooth
        result.append([(x/gw,y/gh) for x,y in loop])
    return result

def material(name,color,metal=0,rough=.3):
    m=bpy.data.materials.new(name);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*color,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
    return m

def aim(obj,at=(0,0,0)):obj.rotation_euler=(Vector(at)-obj.location).to_track_quat('-Z','Y').to_euler()

def build(item,out):
    bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
    img=bpy.data.images.load(item['source'],check_existing=False);img.pack()
    contours=outline(img);side=2.1
    # Front enamel, a beveled metal rim, full solid sidewall and closed back.
    rings=[(.992,.085),(1.012,.068),(1.012,-.068),(.992,-.085)]
    verts=[];faces=[];types=[];coords=[]
    for points in contours:
        n=len(points);offset=len(verts)
        verts.extend([((x-.5)*side*s,(y-.5)*side*s,z) for s,z in rings for x,y in points]);coords.extend(points*4)
        faces.extend([tuple(offset+i for i in range(n)),tuple(offset+i for i in reversed(range(3*n,4*n)))]);types.extend([0,2])
        for ring in range(3):
            for i in range(n):
                j=(i+1)%n;faces.append(tuple(offset+k for k in (ring*n+j,ring*n+i,(ring+1)*n+i,(ring+1)*n+j)));types.append(1)
    mesh=bpy.data.meshes.new(item['slug']+'_solid');mesh.from_pydata(verts,[],faces);mesh.update()
    obj=bpy.data.objects.new(item['slug']+'_crest',mesh);bpy.context.collection.objects.link(obj)
    front=material('Enamel '+item['club'],(.8,.8,.8),.12,.25)
    tex=front.node_tree.nodes.new('ShaderNodeTexImage');tex.image=img
    front.node_tree.links.new(tex.outputs['Color'],front.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])
    # Source alpha preserves any internal cutouts; solid back and rim remain explicit.
    front.node_tree.links.new(tex.outputs['Alpha'],front.node_tree.nodes.get('Principled BSDF').inputs['Alpha']);front.blend_method='CLIP'
    metal=material('Brushed champagne edge',(.55,.43,.25),.8,.26)
    back=material('Graphite back',(.035,.045,.05),.55,.34)
    obj.data.materials.append(front);obj.data.materials.append(metal);obj.data.materials.append(back)
    for poly in mesh.polygons:poly.material_index=types[poly.index]
    for poly in mesh.polygons:
        if poly.material_index==1:poly.use_smooth=True
    uv=mesh.uv_layers.new(name='UVMap')
    for poly in mesh.polygons:
        for li in poly.loop_indices:
            vi=mesh.loops[li].vertex_index;uv.data[li].uv=coords[vi]
    # Keep export orientation upright, front facing -Y; no nonuniform scaling.
    obj.rotation_euler=(math.radians(90),0,0)
    bpy.context.view_layer.objects.active=obj;obj.select_set(True)
    bpy.ops.object.transform_apply(location=False,rotation=True,scale=True)
    triangulate=obj.modifiers.new('Portable triangles','TRIANGULATE')
    bpy.ops.object.modifier_apply(modifier=triangulate.name)
    target=os.path.join(out,item['slug']);os.makedirs(target,exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=os.path.join(target,item['slug']+'.glb'),export_format='GLB',export_selected=True)
    bpy.ops.export_scene.fbx(filepath=os.path.join(target,item['slug']+'.fbx'),use_selection=True,object_types={'MESH'},path_mode='COPY',embed_textures=True,axis_forward='-Z',axis_up='Y')
    scene=bpy.context.scene;scene.render.engine='BLENDER_EEVEE';scene.eevee.taa_render_samples=96
    scene.eevee.use_gtao=True;scene.eevee.gtao_distance=3;scene.eevee.gtao_factor=1.25
    scene.render.resolution_x=768;scene.render.resolution_y=768;scene.render.resolution_percentage=100
    scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.render.film_transparent=True
    scene.view_settings.view_transform='Standard';scene.view_settings.look='None';scene.view_settings.exposure=0;scene.view_settings.gamma=1
    scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.3,.35,.42,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.3
    for name,pos,power,size,color in [('Key',(-3,-4,5),550,4,(1,.94,.84)),('Fill',(4,-3,1),350,3,(.78,.88,1)),('Rim',(1,2,4),700,3,(1,.93,.78))]:
        data=bpy.data.lights.new(name,'AREA');data.energy=power;data.size=size;data.color=color
        light=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(light);light.location=pos;aim(light)
    cam_data=bpy.data.cameras.new('Product camera');cam=bpy.data.objects.new('Product camera',cam_data);bpy.context.collection.objects.link(cam)
    cam.location=(2.3,-6.2,1.5);aim(cam);cam_data.type='ORTHO';cam_data.ortho_scale=2.7;scene.camera=cam
    scene.render.filepath=os.path.join(target,item['slug']+'.png')
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(target,item['slug']+'.blend'))
    bpy.ops.render.render(write_still=True)
    print('CREST_DONE '+item['slug'],flush=True)

args=sys.argv[sys.argv.index('--')+1:]
with open(args[0],encoding='utf-8-sig') as f:catalog=json.load(f)
for item in catalog:
    item['source']=os.path.abspath(os.path.join(os.path.dirname(args[0]),item['source']))
    build(item,os.path.abspath(args[1]))
