// Document preview rendering — zero dependencies.
// Builds DOM for a readDocument() descriptor into a target container.

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Minimal, safe Markdown → HTML (headings, bold/italic/code, lists, quotes,
// hr, links, fenced code). Escapes first, so no raw HTML injection.
function renderMarkdown(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let inCode = false;
  let listOpen = false;
  const closeList = () => { if (listOpen) { html += "</ul>"; listOpen = false; } };

  for (let raw of lines) {
    if (/^```/.test(raw)) {
      if (inCode) { html += "</code></pre>"; inCode = false; }
      else { closeList(); html += '<pre class="md-code"><code>'; inCode = true; }
      continue;
    }
    if (inCode) { html += escapeHtml(raw) + "\n"; continue; }

    let line = escapeHtml(raw);
    // inline: code, bold, italic, links
    line = line
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    if (/^#{1,6}\s/.test(raw)) {
      closeList();
      const level = raw.match(/^#+/)[0].length;
      html += `<h${level}>${line.replace(/^#{1,6}\s/, "")}</h${level}>`;
    } else if (/^\s*[-*+]\s/.test(raw)) {
      if (!listOpen) { html += "<ul>"; listOpen = true; }
      html += `<li>${line.replace(/^\s*[-*+]\s/, "")}</li>`;
    } else if (/^\s*>\s?/.test(raw)) {
      closeList();
      html += `<blockquote>${line.replace(/^\s*>\s?/, "")}</blockquote>`;
    } else if (/^\s*([-*_])\1{2,}\s*$/.test(raw)) {
      closeList();
      html += "<hr/>";
    } else if (raw.trim() === "") {
      closeList();
    } else {
      closeList();
      html += `<p>${line}</p>`;
    }
  }
  if (inCode) html += "</code></pre>";
  closeList();
  return html;
}

// Renders into `container` (clears it). Returns a cleanup() that revokes any
// object URLs created for image/pdf previews.
export function renderPreview(container, doc, title) {
  container.innerHTML = "";
  let objectUrl = null;

  const head = document.createElement("div");
  head.className = "pv-head";
  head.textContent = title;
  container.appendChild(head);

  const body = document.createElement("div");
  body.className = "pv-body";
  container.appendChild(body);

  switch (doc.type) {
    case "markdown":
      body.classList.add("pv-md");
      body.innerHTML = renderMarkdown(doc.text);
      break;
    case "code":
    case "text": {
      const pre = document.createElement("pre");
      pre.className = "pv-pre";
      pre.textContent = doc.text;
      body.appendChild(pre);
      break;
    }
    case "image": {
      objectUrl = doc.url;
      const img = document.createElement("img");
      img.className = "pv-img";
      img.src = doc.url;
      img.alt = title;
      body.appendChild(img);
      break;
    }
    case "pdf": {
      objectUrl = doc.url;
      const frame = document.createElement("iframe");
      frame.className = "pv-pdf";
      frame.src = doc.url + "#toolbar=0";
      body.appendChild(frame);
      break;
    }
    default: {
      const note = document.createElement("div");
      note.className = "pv-note";
      note.textContent = doc.message ?? "no preview available";
      body.appendChild(note);
    }
  }

  return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
}
