#!/bin/bash
# Pente fino antes de subir. Cobre os erros que o build NÃO pega.
set -u; falhas=0
cd "$(dirname "$0")"

echo "1. Build"
npx vite build >/dev/null 2>&1 && echo "   ok" || { echo "   FALHOU"; falhas=$((falhas+1)); }

echo "2. Ordem de declaração (TDZ em useMemo e dependências)"
python3 verificar-ordem.py | sed 's/^/   /'
python3 verificar-ordem.py >/dev/null 2>&1 || falhas=$((falhas+1))

echo "3. .catch em consulta Supabase (o builder não é Promise)"
n=$(grep -oE "from\('[a-z_0-9]+'\)[^;]{0,200}\.catch\(" src/App.jsx | grep -vc "fetch(" || true)
[ "$n" = "0" ] && echo "   ok" || { echo "   $n ocorrência(s)"; falhas=$((falhas+1)); }

echo "4. Componentes usados sem importar"
python3 - <<'PY'
import re,sys
src=open('src/App.jsx').read()
m=re.search(r"from\s+['\"]lucide-react['\"]",src)
ini=src[:m.start()].rfind('import')
imp=set(re.findall(r'\b([A-Z][A-Za-z0-9]*)\b',src[ini:m.start()]))
defin=set(re.findall(r'^(?:function|const)\s+([A-Z][A-Za-z0-9]*)',src,re.M))
loc=set(re.findall(r'const\s+([A-Z][A-Za-z0-9]*)\s*=',src))
# Remove comentários e strings antes de procurar componentes: "<SEM PROJETO>"
# num comentário e "<INSIGHT>" dentro do prompt da IA não são JSX.
limpo=re.sub(r'//[^\n]*','',src)
limpo=re.sub(r'/\*.*?\*/','',limpo,flags=re.S)
limpo=re.sub(r'`(?:[^`\\]|\\.)*`','``',limpo)
limpo=re.sub(r"'(?:[^'\\\n]|\\.)*'","''",limpo)
usados=set(re.findall(r'<([A-Z][A-Za-z0-9]*)[\s/>]',limpo))
recharts={'Bar','CartesianGrid','Cell','LabelList','Legend','Line','LineChart','Pie',
          'ResponsiveContainer','Tooltip','XAxis','YAxis','BarChart','PieChart','Area','AreaChart'}
falta=sorted(usados-imp-defin-loc-recharts-{'React','Fragment'})
print('   ok' if not falta else '   FALTAM: '+', '.join(falta))
sys.exit(1 if falta else 0)
PY
[ $? -eq 0 ] || falhas=$((falhas+1))

echo "5. Erros reais de lint (fora variável não usada)"
n=$(npx eslint src/App.jsx 2>&1 | grep -E " error " | grep -vcE "no-unused-vars|no-empty" || true)
[ "$n" = "0" ] && echo "   ok" || { npx eslint src/App.jsx 2>&1 | grep -E " error " | grep -vE "no-unused-vars|no-empty" | head -5 | sed 's/^/   /'; falhas=$((falhas+1)); }

echo "6. Carregamento em navegador simulado"
npm install --no-save jsdom >/dev/null 2>&1
cat > ./.smoke.mjs <<'EOF'
import { JSDOM } from 'jsdom'; import fs from 'fs';
const b=fs.readdirSync('dist/assets').find(f=>f.endsWith('.js'));
let falhou=null;
for(const url of ['https://localhost/','https://localhost/?manutencao=solicitar','https://localhost/?rac=1']){
  const dom=new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>',
    {runScripts:'outside-only',pretendToBeVisual:true,url});
  dom.window.fetch=()=>Promise.resolve({ok:true,json:()=>Promise.resolve({})});
  dom.window.matchMedia=()=>({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
  try{dom.window.eval(fs.readFileSync(`dist/assets/${b}`,'utf8'));}
  catch(e){falhou=`${url}: ${String(e.message||e).split('\n')[0]}`;break;}
}
if(falhou){console.log('   FALHOU '+falhou);process.exit(1);}
console.log('   ok');
EOF
node ./.smoke.mjs 2>/dev/null || falhas=$((falhas+1))
rm -f ./.smoke.mjs

echo
[ "$falhas" = "0" ] && echo "TUDO LIMPO" || echo "$falhas verificação(ões) falharam"
exit $falhas
