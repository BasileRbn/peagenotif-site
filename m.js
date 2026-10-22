// Compteur de visites anonyme de peagenotif.fr — copié à la racine du site sous « /m.js »
// et appelé par <script src="/m.js" defer></script>. Source : worker-audience/m.js.
// Aucun cookie, aucun stockage, aucun identifiant : la page signale seulement qu'elle a été
// vue (et d'où l'on vient), et qu'un badge App Store ou Google Play a été touché.
// Le serveur ne garde que des totaux (worker-audience/src/index.js).
(function () {
  if (navigator.webdriver || !navigator.sendBeacon || !window.JSON) return;
  var COMPTEUR = "https://peage-audience.peagenotif.workers.dev/v";
  var q = new URLSearchParams(location.search);
  var campagne = q.get("src") || q.get("utm_source") || "";
  function signale(evenement) {
    try {
      navigator.sendBeacon(COMPTEUR, JSON.stringify({
        p: location.pathname, r: document.referrer, s: campagne, e: evenement
      }));
    } catch (e) {}
  }
  // Une page préchargée par le navigateur n'est comptée que si elle est réellement affichée.
  if (document.prerendering) {
    document.addEventListener("prerenderingchange", function () { signale("vue"); }, { once: true });
  } else {
    signale("vue");
  }
  document.addEventListener("click", function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest("a[href]") : null;
    if (!a) return;
    if (/^https:\/\/apps\.apple\.com\//.test(a.href)) signale("app_store");
    else if (/^https:\/\/play\.google\.com\//.test(a.href)) signale("google_play");
  }, true);
})();
