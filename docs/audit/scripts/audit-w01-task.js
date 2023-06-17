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

  js = js.replace(/ error/g, ' error<br>');
  js = js.replace(/;/g, ';<br>');
  js = js.replace(/ {/g, ' { <br>');

  return `<main>
      <h3>Page Rendering Check</h3>
      <div class="label">URL:</div>
      <div class="data">🔗</div>
      <div class="standard"><a href="https://${student.value}.github.io/cse121b/w01-task/w01-task.html" target="_blank">https://${student.value}.github.io/cse121b/w01-task/w01-task.html</a></div>

      <h3>HTML</h3>
      <div class="label">h2 Heading:</div>
      <div class="data">${h.includes('<h2') && h.includes('</h2>') ? '✔️❔' : '❌'}</div>
      <div class="standard">${getContent(h, /<h2>(.*?)<\/h2>/)} <span class="blue">❔Must contain student name.</span></div>

       <h3>Console Output Check</h3>
      <div class="label">Part 1 Error Fixed:</div>
      <div class="data">${js.includes("let userName = 'Moroni'") || js.includes('let userName = "Moroni"') ? '✔️' : '❌'}</div>
      <div class="standard">let userName = 'Moroni';</div>

      <div class="label">Part 2 Error Fixed:</div>
      <div class="data">${js.includes("const currentDateAndTime = new Date();") || js.includes('const currentDateAndTime = Date();') ? '✔️' : '❌'}</div>
      <div class="standard">Assumes that a Date() object was used.</div>

      <div class="label">JavaScript</div>
      <div class="data">👀</div>
      <div class="standard">${js}</div>

    </main>`;
}