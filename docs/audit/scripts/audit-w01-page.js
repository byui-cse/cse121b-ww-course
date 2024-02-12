import { getElement, getContent } from './element-data.js';
import { student, getReportButton, report, message } from './interface.js';

const modal = document.querySelector("#modal");
const modalContent = document.querySelector(".modal-content");
const closeModal = document.querySelector(".close-button");
closeModal.addEventListener("click", () =&gt; {
  modal.close();
});

getReportButton.addEventListener('click', getReport);

document.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    getReport();
  }
});

function checkURL(url) {
  return fetch(url)
    .then(res =&gt; res.ok)
    .catch(err =&gt; false);
}

async function getReport() {
  resetReport();
  let studentgh = student.value;
  if (studentgh === "") {
    student.focus();
    return;
  }
  else {
    let uri = `${studentgh}.github.io/cse121b/test.html`;
    let url = `https://${uri}`;
    let rescheck = await checkURL(url);
    if (rescheck) {
      const cssStats = await cssstats(uri);
      report.innerHTML += buildReport(cssStats, uri);
    } else {
      message.style.display = "block";
      return;
    }
  }
}

async function cssstats(baseuri) {
  let url = `https://cssstats.com/api/stats?url=${baseuri}`;
  let response = await fetch(url);
  return await response.json();
}

function resetReport() {
  message.style.display = 'none';
  report.textContent = '';
}

async function validateHTML(h) {
  let url = `https://validator.w3.org/nu/?out=json`;
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/html'
    },
    body: h
  });
  if (response.status !== 200 || !response.ok) {
    throw new Error(`Validation failed with status code ${response.status}`);
  }
  let hResult = await response.json();

  // build error message list in dialog modal
  let htmlErrorMessages = hResult.messages;
  if (htmlErrorMessages.length > 0) {
    modalContent.innerHTML = '';
    htmlErrorMessages.forEach((message) =&gt; {
      modalContent.innerHTML += `<p>▶ ${message.message}</p>`;
    });
    modal.showModal();
  }

  let htmlErrorCount = hResult.messages.reduce((count, message) =&gt; {
    return message.type === 'error' ? count + 1 : count;
  }, 0);

  return htmlErrorCount;
}

function buildReport(data, url) {
  let h = data.css.html;
  h = h.replace(/[\n\r]/g, ""); // remove line breaks
  h = h.replace(/ {2,}/g, " "); // remove extra spaces
  h = h.replace(/<!--[\s\S]*?-->/g, ''); // remove comments

  validateHTML(h)
    .then((htmlErrorCount) =&gt; {
      document.getElementById('hvalid').innerHTML = (htmlErrorCount === 0) ? '✅' : '❌';
      document.getElementById('htmlerrorscount').innerHTML = `Errors: ${htmlErrorCount}`;
    })
    .catch((error) =&gt; {
      document.getElementById('htmlerrorscount').innerHTML = `${error}`;
    });

  return `<main>
      <div class="label">HTML Validator:</div>
      <div class="data" id="hvalid"></div>
      <div class="standard"> <span class="blue" id="htmlerrorscount"></span> 🔗<a href="https://validator.w3.org/check?verbose=1&uri=${url}" target="_blank">w3.org HTML Validation Report</a>
      </div>

      <h3>Required Elements</h3>
      <div class="label">Document Type:</div>
      <div class="data">${h.includes('<!DOCTYPE html>') || h.includes('<!doctype html>') ? '✅' : '❌'}</div>
      <div class="standard"></div>

      <div class="label">HTML Lang Attribute:</div>
      <div class="data">${h.includes('<html lang="') > 0 ? '✅' : '❌'}</div>
      <div class="standard">&lt;html lang="en"&gt;</div>

      <div class="label">&lt;head&gt;</div>
      <div class="data">${h.includes('<head') && h.includes('</head>') ? '✅' : '❌'}</div>
      <div class="standard"></div>

      <div class="label">&lt;title&gt;</div>
      <div class="data">${data.css.pageTitle.includes('CSE 121B') && data.css.pageTitle.includes('BYU-Idaho') && data.css.pageTitle.length > 25 ? '✅' : '👀'}</div>
      <div class="standard">"${data.css.pageTitle}" <span class="blue">Student name, CSE 121B, BYU-Idaho</span></div>

      <div class="label">&lt;body&gt;</div>
      <div class="data">${h.includes('<body') && h.includes('</body>') ? '✅' : '❌'}</div>
      <div class="standard"></div>

      <div class="label">&lt;h1&gt; heading</div>
      <div class="data">${h.includes('<h1') && h.includes('</h1>') ? '👀' : '❌'}</div>
      <div class="standard">${getContent(h, /<h1>(.*?)<\/h1>/)} <span class="blue">👀 Student Name, CSE 121B, BYU-Idaho</span></div>

      <div class="label">&lt;h2&gt; heading</div>
      <div class="data">${h.includes('<h2') && h.includes('</h2>') ? '👀' : '❌'}</div>
      <div class="standard">${getContent(h, /<h2>(.*?)<\/h2>/)} <span class="blue">👀 Student Location</span></div>

      <div class="label">&lt;hr&gt;</div>
      <div class="data">${h.includes('<hr>') || h.includes('<hr/>') ? '✅' : '❌'}</div>
      <div class="standard"></div>

      <div class="label">Document Structure</div>
      <div class="data">
        ${h.indexOf('<html') < h.indexOf('<head>') &&
      h.indexOf('<head>') < h.indexOf('</head>') &&
      h.indexOf('</head>') < h.indexOf('<body>') &&
      h.indexOf('<body>') < h.indexOf('</h1>') &&
      h.indexOf('</h1>') < h.indexOf('</h2>') &&
      h.indexOf('</h2>') < h.indexOf('<hr>') &&
      h.indexOf('<hr>') < h.indexOf('</body>') &&
      h.indexOf('</body>') < h.indexOf('</html>') ? '✅' : '❌'}
      </div>
      <div class="standard">Per assignment &nbsp;<a href="https://byui-cse.github.io/cse121b-ww-course/week01/setup-github-pages.html#check" target="_blank">specifications</a>. Click "Check Your Work" to compare.</div>

    </main>`;
}