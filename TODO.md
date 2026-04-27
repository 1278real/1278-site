# TODO — 1·2·7·8 site

## Quick wins (< 1h)

- [ ] Déposer `public/fonts/Stenciletta.woff2` pour activer la typo du logo
- [ ] Meta og:image sur la page projet (image vignette → partage social)
- [ ] Classe `active` sur "Portfolio" dans la nav de la page projet

## Features courtes (1–3h)

- [ ] Page Contact — coordonnées + formulaire simple
- [ ] Responsive mobile — grille 12 col et nav à adapter sous 768px
- [ ] Page Flashback — galerie archives, filtre par décennie

## Chantiers (> 3h)

- [ ] Bilinguisme FR/EN — routing + champs `titre_en` / `description_en`
- [ ] Transitions de page — View Transitions API Astro (index ↔ projet)

## Quand tu es prêt à basculer live

- [ ] Supprimer `base: '/aZeRtYuIoP/test/'` dans `astro.config.mjs`
- [ ] Changer le secret GitHub `FTP_PATH` de `/aZeRtYuIoP/test/` à `/`
- [ ] Vérifier que le token PAT dans le Flow Directus est le nouveau (scope repo + workflow)

## Fait ✓

- [x] Grille mosaïque 12 colonnes + mosaicLayout serveur/client
- [x] Filtres par catégorie avec cascade de fondus
- [x] Alternance blocs span-8 (normal / inversé)
- [x] Anti-répétition couleurs tuiles (historique 2 couleurs)
- [x] Page projet `/projets/[slug].astro` — hero, meta, badges catégories, galerie
- [x] Favicon SVG + ICO
- [x] Logo PNG nav + fallback texte Stenciletta
- [x] Items portfolio cliquables (`<a href>`)
- [x] Badges catégories colorés depuis Directus
- [x] Pipeline deploy : Directus Flow → GitHub Actions → FTP Infomaniak
