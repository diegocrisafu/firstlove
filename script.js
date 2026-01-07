const PASS = 'dr.jade';
const lock = document.getElementById('lock-screen');
const letterScreen = document.getElementById('letter-screen');
const diaryCard = document.getElementById('diary-card');
const input = document.getElementById('password');
const enterBtn = document.getElementById('enter-btn');
const letterEl = document.getElementById('letter');
const nextBtn = document.getElementById('next-page');

const message = `Dear Jade,

I was really hurt when you dumped me over text. After five years, I could not believe it. All I got was a text. But what hurt even more was the person I am losing.

It is hard to accept especially when you said you did not love me anymore. Two weeks before that, I was holding you in my arms, and hearing you say those things was a huge shock. I think the fact that it caught me so off guard made it hurt even more.

I am still grieving, but I forgive you if this is what you want. I wish we could be together forever like a covalent bond, stable, strong, and not letting go. It is going to take a lot for me to get over you, but most importantly, I wish we could have fixed things.

I wish you came to talk to me. I wish I was more there for you, and I wish I had the chance to tell you that. I wish you would talk to me more about the important things—the deep feelings, you know?

I wish I told you things like: even though your dad is free, I will always be there—in a flash, in a heartbeat—to protect you. I wish I told you that I am proud of the person you became. I hope you get into any dental school that you want. And I wish I told you, “Come talk to me, what is going on, what is wrong?”

You will always have a spot in my heart. I will always have love for you. I wish we were together, and I wish you the best in your journey—your life journey. It is really hard switching, you know? I have been hanging out with friends, but I still feel lost. There is a void that I cannot rebuild. Maybe it is just how I feel right now, but I truly feel like no girl will ever take your spot. Maybe it is wishful thinking.`;

let audioCtx;
let masterGain;
let heartbeatInterval;

function animateLetter(text) {
  letterEl.textContent = '';
  let idx = 0;
  const caret = document.createElement('span');
  caret.className = 'caret';
  letterEl.appendChild(caret);

  const tick = () => {
    if (idx < text.length) {
      caret.before(document.createTextNode(text[idx]));
      idx += 1;
      setTimeout(tick, text[idx - 1] === '\n' ? 180 : 32 + Math.random() * 45);
    }
  };
  tick();
}

function unlock() {
  lock.classList.add('hidden');
  lock.setAttribute('aria-hidden', 'true');
  letterScreen.classList.remove('hidden');
  letterScreen.setAttribute('aria-hidden', 'false');
  animateLetter(message);
  fadeHeartbeat(0.02);
  updatePageButton();
}

function handleSubmit() {
  const value = input.value.trim();
  if (value === PASS) {
    unlock();
  } else {
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 400);
  }
}

function initAudio() {
  if (audioCtx) return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  audioCtx = new Ctx();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.05;
  masterGain.connect(audioCtx.destination);
  startHeartbeat();
}

function startHeartbeat() {
  if (!audioCtx || heartbeatInterval) return;

  const beat = () => {
    const time = audioCtx.currentTime;
    const thump = audioCtx.createOscillator();
    const thumpGain = audioCtx.createGain();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(60, time);
    thumpGain.gain.setValueAtTime(0, time);
    thumpGain.gain.linearRampToValueAtTime(0.16, time + 0.02);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
    thump.connect(thumpGain).connect(masterGain);
    thump.start(time);
    thump.stop(time + 0.4);

    const thump2 = audioCtx.createOscillator();
    const thumpGain2 = audioCtx.createGain();
    thump2.type = 'sine';
    thump2.frequency.setValueAtTime(70, time + 0.2);
    thumpGain2.gain.setValueAtTime(0, time + 0.18);
    thumpGain2.gain.linearRampToValueAtTime(0.14, time + 0.22);
    thumpGain2.gain.exponentialRampToValueAtTime(0.001, time + 0.55);
    thump2.connect(thumpGain2).connect(masterGain);
    thump2.start(time + 0.18);
    thump2.stop(time + 0.58);
  };

  beat();
  heartbeatInterval = setInterval(beat, 1500);
}

function fadeHeartbeat(target) {
  if (!masterGain || !audioCtx) return;
  masterGain.gain.setTargetAtTime(target, audioCtx.currentTime, 0.6);
}

input.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') handleSubmit();
});
enterBtn.addEventListener('click', handleSubmit);
window.addEventListener('DOMContentLoaded', () => input.focus());
['click', 'keydown', 'touchstart'].forEach((evt) => {
  document.addEventListener(evt, initAudio, { once: true });
});

function updatePageButton() {
  if (!diaryCard || !nextBtn) return;
  const nearBottom = diaryCard.scrollTop + diaryCard.clientHeight >= diaryCard.scrollHeight - 12;
  nextBtn.textContent = nearBottom ? 'Back to top ↑' : 'Next page ↓';
}

function handlePageScroll() {
  if (!diaryCard) return;
  const nearBottom = diaryCard.scrollTop + diaryCard.clientHeight >= diaryCard.scrollHeight - 12;
  const target = nearBottom ? 0 : diaryCard.scrollTop + diaryCard.clientHeight * 0.9;
  diaryCard.scrollTo({ top: target, behavior: 'smooth' });
  setTimeout(updatePageButton, 320);
}

if (nextBtn) nextBtn.addEventListener('click', handlePageScroll);
if (diaryCard) diaryCard.addEventListener('scroll', updatePageButton);
