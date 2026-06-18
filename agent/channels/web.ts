import { defineChannel, GET } from "eve/channels";

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Eve Framework 全功能演示</title>
  <style>
    :root {
      --bg: #0f0f0f;
      --surface: #1a1a2e;
      --surface2: #16213e;
      --primary: #0f3460;
      --accent: #e94560;
      --text: #eaeaea;
      --text-dim: #a0a0a0;
      --border: #2a2a4a;
      --success: #4caf50;
      --code-bg: #0d1117;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      min-height: 100vh;
    }
    .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
    header {
      text-align: center;
      padding: 40px 20px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 30px;
    }
    header h1 { font-size: 2.5em; color: var(--accent); margin-bottom: 10px; }
    header p { color: var(--text-dim); font-size: 1.1em; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      transition: border-color 0.2s;
    }
    .card:hover { border-color: var(--accent); }
    .card h2 {
      color: var(--accent);
      font-size: 1.2em;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card h2 .badge {
      font-size: 0.6em;
      background: var(--primary);
      padding: 2px 8px;
      border-radius: 10px;
      color: var(--text-dim);
    }
    .card p.desc { color: var(--text-dim); font-size: 0.9em; margin-bottom: 16px; }
    .full-width { grid-column: 1 / -1; }
    input, select, button, textarea {
      font-family: inherit;
      font-size: 0.9em;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 8px 12px;
      background: var(--code-bg);
      color: var(--text);
      outline: none;
      transition: border-color 0.2s;
    }
    input:focus, select:focus, textarea:focus { border-color: var(--accent); }
    button {
      background: var(--accent);
      border-color: var(--accent);
      cursor: pointer;
      font-weight: 600;
      padding: 8px 16px;
    }
    button:hover { opacity: 0.9; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    button.secondary { background: var(--primary); border-color: var(--primary); }
    .form-row { display: flex; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
    .form-row input, .form-row select { flex: 1; min-width: 120px; }
    .output {
      background: var(--code-bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 12px;
      margin-top: 12px;
      font-size: 0.85em;
      max-height: 300px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .output.streaming { border-color: var(--success); }
    .chat-container { display: flex; flex-direction: column; height: 500px; }
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      background: var(--code-bg);
      border: 1px solid var(--border);
      border-radius: 6px 6px 0 0;
    }
    .chat-input-row { display: flex; gap: 8px; padding-top: 8px; }
    .chat-input-row input { flex: 1; }
    .message {
      margin-bottom: 12px;
      padding: 8px 12px;
      border-radius: 8px;
      max-width: 85%;
    }
    .message.user { background: var(--primary); margin-left: auto; text-align: right; }
    .message.assistant { background: var(--surface2); margin-right: auto; }
    .message.tool { background: #1a2e1a; border-left: 3px solid var(--success); font-size: 0.85em; font-family: monospace; }
    .message .role { font-size: 0.75em; color: var(--text-dim); margin-bottom: 4px; }
    .structure-tree { font-family: monospace; font-size: 0.9em; line-height: 1.8; color: var(--text-dim); }
    .structure-tree .folder { color: #64b5f6; }
    .structure-tree .file { color: var(--text); }
    .structure-tree .desc { color: var(--text-dim); font-style: italic; }
    .status-bar {
      position: fixed; bottom: 0; left: 0; right: 0;
      background: var(--surface); border-top: 1px solid var(--border);
      padding: 8px 20px; display: flex; justify-content: space-between; align-items: center; font-size: 0.8em;
    }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }
    .status-dot.connected { background: var(--success); }
    .status-dot.disconnected { background: var(--accent); }
    .code-block {
      background: var(--code-bg); border: 1px solid var(--border); border-radius: 6px;
      padding: 16px; font-size: 0.85em; overflow-x: auto; margin-top: 8px;
    }
    .code-block .keyword { color: #c792ea; }
    .code-block .string { color: #c3e88d; }
    .code-block .comment { color: #546e7a; }
    .code-block .function { color: #82aaff; }
    .feature-list { list-style: none; }
    .feature-list li { padding: 6px 0; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 8px; }
    .feature-list li:last-child { border-bottom: none; }
    .check { color: var(--success); }
    footer { padding-bottom: 60px; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Eve Framework Demo</h1>
      <p>包含全部子功能的交互式测试界面 — 边测试边学习 (访问路径: /demo)</p>
    </header>

    <!-- Project Structure -->
    <div class="card full-width" style="margin-bottom: 20px;">
      <h2>Project Structure <span class="badge">Layout</span></h2>
      <p class="desc">Eve 使用文件系统优先的设计，文件位置决定功能。</p>
      <div class="structure-tree">
<span class="folder">agent/</span>
+-- <span class="file">agent.ts</span> <span class="desc">— defineAgent: 模型和运行时配置</span>
+-- <span class="file">instructions.md</span> <span class="desc">— 系统提示词（每轮都生效）</span>
+-- <span class="folder">tools/</span> <span class="desc">— 可调用工具（文件名 = 工具名）</span>
|   +-- <span class="file">get_weather.ts</span> / <span class="file">calculate.ts</span> / <span class="file">manage_todos.ts</span>
|   +-- <span class="file">generate_password.ts</span> / <span class="file">text_convert.ts</span> / <span class="file">get_time.ts</span>
+-- <span class="folder">skills/</span> <span class="desc">— 按需加载的技能文档</span>
+-- <span class="folder">subagents/researcher/</span> <span class="desc">— 子代理</span>
+-- <span class="folder">schedules/</span> <span class="desc">— 定时任务 (cron)</span>
+-- <span class="folder">channels/</span> <span class="desc">— 通道适配器</span>
+-- <span class="folder">sandbox/</span> <span class="desc">— 隔离执行环境</span>
      </div>
    </div>

    <!-- Chat Interface -->
    <div class="card full-width" style="margin-bottom: 20px;">
      <h2>Chat Test <span class="badge">Session API</span></h2>
      <p class="desc">与 Eve agent 对话。支持创建 session、流式响应、多轮对话。</p>
      <div class="chat-container">
        <div class="chat-messages" id="chatMessages">
          <div class="message assistant"><div class="role">Assistant</div><div>Send a message to start. Try: "What is the weather in Beijing?" or "Calculate 42 * 13"</div></div>
        </div>
        <div class="chat-input-row">
          <input type="text" id="chatInput" placeholder="Type a message..." onkeydown="if(event.key==='Enter')sendMessage()">
          <button onclick="sendMessage()">Send</button>
          <button class="secondary" onclick="newSession()">New Session</button>
        </div>
      </div>
    </div>

    <div class="grid">
      <!-- Weather -->
      <div class="card">
        <h2>Weather <span class="badge">Tool</span></h2>
        <p class="desc">defineTool + Zod inputSchema + execute</p>
        <div class="form-row">
          <input type="text" id="weatherCity" placeholder="City (e.g. Beijing)" value="Beijing">
          <button onclick="testTool('weather')">Query</button>
        </div>
        <div class="output" id="weatherOutput">Ready...</div>
      </div>

      <!-- Calculator -->
      <div class="card">
        <h2>Calculator <span class="badge">Tool</span></h2>
        <p class="desc">z.enum + z.number multi-param schema</p>
        <div class="form-row">
          <input type="number" id="calcA" value="42" style="width:70px">
          <select id="calcOp"><option value="add">+</option><option value="subtract">-</option><option value="multiply">x</option><option value="divide">/</option></select>
          <input type="number" id="calcB" value="13" style="width:70px">
          <button onclick="testTool('calc')">Calc</button>
        </div>
        <div class="output" id="calcOutput">Ready...</div>
      </div>

      <!-- Todo -->
      <div class="card">
        <h2>Todos <span class="badge">Tool</span></h2>
        <p class="desc">Stateful tool with globalThis storage</p>
        <div class="form-row">
          <input type="text" id="todoText" placeholder="Todo text" value="Learn Eve">
          <button onclick="testTool('todo_add')">Add</button>
          <button class="secondary" onclick="testTool('todo_list')">List</button>
        </div>
        <div class="output" id="todoOutput">Ready...</div>
      </div>

      <!-- Password -->
      <div class="card">
        <h2>Password <span class="badge">Tool</span></h2>
        <p class="desc">z.number + z.boolean params</p>
        <div class="form-row">
          <input type="number" id="pwdLen" value="16" min="4" max="128" style="width:60px">
          <label style="color:var(--text-dim)"><input type="checkbox" id="pwdSymbols" checked> Symbols</label>
          <label style="color:var(--text-dim)"><input type="checkbox" id="pwdNumbers" checked> Numbers</label>
          <button onclick="testTool('password')">Generate</button>
        </div>
        <div class="output" id="pwdOutput">Ready...</div>
      </div>

      <!-- Text Convert -->
      <div class="card">
        <h2>Text Convert <span class="badge">Tool</span></h2>
        <p class="desc">Base64, URL encode, JSON format</p>
        <div class="form-row">
          <select id="convertOp">
            <option value="base64_encode">Base64 Encode</option>
            <option value="base64_decode">Base64 Decode</option>
            <option value="url_encode">URL Encode</option>
            <option value="url_decode">URL Decode</option>
            <option value="json_stringify">JSON Format</option>
          </select>
        </div>
        <div class="form-row">
          <input type="text" id="convertInput" value="Hello, Eve!">
          <button onclick="testTool('convert')">Convert</button>
        </div>
        <div class="output" id="convertOutput">Ready...</div>
      </div>

      <!-- Time -->
      <div class="card">
        <h2>Time <span class="badge">Tool</span></h2>
        <p class="desc">Timezone handling + z.string().default()</p>
        <div class="form-row">
          <select id="timezone">
            <option value="UTC">UTC</option>
            <option value="Asia/Shanghai">Asia/Shanghai</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
            <option value="Asia/Tokyo">Asia/Tokyo</option>
          </select>
          <button onclick="testTool('time')">Get Time</button>
        </div>
        <div class="output" id="timeOutput">Ready...</div>
      </div>

      <!-- Skills -->
      <div class="card">
        <h2>Skills <span class="badge">On-demand</span></h2>
        <p class="desc">Model pulls procedures into context via load_skill</p>
        <ul class="feature-list">
          <li><span class="check">ok</span> research.md — Research procedure</li>
          <li><span class="check">ok</span> code_generation.md — Code best practices</li>
        </ul>
        <div class="code-block">
<span class="comment">// Skills vs Instructions:</span>
<span class="comment">// Instructions = always active (every turn)</span>
<span class="comment">// Skills = loaded on-demand (avoid context bloat)</span>
        </div>
      </div>

      <!-- Subagents -->
      <div class="card">
        <h2>Subagents <span class="badge">Delegation</span></h2>
        <p class="desc">Child agents with isolated instructions/tools</p>
        <ul class="feature-list">
          <li><span class="check">ok</span> researcher — Deep research specialist</li>
          <li><span class="check">ok</span> Built-in agent tool — parent copy</li>
        </ul>
        <div class="code-block">
<span class="comment">// Declared subagent inherits NOTHING from parent</span>
<span class="comment">// Built-in agent tool inherits EVERYTHING</span>
        </div>
      </div>

      <!-- Schedules -->
      <div class="card">
        <h2>Schedules <span class="badge">Cron</span></h2>
        <p class="desc">Cron-driven automation tasks</p>
        <ul class="feature-list">
          <li><span class="check">ok</span> health_check — 0 9 * * * (daily 9am)</li>
        </ul>
        <div class="form-row">
          <button onclick="triggerSchedule('health_check')">Trigger Manually</button>
        </div>
        <div class="output" id="scheduleOutput">Ready...</div>
      </div>

      <!-- Session -->
      <div class="card">
        <h2>Session State <span class="badge">Durable</span></h2>
        <p class="desc">Persistent, crash-safe, resumable sessions</p>
        <div class="output" id="sessionInfo">Session ID: (none)
Continuation Token: (none)
Messages: 0</div>
      </div>
    </div>

    <!-- API Reference -->
    <div class="card full-width">
      <h2>HTTP API Reference</h2>
      <div class="code-block">
<span class="comment">// 1. Create session</span>
POST /eve/v1/session
{ "message": "Hello" }

<span class="comment">// 2. Stream response (NDJSON)</span>
GET /eve/v1/session/:id/stream

<span class="comment">// 3. Continue conversation</span>
POST /eve/v1/session/:id
{ "continuationToken": "...", "message": "Follow up" }

<span class="comment">// 4. Trigger schedule (dev only)</span>
POST /eve/v1/dev/schedules/:scheduleId
      </div>
    </div>
  </div>

  <div class="status-bar">
    <div><span class="status-dot disconnected" id="statusDot"></span><span id="statusText">Not connected</span></div>
    <div>Session: <span id="statusSession">-</span> | Msgs: <span id="statusMsgCount">0</span></div>
  </div>

  <script>
    const state = { sessionId: null, continuationToken: null, messageCount: 0 };
    function getApiBase() { return window.location.origin; }

    function updateStatus(connected, text) {
      document.getElementById('statusDot').className = 'status-dot ' + (connected ? 'connected' : 'disconnected');
      document.getElementById('statusText').textContent = text;
      document.getElementById('statusSession').textContent = state.sessionId || '-';
      document.getElementById('statusMsgCount').textContent = state.messageCount;
    }

    function updateSessionInfo() {
      document.getElementById('sessionInfo').textContent =
        'Session ID: ' + (state.sessionId || '(none)') +
        '\\nContinuation Token: ' + (state.continuationToken ? state.continuationToken.substring(0, 40) + '...' : '(none)') +
        '\\nMessages: ' + state.messageCount;
    }

    function addMessage(role, content, isTool) {
      const c = document.getElementById('chatMessages');
      const d = document.createElement('div');
      d.className = 'message ' + (isTool ? 'tool' : role);
      d.innerHTML = '<div class="role">' + role + (isTool ? ' (tool)' : '') + '</div><div>' + escapeHtml(content) + '</div>';
      c.appendChild(d); c.scrollTop = c.scrollHeight;
    }

    function escapeHtml(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

    async function readStream(streamRes, onEvent) {
      const reader = streamRes.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.trim()) continue;
          try { onEvent(JSON.parse(line)); } catch(e) {}
        }
      }
      if (buffer.trim()) {
        try { onEvent(JSON.parse(buffer)); } catch(e) {}
      }
    }

    async function sendMessage() {
      const input = document.getElementById('chatInput');
      const message = input.value.trim();
      if (!message) return;
      input.value = '';
      addMessage('user', message);
      state.messageCount++;
      const base = getApiBase();
      updateStatus(true, 'Sending...');
      try {
        let url, body;
        if (state.sessionId && state.continuationToken) {
          url = base + '/eve/v1/session/' + state.sessionId;
          body = { message: message, continuationToken: state.continuationToken };
        } else {
          url = base + '/eve/v1/session';
          body = { message: message };
        }
        const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok) { addMessage('assistant', 'Error ' + res.status + ': ' + await res.text()); updateStatus(false, 'Error'); return; }
        const data = await res.json();
        state.sessionId = data.sessionId || state.sessionId;
        state.continuationToken = data.continuationToken || state.continuationToken;
        updateStatus(true, 'Streaming...');
        updateSessionInfo();
        const streamRes = await fetch(base + '/eve/v1/session/' + state.sessionId + '/stream');
        let assistantContent = '';
        await readStream(streamRes, function(ev) {
          if (ev.type === 'text.delta') assistantContent += (ev.delta || '');
          else if (ev.type === 'message.appended') assistantContent += (ev.delta || ev.text || '');
          else if (ev.type === 'actions.requested' && ev.actions) {
            ev.actions.forEach(function(a) { addMessage('assistant', 'Tool: ' + (a.name || a.tool || 'unknown'), true); });
          }
          else if (ev.type === 'action.result') {
            addMessage('assistant', 'Result: ' + JSON.stringify(ev.result || ev.output || ev, null, 2), true);
          }
          else if (ev.type === 'session.completed' || ev.type === 'session.waiting') {
            state.continuationToken = ev.continuationToken || state.continuationToken;
          }
        });
        if (assistantContent) { addMessage('assistant', assistantContent); state.messageCount++; }
        updateStatus(true, 'Connected'); updateSessionInfo();
      } catch(e) { addMessage('assistant', 'Network error: ' + e.message); updateStatus(false, 'Disconnected'); }
    }

    function newSession() {
      state.sessionId = null; state.continuationToken = null; state.messageCount = 0;
      document.getElementById('chatMessages').innerHTML = '<div class="message assistant"><div class="role">Assistant</div><div>New session. Send a message to begin!</div></div>';
      updateStatus(false, 'Not connected'); updateSessionInfo();
    }

    async function testTool(tool) {
      const base = getApiBase();
      let message = '';
      switch (tool) {
        case 'weather': message = 'What is the weather in ' + (document.getElementById('weatherCity').value || 'Beijing') + '?'; break;
        case 'calc': { const a=document.getElementById('calcA').value, op=document.getElementById('calcOp').value, b=document.getElementById('calcB').value; const w={add:'plus',subtract:'minus',multiply:'times',divide:'divided by'}; message='Calculate '+a+' '+w[op]+' '+b; break; }
        case 'todo_add': message = 'Add a todo: ' + (document.getElementById('todoText').value || 'Learn Eve'); break;
        case 'todo_list': message = 'List all todos'; break;
        case 'password': { const l=document.getElementById('pwdLen').value, s=document.getElementById('pwdSymbols').checked, n=document.getElementById('pwdNumbers').checked; message='Generate a password with length '+l+(s?'':', no symbols')+(n?'':', no numbers'); break; }
        case 'convert': message = 'Convert "'+document.getElementById('convertInput').value+'" using '+document.getElementById('convertOp').value.replace('_',' '); break;
        case 'time': message = 'What time is it in '+document.getElementById('timezone').value+'?'; break;
      }
      const ids = {weather:'weatherOutput',calc:'calcOutput',todo_add:'todoOutput',todo_list:'todoOutput',password:'pwdOutput',convert:'convertOutput',time:'timeOutput'};
      const output = document.getElementById(ids[tool]);
      output.textContent = 'Loading...'; output.classList.add('streaming');
      try {
        const res = await fetch(base+'/eve/v1/session', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({message:message}) });
        if (!res.ok) { output.textContent = 'Error '+res.status+': '+await res.text(); output.classList.remove('streaming'); return; }
        const data = await res.json();
        const sr = await fetch(base+'/eve/v1/session/'+data.sessionId+'/stream');
        let result = '';
        await readStream(sr, function(ev) {
          if (ev.type === 'text.delta') result += (ev.delta || '');
          else if (ev.type === 'message.appended') result += (ev.delta || ev.text || '');
          else if (ev.type === 'actions.requested' && ev.actions) {
            ev.actions.forEach(function(a) { result += '\\n[' + (a.name || a.tool || '') + '] '; });
          }
          else if (ev.type === 'action.result') {
            result += JSON.stringify(ev.result || ev.output || ev, null, 2) + '\\n';
          }
        });
        output.textContent = result || '(no output)';
      } catch(e) { output.textContent = 'Error: '+e.message+'\\n\\nMake sure ANTHROPIC_API_KEY is set in Vercel env vars.'; }
      output.classList.remove('streaming');
    }

    async function triggerSchedule(id) {
      const output = document.getElementById('scheduleOutput');
      output.textContent = 'Triggering...';
      try {
        const res = await fetch(getApiBase()+'/eve/v1/dev/schedules/'+id, {method:'POST'});
        output.textContent = res.ok ? 'Triggered! ' + JSON.stringify(await res.json(),null,2) : 'Error '+res.status+': '+await res.text();
      } catch(e) { output.textContent = 'Error: '+e.message; }
    }

    updateSessionInfo();
  </script>
</body>
</html>`;

export default defineChannel({
  routes: [
    GET("/demo", async () => {
      return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }),
  ],
});
