async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) {
    console.error("Failed to load JSON:", path);
    return null;
  }
  return res.json();
}

async function loadProjects() {
  const container = document.getElementById("projects-list");
  const data = await loadJSON("data/index.json");
  if (!data) return;

  container.innerHTML = `
    <ul>
      ${data.projects.map(p => `
        <li>
          <strong>${p.name}</strong> — ${p.summary}
          <a href="#" onclick="showProject('${p.id}');return false;">details</a>
        </li>
      `).join('')}
    </ul>
  `;

  // Check URL param and auto-show project
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get("project");
  if (projectId) {
    showProject(projectId);
  }
}

async function showProject(id) {
  const data = await loadJSON(`data/${id}.json`);
  if (!data) return;

  const viewer = document.getElementById("viewer");
  viewer.innerHTML = `
    <h2>${data.name}</h2>
    <p>${data.summary}</p>
    <h3>Design</h3>
    <ul>${data.design.map(d => `<li>${d}</li>`).join('')}</ul>
    ${data.repo ? `<p><a href="${data.repo}" target="_blank" rel="noopener">source</a></p>` : ''}
  `;

  viewer.scrollIntoView({ behavior: "smooth" });
}

window.onload = loadProjects;
