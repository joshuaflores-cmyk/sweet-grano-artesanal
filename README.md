# Sweet Grano — sitio web

Sitio web estático de Sweet Grano. Contiene la página, los estilos, el código JavaScript, los modelos 3D y los fotogramas de la portada. No requiere instalar dependencias ni ejecutar un proceso de compilación.

## Estructura

- `index.html`: contenido principal.
- `style.css`, `hero-sequence.css`, `product-3d.css`: estilos.
- `app.js`, `hero-sequence.js`, `product-3d.js`: comportamiento del catálogo, la secuencia y los modelos.
- `assets/sequence/desktop` y `assets/sequence/mobile`: fotogramas optimizados de la portada.
- `assets/fuentes/video-portada.mp4`: video original usado para generar la secuencia.
- `assets/models/`: modelos `.glb` usados en la web, archivos `.blend` editables sus imágenes de carga y las texturas editables en `textures/`.
- `assets/`: logo, imágenes y fuentes locales.
- `vendor/`: visor de modelos 3D y su licencia.

## Ejecutarlo en tu computadora

Usa un servidor web local: abrir `index.html` directamente con doble clic puede impedir que el navegador cargue los modelos y los fotogramas.

1. Descomprime el archivo y abre una terminal dentro de la carpeta `Sweet-Grano`.
2. En Windows ejecuta `py -m http.server 8000`. En macOS o Linux ejecuta `python3 -m http.server 8000`.
3. Abre `http://localhost:8000` en el navegador.
4. Para detener el servidor, presiona `Ctrl+C` en la terminal.

Si usas Visual Studio Code también puedes abrir la carpeta con una extensión de servidor local, como Live Server.

## Subirlo a tu repositorio de GitHub

Sube **el contenido de la carpeta `Sweet-Grano`** a la raíz de tu repositorio, de modo que `index.html` quede en la raíz y las carpetas `assets` y `vendor` conserven su estructura. Puedes hacerlo con GitHub Desktop o Git desde la terminal.

La secuencia contiene cientos de fotogramas. Si utilizas la página web de GitHub para cargar archivos, tendrás que subirlos por lotes y mantener sus carpetas; GitHub Desktop o Git suelen resultar más prácticos para subir toda la carpeta.

Para publicar con GitHub Pages, entra en **Settings → Pages**, elige **Deploy from a branch**, selecciona la rama que subiste y la carpeta **/(root)**. GitHub mostrará la dirección del sitio cuando termine la publicación. Revisa la disponibilidad de GitHub Pages para la visibilidad y el plan de tu repositorio.

## Modelos 3D

Los archivos `.blend` de `assets/models/` se pueden abrir y editar en Blender; usan texturas incluidas en `assets/models/textures/` y el logo en `assets/logo.png`; conserva esas rutas junto a los modelos. La web utiliza los correspondientes `.glb`. Si editas un modelo en Blender, debes volver a exportarlo en formato GLB y reemplazar el archivo correspondiente para que el cambio aparezca en la web.

## Notas

- El catálogo y el cálculo de importes son demostrativos; no se procesan pedidos ni pagos.
- La secuencia de portada utiliza fotogramas extraídos del video incluido en `assets/fuentes/`. El video original no se necesita para ejecutar el sitio.
- Los modelos se muestran con `model-viewer`, distribuido dentro de `vendor/` junto con su licencia.
- Esta copia no incluye el historial Git ni la configuración de publicación privada de Sites; puedes asociarla a tu propio repositorio.
