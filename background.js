// @ts-check
browser.commands.onCommand.addListener(async (command) => {
  move_tabs_anywhere_at_all();
  return;
//   const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  console.log("tabs", tabs);
  const tab_ids = tabs.map(tab => tab.id);
  console.log("tab_ids", tab_ids);
  const windows = await browser.windows.getAll({ populate: true });
  windows
  console.log("windows", windows);
  console.log("gimme info", windows[0].id);
  await browser.tabs.move(tab_ids, { windowId: 44, index: -1 });
});

async function move_tabs_anywhere_at_all() {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const windows = await browser.windows.getAll({ populate: true });
  const window_ids = windows.map(window => window.id);

  for (const tab of tabs) {
    const free_window_id = window_ids.find(window_id => window_id !== tab.windowId);
    await browser.tabs.move(tab.id, { windowId: free_window_id, index: -1 });
  }
}



// browser.commands.onCommand.addListener(async (command) => {
//   const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
//   console.log("Active tab:", tab);

//   switch (command) {
//     case "custom-action-1":
//       // Do something with the tab
//       console.log("Action 1 triggered on", tab.url);
//       break;
//     case "custom-action-2":
//       // Another action
//       break;
//   }
// });


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