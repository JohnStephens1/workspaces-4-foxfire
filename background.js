// @ts-check


// about:config
// browser.tabs.closeWindowWithLastTab = false
// or suffering


// let storage = {0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {}, 9: {}};
let storage = {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []};
let active = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


// browser.storage.local.remove("imstored");

// browser.storage.local.set({"imstored": "most certainly"}).then(() => {console.log("saved smth?")});

// const gotten = await browser.storage.local.get("imstored");
// console.log(gotten);


function is_number(string) {
  return !isNaN(parseInt(string));
}

async function check_if_persistent_storage_exists() {
  let call1 = Promise.resolve();
  let call2 = Promise.resolve();

  const received_storage = await browser.storage.local.get(["storage", "active"]);

  if (received_storage.storage) {
    storage = received_storage.storage;
  } else {
    call1 = browser.storage.local.set({"storage": storage});
  }
  
  if (received_storage.active) {
    active = received_storage.active;
  } else {
    call2 = browser.storage.local.set({"active": active});
  }
  
  await Promise.all([call1, call2]);
}

async function update_persistent_storage() {
  // can probably set both @ once
  const call1 = browser.storage.local.set({"storage": storage});
  const call2 = browser.storage.local.set({"active": active});
  
  await Promise.all([call1, call2]);
}


browser.commands.onCommand.addListener(async (command) => {
  await check_if_persistent_storage_exists();
  // show_all_tabs();
  if (is_number(command)) {
    await tab_shenanigans(command);
  }

  switch (command) {
    case "show-all-tabs":
      await show_all_tabs();
      break;
  }

  await update_persistent_storage();
  // console.log("whole fkin storage sht", await browser.storage.local.get());
});


async function tab_shenanigans(command) {
  // store current
  console.log("thisshit1");
  const active_workspace = get_active_workspace();
  if (active_workspace == command) return;
  console.log("thisshit2");

  const visible_tabs = await get_visible_tabs(); // [tab]
  storage[active_workspace] = visible_tabs; // [tab]

  // hide schtick avoidance
  const temp_tab = await browser.tabs.create({});
  const temp_tab_id = temp_tab.id;

  // get selected
  const new_tabs = storage[command];

  // console.log(1);
  const new_tab_ids = new_tabs.map(({ id }) => id);
  browser.tabs.show(new_tab_ids);

  // console.log(2);
  const old_tab_ids = visible_tabs.map(({ id }) => id);
  browser.tabs.hide(old_tab_ids);
  // console.log("ACTIVE HERE1", active);
  set_active_workspace(command);
  // console.log("ACTIVE HERE2", active);
  // console.log(3);
  // kill bs tab again
  const remaining_visible_tabs = await get_visible_tabs();
  if (remaining_visible_tabs.length > 1) {
    browser.tabs.remove(temp_tab_id);
  }
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


// extra util hotkey
async function show_all_tabs() {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const tab_ids = tabs.map(({ id }) => id);
  browser.tabs.show(tab_ids);
  storage = {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []};
  active = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}


// unused
async function hide_all_tabs() {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const tab_ids = tabs.map(({ id }) => id);
  browser.tabs.hide(tab_ids);
}

// unused
async function something_save(command) {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const visible_tabs = tabs.filter(tab => tab.hidden == false);
  storage[command] = visible_tabs;
}

// unused
async function something_switch(command) {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const visible_tabs = tabs.filter(tab => tab.hidden == false);
  storage[command] = visible_tabs;
}
