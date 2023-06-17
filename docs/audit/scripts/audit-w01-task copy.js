import { getElement, getContent } from './element-data.js';
import { student, getReportButton, report, message } from './interface.js';
import { getJavaScriptText } from './getJavaScriptText.js';

getReportButton.addEventListener('click', getReport);
document.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    getReport();
  }
});

async function getReport() {
  let studentgh = student.value;
  if (studentgh === '') {
    message.textContent = "A valid GitHub username is required."
    message.style.display = 'block';
    student.focus();
    return;
  }
  let uri = `${studentgh}.github.io/cse121b/w01-task/w01-task.html`;
  let jsfile = `${studentgh}.github.io/cse121b/w01-task/w01-task.js`;
  let js = await getJavaScriptText(`https://${jsfile}`);

  let response = await fetch(`https://${uri}`);
  if (response.status === 200) {
    resetReport();
    const cssStats = await cssstats(uri);
    report.innerHTML += buildReport(cssStats, js);
  } else {
    message.textContent = "The w01-task.html page was not found in the w01-task folder within the cse121b repository folder."
    message.style.display = 'block';
    return;
  }
};

async function cssstats(baseuri) {
  let url = `https://cssstats.com/api/stats?url=${baseuri}`;
  let response = await fetch(url);
  return await response.json();
}

function resetReport() {
  message.innerHTML = '';
  message.style.display = 'none';
  report.textContent = '';
}

function buildReport(data, js) {
  let h = data.css.html;
  h = h.replace(/[\n\r]/g, ""); // remove line breaks
  h = h.replace(/ {2,}/g, " "); // remove extra spaces

  return `<main>
      <h3>Page Rendering Check</h3>
      <div class="label">URL:</div>
      <div class="data">🔗</div>
      <div class="standard"><a href="https://${student.value}.github.io/cse121b/w01-task/w01-task.html" target="_blank">https://${student.value}.github.io/cse121b/w01-task/w01-task.html</a></div>

      <h3>Console Output Check</h3>
      <div class="label">Part 1 Error Fixed:</div>
      <div class="data">${js.includes("let userName = 'Moroni'") || js.includes('let userName = "Moroni"') ? '✔️' : '❌'}</div>
      <div class="standard">let userName = 'Moroni';</div>

      <div class="label">Part 2 Error Fixed:</div>
      <div class="data">${js.includes("const currentDateAndTime = new Date();") || js.includes('const currentDateAndTime = Date();') ? '✔️' : '❌'}</div>
      <div class="standard">Assumes that a Date() object was used.</div>

      <h3>HTML</h3>
      <div class="label">Document Type:</div>
      <div class="data">${h.includes('<!DOCTYPE html>') || h.includes('<!doctype html>') ? '✔️' : '❌'}</div>
      <div class="standard">&lt;!DOCTYPE html&gt; or &lt;!doctype html&gt;</div>

      <div class="label">HTML Lang Attribute:</div>
      <div class="data">${h.includes('<html lang="') > 0 ? '✔️' : '❌'}</div>
      <div class="standard">&lt;html lang="en"&gt;</div>

      <div class="label">Head:</div>
      <div class="data">${h.includes('<head') && h.includes('</head>') ? '✔️' : '❌'}</div>
      <div class="standard">&lt;head&gt; ... &lt;/head&gt;</div>

      <div class="label">Meta Charset:</div>
      <div class="data">${h.includes('<meta charset="utf-8"') > 0 || h.includes('<meta charset="UTF-8"') ? '✔️' : '❌'}</div>
      <div class="standard">&lt;meta charset="UTF-8"&gt;</div>

      <div class="label">Meta Viewport:</div>
      <div class="data">${h.includes('<meta name="viewport"') > 0 ? '✔️' : '❌'}</div>
      <div class="standard">&lt;meta name="viewport" content="width=device-width,initial-scale=1.0"&gt;</div>

      <div class="label">Title:</div>
      <div class="data">${data.css.pageTitle.includes('W01: Programming Task') ? '✔️' : '❓'}</div>
      <div class="standard">"${data.css.pageTitle}" <span class="blue">W01: Programming Task</span></div>

      <div class="label">Body:</div>
      <div class="data">${h.includes('<body') && h.includes('</body>') ? '✔️' : '❌'}</div>
      <div class="standard">&lt;body&gt; ... &lt;/body&gt;</div>

      <div class="label">h1 Heading:</div>
      <div class="data">${getContent(h, /<h1>(.*?)<\/h1>/) === 'W01: Programming Task' ? '✔️' : '❌'}</div>
      <div class="standard">${getContent(h, /<h1>(.*?)<\/h1>/)} <span class="blue">W01: Programming Task</span></div>

      <div class="label">h2 Heading:</div>
      <div class="data">${h.includes('<h2') && h.includes('</h2>') ? '✔️❔' : '❌'}</div>
      <div class="standard">${getContent(h, /<h2>(.*?)<\/h2>/)} <span class="blue">❔Must contain student name.</span></div>

    </main>`;
}