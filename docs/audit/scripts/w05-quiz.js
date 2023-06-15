const student = document.querySelector('#student');
const getReportButton = document.querySelector('#getReport');
const report = document.querySelector('#report');
const message = document.querySelector('#message');

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
  let uri = `${studentgh}.github.io/wdd130/quiz.html`;

  let response = await fetch(`https://${uri}`);
  if (response.status === 200) {
    resetReport();
    const cssStats = await cssstats(uri);
    report.innerHTML += buildReport(cssStats, uri);
  } else {
    message.textContent = "The quiz.html page was not found in the wdd130 folder."
    message.style.display = 'block';
    return;
  }
};

async function cssstats(baseuri) {
  let url = `https://cssstats.com/api/stats?url=${baseuri}`;
  let response = await fetch(url);
  let cssresult = await response.json();
  return cssresult;
}

function resetReport() {
  message.innerHTML = '';
  message.style.display = 'none';
  message.style.display = 'none';
  report.textContent = '';
}

// #region Utility Functions ******************************************
function getElement(html, element) {
  let count = 0;
  let i = 0;
  while (true) {
    let elementIndex = html.indexOf(element, i);
    if (elementIndex === -1) break;
    count++;
    i = elementIndex + 1;
  }
  return count;
}
function getContent(html, regex) {
  let match = html.match(regex);
  return match ? match[1] : null;
}
// #endregion Utlity Functions ***************************************

