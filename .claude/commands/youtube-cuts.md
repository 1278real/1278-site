Extraire un extrait vidéo depuis YouTube.

Demande à l'utilisateur :
1. L'URL YouTube
2. Le point IN (format MM:SS ou HH:MM:SS)
3. Le point OUT (format MM:SS ou HH:MM:SS)

Puis lance cette commande dans le terminal :
yt-dlp --download-sections "*$IN-$OUT" -f mp4 --output "~/Downloads/%(title)s.mp4" "$URL"

Si yt-dlp n'est pas installé, propose : brew install yt-dlp