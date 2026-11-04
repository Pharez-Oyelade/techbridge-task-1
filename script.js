document.addEventListener("DOMContentLoaded", () => {
  initMobileNavigation();
  initRoadmapTabs();
  initEmailCopy();
});

function initMobileNavigation() {
  const toggleBtn = document.getElementById("mobile-toggle");
  const drawer = document.getElementById("mobile-drawer");
  const closeBtn = document.getElementById("drawer-close");
  const backdrop = document.getElementById("drawer-backdrop");
  const navLinks = drawer.querySelectorAll(
    ".mobile-nav-link, .mobile-drawer-footer a",
  );

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    toggleBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    toggleBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    toggleBtn.focus();
  }

  toggleBtn.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("is-open");
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeDrawer);
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeDrawer);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) {
      closeDrawer();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeDrawer();
    });
  });
}

function initRoadmapTabs() {
  const tabList = document.querySelector(".tab-controls");
  if (!tabList) return;

  const tabs = tabList.querySelectorAll('[role="tab"]');
  const panels = document.querySelectorAll('[role="tabpanel"]');

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activateTab(tab);
    });

    tab.addEventListener("keydown", (e) => {
      let targetTab = null;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        targetTab = tab.nextElementSibling || tabs[0];
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        targetTab = tab.previousElementSibling || tabs[tabs.length - 1];
      }

      if (targetTab && targetTab.hasAttribute("role")) {
        targetTab.focus();
        activateTab(targetTab);
      }
    });
  });

  function activateTab(selectedTab) {
    // Deselect all tabs
    tabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
      t.setAttribute("tabindex", "-1");
    });

    // Hide all panels
    panels.forEach((p) => {
      p.classList.remove("active");
      p.hidden = true;
    });

    // Activate selected tab
    selectedTab.classList.add("active");
    selectedTab.setAttribute("aria-selected", "true");
    selectedTab.setAttribute("tabindex", "0");

    const controlsId = selectedTab.getAttribute("aria-controls");
    const targetPanel = document.getElementById(controlsId);
    if (targetPanel) {
      targetPanel.classList.add("active");
      targetPanel.hidden = false;
    }
  }
}

function initEmailCopy() {
  const copyBtn = document.getElementById("copy-email-btn");
  if (!copyBtn) return;

  copyBtn.addEventListener("click", async () => {
    const email =
      copyBtn.getAttribute("data-email") || "techbridgebaslink@gmail.com";
    const originalText = copyBtn.textContent;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        // Fallback for older browsers
        const tempInput = document.createElement("input");
        tempInput.value = email;
        tempInput.style.position = "absolute";
        tempInput.style.left = "-9999px";
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      copyBtn.textContent = "Copied!";
      copyBtn.style.borderColor = "var(--color-primary)";
      copyBtn.style.color = "var(--color-primary)";

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.borderColor = "";
        copyBtn.style.color = "";
      }, 2000);
    } catch (err) {
      console.warn("Clipboard copy failed:", err);
    }
  });
}
