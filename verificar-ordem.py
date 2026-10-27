import re,sys
L=open('src/App.jsx').read().split('\n')
ini=next(i for i,l in enumerate(L) if l.startswith('export default function App'))
nome=re.compile(r'^[A-Za-z_$][\w$]*$')
decl=re.compile(r'^\s{2}const (?:\[)?([A-Za-z_$][\w$]*)')
d={}
for i in range(ini,len(L)):
    m=decl.match(L[i])
    if m and m.group(1) not in d: d[m.group(1)]=i
p=[]
for i in range(ini,len(L)):
    m=re.search(r'\},\[([^\]]*)\]\);',L[i])
    if not m: continue
    for dep in m.group(1).split(','):
        x=dep.strip()
        if nome.match(x) and x in d and d[x]>i:
            p.append(f'  linha {i+1}: "{x}" declarado so na {d[x]+1}')
print('\n'.join(p) if p else '  nenhum')
