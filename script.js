/*
  LA PESCA DEL FUTBOLISTA — V3
  Base de 100+ jugadores y selección aleatoria por dificultad.
  Cada partida usa 5 jugadores distintos: uno de cada nivel.
*/

const DIFFICULTIES = ['Fácil', 'Media', 'Difícil', 'Experto'];

const state = {
  round: 0,
  lives: 3,
  score: 0,
  casting: false,
  gameStarted: false,
  selectedPlayers: []
};

const $ = (id) => document.getElementById(id);
const castButton = $('castButton');
const startButton = $('startButton');
const checkButton = $('checkButton');
const restartButton = $('restartButton');
const input = $('playerInput');
const feedback = $('feedback');
const pondCard = $('pondCard');

function normalizeName(value) {
  return value
    .toLocaleLowerCase('es-ES')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’'`´.-]/g, ' ')
    .replace(/[^a-z0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function makeAliases(player) {
  const aliases = new Set(player.aliases || []);
  const parts = player.name.split(' ');
  if (parts.length >= 2) {
    const surname = parts[parts.length - 1];
    if (surname.length >= 5) aliases.add(surname);
  }
  aliases.add(player.name);
  return [...aliases].map(normalizeName);
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function choosePlayers() {
  // Cinco pruebas: fácil, media, difícil y dos expertos.
  const chosen = [];
  const used = new Set();
  const pools = DIFFICULTIES.map(d => shuffle(PLAYER_DATABASE.filter(p => p.difficulty === d)));

  const pickFrom = (pool) => {
    const candidate = pool.find(p => !used.has(p.name));
    if (!candidate) return null;
    used.add(candidate.name);
    return candidate;
  };

  // Primera ronda fácil, segunda media, tercera difícil y dos rondas expertas.
  [pools[0], pools[1], pools[2], pools[3], pools[3]].forEach(pool => {
    const candidate = pickFrom(pool);
    if (candidate) chosen.push(candidate);
  });

  // Salvaguarda por si se modifica la base en el futuro.
  while (chosen.length < 5) {
    const fallback = shuffle(PLAYER_DATABASE).find(p => !used.has(p.name));
    if (!fallback) break;
    used.add(fallback.name);
    chosen.push(fallback);
  }
  return chosen;
}

function renderLives() {
  $('lives').innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const heart = document.createElement('span');
    heart.className = `heart ${i >= state.lives ? 'dead' : ''}`;
    heart.textContent = '♥';
    $('lives').appendChild(heart);
  }
}

function renderProgress() {
  $('roundLabel').textContent = `PRUEBA ${Math.min(state.round + 1, 5)} / 5`;
  $('progressBar').style.width = `${(state.score / 5) * 100 || 0}%`;
  $('score').textContent = `${state.score} / 5`;
}

function resetRoundUI() {
  $('clues').classList.add('hidden');
  $('answerPanel').classList.add('hidden');
  $('feedback').textContent = '';
  $('feedback').className = 'feedback';
  input.value = '';
}

function showClues(player) {
  $('positionBadge').textContent = player.position;
  $('positionText').textContent = player.position;
  $('flag').textContent = player.flag;
  $('nationalityText').textContent = player.nationality;
  $('teamLogo').innerHTML = `<span>${player.teamCode}</span>`;
  $('teamText').textContent = player.team;
  $('clues').classList.remove('hidden');
  $('answerPanel').classList.remove('hidden');
  setTimeout(() => input.focus(), 250);
}

function cast() {
  if (!state.gameStarted || state.casting || state.lives <= 0 || state.round >= 5) return;
  state.casting = true;
  castButton.disabled = true;
  resetRoundUI();
  pondCard.classList.remove('pulse');
  void pondCard.offsetWidth;
  pondCard.classList.add('casting');
  $('pondTitle').textContent = '¡Ha picado algo!';
  $('pondHint').textContent = 'Recogiendo las pistas…';

  setTimeout(() => {
    pondCard.classList.remove('casting');
    const player = state.selectedPlayers[state.round];
    showClues(player);
    $('pondTitle').textContent = `Pistas ${state.round + 1}`;
    $('pondHint').textContent = `Dificultad: ${player.difficulty}. Encuentra un futbolista que encaje.`;
    state.casting = false;
    castButton.disabled = true;
  }, 1500);
}

function loseLife() {
  state.lives -= 1;
  renderLives();
  input.value = '';
  input.focus();
  $('answerPanel').classList.add('shake');
  setTimeout(() => $('answerPanel').classList.remove('shake'), 450);

  if (state.lives <= 0) endGame(false);
}

function checkAnswer() {
  if (state.casting || !state.gameStarted || state.round >= 5 || state.lives <= 0) return;
  const value = normalizeName(input.value);
  if (!value) {
    feedback.textContent = 'Escribe un nombre antes de comprobarlo.';
    feedback.className = 'feedback error';
    return;
  }

  const player = state.selectedPlayers[state.round];
  const correct = makeAliases(player).includes(value);

  if (correct) {
    state.score += 1;
    feedback.textContent = `✓ ¡Correcto! Era ${player.name}.`;
    feedback.className = 'feedback ok';
    renderProgress();
    $('answerPanel').classList.add('pulse');
    setTimeout(() => $('answerPanel').classList.remove('pulse'), 550);

    if (state.score === 5) {
      setTimeout(() => endGame(true), 900);
      return;
    }

    state.round += 1;
    setTimeout(() => {
      resetRoundUI();
      $('pondTitle').textContent = '¿Qué jugador picará?';
      $('pondHint').textContent = 'Lanza la caña para descubrir las tres pistas.';
      castButton.disabled = false;
      renderProgress();
    }, 1000);
  } else {
    feedback.textContent = '✕ No encaja con las tres pistas. Pierdes una vida.';
    feedback.className = 'feedback error';
    loseLife();
  }
}

function endGame(won) {
  state.gameStarted = false;
  castButton.disabled = true;
  checkButton.disabled = true;
  input.disabled = true;
  $('clues').classList.add('hidden');
  $('answerPanel').classList.add('hidden');
  $('startPanel').classList.add('hidden');
  $('endPanel').classList.remove('hidden');

  if (won) {
    $('endIcon').textContent = '🏆';
    $('endTitle').textContent = '¡Enhorabuena!';
    $('endMessage').textContent = 'Has conseguido superar las cinco pruebas. Ya tienes todas las piezas, solo queda insertarlo en el orden y el lugar correcto.';
    $('finalCode').classList.remove('hidden');
  } else {
    $('endIcon').textContent = '🎣';
    $('endTitle').textContent = '¡Se acabaron las vidas!';
    $('endMessage').textContent = `Has conseguido ${state.score} de 5 pruebas. La caña vuelve al agua… pero todavía puedes intentarlo de nuevo.`;
    $('finalCode').classList.add('hidden');
  }
}

function startGame() {
  state.round = 0;
  state.lives = 3;
  state.score = 0;
  state.casting = false;
  state.gameStarted = true;
  state.selectedPlayers = choosePlayers();
  input.disabled = false;
  checkButton.disabled = false;
  $('endPanel').classList.add('hidden');
  $('startPanel').classList.add('hidden');
  $('pondTitle').textContent = '¿Qué jugador picará?';
  $('pondHint').textContent = 'Lanza la caña para descubrir las tres pistas.';
  castButton.disabled = false;
  resetRoundUI();
  renderLives();
  renderProgress();
}

startButton.addEventListener('click', startGame);
castButton.addEventListener('click', cast);
checkButton.addEventListener('click', checkAnswer);
restartButton.addEventListener('click', startGame);
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') checkAnswer();
});

renderLives();
