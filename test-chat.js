fetch('http://localhost:3000/api/gemini/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', parts: [{ text: 'Hello' }] }],
    language: 'en'
  })
}).then(async r => {
  console.log(r.status);
  console.log(await r.text());
}).catch(console.error)
