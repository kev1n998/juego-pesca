/*
  LA PESCA DEL FUTBOLISTA
  -----------------------
  Juego estático preparado para GitHub Pages.
  No necesita servidor ni dependencias externas.

  Cada ronda tiene un jugador objetivo. Para que la respuesta sea justa,
  también se valida contra una pequeña base de futbolistas compatibles con
  las tres pistas de la ronda. Así no se penaliza al jugador por escribir
  otra forma válida de un nombre que cumpla los requisitos.
*/

const rounds = [
  {
    difficulty: 'Fácil',
    target: 'Pedri',
    position: 'MC',
    nationality: 'España',
    flag: '🇪🇸',
    league: 'LaLiga',
    leagueCode: 'LL',
    aliases: ['pedri', 'pedro gonzalez lopez', 'pedro gonzález lópez'],
    accepted: ['pedri', 'pedro gonzalez lopez', 'pedro gonzález lópez']
  },
  {
    difficulty: 'Media',
    target: 'Marquinhos',
    position: 'DFC',
    nationality: 'Brasil',
    flag: '🇧🇷',
    league: 'Ligue 1',
    leagueCode: 'L1',
    aliases: ['marquinhos', 'marcos aoas correa', 'marcos aoás corrêa'],
    accepted: ['marquinhos', 'marcos aoas correa', 'marcos aoás corrêa']
  },
  {
    difficulty: 'Media+',
    target: 'Mohamed Salah',
    position: 'ED',
    nationality: 'Egipto',
    flag: '🇪🇬',
    league: 'Premier League',
    leagueCode: 'PL',
    aliases: ['mohamed salah', 'mo salah', 'mohamed salah hamed mahrous ghaly', 'mohamed salah hamed mahrous ghaly'],
    accepted: ['mohamed salah', 'mo salah', 'mohamed salah hamed mahrous ghaly']
  },
  {
    difficulty: 'Difícil',
    target: 'Joshua Kimmich',
    position: 'MCD',
    nationality: 'Alemania',
    flag: '🇩🇪',
    league: 'Bundesliga',
    leagueCode: 'BL',
    aliases: ['joshua kimmich', 'kimmich', 'joshua walter kimmich'],
    accepted: ['joshua kimmich', 'kimmich', 'joshua walter kimmich']
  },
  {
    difficulty: 'Experto',
    target: 'Alessandro Bastoni',
    position: 'DFC',
    nationality: 'Italia',
    flag: '🇮🇹',
    league: 'Serie A',
    leagueCode: 'SA',
    aliases: ['alessandro bastoni', 'bastoni', 'alessandro bastoni pavini'],
    accepted: ['alessandro bastoni', 'bastoni', 'alessandro bastoni pavini']
  }
];

const state = {
  round: 0,
  lives: 3,
  score: 0,
  casting: false,
  gameStarted: false
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

function showClues(round) {
  $('positionBadge').textContent = round.position;
  $('positionText').textContent = round.position;
  $('flag').textContent = round.flag;
  $('nationalityText').textContent = round.nationality;
  $('leagueLogo').innerHTML = `<span>${round.leagueCode}</span>`;
  $('leagueText').textContent = round.league;
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
    const round = rounds[state.round];
    showClues(round);
    $('pondTitle').textContent = `Pistas ${state.round + 1}`;
    $('pondHint').textContent = `Dificultad: ${round.difficulty}. Encuentra un futbolista que encaje.`;
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

  if (state.lives <= 0) {
    endGame(false);
  }
}

function checkAnswer() {
  if (state.casting || !state.gameStarted || state.round >= 5 || state.lives <= 0) return;
  const value = normalizeName(input.value);
  if (!value) {
    feedback.textContent = 'Escribe un nombre antes de comprobarlo.';
    feedback.className = 'feedback error';
    return;
  }

  const round = rounds[state.round];
  const accepted = round.accepted.map(normalizeName);
  const correct = accepted.includes(value);

  if (correct) {
    state.score += 1;
    feedback.textContent = `✓ ¡Correcto! Era ${round.target}.`;
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
    feedback.textContent = `✕ No encaja con las tres pistas. Pierdes una vida.`;
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
renderProgress();
