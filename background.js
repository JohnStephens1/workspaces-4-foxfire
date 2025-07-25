browser.commands.onCommand.addListener(async (command) => {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  console.log("Active tab:", tab);

  switch (command) {
    case "custom-action-1":
      // Do something with the tab
      console.log("Action 1 triggered on", tab.url);
      break;
    case "custom-action-2":
      // Another action
      break;
  }
});






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