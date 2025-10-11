let accounts = {
  Guest: { folders: [], deleted: [] } // 👈 Added deleted array per account
};
let currentAccount = "Guest";
let tempTodos = [];

// === Sidebar ===
function toggleMenu() {
  document.getElementById("sidebar").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
}
function closeMenu() {
  document.getElementById("sidebar").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}
function toggleSettings(event) {
  event.preventDefault();
  const panel = document.getElementById("settingsPanel");
  panel.style.display = panel.style.display === "block" ? "none" : "block";
}

// === Folder Modal ===
const folderModal = document.getElementById("folderModal");
document.getElementById("openFolderModal").onclick = () => {
  folderModal.style.display = "flex";
};
document.getElementById("cancelFolderBtn").onclick = () => {
  folderModal.style.display = "none";
  resetTempData();
};

// === Add Todo ===
document.getElementById("addTodoBtn").onclick = () => {
  const task = document.getElementById("todoInput").value.trim();
  if (task) {
    tempTodos.push({ text: task, done: false });
    renderTempTodos();
    document.getElementById("todoInput").value = "";
  }
};
function renderTempTodos() {
  const list = document.getElementById("tempTodoList");
  list.innerHTML = "";
  tempTodos.forEach((todo, i) => {
    const li = document.createElement("li");
    li.textContent = todo.text;
    list.appendChild(li);
  });
}

// === Create Folder ===
document.getElementById("createFolderBtn").onclick = () => {
  const name = document.getElementById("folderNameInput").value.trim();
  if (!name) return alert("Enter a folder name!");
  const userFolders = accounts[currentAccount].folders;
  userFolders.push({ name, todos: [...tempTodos] });
  renderFolders();
  resetTempData();
  folderModal.style.display = "none";
};
function resetTempData() {
  document.getElementById("folderNameInput").value = "";
  document.getElementById("tempTodoList").innerHTML = "";
  tempTodos = [];
}

// === Render Folders ===
function renderFolders() {
  const folderList = document.getElementById("folderList");
  folderList.innerHTML = "";
  const folders = accounts[currentAccount].folders;

  folders.forEach((folder, i) => {
    const li = document.createElement("li");
    li.className = "folder-item";
    li.innerHTML = `
      <h3>${folder.name} 
        <button onclick="deleteFolder(${i})">🗑</button>
      </h3>
      <ul>
        ${folder.todos
          .map(
            (t, j) =>
              `<li><input type='checkbox' onclick='toggleCheck(${i},${j})' ${
                t.done ? "checked" : ""
              }> ${t.text}</li>`
          )
          .join("")}
      </ul>`;
    folderList.appendChild(li);
  });

  document.getElementById("currentAccountTitle").textContent = `My Folders (${currentAccount})`;
}

// === Toggle Checkbox ===
function toggleCheck(folderIndex, todoIndex) {
  const folder = accounts[currentAccount].folders[folderIndex];
  folder.todos[todoIndex].done = !folder.todos[todoIndex].done;
  renderFolders();
}

// === Delete Folder (move to Recently Deleted per account) ===
function deleteFolder(index) {
  const removed = accounts[currentAccount].folders.splice(index, 1)[0];
  if (!accounts[currentAccount].deleted) accounts[currentAccount].deleted = [];
  accounts[currentAccount].deleted.push(removed);
  renderFolders();
}

// === Account Modal ===
const accountModal = document.getElementById("accountModal");
function openAccountPanel(event) {
  event.preventDefault();
  accountModal.style.display = "flex";
  renderAccounts();
}
document.getElementById("closeAccountBtn").onclick = () => {
  accountModal.style.display = "none";
};
document.getElementById("addAccountBtn").onclick = () => {
  const name = document.getElementById("accountNameInput").value.trim();
  if (!name) return alert("Enter account name!");
  if (accounts[name]) return alert("Account already exists!");
  accounts[name] = { folders: [], deleted: [] }; // 👈 Initialize deleted list
  renderAccounts();
  document.getElementById("accountNameInput").value = "";
};
function renderAccounts() {
  const list = document.getElementById("accountList");
  list.innerHTML = "";
  for (const acc in accounts) {
    const li = document.createElement("li");
    li.innerHTML = `<span>${acc}</span> 
      <button onclick="switchAccount('${acc}')">Switch</button>`;
    list.appendChild(li);
  }
}
function switchAccount(name) {
  currentAccount = name;
  accountModal.style.display = "none";
  renderFolders();
}

// === Recently Deleted Modal (only show current account’s deleted folders) ===
function showRecentlyDeleted(event) {
  event.preventDefault();
  document.getElementById("recentlyDeletedModal").style.display = "flex";

  const list = document.getElementById("deletedList");
  const deleted = accounts[currentAccount].deleted || [];

  list.innerHTML =
    deleted.length > 0
      ? deleted
          .map(
            d =>
              `<li><strong>${d.name}</strong> - ${d.todos.length} items</li>`
          )
          .join("")
      : "<p>No recently deleted folders for this account.</p>";
}
function closeDeleted() {
  document.getElementById("recentlyDeletedModal").style.display = "none";
}

// === List Order Modal ===
function showListOrder(event) {
  event.preventDefault();
  document.getElementById("listOrderModal").style.display = "flex";
  const list = document.getElementById("orderedList");
  const sorted = [...accounts[currentAccount].folders].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  list.innerHTML = sorted
    .map(f => `<li>${f.name} (${f.todos.length} items)</li>`)
    .join("");
}
function closeOrdered() {
  document.getElementById("listOrderModal").style.display = "none";
}

// Initial render
renderFolders();
