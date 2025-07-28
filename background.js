// @ts-check


// about:config
// browser.tabs.closeWindowWithLastTab = false
// or suffering


let workspaces = {
  "tab_counts": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "active": 1
}


async function check_for_persistent_storage() {
  const received_workspaces = await browser.storage.local.get(["workspaces"]);

  if (Object.keys(received_workspaces).length > 0) {
    workspaces = received_workspaces.workspaces;
  } else {
    await browser.storage.local.set({"workspaces": workspaces});
  }
}


function is_number(string) {
  return !isNaN(parseInt(string));
}

browser.commands.onCommand.addListener(async (command) => {
  await check_for_persistent_storage();

  if (is_number(command)) {
    await workspace_schtick(command);
  }

  switch (command) {
    case "show-all-tabs":
      await show_all_tabs();
      break;
  }

  await browser.storage.local.set({"workspaces": workspaces});
});


async function workspace_schtick(next_workspace) {
  const active_workspace = workspaces['active'];
  if (next_workspace == active_workspace) return;

  const visible_tabs = await get_visible_tabs();
  const visible_tab_ids = visible_tabs.map(({ id }) => id);
  const visible_tab_count = visible_tabs.length;

  const current_workspace_start = get_start_index_of_workspace(active_workspace);
  await browser.tabs.move(visible_tab_ids, { index: current_workspace_start });
  
  workspaces.tab_counts[active_workspace] = visible_tab_count;
  workspaces.active = next_workspace;

  // round two
  const next_workspace_length = workspaces['tab_counts'][next_workspace];

  if (next_workspace_length == 0) {
    const new_tab = await browser.tabs.create({}); // can't set -1
    await browser.tabs.move(new_tab.id, { index: -1 });
    workspaces.tab_counts[next_workspace] = 1;
  } else {

    const next_workspace_start = get_start_index_of_workspace(next_workspace);
    const next_workspace_end = next_workspace_start + next_workspace_length;
    const next_workspace_tabs = await get_tabs_by_index(next_workspace_start, next_workspace_end);
    const next_workspace_tab_ids = next_workspace_tabs.map(({ id }) => id);

    await browser.tabs.move(next_workspace_tab_ids, { index: -1 });
    await browser.tabs.show(next_workspace_tab_ids);
    await browser.tabs.update(next_workspace_tab_ids[0], { active: true });
  }

  // finishing
  await browser.tabs.hide(visible_tab_ids);
}


async function get_visible_tabs() {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const visible_tabs = tabs.filter(tab => tab.hidden == false);
  return visible_tabs;
}


function get_start_index_of_workspace(target) {
  return workspaces['tab_counts'].slice(0, target).reduce((a, b) => a + b, 0);
}

async function get_tabs_by_index(start, end) {
  const all_tabs = await browser.tabs.query({ currentWindow: true });
  const tabs = all_tabs.filter(tab => tab.index >= start && tab.index < end);
  return tabs;
}


// extra util hotkey
async function show_all_tabs() {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const tab_ids = tabs.map(({ id }) => id);
  await browser.tabs.show(tab_ids);
  workspaces.active = 1;
  workspaces.tab_counts = workspaces.tab_counts.fill(0);
}