function buildReport(data, url) {
  let h = data.css.html;
  h = h.replace(/[\n\r]/g, ""); // remove line breaks
  h = h.replace(/ {2,}/g, " "); // remove extra spaces

  return `<main>
   <h3>Validation</h3>
       <div class="label">HTML Validator:</div>
       <div class="data">🔗</div>
       <div class="standard"><a href="https://validator.w3.org/check?verbose=1&uri=${url}" target="_blank">w3c Check</a></div>
       <div class="label">CSS Validator:</div>
       <div class="data">🔗</div>
       <div class="standard"><a href="https://jigsaw.w3.org/css-validator/validator?uri=${url}" target="_blank">w3c Check</a></div>

      <h3>Standard Elements</h3>
      <div class="label">Document Type:</div>
      <div class="data">${h.includes('<!DOCTYPE html>') ||
      h.includes('<!doctype html>') ? '✔️' : '❌'}</div>
      <div class="standard"><span class="blue">&lt;!DOCTYPE html&gt; or &lt;!doctype html&gt;</span></div>

      <div class="label">HTML Lang Attribute:</div>
      <div class="data">${h.includes('<html lang="') > 0 ? '✔️' : '❌'
    }</div>
      <div class="standard"><span class="blue">&lt;html lang="en-US"&gt;</span></div>

      <div class="label">Meta Charset:</div>
      <div class="data">${h.includes('<meta charset="utf-8"') > 0 ||
      h.includes('<meta charset="UTF-8"') ? '✔️' : '❌'}</div>
      <div class="standard"><span class="blue">&lt;meta charset="UTF-8"&gt;</span></div>

      <div class="label">Meta Viewport:</div>
      <div class="data">${h.includes('<meta name="viewport"') > 0 ? '✔️' : '❌'
    }</div>
      <div class="standard"><span class="blue">&lt;meta name="viewport" content="width=device-width,initial-scale=1.0"&gt;</span></div>

      <div class="label">Title:</div>
      <div class="data">${data.css.pageTitle.includes('Quiz') && data.css.pageTitle.includes('HTML') && data.css.pageTitle.includes('Quiz') ? '✔️' : '❓'}</div>
      <div class="standard">"${data.css.pageTitle}"<span class="blue">Must contain 'HTML', 'CSS', and 'Quiz' terms</span></div>

      <div class="label">Meta Description:</div>
      <div class="data">${h.includes('<meta name="description" content="')? '❔' : '❌'}</div>
      <div class="standard">${getContent(h, /<meta\s+name="description"\s+content="([^"]+)"/i )} <span class="blue">Is this description accurate for the page - quiz page?</span></div>

      <div class="label">Meta Author:</div>
      <div class="data">${h.includes('<meta name="author"') ? '✔️' : '❌'}</div>
      <div class="standard">${getContent(h, /<meta\s+name="author"\s+content="([^"]+)"/i)}</div>

      <div class="label">External CSS:</div>
      <div class="data">${data.css.links[0].link == 'styles/quiz.css' ? '✔️' : '❌'}</div>
      <div class="standard">${data.css.links[0].link} | (styles/quiz.css)</div>

      <div class="label">H1 Element:</div>
      <div class="data">${h.includes('<h1') && h.includes('</h1>')  ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h, '<h1')} / 1 : ${getContent(h, /<h1>(.*?)<\/h1>/) }</div>

      <h3>Form Elements</h3>

      <div class="label">Form Element:</div>
      <div class="data">${getElement(h, '<form') === 1 && h.includes('</form>') ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h, '<form')} / 1</div>

      <div class="label">Input Type Text:</div>
      <div class="data">${getElement(h, 'type="text"') >= 1 ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h, 'type="text"')} / 1+</div>

      <div class="label">TextArea Element:</div>
      <div class="data">${h.includes('<textarea') && h.includes('</textarea>') ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h, '</textarea>')} / 1+</div>

      <div class="label">Select Element:</div>
      <div class="data">${h.includes('<select') && h.includes('</select>') ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h , '</select>')} / 1+</div>

      <div class="label">Option Elements:</div>
      <div class="data">${getElement(h, '</option>') >= 3 ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h, '</option>')} / 3+</div>

      <div class="label">Input Type Number:</div>
      <div class="data">${getElement(h, 'type="number"') >= 1 ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h, 'type="number"')} / 1+</div>

      <div class="label">Label Elements:</div>
      <div class="data">${getElement(h, '</label>') >= 4 ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h, '</label>')} / 4+</div>

      <div class="label">Name Attributes:</div>
      <div class="data">${h.includes('name="q1"') && h.includes('name="q2"') && h.includes('name="q3"') && h.includes('name="q4"') ? '✔️' : '❌'}</div>
      <div class="standard">Each quiz element has a name attribute: q1 - q4.</div>

      <div class="label">ID Attributes:</div>
      <div class="data">${h.includes('id="q1"') && h.includes('id="q2"') && h.includes('id="q3"') && h.includes('id="q4"') ? '✔️' : '❌'}</div>
      <div class="standard">Each quiz element has an id attribute: q1 - q4.</div>



      <h3>Information Only: CSS</h3>
       <div class="label">Rules:</div>
       <div class="data">📑</div>
       <div class="standard">${data.stats.rules.total} : ${data.stats.rules}</div>
       <div class="label">Selectors:</div>
       <div class="data">📑</div>
       <div class="standard">${data.stats.selectors.total} : ${data.stats.selectors}</div>
       <div class="label">Elements:</div>
       <div class="data">📑</div>
       <div class="standard">${data.stats.selectors.values}</div>
       <div class="label">Classes:</div>
       <div class="data">📑</div>
       <div class="standard">${data.stats.selectors.class}</div>
       <div class="label">IDs:</div>
       <div class="data">📑</div>
       <div class="standard">${data.stats.selectors.id}</div>
       <div class="label">Pseudo-classes:</div>
       <div class="data">📑</div>
       <div class="standard">${data.stats.selectors.pseudoClass}</div>
       <div class="label">Pseudo-elements:</div>
       <div class="data">📑</div>
       <div class="standard">${data.stats.selectors.pseudoElement}</div>
       <div class="label">Repeated:</div>
       <div class="data">📑</div>
       <div class="standard">${data.stats.selectors.repeated.length}: ${data.stats.selectors.repeated}</div>
    </main>`;
}