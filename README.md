# La Pesca del Futbolista

Minijuego web estático preparado para publicar directamente con **GitHub Pages**.

## Archivos

- `index.html` — estructura del juego.
- `style.css` — diseño, responsive y animaciones.
- `script.js` — lógica, rondas, vidas y validación.

## Publicarlo en GitHub Pages

1. Crea un repositorio en GitHub.
2. Sube `index.html`, `style.css`, `script.js` y este `README.md` a la raíz del repositorio.
3. En GitHub entra en **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Selecciona la rama `main` y la carpeta `/ (root)`.
6. Guarda. GitHub generará la dirección de GitHub Pages.

No hay dependencias externas ni servidor: funciona como una web estática.

## Mecánica actual

- 5 pruebas de dificultad creciente.
- 3 vidas.
- Animación de lanzamiento de la caña, línea, boya y salpicadura.
- Pistas visuales de posición, bandera y liga.
- Validación tolerante de nombres: ignora mayúsculas/minúsculas, tildes y admite alias definidos para cada objetivo.
- Código final al superar las 5 pruebas: **15: 2ULE**.

## Importante sobre la validación

La versión inicial utiliza cinco objetivos definidos en `script.js` y valida sus formas habituales de escritura. Si quieres ampliar el juego para que acepte **cualquier jugador del mundo que cumpla las tres pistas**, habría que ampliar la base de datos de jugadores o conectarla a una fuente de datos externa.
