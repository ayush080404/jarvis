import paris from './paris.js';
import tokyo from './tokyo.js';
import dubai from './dubai.js';
import sydney from './sydney.js';
import new_york from './new-york.js';
import rio_de_janeiro from './rio-de-janeiro.js';
import spain from './spain.js';
import italy from './italy.js';
import turkiye from './turkiye.js';
import mexico from './mexico.js';
import united_kingdom from './united-kingdom.js';
import germany from './germany.js';
import greece from './greece.js';
import austria from './austria.js';
import thailand from './thailand.js';
import saudi_arabia from './saudi-arabia.js';
import portugal from './portugal.js';
import malaysia from './malaysia.js';
import netherlands from './netherlands.js';
import hong_kong from './hong-kong.js';
import india from './india.js';
import vietnam from './vietnam.js';
import south_korea from './south-korea.js';
import singapore from './singapore.js';
import croatia from './croatia.js';
import indonesia from './indonesia.js';
import poland from './poland.js';
import canada from './canada.js';
import switzerland from './switzerland.js';
import ireland from './ireland.js';
import morocco from './morocco.js';
import egypt from './egypt.js';

export const destinations = [
  paris,
  tokyo,
  dubai,
  sydney,
  new_york,
  rio_de_janeiro,
  spain,
  italy,
  turkiye,
  mexico,
  united_kingdom,
  germany,
  greece,
  austria,
  thailand,
  saudi_arabia,
  portugal,
  malaysia,
  netherlands,
  hong_kong,
  india,
  vietnam,
  south_korea,
  singapore,
  croatia,
  indonesia,
  poland,
  canada,
  switzerland,
  ireland,
  morocco,
  egypt,
];

export function getDestinationBySlug(slug) {
  return destinations.find((d) => d.slug === slug);
}
