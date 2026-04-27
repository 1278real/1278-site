/**
 * Assigne les catégories aux projets via l'API Directus.
 * Édite le mapping CATEGORIES_MAP ci-dessous, puis lance :
 *   node scripts/assign-categories.mjs
 *
 * Catégories disponibles :
 *   1 = Sports
 *   2 = Directs
 *   3 = Mode & Arts
 *   4 = Mise en place artistique
 *   5 = Divertissements
 *   6 = Institutionnel
 *   7 = Documentaire
 */

const API = 'https://api-gthp.1-2-7-8.solutions';
const TOKEN = 'odPOs8HSIMTJ9n-SPdAwitfvP0pHe4mE';

// projet_id → [category_id, ...]  (à corriger si besoin)
const CATEGORIES_MAP = {
  // 2026
  53: [2, 5],  // Bonjour ! La Matinale TF1
  54: [2, 1],  // Le mag DAZN
  55: [3],     // Giambattista Valli FW26
  56: [3],     // Elie Saab FW26
  57: [3],     // AKRIS FW26
  58: [3],     // Pierre Cardin FW25
  59: [3],     // Kenzo SS26
  60: [3],     // Elie Saab HC FW26
  61: [1],     // Champions Hockey League
  62: [1],     // Ligue1+
  63: [3],     // The Attico SS26
  // 2025
  38: [2, 5],  // Bonjour ! la Matinale TF1
  39: [1],     // Soir de Padel
  40: [1],     // Roland Garros
  41: [2],     // Edition Spéciale Débarquement
  42: [1],     // Prix de Diane
  43: [3],     // Balenciaga SS25
  44: [1],     // Champions Hockey League
  45: [3],     // Ferragamo FW25
  46: [3],     // Giambattista Valli FW25
  47: [3],     // Elie Saab FW25
  48: [1],     // Champions Hockey League
  49: [1],     // Soir de Pro D2
  50: [1],     // Champions Hockey League
  51: [2],     // Sum 41
  52: [6],     // COP16 Désertification
  // 2024
  32: [1],     // Roland Garros
  33: [1],     // Prix de Diane
  34: [3],     // Balenciaga SS24
  35: [3],     // BALENCIAGA SS24
  36: [3],     // Pierre Cardin SS24
  37: [1],     // Champions Hockey League
  // 2023
  24: [3],     // Elie Saab
  25: [1],     // Roland Garros
  26: [3],     // L'Oréal
  27: [3],     // Zimmermann
  28: [3],     // YZYSZN9
  29: [1],     // Skweek EuroLeague
  30: [1],     // Ballon d'Or
  31: [6],     // Sotheby's Modernités
  // 2022
  20: [1],     // Roland Garros
  21: [2],     // TVFestival de Cannes
  22: [3],     // L'Oréal
  23: [1],     // Champions Hockey League
  // 2021
  14: [2],     // TVFestival de Cannes
  15: [4],     // le nouvel InfoSport+
  16: [5],     // Secret Story 10
  17: [5],     // La villa des Cœurs brisés 2
  18: [2, 1],  // L'Equipe du Soir
  19: [1],     // Fédérale 1
  // 2016-2018
  10: [5],     // Rating Ramadan
  11: [5],     // Secret Story 9
  12: [5],     // Miss Liban 2015
  13: [7],     // Des Combats et des Lois
  // 2014-2015
   5: [2],     // TVFestival de Cannes
   6: [5],     // Secret Story 8
   7: [2],     // Show ! le Matin
   8: [2],     // TVFestival de Cannes
   9: [7],     // Après la Clôture
  // 2013
   4: [2],     // TVFestival de Cannes
   2: [2],     // TVFestival de Cannes
   3: [2],     // #NB11, nuit blanche live
   1: [2],     // TVFestival de Cannes
};

async function patch(projetId, categoryIds) {
  const categories = categoryIds.map(catId => ({
    portfolio_projets_id: projetId,
    portfolio_categories_id: catId,
  }));

  const res = await fetch(`${API}/items/portfolio_projets/${projetId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ categories }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Projet ${projetId}: ${res.status} ${err}`);
  }
  return res.json();
}

async function run() {
  const entries = Object.entries(CATEGORIES_MAP);
  console.log(`Assignation de ${entries.length} projets...\n`);

  let ok = 0, fail = 0;
  for (const [id, cats] of entries) {
    try {
      await patch(Number(id), cats);
      console.log(`✓ ${id} → [${cats.join(', ')}]`);
      ok++;
    } catch (e) {
      console.error(`✗ ${id}: ${e.message}`);
      fail++;
    }
  }
  console.log(`\nTerminé : ${ok} ok, ${fail} erreurs`);
}

run();
