/**
 * Ré-encode les vidéos-vignettes du portfolio pour le web mobile.
 *
 * Deux problèmes traités :
 *  1. moov atom en fin de fichier -> Safari iOS doit tout télécharger avant
 *     d'afficher la moindre image. Corrigé par -movflags +faststart.
 *  2. Poids moyen ~7 Mo par vignette -> saturation réseau sur iPhone.
 *     Corrigé par un downscale 640px, CRF 30, sans piste audio. La durée de
 *     l'extrait est conservée intégralement.
 *
 * Usage :
 *   node scripts/reencode-vignettes.mjs --dry-run   # liste ce qui serait fait
 *   node scripts/reencode-vignettes.mjs --limit 1   # teste sur une seule vidéo
 *   node scripts/reencode-vignettes.mjs             # tout, avec upload Directus
 *
 * Les originaux ne sont jamais supprimés : le script upload un NOUVEAU fichier
 * et repointe portfolio_projets.video_vignette dessus. L'ancien reste en place.
 *
 * Prérequis : ffmpeg, ffprobe (brew install ffmpeg)
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readFile, stat, rm, writeFile, open } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const exec = promisify(execFile);

const API = 'https://api-gthp.1-2-7-8.solutions';
const TOKEN = process.env.DIRECTUS_TOKEN || 'odPOs8HSIMTJ9n-SPdAwitfvP0pHe4mE';

// Réglages vignette : 640px de large suffit pour une tuile de grille.
const WIDTH = 640;
const CRF = 30;
// Pas de troncature : les vignettes conservent la durée intégrale de l'extrait
// monté en amont (via /youtube-cuts), qui fait déjà office de point de montage.

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const LIMIT = args.includes('--limit')
  ? Number(args[args.indexOf('--limit') + 1])
  : Infinity;

const WEB_PREFIX = 'web-';
const WORKDIR = path.join(os.tmpdir(), 'vignettes-reencode');

const headers = { Authorization: `Bearer ${TOKEN}` };

async function api(pathname, options = {}) {
  const res = await fetch(`${API}${pathname}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  if (!res.ok) {
    throw new Error(`${options.method || 'GET'} ${pathname} -> ${res.status} ${await res.text()}`);
  }
  return res.json();
}

const mb = (n) => (Number(n) / 1048576).toFixed(1);

/** Le moov est-il déjà en tête ? Si oui, la vidéo est déjà "faststart". */
async function hasFaststart(file) {
  // On ne lit que le tout début : chercher plus loin trouverait le moov de fin
  // et transformerait le test en faux positif.
  const fh = await open(file, 'r');
  try {
    const buf = Buffer.alloc(1024);
    const { bytesRead } = await fh.read(buf, 0, 1024, 0);
    const head = buf.subarray(0, bytesRead);
    const moov = head.indexOf('moov');
    const mdat = head.indexOf('mdat');
    return moov !== -1 && (mdat === -1 || moov < mdat);
  } finally {
    await fh.close();
  }
}

