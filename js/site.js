/* ============================================================================
   JayCK Flow — site.js

   The header's two behaviours, shared by all five pages: the band that appears
   on scroll, and the fullscreen menu. It was five inline copies until today.

   NOTHING HERE IS LOAD-BEARING FOR CONTENT. If this file never runs, every
   page still reads: the links are real links, and a <noscript> block in each
   page turns the burger off and lays the nav links out as an ordinary row.
   A page that needs JavaScript to become visible is a page that can fail
   closed, and one of these five was exactly that until this change.
   ========================================================================= */
(function(){
  "use strict";

  var hdr = document.querySelector(".hdr");
  if (hdr) {
    var onScroll = function(){
      hdr.setAttribute("data-scrolled", (window.scrollY || 0) > 8 ? "true" : "false");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
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
