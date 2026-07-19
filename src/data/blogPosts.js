const blogPosts = [
  {
    slug: '48-hours-in-lisbon',
    title: '48 hours in Lisbon, done right',
    tag: 'City guide',
    author: 'Voyora Editorial',
    coverImage: '/images/lisbon_tram_28.jpg',
    readTime: '6 min read',
    excerpt:
      'A tight two-day route through Lisbon\u2019s hills, trams, and miradouros for a first visit that doesn\u2019t feel rushed.',
    body: [
      {
        heading: 'Day one: get lost in Alfama',
        text: 'Start in Alfama, Lisbon\u2019s oldest neighborhood, before the streets fill up. The alleys here weren\u2019t built with cars in mind, and that\u2019s the point \u2014 wander without a fixed route and you\u2019ll keep stumbling onto small miradouros (viewpoints) over the Tagus River. Ride the number 28 tram at least once, ideally early morning or evening when it\u2019s not packed shoulder to shoulder with tourists. In the afternoon, head to the Castelo de S\u00e3o Jorge for the widest view over the city\u2019s terracotta rooftops.',
      },
      {
        heading: 'Day one, evening: dinner in Bairro Alto',
        text: 'Bairro Alto is quiet by day and loud by night. Grab a casual dinner around 8pm \u2014 grilled sardines or a bowl of caldo verde \u2014 then let the neighborhood do what it does best after 10pm: small bars, doors open onto the street, no real distinction between inside and outside.',
      },
      {
        heading: 'Day two: Bel\u00e9m and the river',
        text: 'Spend the morning in Bel\u00e9m. The Jer\u00f3nimos Monastery is worth the entry fee for the cloisters alone, and the Bel\u00e9m Tower nearby is small but photogenic. Non-negotiable: a pastel de nata from Pastéis de Bel\u00e9m, eaten warm with a dusting of cinnamon, ideally standing up because the line moves fast and the seats don\u2019t.',
      },
      {
        heading: 'Day two, afternoon: LX Factory and sunset',
        text: 'LX Factory, a converted industrial complex under the 25 de Abril bridge, is full of small shops and cafes \u2014 good for a slower afternoon. End the trip at Miradouro da Senhora do Monte for sunset; it\u2019s a short uphill walk and quieter than the more famous viewpoints, with a clean view across the whole city as the light goes gold.',
      },
    ],
  },
  {
    slug: 'packing-light-for-asia',
    title: 'Packing light for a 3-week Asia trip',
    tag: 'Tips',
    author: 'Voyora Editorial',
    coverImage: '/images/ha_long_bay_aerial.jpg',
    readTime: '8 min read',
    excerpt:
      'How to fit three weeks across multiple climates and countries into one carry-on, without leaving the essentials behind.',
    body: [
      {
        heading: 'Plan around laundry, not luggage',
        text: 'The biggest mental shift for packing light isn\u2019t about buying smaller items \u2014 it\u2019s accepting that you\u2019ll do laundry every 4\u20135 days instead of packing for every day of the trip. Most guesthouses and hostels across Southeast and East Asia offer cheap laundry service, often same-day. Pack for five days, not twenty-one.',
      },
      {
        heading: 'The clothing math that actually works',
        text: 'Five tops, two bottoms, one layer for air conditioning or evenings, one pair of shoes you can walk 15km in, and one pair of sandals. That\u2019s it. Everything should mix and match in dark, neutral colors so nothing looks out of place after being worn twice. Merino wool or quick-dry synthetic fabrics dry overnight after a sink wash, which matters more than any packing cube system.',
      },
      {
        heading: 'What actually earns its space',
        text: 'A universal power adapter, a portable charger, a compact first-aid kit with rehydration salts (genuinely more useful in humid climates than almost anything else you\u2019ll pack), and a lightweight rain jacket that folds down to nothing. Skip the travel-size toiletries aisle \u2014 convenience stores in every country on a typical Asia route sell shampoo, sunscreen, and toothpaste for less than you\u2019d spend at home.',
      },
      {
        heading: 'One bag, one weight limit',
        text: 'If it fits in a 40L backpack or a carry-on suitcase and you can carry it up three flights of stairs without stopping, you\u2019ve packed correctly. Anything beyond that becomes a tax on every travel day \u2014 taxis, stairs at train stations, overhead bins on regional flights. Weigh the bag before you leave and be honest with yourself about what comes out.',
      },
    ],
  },
  {
    slug: 'best-shoulder-season-destinations-2026',
    title: 'The best shoulder-season destinations for 2026',
    tag: 'Trends',
    author: 'Voyora Editorial',
    coverImage: '/images/santorini_blue_domes.jpg',
    readTime: '5 min read',
    excerpt:
      'Fewer crowds, better prices, and weather that\u2019s often more comfortable than peak season \u2014 here\u2019s where shoulder season pays off most.',
    body: [
      {
        heading: 'Why shoulder season is worth planning around',
        text: 'Shoulder season \u2014 the weeks just before or after a destination\u2019s peak \u2014 tends to offer the best ratio of good weather to low crowds. Flights and hotels are cheaper, popular sites are walkable instead of wall-to-wall, and locals have more bandwidth for the kind of conversations that don\u2019t happen during peak-season rush.',
      },
      {
        heading: 'Europe: late spring over midsummer',
        text: 'May and early June across Southern Europe \u2014 Italy, Greece, Croatia \u2014 deliver warm, swimmable weather without the July\u2013August crowds or prices. Santorini in May, for example, is a different experience entirely from the packed viewpoints of August.',
      },
      {
        heading: 'Southeast Asia: shoulder months between monsoons',
        text: 'Thailand and Vietnam both have brief shoulder windows \u2014 typically March\u2013April and October\u2013November \u2014 between the wet and high seasons, where rain is less frequent than the wet season but crowds and prices haven\u2019t yet hit the December\u2013February peak.',
      },
      {
        heading: 'Where it matters less: destinations without a hard peak',
        text: 'Some places \u2014 Switzerland\u2019s alpine towns, for instance \u2014 have two peaks (ski season and summer hiking season), which means the shoulder windows in between (late spring, early autumn) are dramatically quieter without much of a weather trade-off. Worth checking a destination\u2019s specific seasonality rather than assuming a single global "shoulder season" rule applies everywhere.',
      },
    ],
  },
];

export default blogPosts;

export function getPostBySlug(slug) {
  return blogPosts.find((p) => p.slug === slug) || null;
}
