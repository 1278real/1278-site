# TODO — 1·2·7·8 site

## Quick wins (< 1h)

- [x] Typo Stenciletta via Adobe Fonts (kit deq5imu) — stenciletta-solid sur nav + titres projets
- [x] Meta og:image sur la page projet (image vignette → partage social)
- [x] Classe `active` sur "Portfolio" dans la nav de la page projet

## Features courtes (1–3h)

- [x] Page Contact — coordonnées + formulaire simple ✓ fait
- [x] Responsive mobile — grille 12 col et nav à adapter sous 768px ✓ fait
- [x] Embed YouTube — lecteur intégré page détail + preview hover sur la grille ✓ fait

## Chantiers (> 3h)

- [x] Bilinguisme FR/EN — routing + champs `titre_en` / `description_en` ✓ fait
- [ ] Transitions de page — View Transitions API Astro (index ↔ projet)
- [ ] Upgrade Directus — pour avoir la duplication de ligne directement dans les projets (fonctionnalité disponible dans les versions récentes)

## Avant diffusion

- [ ] Repasse des traductions EN — vérifier le ton et la cohérence sur toutes les pages (portfolio, flashback, contact, pages projet)
- [ ] Retours collègue — voir ci-dessous :
  - → "côté CV peu digeste" : déjà adressé par le filtre Sélection (landing curatée par défaut) — à vérifier si c'est lisible sur mobile
  - → "classement par importance plutôt que par année" : dans les vues filtrées (hors Sélection/Tout), trier par poids et masquer les séparateurs d'année pour ne pas trahir l'ancienneté d'une catégorie

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
