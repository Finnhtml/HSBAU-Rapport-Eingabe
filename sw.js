const CACHE_NAME = 'hs-rapport-v4';
const ASSETS = [
  'index.html',
  'xlsx-populate.min.js',
  'manifest.json',
  'icon.svg',
  'assets/hilfe_bilder/fraesen_1_10.png',
  'assets/hilfe_bilder/bohren_1_10.png',
  'assets/hilfe_bilder/arbeitszeit.png',
  'assets/hilfe_bilder/visum_kunde.png',
  'assets/hilfe_bilder/bemerkungen.png',
  'assets/hilfe_bilder/bilder.png',
  'assets/hilfe_bilder/betonteiletransport_ueber_25kg.png',
  'assets/hilfe_bilder/visum_huber_straub_ag.png',
  'assets/hilfe_bilder/fraeseinrichtung_in_anderes_gebaeude.png',
  'assets/hilfe_bilder/bohreinrichtung_in_andere_etage.png',
  'assets/hilfe_bilder/fraeseinrichtung_von_schnitt_zu_schnitt.png',
  'assets/hilfe_bilder/fraeseinrichtung_ueber_50m.png',
  'assets/hilfe_bilder/bohreinrichtung_in_anderes_gebaeude.png',
  'assets/hilfe_bilder/fraeseinrichtung_in_andere_etage.png',
  'assets/hilfe_bilder/abbruchhammer_mit_spitzeisen.png',
  'assets/hilfe_bilder/mulde_entsorgung_mauerwerk.png',
  'assets/hilfe_bilder/bohreinrichtung_von_bohrloch_zu_bohrloch.png',
  'assets/hilfe_bilder/notstromgruppe.png',
  'assets/hilfe_bilder/bohreinrichtung_ueber_50m.png',
  'assets/hilfe_bilder/trennscheibe_mit_blatt.png',
  'assets/hilfe_bilder/spitzmaschine_12kg_mit_spitzeisen.png',
  'assets/hilfe_bilder/baustellen_nummer.png',
  'assets/hilfe_bilder/wassersauger_ohne_bedienung.png',
  'assets/hilfe_bilder/mulde_entsorgung_beton.png',
  'assets/hilfe_bilder/wassersauger_mit_bedienung.png',
  'assets/hilfe_bilder/rapport_nummer.png',
  'assets/hilfe_bilder/auftrag_nummer.png',
  'assets/hilfe_bilder/minimulde.png',
  'assets/hilfe_bilder/baustelle.png',
  'assets/hilfe_bilder/telefon.png',
  'assets/hilfe_bilder/name.png',
  'assets/hilfe_bilder/firma.png',
  'assets/hilfe_bilder/adresse.png',
  'assets/hilfe_bilder/geruest_erstellen.png',
  'assets/hilfe_bilder/spritzschutzvorhang.png',
  'assets/hilfe_bilder/rueckhaltevorrichtung_an_wand.png',
  'assets/hilfe_bilder/abdecken.png',
  'assets/hilfe_bilder/rueckhaltevorrichtung_an_decke.png',
  'assets/hilfe_bilder/kantholz_schaumboard.png',
  'assets/hilfe_bilder/installation_fraesen.png',
  'assets/hilfe_bilder/installation_bohren.png',
  'assets/hilfe_bilder/besonderes.png',
  'assets/hilfe_bilder/etappe.png',
  'assets/hilfe_bilder/ausgefuhrte_arbeiten.png',
  'assets/hilfe_bilder/bauteil.png',
  'assets/hilfe_bilder/geschoss.png',
  'assets/hilfe_bilder/datum.png',
  'https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js',
  'https://cdn.jsdelivr.net/npm/signature_pad@4.0.0/dist/signature_pad.umd.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});