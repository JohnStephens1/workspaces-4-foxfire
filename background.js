// @ts-check
browser.commands.onCommand.addListener(async (command) => {
  move_tabs_anywhere_at_all();
  tab_group_schtick();
});

async function move_tabs_anywhere_at_all() {
  // browser.tabs.discard(tabIds)  # this frees their memory
  const tabs = await get_selected_tabs();
  const windows = await get_all_windows();
  const window_ids = windows.map(window => window.id);

  for (const tab of tabs) {
    const free_window_id = window_ids.find(window_id => window_id !== tab.windowId);
    await browser.tabs.move(tab.id, { windowId: free_window_id, index: -1 });
  }
}

async function tab_group_schtick() {

}

function get_all_windows() {
  return browser.windows.getAll({ populate: true });
}

function get_selected_tabs() {
  return browser.tabs.query({ highlighted: true, currentWindow: true });
}






// browser.commands.onCommand.addListener(() => {
//   console.log("Opening popup...");
//   // Simulate clicking the browser action to open prompt.html
//   browser.openPopup();
// });

// browser.commands.onCommand.addListener(async (command) => {
//   if (command === "trigger-workspace-input") {
//     console.log("Workspace input trigger");

//     // EITHER: open a popup, or notify sidebar
//     // Here we send a message to the sidebar
//     browser.runtime.sendMessage({ cmd: "awaitingWorkspaceInput" });
//   }
// });






// browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.cmd === "save") {
//     saveWorkspace(message.name);
//   }
//   if (message.cmd === "load") {
//     loadWorkspace(message.name);
//   }
// });

// async function saveWorkspace(name) {
//   const tabs = await browser.tabs.query({ currentWindow: true });
//   const urls = tabs.map(tab => ({ url: tab.url }));
//   const storage = await browser.storage.local.get("workspaces");
//   const workspaces = storage.workspaces || {};
//   workspaces[name] = urls;
//   await browser.storage.local.set({ workspaces });
// }

// async function loadWorkspace(name) {
//   const storage = await browser.storage.local.get("workspaces");
//   const tabs = storage.workspaces?.[name];
//   if (!tabs) return;

//   const currentTabs = await browser.tabs.query({ currentWindow: true });
//   for (const tab of currentTabs) {
//     await browser.tabs.remove(tab.id);
//   }

//   for (const tab of tabs) {
//     await browser.tabs.create({ url: tab.url });
//   }
// }


// browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//   if (msg.cmd === 'save') saveWorkspace(msg.name);
//   if (msg.cmd === 'load') loadWorkspace(msg.name);
// });