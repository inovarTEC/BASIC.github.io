/**
 * ⚡ Eletricista Power — Service Worker
 * Estratégia: NETWORK ONLY (100% online obrigatório)
 * Sem cache. Sem fallback offline. App exige internet sempre.
 */

const SW_VERSION = 'ep-v1.0.0';

// ── Instalação: não cacheamos nada ──────────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[SW] Instalado — modo 100% online');
  // Ativa imediatamente sem esperar tabs fecharem
  self.skipWaiting();
});

// ── Ativação: limpa qualquer cache antigo que possa existir ─────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          console.log('[SW] Removendo cache antigo:', key);
          return caches.delete(key);
        })
      );
    }).then(() => {
      console.log('[SW] Ativado — todos os caches limpos');
      // Assume controle imediato de todas as abas abertas
      return self.clients.claim();
    })
  );
});

// ── Interceptação de requisições: SEMPRE vai para a rede ────────────────────
self.addEventListener('fetch', event => {
  // Ignora requisições que não sejam HTTP/HTTPS
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Retorna a resposta da rede diretamente, sem cachear
        return response;
      })
      .catch(error => {
        // Sem internet: retorna página de erro personalizada
        console.log('[SW] Sem internet — requisição bloqueada:', event.request.url);

        // Se for uma navegação (abrir o app), mostra tela de erro
        if (event.request.mode === 'navigate') {
          return new Response(
            getOfflineHTML(),
            {
              status: 503,
              statusText: 'Sem Conexão',
              headers: { 'Content-Type': 'text/html; charset=utf-8' }
            }
          );
        }

        // Para outros recursos (scripts, imagens), retorna erro simples
        return new Response(
          JSON.stringify({ error: 'Sem conexão com a internet', offline: true }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      })
  );
});

// ── HTML exibido quando o usuário tenta abrir o app sem internet ─────────────
function getOfflineHTML() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#0f172a">
  <title>Eletricista Power — Sem Conexão</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background: #0f172a;
      color: #f1f5f9;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      text-align: center;
    }
    .icon { font-size: 72px; margin-bottom: 20px; }
    .logo {
      font-family: 'Syne', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: #f1f5f9;
      margin-bottom: 4px;
      letter-spacing: .04em;
    }
    .logo span { color: #2563eb; }
    .title {
      font-family: 'Syne', sans-serif;
      font-size: 26px;
      font-weight: 800;
      color: #f87171;
      margin-bottom: 10px;
      margin-top: 24px;
    }
    .subtitle {
      font-size: 14px;
      color: #64748b;
      line-height: 1.7;
      max-width: 300px;
      margin-bottom: 32px;
    }
    .card {
      background: #111827;
      border: 1px solid #1e2d45;
      border-radius: 20px;
      padding: 20px;
      max-width: 340px;
      width: 100%;
      margin-bottom: 24px;
    }
    .card-title {
      font-family: 'Syne', sans-serif;
      font-size: 13px;
      font-weight: 800;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: .08em;
      margin-bottom: 12px;
    }
    .step {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 10px;
      text-align: left;
    }
    .step-num {
      width: 22px;
      height: 22px;
      background: rgba(37,99,235,.2);
      border: 1px solid rgba(37,99,235,.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
      color: #3b82f6;
      flex-shrink: 0;
    }
    .step-txt {
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.5;
    }
    .btn {
      width: 100%;
      max-width: 340px;
      padding: 15px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #fff;
      font-family: 'Syne', sans-serif;
      font-size: 15px;
      font-weight: 800;
      border: none;
      border-radius: 14px;
      cursor: pointer;
      box-shadow: 0 6px 24px rgba(37,99,235,.35);
      letter-spacing: .04em;
    }
    .version {
      font-size: 10px;
      color: #334155;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="icon">📡</div>
  <div class="logo">ELETRICISTA <span>POWER</span></div>
  <div class="title">Sem Conexão!</div>
  <p class="subtitle">
    Este aplicativo requer conexão com a internet para funcionar.<br>
    Verifique sua rede e tente novamente.
  </p>

  <div class="card">
    <div class="card-title">O que fazer?</div>
    <div class="step">
      <div class="step-num">1</div>
      <div class="step-txt">Verifique se o Wi-Fi ou dados móveis estão ativos</div>
    </div>
    <div class="step">
      <div class="step-num">2</div>
      <div class="step-txt">Desative e reative o Wi-Fi ou 4G/5G do celular</div>
    </div>
    <div class="step">
      <div class="step-num">3</div>
      <div class="step-txt">Aguarde alguns segundos e pressione o botão abaixo</div>
    </div>
  </div>

  <button class="btn" onclick="location.reload()">↺ Tentar Novamente</button>

  <div class="version">⚡ Eletricista Power · Versão Online</div>
</body>
</html>`;
}

// ── Mensagens vindas do app principal ────────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CHECK_VERSION') {
    event.ports[0].postMessage({ version: SW_VERSION });
  }

  // Força atualização imediata quando solicitado
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
