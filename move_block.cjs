const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
const start = code.findIndex(l => l.includes('LIVE DUTY / MEAL / EXAM TOP WIDGET'));
const end = code.findIndex((l, i) => i > start && l.includes('PANEL VIEW ROUTER SWITCHER'));

if (start !== -1 && end !== -1) {
  const block = code.splice(start - 1, end - start + 1);
  const target = code.findIndex(l => l.includes('Widget 1: Daily Wellness'));
  if (target !== -1) {
    code.splice(target - 1, 0, ...block);
    fs.writeFileSync('src/App.tsx', code.join('\n'));
    console.log('Moved block successfully');
  } else {
    console.log('Target not found');
  }
} else {
  console.log('Block not found: start=' + start + ', end=' + end);
}
