# OLD_SCHOOL [TOXIC]

Landing estática de la alianza para Gladiatus, servidor español 64.

## Desarrollo

```sh
pnpm install
pnpm dev
```

Para generar la web: `pnpm build`. Para revisar la versión generada: `pnpm preview`.

## Enlaces

Copia `.env.example` como `.env` y configura `PUBLIC_WHATSAPP_URL` y, si es necesario, `PUBLIC_GLADIATUS_URL`. El botón de WhatsApp solo aparece cuando se indica una URL. Estos valores se incorporan a la web al compilar y son públicos: no pongas contraseñas ni identificadores de sesión. Vuelve a compilar después de cambiarlos.

Los miembros se editan en `src/pages/index.astro`. La lista facilitada es parcial. Las fuentes Cinzel Decorative, Cinzel y Alegreya se cargan desde Google Fonts; son alternativas de estilo romano, no fuentes verificadas del juego. El fondo es una ilustración generada y el emblema fue aportado por la alianza.

## SEO

Configura `PUBLIC_SITE_URL` con la URL HTTPS definitiva antes de compilar para generar la URL canónica y las etiquetas de redes sociales. En local se omiten. El sitio debe publicarse y ser accesible a buscadores antes de poder indexarse.

## Publicación

El flujo de GitHub Actions publica en GitHub Pages. Para activar el enlace público de WhatsApp, añade la variable de repositorio `PUBLIC_WHATSAPP_URL` en Settings → Secrets and variables → Actions → Variables y vuelve a ejecutar el flujo. Su valor será visible en la web publicada.
