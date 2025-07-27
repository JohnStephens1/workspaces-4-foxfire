// @ts-check


// let storage = {0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {}, 9: {}};
let storage = {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []};
let active = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


function is_number(string) {
  return !isNaN(parseInt(string));
}


browser.commands.onCommand.addListener(async (command) => {
  // show_all_tabs();
  if (is_number(command)) {
    tab_shenanigans(command);
  }

  switch (command) {
    case "show-all-tabs":
      show_all_tabs();
      break;
  }
});



async function tab_shenanigans(command) {
  // store current
  const active_workspace = get_active_workspace();
  if (active_workspace == command) return;

  const visible_tabs = await get_visible_tabs();
  storage[active_workspace] = visible_tabs;

  // hide schtick avoidance
  const temp_tab = await browser.tabs.create({});
  const temp_tab_id = temp_tab.id;

  // get selected
  const new_tabs = storage[command];

  console.log(1);
  const new_tab_ids = new_tabs.map(({ id }) => id);
  browser.tabs.show(new_tab_ids);

  console.log(2);
  const old_tab_ids = visible_tabs.map(({ id }) => id);
  browser.tabs.hide(old_tab_ids);
  set_active_workspace(command);
  console.log(3);
  // kill bs tab again
  const remaining_visible_tabs = await get_visible_tabs();
  if (remaining_visible_tabs.length > 1) {
    browser.tabs.remove(temp_tab_id);
  }
}


async function something_save(command) {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const visible_tabs = tabs.filter(tab => tab.hidden == false);
  storage[command] = visible_tabs;
}

async function something_switch(command) {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const visible_tabs = tabs.filter(tab => tab.hidden == false);
  storage[command] = visible_tabs;
}

async function get_visible_tabs() {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const visible_tabs = tabs.filter(tab => tab.hidden == false);
  return visible_tabs;
}

function set_active_workspace(command) {
  active = active.fill(0);
  active[parseInt(command)] = 1;
}

function get_active_workspace() {
  const index = active.findIndex(x => x == 1);
  if (index == -1) return 1;
  return index;
}







async function make_me_smile() {
  const current_win = await browser.windows.getCurrent({populate: true});
  console.log(current_win.tabs);
  [{hello: 'potato'}][0].hello
  const tab_ids = current_win.tabs.map(({ id }) => id);
  browser.tabs.hide(tab_ids);
  // for (const tab of current_win.tabs) {
    
  // }
  console.log("fk u")
}


async function something_visibility() {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const visible_tabs = tabs.filter(tab => tab.hidden == false);
    // browser.tabs.hide(tab_ids);

}


async function hide_all_tabs() {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const tab_ids = tabs.map(({ id }) => id);
  browser.tabs.hide(tab_ids);
}


async function show_all_tabs() {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const tab_ids = tabs.map(({ id }) => id);
  browser.tabs.show(tab_ids);
  storage = {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []};
  active = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}





// async function full_case_1() {
  // current window, get tabs, id
  // const current_win = await browser.windows.getCurrent({populate: true});
  // console.log(current_win);
  // store current groups
  // const present_group_ids = [...new Set(
  //   current_win.tabs
  //     .map(tab => tab.groupId)
  //     .filter(groupId => groupId !== -1)
  // )];

  // console.log(present_group_ids);

  // for (const tab of current_win.tabs) {
  //   if tab.groupId !== -1 {
  //     // we got a tab
  //     // store group_id
  //   }
  // }

// }


// async function store_retrieve_group(current_group_id, target_group_id, current_window_id) {
//   const base_window_id = await base_window_schtick();
//   get_group(target_group_id, current_window_id);
//   store_group(current_group_id);
// }


// async function store_group(group_id) {
//   const base_window_id = await base_window_schtick();

//   // @ts-ignore
//   browser.tabGroups.move(group_id, {index: -1, windowId: base_window_id});
// }


// async function get_group(group_id, current_window_id) {
//   // @ts-ignore
//   browser.tabGroups.move(group_id, {index: -1, windowId: current_window_id});
// }


// async function base_window_schtick() {
//   const base_group_name = "0";
//   const base_group_color = "blue";
//   // @ts-ignore
//   const group = await browser.tabGroups.query({title: base_group_name});

