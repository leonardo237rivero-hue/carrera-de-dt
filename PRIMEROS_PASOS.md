# Cómo subir esto a GitHub

El repositorio ya está armado y tiene su primer commit. Sólo falta enchufarlo a tu cuenta.

## 1. Crear el repositorio vacío en GitHub

Entrá a github.com → New repository.

- Nombre: `carrera-de-dt`
- Público
- **No** marques "Add a README", "Add .gitignore" ni licencia. Tiene que quedar vacío,
  porque acá ya está todo.

## 2. Subirlo

Desde la carpeta del proyecto, en la terminal:

```bash
git remote add origin https://github.com/TU_USUARIO/carrera-de-dt.git
git branch -M main
git push -u origin main
```

Si te pide contraseña, GitHub ya no acepta la de la cuenta: hay que generar un token en
Settings → Developer settings → Personal access tokens, y usarlo como contraseña.

## 3. Publicar la página

En el repositorio: Settings → Pages.

- Source: **Deploy from a branch**
- Branch: **main**, carpeta **/ (root)**
- Guardar.

En un par de minutos queda en:

```
https://TU_USUARIO.github.io/carrera-de-dt/
```

Actualizá el enlace del README con esa dirección.

## 4. Seguir trabajando con Claude Code

```bash
npm install -g @anthropic-ai/claude-code
cd carrera-de-dt
claude
```

Ya dentro, alcanza con algo así:

> Leé docs/BACKLOG.md y arrancá con la tanda 3. Antes de cada cambio corré
> `node herramientas/simular.js` para ver que el balance no se rompa, y hacé
> un commit por cada punto del backlog.

Claude Code trabaja directo sobre los archivos, ve el historial de git y puede correr
el simulador solo. Eso es lo que acá no se podía hacer.

## 5. Probarlo local mientras trabajás

El juego está dividido en varios archivos, así que abrirlo con doble clic no alcanza.
Necesita un servidor mínimo:

```bash
python3 -m http.server 8000
```

Y abrís http://localhost:8000

## Flujo de trabajo recomendado

```bash
git checkout -b nombre-del-cambio   # rama por cada cosa
# ... trabajás ...
node herramientas/simular.js        # verificás balance
git add -A && git commit -m "qué hiciste"
git checkout main && git merge nombre-del-cambio
git push
```

Si un cambio de balance rompe algo, con `git log` encontrás dónde y con
`git revert` lo deshacés sin perder el resto.
