# Documentación técnica

La referencia generada del código reutilizable del frontend se encuentra en
`docs/generated` después de ejecutar:

```bash
npm run docs
```

La documentación se genera con TypeDoc a partir de la carpeta `lib`, que
contiene el cliente de API, las acciones administrativas, los tipos del
dominio y las utilidades compartidas.

La especificación OpenAPI de la API REST pertenece al repositorio backend y no
se duplica en este frontend.
