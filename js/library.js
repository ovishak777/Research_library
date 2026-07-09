Auth.requireLogin();

const session_key = "rp_auth_session_key";

const form = document.getElementById("add-form");
const input = document.getElementById("link-input");
const formMsg = document.getElementById("form-msg");
const list = document.getElementById("paper-list");
const emptyMsg = document.getElementById("empty-msg");
const logoutBtn = document.getElementById("logout-btn");

let papers = [];

async function init() {
  const stored = localStorage.getItem(session_key);

  if (stored) {
    papers = JSON.parse(stored);
  } else {
    // First run: seed from data/papers.json if it exists
    try {
      const res = await fetch("data/papers.json");
      papers = res.ok ? await res.json() : [];
    } catch (err) {
      papers = [];
    }
    save();
  }

  render();
}

function save() {
  localStorage.setItem(session_key, JSON.stringify(papers));
}

function render() {
  list.innerHTML = "";

  if (papers.length === 0) {
    emptyMsg.classList.remove("hidden");
    return;
  }
  emptyMsg.classList.add("hidden");

  papers.forEach((entry) => {
    const li = document.createElement("li");

    const info = document.createElement("div");
    info.className = "entry-info";

    const typeLabel = document.createElement("span");
    typeLabel.className = "entry-type";
    typeLabel.textContent = entry.type === "doi" ? "DOI" : "Link";

    const valueLabel = document.createElement("span");
    valueLabel.className = "entry-value";
    valueLabel.textContent = entry.value;
    valueLabel.title = entry.value;

    info.appendChild(typeLabel);
    info.appendChild(valueLabel);

    const searchBtn = document.createElement("button");
    searchBtn.className = "search-btn";
    searchBtn.textContent = "Search";
    searchBtn.addEventListener("click", () => {
      window.open(SEARCH.getOpenUrl(entry), "_blank", "noopener");
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      papers = papers.filter((p) => p.id !== entry.id);
      save();
      render();
    });

    li.appendChild(info);
    li.appendChild(searchBtn);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const raw = input.value.trim();

  if (!raw) {
    formMsg.textContent = "Paste a link or DOI first.";
    formMsg.classList.add("error");
    return;
  }

  const detected = SEARCH.detectType(raw);

  const alreadyExists = papers.some((p) => p.value === detected.value);
  if (alreadyExists) {
    formMsg.textContent = "That entry is already in your library.";
    formMsg.classList.add("error");
    return;
  }

  papers.unshift({
    id: Date.now().toString(),
    type: detected.type,
    value: detected.value,
    dateAdded: new Date().toISOString().slice(0, 10),
  });

  save();
  render();
  input.value = "";
  formMsg.textContent = "";
  formMsg.classList.remove("error");
});

logoutBtn.addEventListener("click", () => Auth.logout());

init();
