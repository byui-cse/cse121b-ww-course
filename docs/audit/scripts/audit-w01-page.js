import { getElement, getContent } from './element-data.js';
import { student, getReportButton, report, message } from './interface.js';

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
  let uri = `${studentgh}.github.io/cse121b/`;

  let response = await fetch(`https://${uri}`);
  if (response.status === 200) {
    resetReport();
    const cssStats = await cssstats(uri);
    report.innerHTML += buildReport(cssStats, uri);
  } else {
    message.textContent = "The index.html page was not found in the cse121b repository folder."
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

function buildReport(data, url) {
  let h = data.css.html;
  h = h.replace(/[\n\r]/g, ""); // remove line breaks
  h = h.replace(/ {2,}/g, " "); // remove extra spaces

  return `<main>
      <h3>Page Rendering Check</h3>
      <div class="label">URL:</div>
      <div class="data">🔗</div>
      <div class="standard"><a href="https://${student.value}.github.io/cse121b" target="_blank">https://${student.value}.github.io/cse121b</a></div>

      <h3>Required Elements</h3>
      <div class="label">Document Type:</div>
      <div class="data">${h.includes('<!DOCTYPE html>') || h.includes('<!doctype html>') ? '✔️' : '❌'}</div>
      <div class="standard">&lt;!DOCTYPE html&gt; or &lt;!doctype html&gt; <span class="blue">❔This should be on the first line.</span></div>

      <div class="label">HTML Lang Attribute:</div>
      <div class="data">${h.includes('<html lang="') > 0 ? '✔️' : '❌'}</div>
      <div class="standard">&lt;html lang="en"&gt; <span class="blue">or equivalent language</span></div>

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
      <div class="data">${data.css.pageTitle.includes('CSE 121B') && data.css.pageTitle.includes('BYU-Idaho') && data.css.pageTitle.length > 25 ? '✔️' : '❓'}</div>
      <div class="standard">"${data.css.pageTitle}" <span class="blue">Must contain the student name, CSE 121B, and BYU-Idaho</span></div>

      <div class="label">Body:</div>
      <div class="data">${h.includes('<body') && h.includes('</body>') ? '✔️' : '❌'}</div>
      <div class="standard">&lt;body&gt; ... &lt;/body&gt;</div>

      <div class="label">h1 Heading:</div>
      <div class="data">${h.includes('<h1') && h.includes('</h1>') ? '✔️❔' : '❌'}</div>
      <div class="standard">${getContent(h, /<h1>(.*?)<\/h1>/)} <span class="blue">❔Must contain name and 'CSE 121B and BYU-Idaho'</span></div>

      <div class="label">h2 Heading:</div>
      <div class="data">${h.includes('<h2') && h.includes('</h2>') ? '✔️❔' : '❌'}</div>
      <div class="standard">${getContent(h, /<h2>(.*?)<\/h2>/)} <span class="blue">❔Must contain name location</span></div>

      <div class="label">hr Line:</div>
      <div class="data">${h.includes('<hr>') ? '✔️' : '❌'}</div>
      <div class="standard"></div>

      <h3>Proper HTML Document Structure</h3>
      <div class="label">Structure:</div>
      <div class="data">
        ${h.indexOf('<html') < h.indexOf('<head>') &&
    h.indexOf('<head>') < h.indexOf('</head>') &&
    h.indexOf('</head>') < h.indexOf('<body>') &&
    h.indexOf('<body>') < h.indexOf('</h1>') &&
    h.indexOf('</h1>') < h.indexOf('</h2>') &&
    h.indexOf('</h2>') < h.indexOf('<hr>') &&
    h.indexOf('<hr>') < h.indexOf('</body>') &&
    h.indexOf('</body>') < h.indexOf('</html>') ? '✔️' : '❌'}
      </div>
      <div class="standard">per assignment requirements</div>

    </main>`;
}