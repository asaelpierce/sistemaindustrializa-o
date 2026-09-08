# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Correção: saldo travado na sincronização de estoque (set/2026)

A edge function `sankhya-stock-sync` filtrava a consulta por uma **lista fixa
de códigos de produto acabado** (`VW.CODPRODPA IN (...)`). Só as matérias-primas
pertencentes ao BOM desses PAs tinham o saldo atualizado.

Qualquer item fora dessa lista — tipicamente os cadastrados depois, pela busca
individual no Sankhya — ficava com o **saldo congelado permanentemente**, por
mais que se apertasse "atualizar saldo". Eram 74 itens nessa situação.

A função agora roda uma **segunda consulta** de saldo cobrindo todos os códigos
já presentes em `estoque_mp`, independentemente de estarem no BOM da lista.
Sintoma diagnóstico: `saldo_almoxarifado IS NULL` indicava item nunca tocado
pela sincronização completa.
