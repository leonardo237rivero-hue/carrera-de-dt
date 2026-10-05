// Simulador headless: juega carreras completas sin navegador para verificar balance.
// Uso:  node herramientas/simular.js
// Compara un DT "que sabe" (idea coherente, plan según los rivales, rota por forma
// y cansancio) contra uno que elige al azar, en los tres modos y los tres tipos de oferta.
const fs=require('fs'), path=require('path');
const {codigo}=require('./carga.js');
eval(codigo()+"\n"+fs.readFileSync(path.join(__dirname,'pruebas.js'),'utf8'));
