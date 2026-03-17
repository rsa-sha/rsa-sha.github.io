async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) return null;
  return res.json();
}

async function loadProjects() {
  const container = document.getElementById("projects-list");
  const data = await loadJSON("/data/index.json"); // absolute path

  if (!data) return;

  container.innerHTML = `
    <ul>
      ${data.projects.map(p => `
        <li>
          <strong>${p.name}</strong> — ${p.summary}
          <a href="/projects.html?project=${p.id}">details</a>
        </li>
      `).join('')}
    </ul>
  `;
}

window.onload = loadProjects;
