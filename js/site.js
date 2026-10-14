/* ============================================================================
   JayCK Flow — site.js

   The header's behaviours, shared by every page framed from `landing/src/layout/top.html`: the band that appears
   on scroll, the fullscreen menu, and — where the page carries its own Download/store action — the pill that
   hides while it is on screen (`BACKLOG.md` M26). The first two were five inline copies until the frame was one
   file; the third is the home page's own rule, generalized here once the defect was found.

   NOTHING HERE IS LOAD-BEARING FOR CONTENT. If this file never runs, every
   page still reads: the links are real links, the header pill still offers the download page (`top.html`'s own
   noscript rule forces it visible), and a <noscript> block in each page turns the burger off and lays the nav
   links out as an ordinary row. A page that needs JavaScript to become visible is a page that can fail closed,
   and one of these five was exactly that before the frame.
   ========================================================================= */
(function(){
  "use strict";

  var hasIO = "IntersectionObserver" in window;

  var hdr = document.querySelector(".hdr");
  if (hdr) {
    var onScroll = function(){
      hdr.setAttribute("data-scrolled", (window.scrollY || 0) > 8 ? "true" : "false");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* The header pill, where the page carries its own Download/store action (M26 defect, his screenshot on
     /download): hidden exactly while one of those is on screen, so the same offer is never asked twice. `.cta`
     and `.soon` are the pages' own Download/store elements — an intent page's single Download button, or the
     download page's App Store link and Google Play label; nothing else on a shared-frame page carries either
     class. A page with neither has no `#hdr-cta` either (`build-landing.ts`'s PILL_SMART_PAGES), so this block
     never runs there. Fails open: without IntersectionObserver the pill stays on, the safe direction for a
     conversion path. */
  var hdrCta = document.getElementById("hdr-cta");
  if (hdrCta) {
    var storeEls = [].slice.call(document.querySelectorAll(".cta, .soon"));
    if (!storeEls.length || !hasIO) {
      hdrCta.setAttribute("data-hidden", "false");
    } else {
      var seen = storeEls.map(function(){ return false; });
      var recount = function(){ hdrCta.setAttribute("data-hidden", seen.indexOf(true) > -1 ? "true" : "false"); };
      var sio = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ seen[storeEls.indexOf(e.target)] = e.isIntersecting; });
        recount();
      }, { threshold: .35 });
      storeEls.forEach(function(el){ sio.observe(el); });
    }
  }

  var burger = document.getElementById("burger");
  var menu   = document.getElementById("site-menu");
  if (!burger || !menu) return;

  function setMenu(open){
    /* Locking the body removes the scrollbar, which widens the viewport and
       walks the ✕ a scrollbar-width away from where the burger just was. */
    var sbw = open ? window.innerWidth - document.documentElement.clientWidth : 0;
    document.documentElement.style.setProperty("--sbw", (sbw > 0 ? sbw : 0) + "px");
    document.body.setAttribute("data-menu", open ? "open" : "closed");
    burger.setAttribute("aria-expanded", String(open));
  }
  setMenu(false);

  burger.addEventListener("click", function(){
    setMenu(document.body.getAttribute("data-menu") !== "open");
  });
  [].slice.call(menu.querySelectorAll("a")).forEach(function(a){
    a.addEventListener("click", function(){ setMenu(false); });
  });
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape" && document.body.getAttribute("data-menu") === "open"){
      setMenu(false); burger.focus();
    }
  });
})();
