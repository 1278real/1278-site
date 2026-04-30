export const languages = ['fr', 'en'] as const;
export type Lang = typeof languages[number];

export const ui = {
  fr: {
    nav: { portfolio: 'Portfolio', flashback: 'Timeline', contact: 'Contact', lang: 'EN' },
    portfolio: { showAll: 'Tout afficher' },
    categories: {} as Record<string, string>,
    projet: { back: '← Portfolio' },
    contact: {
      phone: 'Téléphone',
      email: 'Email',
      baseline: '<span class="b1">du plateau au pixel :</span><br><span class="b2">mettre à profit les <span class="b4">connaissances techniques</span> acquises</span><br><span class="b2">&amp; les <span class="b4">collaborations</span> passées pour</span><br><span class="b3">servir les projets actuels</span>',
    },
    flashback: {
      subtitle: '1·2·7·8 joue avec les pixels',
      appsTitle: 'Applications mobiles',
      appsPack: 'Pack gth',
      timeline: [
        {
          annee: '2000',
          titre: 'Diplômé 3IS',
          texte: 'Spécialité montage & effets visuels. Débuts en tant que monteur sur <em>Tout le monde en parle</em>, <em>Paris Dernière</em>, <em>Le Soldat Rose</em>…',
        },
        {
          annee: '2005',
          titre: 'Création FADE IN',
          texte: "Société d'habillage TV et graphismes. Truquiste sur <em>Ça se discute</em>, <em>Miss France</em>, <em>Roland Garros</em>, le Festival de Cannes, la Ligue 1, le Top 14 et la Coupe du Monde de la FIFA.",
        },
        {
          annee: '2010',
          titre: 'Réalisateur',
          texte: 'Mise en place et réalisation, plateaux et extérieurs, talk et sports. Un credo : mettre à profit les connaissances techniques acquises & les collaborations passées pour servir les projets actuels.',
        },
        {
          annee: '2016',
          titre: 'Création 27|28 réalisation(s)',
          texte: 'Structure dédiée à la réalisation TV & au développement iOS / Android.',
        },
        {
          annee: '2019',
          titre: '1·2·7·8 réalisation(s)',
          texte: "Fade In & 27|28 réalisation(s) fusionnent. La structure unique porte désormais l'ensemble des activités : réalisation TV, mise en place artistique et développement applicatif.",
        },
      ],
    },
  },
  en: {
    nav: { portfolio: 'Portfolio', flashback: 'Timeline', contact: 'Contact', lang: 'FR' },
    portfolio: { showAll: 'Show all' },
    categories: {
      selection: 'Selection',
      directs: 'Live',
      divertissements: 'Entertainment',
      documentaire: 'Documentary',
      institutionnel: 'Corporate',
      'mise-en-place': 'Artistic Direction',
      'mode-arts': 'Fashion & Arts',
      sports: 'Sports',
    } as Record<string, string>,
    projet: { back: '← Portfolio' },
    contact: {
      phone: 'Phone',
      email: 'Email',
      baseline: '<span class="b1">from stage to pixel:</span><br><span class="b2">leveraging <span class="b4">technical expertise</span></span><br><span class="b2">&amp; past <span class="b4">collaborations</span> to</span><br><span class="b3">serve present projects</span>',
    },
    flashback: {
      subtitle: '1·2·7·8 plays with pixels',
      appsTitle: 'Mobile apps',
      appsPack: 'gth Pack',
      timeline: [
        {
          annee: '2000',
          titre: '3IS Graduate',
          texte: 'Editing & visual effects major. Started as an editor on <em>Tout le monde en parle</em>, <em>Paris Dernière</em>, <em>Le Soldat Rose</em>…',
        },
        {
          annee: '2005',
          titre: 'FADE IN Founded',
          texte: 'TV-oriented graphics company. Visual effects artist on <em>Ça se discute</em>, <em>Miss France</em>, <em>Roland Garros</em>, Cannes Film Festival, Ligue 1, Top 14 and the FIFA World Cup.',
        },
        {
          annee: '2010',
          titre: 'Director',
          texte: 'Studio and on-location directing — talk shows and sports. One credo: leveraging technical expertise & past collaborations to serve present projects.',
        },
        {
          annee: '2016',
          titre: '27|28 réalisation(s) Founded',
          texte: 'Dedicated to TV directing & iOS / Android development.',
        },
        {
          annee: '2019',
          titre: '1·2·7·8 réalisation(s)',
          texte: 'Fade In & 27|28 réalisation(s) merge. The unified company now encompasses all activities: TV directing, artistic production design and app development.',
        },
      ],
    },
  },
};