async function main() {
  await mkdir(WORKDIR, { recursive: true });

  console.log('Récupération des projets…');
  const { data: projets } = await api(
    '/items/portfolio_projets?limit=200&fields=id,titre,video_vignette&filter[status][_eq]=published'
  );

  // Un projet peut déjà pointer sur une version web-*. Ré-encoder ce fichier
  // dégraderait une source déjà compressée : on remonte à l'original homonyme.
  const { data: allFiles } = await api(
    '/files?limit=300&fields=id,filename_download&filter[type][_starts_with]=video'
  );
  const fileById = new Map(allFiles.map((f) => [f.id, f]));
  const fileByName = new Map(allFiles.map((f) => [f.filename_download, f]));

  function resolveSource(fileId) {
    const f = fileById.get(fileId);
    if (!f) return fileId;
    // Un ré-encodage répété peut avoir empilé les préfixes (web-web-…) : on les
    // retire tous pour toujours repartir de l'original.
    let name = f.filename_download;
    while (name.startsWith(WEB_PREFIX)) name = name.slice(WEB_PREFIX.length);
    if (name === f.filename_download) return fileId;
    const original = fileByName.get(name);
    return original ? original.id : fileId;
  }

  const withVideo = projets.filter((p) => p.video_vignette).slice(0, LIMIT);
  console.log(`${withVideo.length} projet(s) avec vidéo-vignette\n`);

  let totalBefore = 0;
  let totalAfter = 0;
  const failures = [];

  for (const [i, projet] of withVideo.entries()) {
    const tag = `[${i + 1}/${withVideo.length}] ${projet.titre.slice(0, 40)}`;
    try {
      const sourceId = resolveSource(projet.video_vignette);
      const { data: file } = await api(
        `/files/${sourceId}?fields=id,filename_download,filesize,title`
      );

      const src = path.join(WORKDIR, `src-${file.id}.mp4`);
      const out = path.join(WORKDIR, `out-${file.id}.mp4`);

      console.log(`${tag} — ${mb(file.filesize)} Mo`);
      totalBefore += Number(file.filesize);

      if (DRY_RUN) {
        console.log('   (dry-run) téléchargement + ré-encodage sautés\n');
        continue;
      }

      // Téléchargement de l'original
      const res = await fetch(`${API}/assets/${file.id}`, { headers });
      if (!res.ok) throw new Error(`download ${res.status}`);
      await writeFile(src, Buffer.from(await res.arrayBuffer()));

      const already = await hasFaststart(src);

      // Ré-encodage : downscale, CRF, pas d'audio, moov en tête.
      await exec('ffmpeg', [
        '-y',
        '-i', src,
        '-an',
        '-vf', `scale=${WIDTH}:-2`,
        '-c:v', 'libx264',
        '-profile:v', 'main',
        '-pix_fmt', 'yuv420p',
        '-crf', String(CRF),
        '-preset', 'slow',
        '-movflags', '+faststart',
        out,
      ]);

      const outStat = await stat(out);
      totalAfter += outStat.size;
      const gain = (100 - (outStat.size / Number(file.filesize)) * 100).toFixed(0);
      console.log(
        `   -> ${mb(outStat.size)} Mo (-${gain}%)${already ? ' [faststart déjà OK à la source]' : ''}`
      );

      // Upload du nouveau fichier
      const form = new FormData();
      const blob = new Blob([await readFile(out)], { type: 'video/mp4' });
      form.append('title', `${file.title || file.filename_download} (web)`);
      form.append('file', blob, `${WEB_PREFIX}${file.filename_download}`);

      const uploaded = await fetch(`${API}/files`, {
        method: 'POST',
        headers,
        body: form,
      });
      if (!uploaded.ok) throw new Error(`upload ${uploaded.status} ${await uploaded.text()}`);
      const { data: newFile } = await uploaded.json();

      // Repointage du projet vers le nouveau fichier
      await api(`/items/portfolio_projets/${projet.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_vignette: newFile.id }),
      });

      // L'ancienne version web devient orpheline : on la supprime pour ne pas
      // accumuler les doublons. Les ORIGINAUX ne sont jamais touchés.
      const previous = fileById.get(projet.video_vignette);
      if (previous && previous.id !== sourceId && previous.filename_download.startsWith(WEB_PREFIX)) {
        await fetch(`${API}/files/${previous.id}`, { method: 'DELETE', headers });
        console.log(`   -> ancienne version web ${previous.id} supprimée`);
      }

      console.log(`   -> uploadé ${newFile.id} et projet repointé\n`);

      await rm(src, { force: true });
      await rm(out, { force: true });
    } catch (err) {
      console.error(`   ÉCHEC : ${err.message}\n`);
      failures.push({ titre: projet.titre, error: err.message });
    }
  }

  console.log('─'.repeat(60));
  if (DRY_RUN) {
    console.log(`Dry-run : ${withVideo.length} vidéos, ${mb(totalBefore)} Mo au total.`);
  } else {
    console.log(`Avant : ${mb(totalBefore)} Mo — Après : ${mb(totalAfter)} Mo`);
    if (totalBefore > 0) {
      console.log(`Gain : ${(100 - (totalAfter / totalBefore) * 100).toFixed(0)}%`);
    }
  }
  if (failures.length) {
    console.log(`\n${failures.length} échec(s) :`);
    failures.forEach((f) => console.log(`  - ${f.titre} : ${f.error}`));
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