//   if (group.length) {
//     // @ts-ignore
//     // browser.tabGroups.update(group[0].id, {collapsed: true});

//     return group[0].windowId;
//   } else {
//     // create le window
//     const le_window = await browser.windows.create({
//       focused: false,
//       state: "minimized"
//     })
//     const le_window_id = le_window.id;
//     // console.log("tabs", le_window.tabs)
//     const tab_ids = le_window.tabs.map(({ id }) => id);
//     // @ts-ignore
//     const group_id = await browser.tabs.group({tabIds: tab_ids, createProperties: {windowId: le_window_id}});
//     // @ts-ignore
//     // browser.tabGroups.update(group_id, {color: base_group_color, title: base_group_name, collapsed: true});
//     browser.tabGroups.update(group_id, {color: base_group_color, title: base_group_name});

//     return le_window_id;
//   }
// }


// async function tab_group_schtick() {
//   const group_name = "1";
//   const group_color = "red";

//   // @ts-ignore
//   const group = await browser.tabGroups.query({title: group_name});

//   const tabs = await get_selected_tabs();
//   const tab_ids = tabs.map(({ id }) => id);

//   if (group.length) {
//     // @ts-ignore
//     browser.tabs.group({'groupId': group[0]?.id, 'tabIds': tab_ids});
//   } else {
//     // @ts-ignore
//     // const le_id = await browser.tabs.group({tabIds: tab_ids, createProperties: {windowId: tab.windowId}});
//     const group_id = await browser.tabs.group({tabIds: tab_ids});
//     // @ts-ignore
//     browser.tabGroups.update(group_id, {color: group_color, title: group_name});
//   }
// }

// async function move_tabs_anywhere_at_all() {
//   // browser.tabs.discard(tabIds)  # this frees their memory
//   const tabs = await get_selected_tabs();
//   const windows = await get_all_windows();
//   const window_ids = windows.map(window => window.id);

//   for (const tab of tabs) {
//     const free_window_id = window_ids.find(window_id => window_id !== tab.windowId);
//     await browser.tabs.move(tab.id, { windowId: free_window_id, index: -1 });
//   }
// }

// function get_all_windows() {
//   return browser.windows.getAll({ populate: true });
// }

// function get_selected_tabs() {
//   return browser.tabs.query({ highlighted: true, currentWindow: true });
// }






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





// async function tab_group_schtick_old() {
//   /*
//   browser.tabs.group(
//     createProperties: pbb no?,
//     windowId: specific or current,
//     groupId: target group id,else created,
//     tabIds
//   )
//   tabGroups.Color, move, query, update ...
//   https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabGroups
//   https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/group
//   */

//   const le_group_id = 1;
//   const group_name = "1";
 
//   const tabs = await get_selected_tabs();
//   const tab_ids = tabs.map(({ id }) => id);

  
//   // browser.tabs.group()
//   // colors blue,cyan,grey,green,orange,pink,purple,red,yellow,
  
//   // @ts-ignore
//   // browser.tabs.group({
//   //   'groupId': 1,
//   //   'tabIds': tab_ids
//   // });
//   // tabs.group()
//   // const tab_ids = tabs.map(tab => tab.id);

//   // await browser.tabGroups.create({ tabIds: tab_ids });
//     // @ts-ignore
//   const get_group = async (group_id) => browser.tabGroups.get(group_id).then(group => group).catch(() => undefined);
//     // @ts-ignore
//   const group = await get_group(le_group_id);

//     // @ts-ignore
//   const does_group_exist = await browser.tabGroups.query({title: group_name});

//   for (const tab of tabs) {
//     const group = await get_group(le_group_id);
//     if (group) {
//       // @ts-ignore
//       browser.tabs.group({'groupId': le_group_id, 'tabIds': tab_ids});// @ts-ignore
      
//       // add tab to group
//     } else {
//       // create group
//       // add tab to group
//       // @ts-ignore
//       const actual_group_id = await browser.tabs.group({'tabIds': tab_ids});
//       // @ts-ignore
//       browser.tabGroups.update(actual_group_id, {color: 'red', title: le_group_id.toString()});
//       // browser.tabs.group({'groupId': le_group_id, 'tabIds': tab_ids});// @ts-ignore
//     }
//   }
// }