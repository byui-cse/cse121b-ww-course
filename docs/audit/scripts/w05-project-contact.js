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
  let uri = `${studentgh}.github.io/wdd130/wwr/contact.html`;

  let response = await fetch(`https://${uri}`);
  if (response.status === 200) {
    resetReport();
    const cssStats = await cssstats(uri);
    report.innerHTML += buildReport(cssStats, uri);
  } else {
    message.textContent = "The contact.html page was not found in the wwr folder."
    message.style.display = 'block';
    return;
  }
};

async function cssstats(baseuri) {
  let url = `https://cssstats.com/api/stats?url=${baseuri}`;
  let response = await fetch(url);
  let cssresult = await response.json();
  console.log(cssresult);
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
      <div class="data">${h.indexOf('<!DOCTYPE html>') === 0 ||
        h.indexOf('<!doctype html>') === 0 ? '✔️' : '❌'}</div>
      <div class="standard">&lt;!DOCTYPE html&gt;</div>

      <div class="label">HTML Lang Attribute:</div>
      <div class="data">${h.includes('<html lang="') ? '✔️' : '❌'
      }</div>
      <div class="standard">&lt;html lang="en-US"&gt;</div>

      <div class="label">Meta Charset:</div>
      <div class="data">${h.includes('<meta charset="utf-8"') ||
        h.includes('<meta charset="UTF-8"') ? '✔️' : '❌'}</div>
      <div class="standard">&lt;meta charset="UTF-8"&gt;</div>

      <div class="label">Meta Viewport:</div>
      <div class="data">${h.includes('<meta name="viewport"') ? '✔️' : '❌'
      }</div>
      <div class="standard">&lt;meta name="viewport" content="width=device-width,initial-scale=1.0"&gt;</div>

      <div class="label">Title:</div>
      <div class="data">${data.css.pageTitle.includes('Contact') && data.css.pageTitle.includes('Rafting') ? '❔' : '❓'}</div>
      <div class="standard">"${data.css.pageTitle}" <span class="blue">Must contain 'Contact' and rafting company name</span></div>

      <div class="label">Meta Description:</div>
      <div class="data">${h.indexOf('<meta name="description" content="') > 0 ? '❔' : '❓'}</div>
      <div class="standard">${getContent(h, /<meta\s+name="description"\s+content="([^"]+)"/i)} <span class="blue">Is the description about contacting the company?</span></div>

      <div class="label">Meta Author:</div>
      <div class="data">${h.indexOf('name="author"') > 0 ? '✔️' : '❌'}</div>
      <div class="standard">${getContent(h, /<meta\s+name="author"\s+content="([^"]+)"/i)}</div>

      <div class="label">External CSS:</div>
      <div class="data">${data.css.links[0].link == 'styles/rafting.css' ? '✔️' : '❌'}</div>
      <div class="standard">${data.css.links[0].link || 'not found'}</div>

      <div class="label">Header Element:</div>
      <div class="data">${h.includes('<header') && h.includes('</header>') ? '✔️' : '❌'}</div>
      <div class="standard"></div>

      <div class="label">Nav Element:</div>
      <div class="data">${h.includes('<nav') && h.includes('</nav>') ? '✔️' : '❌'}</div>
      <div class="standard"></div>

      <div class="label">H1 Element:</div>
      <div class="data">${h.includes('<h1') && h.includes('</h1>') ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h, '<h1')} / 1 : ${getContent(h, /<h1>(.*?)<\/h1>/) }</div>

      <div class="label">Main Element:</div>
      <div class="data">${h.includes('<main') && h.includes('</main>') ? '✔️' : '❌'}</div>
      <div class="standard"></div>

      <div class="label">Footer Element:</div>
      <div class="data">${h.includes('<footer') && h.includes('</footer>') ? '✔️' : '❌'}</div>
      <div class="standard"></div>

      <h3>Assignment Elements</h3>

      <div class="label">Embed Google Map:</div>
      <div class="data">${h.includes('src="https://www.google.com/maps/embed?') && h.includes('</iframe>') ? '✔️' : '❌'}</div>
      <div class="standard">iframe with google.com/maps source | Visual check OK</div>

      <div class="label">Form Element:</div>
      <div class="data">${h.includes('<form') && h.includes('</form>') ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h, '<form')} / 1</div>

      <div class="label">Text Input Element:</div>
      <div class="data">${getElement(h, 'type="text"') >= 1 ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h, 'type="text"')}</div>

      <div class="label">Radio Element:</div>
      <div class="data">${getElement(h, 'type="radio"') === 3 ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h, 'type="radio"')} / 3</div>

      <div class="label">TextArea Element:</div>
      <div class="data">${getElement(h, '<textarea') === 1 ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h, '<textarea')} / 1</div>

      <div class="label">Checkbox Element:</div>
      <div class="data">${getElement(h, 'type="checkbox"') === 1 ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h, 'type="checkbox"')} / 1</div>

      <div class="label">Submit Button:</div>
      <div class="data">${getElement(h, '<button type="submit"') === 1 ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h, 'type="submit"')} / 1</div>

      <div class="label">Label Elements:</div>
      <div class="data">${getElement(h, '</label>') >= 6 ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h, '</label>')} / at least 6 associated with form elements</div>

      <div class="label">Name Attributes:</div>
      <div class="data">${getElement(h, 'name="') >= 5 ? '✔️' : '❌'}</div>
      <div class="standard">Each form form element with entries should have a name including each radio button.</div>

      <div class="label">ID Attributes:</div>
      <div class="data">${getElement(h, 'id="') >= 5 ? '✔️' : '❌'}</div>
      <div class="standard">Each associated with a lable form element should have an id attribute.</div>

      <div class="label">Image Elements:</div>
      <div class="data">${getElement(h, '<img') >= 7 ? '✔️' : '❌'}</div>
      <div class="standard">${getElement(h, '<img')} / there should be at least 7 on this page </div>


       <h3>CSS Information</h3>
       <div class="label">Rules:</div>
       <div class="data">📑</div>
       <div class="standard">${data.stats.rules.total} : ${data.stats.rules}</div>

       <div class="label">Selectors:</div>
       <div class="data">📑</div>
       <div class="standard">${data.stats.selectors.total} : ${data.stats.selectors}</div>

       <div class="label">Repeated:</div>
       <div class="data">📑</div>
       <div class="standard">${data.stats.selectors.repeated.length} : ${data.stats.selectors.repeated}</div>

    </main>`;
}