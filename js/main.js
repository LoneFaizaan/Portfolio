const nav = document.getElementById('nav');
const body = document.body;
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const entryOverlay = document.getElementById('entryOverlay');
const enterSiteButton = document.getElementById('enterSiteButton');
const audioToggle = document.getElementById('audioToggle');
const mobileAudioToggle = document.getElementById('mobileAudioToggle');

const AUDIO_STORAGE_KEY = 'portfolio-audio-muted';
const YOUTUBE_API_SRC = 'https://www.youtube.com/iframe_api';
const YOUTUBE_VIDEO_ID = '25N1pdzvp4c';
const DEFAULT_VOLUME = 6;

const audioState = {
  hasEntered: false,
  isMuted: localStorage.getItem(AUDIO_STORAGE_KEY) === 'true',
  player: null,
  playerReady: false,
};

let youtubeApiPromise;

function syncBodyLock() {
  const shouldLockBody =
    (entryOverlay && !entryOverlay.classList.contains('hidden')) ||
    mobileMenu.classList.contains('open');

  body.classList.toggle('overlay-open', shouldLockBody);
}

function setMenuOpen(isOpen) {
  hamburger.classList.toggle('open', isOpen);
  mobileMenu.classList.toggle('open', isOpen);
  syncBodyLock();
}

function updateAudioButtons() {
  [audioToggle, mobileAudioToggle].forEach((button) => {
    if (!button) {
      return;
    }

    button.textContent = audioState.isMuted ? 'Unmute Music' : 'Mute Music';
    button.classList.toggle('is-muted', audioState.isMuted);
    button.setAttribute('aria-pressed', String(audioState.isMuted));
  });
}

function syncAudioPlayback() {
  if (!audioState.playerReady || !audioState.player) {
    return;
  }

  audioState.player.setVolume(DEFAULT_VOLUME);

  if (audioState.hasEntered && !audioState.isMuted) {
    audioState.player.unMute();
  } else {
    audioState.player.mute();
  }

  audioState.player.playVideo();
}

function toggleMute() {
  audioState.isMuted = !audioState.isMuted;
  localStorage.setItem(AUDIO_STORAGE_KEY, String(audioState.isMuted));
  updateAudioButtons();
  syncAudioPlayback();
}

function loadYouTubeApi() {
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }

  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise((resolve) => {
      const previousReady = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        if (typeof previousReady === 'function') {
          previousReady();
        }

        resolve(window.YT);
      };

      if (!document.querySelector(`script[src="${YOUTUBE_API_SRC}"]`)) {
        const script = document.createElement('script');
        script.src = YOUTUBE_API_SRC;
        script.async = true;
        document.head.appendChild(script);
      }
    });
  }

  return youtubeApiPromise;
}

function setupBackgroundTrack() {
  loadYouTubeApi()
    .then((YT) => {
      if (audioState.player) {
        return;
      }

      audioState.player = new YT.Player('youtubePlayer', {
        width: '1',
        height: '1',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          loop: 1,
          modestbranding: 1,
          playsinline: 1,
          playlist: YOUTUBE_VIDEO_ID,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            audioState.playerReady = true;
            syncAudioPlayback();
            event.target.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          },
        },
      });
    })
    .catch(() => {
      updateAudioButtons();
    });
}

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
  setMenuOpen(!mobileMenu.classList.contains('open'));
});

mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    setMenuOpen(false);
  });
});

if (audioToggle) {
  audioToggle.addEventListener('click', toggleMute);
}

if (mobileAudioToggle) {
  mobileAudioToggle.addEventListener('click', toggleMute);
}

if (enterSiteButton) {
  enterSiteButton.addEventListener('click', () => {
    audioState.hasEntered = true;
    entryOverlay.classList.add('hidden');
    syncBodyLock();
    syncAudioPlayback();
  });
}

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
reveals.forEach((element) => observer.observe(element));

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((anchor) => anchor.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);

      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  }),
  { threshold: 0.4 }
);
sections.forEach((section) => sectionObserver.observe(section));

(function () {
  const frame = document.querySelector('.hero-photo-frame');

  if (!frame) {
    return;
  }

  const MAX_TILT = 9;
  const STIFFNESS = 0.1;
  const DAMPING = 0.72;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let velX = 0;
  let velY = 0;
  let rafId = null;

  function tick() {
    const ax = (targetX - currentX) * STIFFNESS;
    const ay = (targetY - currentY) * STIFFNESS;
    velX = velX * DAMPING + ax;
    velY = velY * DAMPING + ay;
    currentX += velX;
    currentY += velY;

    frame.style.transform =
      `perspective(600px) rotateX(${currentX.toFixed(3)}deg) rotateY(${currentY.toFixed(3)}deg)`;

    const settled =
      Math.abs(currentX - targetX) < 0.01 &&
      Math.abs(currentY - targetY) < 0.01 &&
      Math.abs(velX) < 0.01 &&
      Math.abs(velY) < 0.01;

    if (!settled) {
      rafId = requestAnimationFrame(tick);
    } else {
      currentX = targetX;
      currentY = targetY;
      velX = 0;
      velY = 0;
      frame.style.transform =
        `perspective(600px) rotateX(${currentX.toFixed(3)}deg) rotateY(${currentY.toFixed(3)}deg)`;
      rafId = null;
    }
  }

  function startTick() {
    if (!rafId) {
      rafId = requestAnimationFrame(tick);
    }
  }

  frame.addEventListener('mousemove', (event) => {
    const rect = frame.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    targetX = -ny * MAX_TILT;
    targetY = nx * MAX_TILT;
    startTick();
  });

  frame.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
    startTick();
  });
})();

updateAudioButtons();
syncBodyLock();
setupBackgroundTrack();
