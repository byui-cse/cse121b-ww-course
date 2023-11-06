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
  let uri = `${studentgh}.github.io//`;

  let response = await fetch(`https://${uri}`);
  if (response.status === 200) {
    resetReport();
    const cssStats = await cssstats(uri);
    report.innerHTML += buildReport(cssStats, uri);
  } else {
    message.textContent = "The index.html page was not found in the  folder."
    message.style.display = 'block';
    return;
  }
};

async function cssstats(baseuri) {
  let url = `https://cssstats.com/api/stats?url=${baseuri}`;
  let response = await fetch(url);
  let cssresult = await response.json();
  // console.log(cssresult);
  return cssresult;
}

function resetReport() {
  message.innerHTML = '';
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
  let c = data.css.css;

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
      <div class="data">${h.includes('<!DOCTYPE html>') ||  h.includes('<!doctype html>') ? '✔️' : '❌'}</div>
      <div class="standard">&lt;!DOCTYPE html&gt;</div>

      <div class="label">HTML Lang Attribute:</div>
      <div class="data">${h.includes('<html lang="') ? '✔️' : '❌'}</div>
      <div class="standard">&lt;html lang="en-US"&gt;</div>

      <div class="label">Meta Charset:</div>
      <div class="data">${h.includes('<meta charset="utf-8"') || h.includes('<meta charset="UTF-8"') ? '✔️' : '❌'}</div>
      <div class="standard">&lt;meta charset="UTF-8"&gt;</div>

      <div class="label">Meta Viewport:</div>
      <div class="data">${h.includes('name="viewport"') ? '✔️' : '❌'}</div>
      <div class="standard">&lt;meta name="viewport" content="width=device-width,initial-scale=1.0"&gt;</div>

      <div class="label">Title:</div>
      <div class="data">${data.css.pageTitle.includes('CSE 121B') ? '✔️' : '❓'}</div>
      <div class="standard">"${data.css.pageTitle}"</div>

      <div class="label">Meta Description:</div>
      <div class="data">${h.includes('<meta name="description" content="') ? '✔️' : '❌'}</div>
      <div class="standard">${getContent(h, /<meta\s+name="description"\s+content="([^"]+)"/i )}</div>

      <div class="label">Meta Author:</div>
      <div class="data">${h.includes('<meta name="author"') ? '✔️' : '❌'}</div>
      <div class="standard">${getContent(h, /<meta\s+name="author"\s+content="([^"]+)"/i)}</div>

      <div class="label">Header Element:</div>
      <div class="data">${h.includes('<header') && h.includes('</header>') ? '✔️' : '❌'}</div>
      <div class="standard"></div>

      <div class="label">Nav Element:</div>
      <div class="data">${h.includes('<nav') && h.includes('</nav>') ? '✔️' : '❌'}</div>
      <div class="standard"></div>

      <div class="label">Anchor &lt;a&gt; Elements:</div>
      <div class="data">${getElement(h, '<a') >= 3 ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h, '<a')} / 3</div>

      <div class="label">Main Element:</div>
      <div class="data">${h.includes('<main') && h.includes('</main>') ? '✔️' : '❌'}</div>
      <div class="standard"></div>

      <div class="label">H1 Element:</div>
      <div class="data">${h.includes('<h1') && h.includes('</h1>') ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h, '<h1')} / 1 : ${getContent(h, /<h1>(.*?)<\/h1>/) }</div>

      <div class="label">Footer Element:</div>
      <div class="data">${h.includes('<footer') && h.includes('</footer>') ? '✔️' : '❌'}</div>
      <div class="standard"></div>

      <h3>Assignment Elements</h3>

      <div class="label">Aside Element:</div>
      <div class="data">${h.includes('<aside') && h.includes('</aside>') ? '✔️' : '❌'}</div>
      <div class="standard"></div>

      <div class="label">H2 Element:</div>
      <div class="data">${h.includes('<h2') && h.includes('</h2>') ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h, '<h2')} / 1</div>

      <div class="label">Img Elements:</div>
      <div class="data">${getElement(h, '<img') >= 2 ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h, '<img')} / 2</div>

      <div class="label">Paragraph Elements:</div>
      <div class="data">${getElement(h, '<p') >= 2 ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h, '<p')} / 2</div>



      <h3>CSS</h3>

      <div class="label">Nav Rule:</div>
      <div class="data">${c.includes('nav {') ? '✔️' : '❌'}</div>
      <div class="standard">nav { ... }</div>

      <div class="label">Nav Anchor Rule:</div>
      <div class="data">${c.includes('nav a {') ? '✔️' : '❌'}</div>
      <div class="standard">nav a { ... }</div>

      <div class="label">Heading 1 Rule:</div>
      <div class="data">${c.includes('h1 {') ? '✔️' : '❌'}</div>
      <div class="standard">h1 { ... }</div>

      <div class="label">img Rule:</div>
      <div class="data">${c.includes('img {') ? '✔️' : '❌'}</div>
      <div class="standard">img { ... }</div>

      <div class="label">Aside Rule:</div>
      <div class="data">${c.includes('aside {') ? '✔️' : '❌'}</div>
      <div class="standard">aside { ... }</div>

      <div class="label">Aside Image Rule:</div>
      <div class="data">${c.includes('aside img {') ? '✔️' : '❌'}</div>
      <div class="standard">aside img { ... }</div>

      <div class="label">Paragraph Rule:</div>
      <div class="data">${c.includes('p {') && c.includes('padding: 0;') ? '✔️' : '❌'}</div>
      <div class="standard">p { padding: 0; }</div>

      <div class="label">Footer Rule:</div>
      <div class="data">${c.includes('footer {') ? '✔️' : '❌'}</div>
      <div class="standard">footer { ... }</div>

    </main>`;
}