Extraire un extrait vidéo depuis YouTube, encodé pour servir de vignette web.

Demande à l'utilisateur :
1. L'URL YouTube
2. Le point IN (format MM:SS ou HH:MM:SS)
3. Le point OUT (format MM:SS ou HH:MM:SS)
4. L'usage : **vignette web** (défaut) ou **master qualité**

## Extraction

yt-dlp --download-sections "*$IN-$OUT" -f mp4 --output "~/Downloads/%(title)s.mp4" "$URL"

## Encodage vignette web (OBLIGATOIRE avant upload dans Directus)

Le MP4 sorti par yt-dlp a son **moov atom en fin de fichier**. Safari iOS doit
alors télécharger tout le fichier avant d'afficher la moindre image : la vignette
reste noire sur iPhone. Il faut systématiquement repasser par ffmpeg :

ffmpeg -y -i "$IN_FILE" \
  -t 12 -an \
  -vf "scale=640:-2" \
  -c:v libx264 -profile:v main -pix_fmt yuv420p \
  -crf 30 -preset slow \
  -movflags +faststart \
  "$OUT_FILE"

Ce que fait chaque option :
- `-movflags +faststart` : déplace le moov atom en tête → première frame affichée
  immédiatement, sans télécharger tout le fichier. **C'est le point critique.**
- `-t 12` : une vignette n'a pas besoin de durer plus de 12 s.
- `-an` : pas de piste audio (les vignettes sont en `muted` de toute façon).
- `scale=640:-2` : largeur suffisante pour une tuile de grille.
- `-crf 30` : compression agressive, acceptable à cette taille.

Résultat attendu : ~200 à 500 Ko par vignette (contre 5 à 13 Mo pour un extrait brut).

## Vérification avant upload

Contrôle que le moov atom est bien en tête de fichier :

moov=$(head -c 1024 "$OUT_FILE" | xxd -p -c 256 | tr -d '\n' | grep -bo '6d6f6f76' | head -1 | cut -d: -f1)
[ -n "$moov" ] && echo "faststart OK (moov a l'octet $((moov/2)))" || echo "PAS de faststart"

Si la sortie est « PAS de faststart », ne pas uploader : refaire l'encodage.
(`head -c 1024` d'abord, sinon xxd lit tout le fichier et le test devient
un faux positif en trouvant le moov de fin.)

## Notes

- Pour un **master qualité** (pas une vignette), garder l'audio et monter la
  qualité : retirer `-an` et `-t`, utiliser `-crf 18` et `scale=1920:-2`.
  Conserver `-movflags +faststart` dans tous les cas.
- Pour ré-encoder en masse les vignettes déjà en ligne dans Directus :
  `node scripts/reencode-vignettes.mjs --dry-run` puis sans le flag.
- Si yt-dlp n'est pas installé : `brew install yt-dlp`
- Si ffmpeg n'est pas installé : `brew install ffmpeg`
