async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) return null;
  return res.json();
}

let allPosts = [];

async function loadPosts() {
  const manifest = await loadJSON("./posts/index.json"); // relative to research/
  if (!manifest) return;

  allPosts = await Promise.all(
    manifest.posts.map(async p => {
      const meta = await loadJSON(`./posts/${p.id}.json`);
      const mdRes = await fetch(`./posts/${p.id}.md`);
      const content = mdRes.ok ? await mdRes.text() : "";
      return { ...meta, content };
    })
  );

  renderPosts();
}

function renderPosts() {
  const container = document.getElementById("posts-list");
  const sortEl = document.getElementById("sort");
  const sort = sortEl ? sortEl.value : "desc";

  const sorted = [...allPosts].sort((a, b) =>
    sort === "desc" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
  );

  container.innerHTML = `
    <ul>
      ${sorted.map(p => `
        <li>
          <strong>${p.title}</strong><br>
          <span class="meta">${p.date} · ${p.project}</span><br>
          ${p.summary}<br>
          <a href="#" onclick="showPost('${p.id}');return false;">read</a>
        </li>
      `).join("")}
    </ul>
  `;
}

function showPost(id) {
  const post = allPosts.find(p => p.id === id);
  if (!post) return;

  const viewer = document.getElementById("viewer");
  viewer.innerHTML = `
    <h2>${post.title}</h2>
    <p class="meta">${post.date} · ${post.project}</p>
    <p>${post.summary}</p>
    <div>${marked(post.content)}</div>
  `;
}

document.getElementById("sort")?.addEventListener("change", renderPosts);

loadPosts();
