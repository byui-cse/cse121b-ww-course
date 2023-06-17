async function getJavaScriptText(URL) {
  try {
    let res = await fetch(URL);
    return await res.text();
  } catch (err) {
    console.error(err);
  }
}

export { getJavaScriptText };