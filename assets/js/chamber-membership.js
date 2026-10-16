(() => {
  const id = "mni-membership-639277029874283606";
  const target = document.getElementById(id);
  if (!target) return;
  let started = false;
  const loadMembership = () => {
    if (started) return;
    started = true;
    const script = document.createElement("script");
    script.src = "https://mtsterlingchamber.chambermaster.com/Content/Script/Member.js";
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => {
      if (!window.MNI?.Widgets?.Member) return;
      const observer = new MutationObserver(() => {
        const link = target.querySelector(".mn-widget-member-link");
        if (!link) return;
        link.setAttribute("rel", "noopener noreferrer");
        link.setAttribute("aria-label", "Mt. Sterling Chamber homepage (opens in a new tab)");
        if (link.href === "http://www.mtsterlingchamber.com/") {
          link.href = "https://www.mtsterlingchamber.com/";
        }
        observer.disconnect();
      });
      observer.observe(target, { childList: true, subtree: true });
      new window.MNI.Widgets.Member(id, {
        member: 2908,
        secure: true,
        styleTemplate: "#@id{text-align:center;position:relative}#@id .mn-widget-member-name{font-weight:700}#@id .mn-widget-member-logo{max-width:100%}"
      }).create();
    };
    document.head.appendChild(script);
  };
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      loadMembership();
    }, { rootMargin: "240px" });
    observer.observe(target.closest(".chamber-membership"));
  } else {
    window.addEventListener("load", loadMembership, { once: true });
  }
})();
