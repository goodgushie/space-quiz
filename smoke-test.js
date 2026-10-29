// Smoke test for index.html. Open the page, paste this into the DevTools console (or run via the browser canvas).
// Logs PASS/FAIL per check and returns a summary. Restarts the quiz first and restores the theme afterwards.
(() => {
  const $ = id => document.getElementById(id);
  const opts = () => [...$('opts').children];
  const results = [];
  const check = (name, cond, detail = '') => results.push({ ok: !!cond, line: `${cond ? 'PASS' : 'FAIL'} ${name}${detail ? ' ' + detail : ''}` });
  const root = document.documentElement;
  const prevTheme = root.dataset.theme;

  start();

  check('initial 4 options', opts().length === 4);
  check('deck is a permutation of Q', deck.length === Q.length && Q.every(q => deck.some(d => d[0] === q[0] && [...d[1]].sort().join() === [...q[1]].sort().join() && d[1][d[2]] === q[1][q[2]])));
  check('shown options match deck', opts().every((b, k) => b.textContent === deck[0][1][k]));
  check('shuffle varies across runs', new Set(Array.from({ length: 12 }, () => (start(), deck[0][0]))).size > 1);
  start();
  check('counter 1 of 10', $('count').textContent === 'Question 1 of 10');
  check('options are tabbable buttons', opts().every(b => b.tagName === 'BUTTON' && b.tabIndex === 0));
  const bodyStyle = getComputedStyle(document.body);
  const px = parseFloat(bodyStyle.fontSize);
  check('body font 14-16px', px >= 14 && px <= 16, bodyStyle.fontSize);
  check('column <= 480px', document.querySelector('main').getBoundingClientRect().width <= 480);

  const wrong = deck[0][2] === 3 ? 2 : 3;
  opts()[1].focus();
  check('focus works', document.activeElement === opts()[1]);
  opts()[wrong].click();
  check('wrong option marked', opts()[wrong].classList.contains('wrong'));
  check('correct option revealed', opts()[deck[0][2]].classList.contains('correct'));
  check('score stays 0', $('score').textContent === 'Score: 0');
  check('options disabled', opts().every(b => b.disabled));
  check('shake animation', getComputedStyle(opts()[wrong]).animationName === 'shake');
  check('Next shown and focused', !$('next').classList.contains('hidden') && document.activeElement === $('next'));
  check('progress 10%', $('fill').style.width === '10%' && $('bar').getAttribute('aria-valuenow') === '1');
  check('wrong fact prefix', $('fact').textContent.startsWith('\u274c'));

  $('next').click();
  check('Q2 shown', $('count').textContent === 'Question 2 of 10');
  check('focus moves to first option', document.activeElement === opts()[0]);
  opts()[deck[1][2]].click();
  check('correct +1 and green', $('score').textContent === 'Score: 1' && opts()[deck[1][2]].classList.contains('correct'));
  check('correct fact prefix', $('fact').textContent.startsWith('\u2705'));
  check('pop animation', getComputedStyle(opts()[deck[1][2]]).animationName === 'pop');
  check('progress 20%', $('fill').style.width === '20%');

  for (let n = 2; n < deck.length; n++) { $('next').click(); opts()[deck[n][2]].click(); }
  check('last button says See results', $('next').textContent === 'See results');
  check('score 9 before finish', $('score').textContent === 'Score: 9', $('score').textContent);
  check('progress 100%', $('fill').style.width === '100%');

  $('next').click();
  check('results visible', !$('result').classList.contains('hidden') && $('quiz').classList.contains('hidden'));
  check('final 9 / 10', $('final').textContent === '9 / 10', $('final').textContent);
  check('results emoji', $('emoji').textContent === '\ud83d\ude80', $('emoji').textContent);

  $('again').click();
  check('Play again resets', $('count').textContent === 'Question 1 of 10' && $('score').textContent === 'Score: 0' && $('fill').style.width === '0%');

  const bgBefore = getComputedStyle(document.body).backgroundColor;
  $('theme').click();
  const bgAfter = getComputedStyle(document.body).backgroundColor;
  check('theme toggle changes background', bgBefore !== bgAfter, `${bgBefore} -> ${bgAfter}`);
  if (prevTheme) root.dataset.theme = prevTheme; else delete root.dataset.theme;
  try { prevTheme ? localStorage.setItem('theme', prevTheme) : localStorage.removeItem('theme'); } catch (e) {}
  paintToggle();

  const failed = results.filter(r => !r.ok).length;
  results.forEach(r => (r.ok ? console.log : console.error)(r.line));
  const summary = `${results.length - failed}/${results.length} passed, ${failed} failed`;
  console.log(summary);
  return summary + '\n' + results.map(r => r.line).join('\n');
})();
