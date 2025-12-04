// ----- CONFIG -----

// Clé locale pour stocker les votes
const STORAGE_KEY = 'weIglooPolls_v1';

// Config des sondages (doit correspondre aux data-poll/data-option du HTML)
const POLL_CONFIG = {
  logement: ['igloo', 'snow-cave', 'igloo-plus'],
  fitness: ['faible', 'moyen', 'bon', 'excellent']
};

// Nombre d'inscrits actuel (à ajuster manuellement ou plus tard via API/Google Sheet)
const REGISTERED_COUNT = 0;

// ----- UTILS LOCALSTORAGE -----

function loadPollData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Structure initiale : tous les compteurs à 0
      return {
        logement: { igloo: 0, 'snow-cave': 0, 'igloo-plus': 0 },
        fitness: { faible: 0, moyen: 0, bon: 0, excellent: 0 }
      };
    }
    const parsed = JSON.parse(raw);
    // Sécurise en s’assurant que toutes les clés existent
    Object.keys(POLL_CONFIG).forEach(pollName => {
      if (!parsed[pollName]) parsed[pollName] = {};
      POLL_CONFIG[pollName].forEach(option => {
        if (typeof parsed[pollName][option] !== 'number') {
          parsed[pollName][option] = 0;
        }
      });
    });
    return parsed;
  } catch (e) {
    return {
      logement: { igloo: 0, 'snow-cave': 0, 'igloo-plus': 0 },
      fitness: { faible: 0, moyen: 0, bon: 0, excellent: 0 }
    };
  }
}

function savePollData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // silencieux
  }
}

// En option : empêcher de voter plusieurs fois par sondage (sur ce navigateur)
function hasVoted(pollName) {
  try {
    const flag = localStorage.getItem(`${STORAGE_KEY}_voted_${pollName}`);
    return flag === 'true';
  } catch {
    return false;
  }
}

function setVoted(pollName) {
  try {
    localStorage.setItem(`${STORAGE_KEY}_voted_${pollName}`, 'true');
  } catch {
    // silencieux
  }
}

// ----- AFFICHAGE DES SONDAGES -----

function updatePollDisplay(pollData) {
  // Pour chaque sondage (logement, fitness, etc.)
  Object.keys(POLL_CONFIG).forEach(pollName => {
    const options = POLL_CONFIG[pollName];
    const pollResults = pollData[pollName] || {};
    const total = options.reduce((sum, opt) => sum + (pollResults[opt] || 0), 0);

    options.forEach(option => {
      const count = pollResults[option] || 0;
      const percent = total > 0 ? Math.round((count / total) * 100) : 0;

      // Ids dans le HTML : `${pollName}-${option}` et `${pollName}-${option}-count`
      const bar = document.getElementById(`${pollName}-${option}`);
      const countSpan = document.getElementById(`${pollName}-${option}-count`);

      if (bar) {
        bar.style.width = `${percent}%`;
      }
      if (countSpan) {
        countSpan.textContent = `${count} (${percent}%)`;
      }
    });
  });
}

// ----- GESTION DES CLICS SUR LES BOUTONS DE SONDAGE -----

function setupPollButtons() {
  const buttons = document.querySelectorAll('.poll-btn');
  const pollData = loadPollData();
  updatePollDisplay(pollData);

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const pollName = btn.getAttribute('data-poll');
      const option = btn.getAttribute('data-option');

      if (!pollName || !option || !POLL_CONFIG[pollName]) {
        return;
      }

      // Option : empêcher plusieurs votes sur un sondage
      if (hasVoted(pollName)) {
        alert('Tu as déjà répondu à ce sondage sur cet appareil.');
        return;
      }

      // Incrémente le vote
      if (!pollData[pollName]) pollData[pollName] = {};
      if (typeof pollData[pollName][option] !== 'number') {
        pollData[pollName][option] = 0;
      }
      pollData[pollName][option] += 1;

      savePollData(pollData);
      setVoted(pollName);
      updatePollDisplay(pollData);
    });
  });
}

// ----- NAVIGATION SMOOTH (liens du menu) -----

function setupSmoothNav() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ----- COMPTEUR D'INSCRITS -----

function setupRegisteredCounter() {
  const span = document.getElementById('registered-count');
  if (span) {
    span.textContent = REGISTERED_COUNT.toString();
  }
}

// ----- INIT -----

document.addEventListener('DOMContentLoaded', () => {
  setupPollButtons();
  setupSmoothNav();
  setupRegisteredCounter();
});

