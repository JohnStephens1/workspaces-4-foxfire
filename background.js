// @ts-check


// about:config
// browser.tabs.closeWindowWithLastTab = false
// or suffering


let workspaces = get_default_workspaces();
initial_storage_check().catch(console.error);


function get_default_workspaces() {
  return {
    "tab_counts": Array(10).fill(0),
    "relative_focus_index": Array(10).fill(0),
    "active": 1
  }
}


function hasSameSchema(a, b) {
  if(typeof a !== typeof b) return false;
  if(typeof a === 'object') {
    if(a === null) return b === null;
    if(a instanceof Date) return b instanceof Date && a.getTime() === b.getTime();
    if(Array.isArray(a)) {
      return Array.isArray(b) && a.length === b.length && a.every((val, index) => hasSameSchema(val, b[index]));
    }
    if(Object.keys(a).length !== Object.keys(b).length) return false;
    return Object.entries(a).every(([key, val]) => hasSameSchema(val, b[key]));
  }
  return true;
}


async function initial_storage_check() {
  const received_workspaces = await browser.storage.local.get(["workspaces"]);
  if (hasSameSchema(workspaces, received_workspaces.workspaces)) {
    workspaces = received_workspaces.workspaces;
    console.log("schema same");
  } else {
    await browser.storage.local.set({"workspaces": workspaces});
    console.log("schema differs!");
  }
}


function is_number(string) {
  return !Number.isNaN(parseInt(string));
}


browser.commands.onCommand.addListener(async (command) => {
  if (is_number(command)) {
    await workspace_schtick(parseInt(command));
  }

  switch (command) {
    case "show-all-tabs":
      await show_all_tabs();
      break;
  }

  await browser.storage.local.set({"workspaces": workspaces});
});


async function workspace_schtick(next_workspace) {
  const active_workspace = workspaces.active;
  if (next_workspace === active_workspace) return;

  const visible_tabs = await get_visible_tabs();
  const visible_tab_ids = visible_tabs.map(({ id }) => id);
  const visible_tab_count = visible_tabs.length;

  const relative_focused_tab_index = visible_tabs.findIndex(tab => tab.active===true);

  const current_workspace_start = get_start_index_of_workspace(active_workspace);
  await browser.tabs.move(visible_tab_ids, { index: current_workspace_start });
  
  workspaces.relative_focus_index[active_workspace] = relative_focused_tab_index;
  workspaces.tab_counts[active_workspace] = visible_tab_count;
  workspaces.active = next_workspace;

  // round two
  const next_workspace_length = workspaces.tab_counts[next_workspace];

  if (next_workspace_length === 0) {
    const new_tab = await browser.tabs.create({});
    await browser.tabs.move(new_tab.id, { index: -1 });
    workspaces.tab_counts[next_workspace] = 1;
  } else {
    const next_workspace_start = get_start_index_of_workspace(next_workspace);
    const next_workspace_end = next_workspace_start + next_workspace_length;
    const next_workspace_tabs = await get_tabs_by_index(next_workspace_start, next_workspace_end);
    const next_workspace_tab_ids = next_workspace_tabs.map(({ id }) => id);
    const next_workspace_focused_tab_index = workspaces.relative_focus_index[next_workspace];

    await browser.tabs.move(next_workspace_tab_ids, { index: -1 });
    await browser.tabs.show(next_workspace_tab_ids);
    await browser.tabs.update(next_workspace_tab_ids[next_workspace_focused_tab_index], { active: true });
  }

  // finishing
  await browser.tabs.hide(visible_tab_ids);
}


async function get_visible_tabs() {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const visible_tabs = tabs.filter(tab => tab.hidden === false);
  return visible_tabs;
}


function get_start_index_of_workspace(target) {
  return workspaces.tab_counts.slice(0, target).reduce((a, b) => a + b, 0);
}

async function get_tabs_by_index(start, end) {
  const all_tabs = await browser.tabs.query({ currentWindow: true });
  const tabs = all_tabs.filter(tab => tab.index >= start && tab.index < end);
  return tabs;
}


// extra util hotkey
async function show_all_tabs() {
  const all_tabs = await browser.tabs.query({ currentWindow: true });
  const all_tab_ids = all_tabs.map(({ id }) => id);

  const visible_tabs = all_tabs.filter(tab => tab.hidden === false);
  const visible_tab_ids = visible_tabs.map(({ id }) => id);

  const active_workspace_start_index = get_start_index_of_workspace(workspaces.active);

  await browser.tabs.move(visible_tab_ids, { index: active_workspace_start_index });
  await browser.tabs.show(all_tab_ids);

  workspaces = get_default_workspaces();
}
