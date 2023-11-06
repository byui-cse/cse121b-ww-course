const student = document.querySelector("#student");
const getReportButton = document.querySelector("#getReport");
const report = document.querySelector("#report");
const message = document.querySelector("#message");

getReportButton.addEventListener("click", getReport);

document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getReport();
  }
});

async function getReport() {
  let studentgh = student.value;
  if (studentgh === "") {
    message.textContent = "A valid GitHub username is required.";
    message.style.display = "block";
    student.focus();
    return;
  }
  let uri = `${studentgh}.github.io//wwr/about.html`;

  let response = await fetch(`https://${uri}`);
  if (response.status === 200) {
    resetReport();
    const cssStats = await cssstats(uri);
    report.innerHTML += buildReport(cssStats, uri);
  } else {
    message.textContent =
      "The about.html page was not found in the wwr folder.";
    message.style.display = "block";
    return;
  }
}

async function cssstats(baseuri) {
  let url = `https://cssstats.com/api/stats?url=${baseuri}`;
  let response = await fetch(url);
  let cssresult = await response.json();
  // console.log(cssresult);
  return cssresult;
}

function resetReport() {
  report.textContent = "";
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
      <div class="data">${
        h.includes("<!DOCTYPE html>") || h.includes("<!doctype html>")
          ? "✔️"
          : "❌"
      }</div>
      <div class="standard">&lt;!DOCTYPE html&gt; or &lt;!doctype html&gt;</div>

      <div class="label">HTML Lang Attribute:</div>
      <div class="data">${h.includes('<html lang="') ? "✔️" : "❌"}</div>
      <div class="standard">&lt;html lang="en-US"&gt;</div>

      <div class="label">Meta Charset:</div>
      <div class="data">${
        h.includes('<meta charset="utf-8"') ||
        h.includes('<meta charset="utf-8"')
          ? "✔️"
          : "❌"
      }</div>
      <div class="standard">&lt;meta charset="utf-8"&gt;</div>

      <div class="label">Meta Viewport:</div>
      <div class="data">${
        h.includes('<meta name="viewport"') ? "✔️" : "❌"
      }</div>
      <div class="standard">&lt;meta name="viewport" content="width=device-width,initial-scale=1.0"&gt;</div>

      <div class="label">Title:</div>
      <div class="data">${
        data.css.pageTitle.includes("About Us") ? "❔" : "❓"
      }</div>
      <div class="standard">"${
        data.css.pageTitle
      }" <span class="blue">Rafting co. name and "About Us"</span></div>

      <div class="label">Meta Description:</div>
      <div class="data">${
        h.includes('<meta name="description" content="') ? "✔️" : "❌"
      }</div>
     <div class="standard">${getContent(
       h,
       /<meta\s+name="description"\s+content="([^"]+)"/i
     )}</div>

      <div class="label">Meta Author:</div>
      <div class="data">${h.includes('<meta name="author"') ? "✔️" : "❌"}</div>
      <div class="standard">${getContent(
        h,
        /<meta\s+name="author"\s+content="([^"]+)"/i
      )}</div>

      <div class="label">External CSS:</div>
      <div class="data">${
        data.css.links[0].link == "styles/rafting.css" ? "✔️" : "❌"
      }</div>
      <div class="standard">${data.css.links[0].link || "not found"}</div>

      <div class="label">Header Element:</div>
      <div class="data">${
        h.includes("<header") && h.includes("</header>") ? "✔️" : "❌"
      }</div>
      <div class="standard"></div>

      <div class="label">Nav Element:</div>
      <div class="data">${
        h.includes("<nav") && h.includes("</nav>") ? "✔️" : "❌"
      }</div>
      <div class="standard"></div>

<div class="label">H1 Element:</div>
      <div class="data">${
        h.includes("<h1") && h.includes("</h1>") ? "✔️" : "❌"
      }</div>
      <div class="standard">${getElement(h, "<h1")} / 1</div>

      <div class="label">Main Element:</div>
      <div class="data">${
        h.includes("<main") && h.includes("</main>") ? "✔️" : "❌"
      }</div>
      <div class="standard"></div>

      <div class="label">Footer Element:</div>
      <div class="data">${
        h.includes("<footer") && h.includes("</footer>") ? "✔️" : "❌"
      }</div>
      <div class="standard"></div>

      <h3>Assignment Elements</h3>

      <div class="label">H2 Elements:</div>
      <div class="data">${
        h.includes("<h2") && h.includes("</h2>") && getElement(h, "<h2") >= 2
          ? "✔️"
          : "❌"
      }</div>
      <div class="standard">${getElement(h, "<h2")} / at least 2</div>

      <div class="label">Section Elements:</div>
      <div class="data">${
        h.includes("<section") && h.includes("</section>") ? "✔️" : "❌"
      }</div>
      <div class="standard">${getElement(h, "<section")} / 2</div>

      <div class="label">Figure Elements:</div>
      <div class="data">${getElement(h, "<figure") >= 5 ? "✔️" : "❌"}</div>
      <div class="standard">${getElement(h, "<figure")} / at least 5</div>

      <div class="label">Img Elements:</div>
      <div class="data">${getElement(h, "<img") >= 10 ? "✔️" : "❌"}</div>
      <div class="standard">${getElement(h, "<img")} / at least 10</div>


      <h3>Information: CSS</h3>
      <div class="label">Rules:</div>
       <div class="data">📑</div>
       <div class="standard">${data.stats.rules.total}</div>
       <div class="label">Selectors:</div>
       <div class="data">📑</div>
       <div class="standard">${data.stats.selectors.total}: ${data.stats.selectors.values}</div>
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
       <div class="standard">${data.stats.selectors.repeated.length}</div>

    </main>`;
}
