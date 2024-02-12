const code = document.querySelectorAll("code");
code.forEach((element) =&gt; {
  element.addEventListener("mousedown", (e) =&gt; {
    e.preventDefault();
  });
  element.addEventListener("selectstart", (e) =&gt; {
    e.preventDefault();
  });
});

