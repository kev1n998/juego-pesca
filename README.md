# La Pesca del Futbolista — V3

Versión para GitHub Pages, sin servidor ni dependencias.

## Novedad de la V3

- Base de **114 jugadores** de distintas ligas y equipos.
- Cada partida selecciona **5 jugadores al azar** y no repite jugador dentro de la partida.
- Progresión: Fácil → Media → Difícil → Experto → Experto.
- Las pistas son posición, nacionalidad y equipo.
- Se aceptan mayúsculas/minúsculas, tildes y algunas formas habituales del nombre.
- Se mantienen 3 vidas y el código final **15: 2ULE**.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo.
2. Sube `index.html`, `style.css`, `players.js` y `script.js`.
3. En Settings → Pages, selecciona `Deploy from a branch`.
4. Elige `main` y `/root`.
5. Guarda y abre la URL que te proporciona GitHub.

Los datos de jugadores están incluidos localmente en `players.js`, por lo que el juego funciona sin backend.
