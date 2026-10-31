# AGENTS.md

## Proyecto

Landing estática de la alianza OLD_SCHOOL [TOXIC] de Gladiatus, servidor español 64. Código en `src/pages/index.astro` y `src/styles/global.css`; ilustraciones y sprites en `public/images/`.

## Forma de trabajo

- Comunica en español, de forma concisa. Usa pnpm y revisa `git status` antes de modificar archivos; preserva cambios existentes.
- Mantén la estética romana chibi kawaii, la legibilidad y la navegación por teclado. Comprueba escritorio y móvil cuando el navegador esté disponible; respeta `prefers-reduced-motion` y evita que las ilustraciones tapen contenido.
- Los 11 miembros y rangos conocidos son una lista parcial, no datos en tiempo real. No publiques la fortuna ni información de actividad privada. `NOTAS_WEB.md` es local y está excluido de Git.
- La guía de rotativos es información facilitada por la alianza y está pendiente de verificar: conserva su advertencia. No presentes funcionalidades ni datos en vivo sin comprobarlos.
- No guardes credenciales, identificadores de sesión o enlaces privados en el código. Las variables `PUBLIC_` son visibles para visitantes; el enlace de WhatsApp se muestra solo cuando está configurado.

## Verificación y publicación

- Ejecuta `pnpm build` tras cambiar la web. Para cambios de interacción o diseño, prueba el comportamiento real en navegador y comprueba varios anchos; si no es posible, indica la limitación.
- Repositorio: `cdryampi/old-school-toxic`, rama `main`. Comprueba la identidad activa antes de acciones en GitHub. Un push a `main` despliega automáticamente la web pública mediante `.github/workflows/pages.yml`.
- GitHub Pages sirve bajo `/old-school-toxic/`: `scripts/prepare-pages.mjs` adapta las rutas de recursos tras el build. Si cambian rutas, SEO o el flujo, verifica que CSS, imágenes y canonical funcionen también bajo ese prefijo.
- No hagas commits, pushes ni despliegues salvo que el usuario lo solicite. No modifiques servicios externos ajenos al encargo.
