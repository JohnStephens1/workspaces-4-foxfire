document.addEventListener("keydown", async (e) => {
  const key = e.key;
  if (key >= "1" && key <= "9") {
    const num = parseInt(key, 10);
    console.log("Pressed:", num);

    const tabs = await browser.tabs.query({ highlighted: true, currentWindow: true });
    console.log("Selected tabs:", tabs);

    for (const tab of tabs) {
      // Do something with the tab and `num`, e.g., tag them or store in workspace
      console.log(`Tab ${tab.id} sent to workspace ${num}`);
    }

    window.close(); // instantly close popup
  }
});
