const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!/^https?:\/\//.test(targetUrl)) return res.status(400).send('Invalid URL');
  try {
    const response = await fetch(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    let html = await response.text();

    // ヘッダー除去
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');
    // 文字コード自動判別
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (e) {
    res.status(500).send('Fetch error');
  }
});

app.listen(8080, () => console.log('Proxy server running on port 8080'));