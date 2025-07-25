const list = document.getElementById("workspace-list");
const nameInput = document.getElementById("workspace-name");
const saveButton = document.getElementById("save-workspace");

async function refreshWorkspaces() {
  const data = await browser.storage.local.get("workspaces");
  const workspaces = data.workspaces || {};
  list.innerHTML = "";
  Object.keys(workspaces).forEach(name => {
    const div = document.createElement("div");
    div.className = "workspace";
    div.textContent = name;
    div.onclick = () => browser.runtime.sendMessage({ cmd: "load", name });
    list.appendChild(div);
  });
}

saveButton.onclick = async () => {
  const name = nameInput.value.trim();
  if (name) {
    await browser.runtime.sendMessage({ cmd: "save", name });
    await refreshWorkspaces();
  }
};

refreshWorkspaces();
