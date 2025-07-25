let waitingForNumber = false;

browser.runtime.onMessage.addListener((msg) => {
  if (msg.cmd === "awaitingWorkspaceInput") {
    waitingForNumber = true;
    console.log("Press a number key (1–9)");
  }
});

let something = prompt("pressanumba");
console.log(something);

document.addEventListener("keydown", (e) => {
  if (!waitingForNumber) return;
  if (e.key >= "1" && e.key <= "9") {
    console.log("Number pressed:", e.key);
    waitingForNumber = false;

    // Handle action here:
    handleWorkspaceInput(parseInt(e.key, 10));
  }
});

function handleWorkspaceInput(num) {
  // Your custom logic for workspace number
  console.log("Switching to workspace", num);
}


// const list = document.getElementById("workspace-list");
// const nameInput = document.getElementById("workspace-name");
// const saveButton = document.getElementById("save-workspace");

// async function refreshWorkspaces() {
//   const data = await browser.storage.local.get("workspaces");
//   const workspaces = data.workspaces || {};
//   list.innerHTML = "";
//   Object.keys(workspaces).forEach(name => {
//     const div = document.createElement("div");
//     div.className = "workspace";
//     div.textContent = name;
//     div.onclick = () => browser.runtime.sendMessage({ cmd: "load", name });
//     list.appendChild(div);
//   });
// }

// saveButton.onclick = async () => {
//   const name = nameInput.value.trim();
//   if (name) {
//     await browser.runtime.sendMessage({ cmd: "save", name });
//     await refreshWorkspaces();
//   }
// };

// refreshWorkspaces();
