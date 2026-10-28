#!/usr/bin/env python3
"""
Procura uso de const antes da declaração — erro que o build NÃO pega.

Só importa o que é avaliado DURANTE a renderização:
  - listas de dependências de useEffect/useMemo/useCallback
  - o CORPO de useMemo (roda na renderização)
O corpo de useEffect roda depois da renderização e o de useCallback só quando
chamado, então esses são seguros e ficam de fora para não gerar ruído.
"""
import re, sys

L = open('src/App.jsx').read().split('\n')
ini = next(i for i, l in enumerate(L) if l.startswith('export default function App'))

decl = re.compile(r'^\s{2}const (?:\[([^\]]+)\]|([A-Za-z_$][\w$]*))')
d = {}
for i in range(ini, len(L)):
    m = decl.match(L[i])
    if not m:
        continue
    nomes = [x.strip() for x in m.group(1).split(',')] if m.group(1) else [m.group(2)]
    for n in nomes:
        if n and n not in d:
            d[n] = i

palavra = re.compile(r'\b([A-Za-z_$][\w$]*)\b')
# Fecha de três formas no arquivo: "},[deps]);", ",[deps]);" em linha própria
# e "},[deps]);" indentado. Não reconhecer todas fazia o bloco se estender e
# gerar falso positivo.
# Qualquer linha que encerre o hook: termina com "[deps]);". Cobre as várias
# formas do arquivo ("},[x]);", ",[x]);", "}),{...}),[x]);").
fecha = re.compile(r'\[[^\]]*\]\s*\)\s*;\s*$')
problemas = []

# 1) corpo de useMemo
i = ini
while i < len(L):
    if 'useMemo(' in L[i]:
        j = i
        while j < len(L) and not fecha.match(L[j]):
            j += 1
        for nome in set(palavra.findall('\n'.join(L[i:j + 1]))):
            if nome in d and i < d[nome] and d[nome] > j:
                problemas.append((i + 1, nome, d[nome] + 1, 'corpo de useMemo'))
        i = j
    i += 1

# 2) listas de dependências
for i in range(ini, len(L)):
    m = re.search(r'\},?\[([^\]]*)\]\);', L[i])
    if not m:
        continue
    for dep in m.group(1).split(','):
        x = dep.strip()
        if re.fullmatch(r'[A-Za-z_$][\w$]*', x) and x in d and d[x] > i:
            problemas.append((i + 1, x, d[x] + 1, 'dependência'))

if problemas:
    for uso, nome, dec, onde in sorted(set(problemas)):
        print(f'  linha {uso} ({onde}): usa "{nome}" declarado so na linha {dec}')
    sys.exit(1)
print('  nenhum')
