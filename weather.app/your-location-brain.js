/* =====================================================
   Open-Meteo — Full JS (replace entirely every time)
   No external JS. One <pre> only.
   ===================================================== */

(function () {
  const PRE = document.querySelector("pre");
  if (!PRE) return;

  // ---------- CONFIG ----------
  const DEFAULT_LAT = 45.5045;     // Montréal (fallback)
  const DEFAULT_LON = -73.5772;
  const LANG = "fr-CA";

  // ---------- UI ----------
  PRE.textContent = "Chargement de la météo…";

  // ---------- GEO ----------
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      p => loadMeteo(p.coords.latitude, p.coords.longitude),
      () => loadMeteo(DEFAULT_LAT, DEFAULT_LON)
    );
  } else {
    loadMeteo(DEFAULT_LAT, DEFAULT_LON);
  }

  // ---------- CORE ----------
  function loadMeteo(lat, lon) {
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      "?latitude=" + lat +
      "&longitude=" + lon +
      "&daily=temperature_2m_min,temperature_2m_max,precipitation_sum,snowfall_sum,weathercode" +
      "&timezone=auto";

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(data => render(data.daily))
      .catch(() => {
        PRE.textContent = "Service météo indisponible.";
      });
  }

  // ---------- RENDER ----------
  function render(d) {
    let out = "";

    for (let i = 0; i < d.time.length; i++) {
      out += formatDate(d.time[i]) + "\n";
      out += "\tMinimum : " + d.temperature_2m_min[i] + "°C\n";
      out += "\tMaximum : " + d.temperature_2m_max[i] + "°C\n";
      out += "\tPrécipitations : " + precipText(d.snowfall_sum[i]) + "\n";
      out += "\tImage du jour : " +
             weatherEmoji(d.weathercode[i], d.snowfall_sum[i]) + "\n\n";
    }

    PRE.textContent = out.trim();
  }

  // ---------- HELPERS ----------
  function formatDate(iso) {
    return new Intl.DateTimeFormat(LANG, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date(iso));
  }

  function weatherEmoji(code, snow) {
    if (snow > 0) return "❄️";
    if (code === 0) return "☀️";
    if (code === 1 || code === 2) return "⛅";
    return "☁️";
  }

  function precipText(snowCm) {
    if (!snowCm) return "0mm";
    const a = Math.floor(snowCm * 0.8);
    const b = Math.ceil(snowCm * 1.2);
    return a + " à " + b + "cm";
  }
})();
