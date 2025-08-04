import { Essay } from '../types';

// Fetch and parse Aeon essays from their RSS feed using a public RSS-to-JSON proxy
const RSS_TO_JSON = 'https://api.rss2json.com/v1/api.json?rss_url=https://aeon.co/feed.rss';

export async function fetchEssays(): Promise<Essay[]> {
  const res = await fetch(RSS_TO_JSON);
  if (!res.ok) throw new Error('Failed to fetch essays');
  const data = await res.json();
  // data.items is an array of articles
  return data.items.map((item: any, idx: number) => ({
    id: item.guid || String(idx + 1),
    title: item.title,
    author: item.author || 'Aeon',
    url: item.link,
    genre: item.categories && item.categories.length > 0 ? item.categories[0] : 'Essay',
    duration: 5, // RSS does not provide reading time; set a default or estimate from content length
    content: item.description.replace(/<[^>]+>/g, ''), // strip HTML tags
  }));
}

export async function fetchEssayById(id: string): Promise<Essay | null> {
  const essays = await fetchEssays();
  return essays.find(e => e.id === id) || null;
}
    genre: 'Culture & History',
    duration: 8,
    content: `Clock-time is a tyrant. It is a grid of hours, minutes and seconds imposed on the fluid, cyclical and various rhythms of life. For most of human history, time was not measured but lived. It was tied to the sun and the moon, to the seasons and the tides, to the needs of the body and the demands of the land. This 'natural time' is flexible and qualitative. It has its own texture and mood. There is a time for planting and a time for harvesting, a time for feasting and a time for fasting, a time for work and a time for rest. This is a far cry from the abstract, homogenous and relentless tick-tock of the clock.
The mechanical clock was invented in medieval monasteries to regulate the hours of prayer. It soon escaped the cloister and became the engine of a new capitalist order. It synchronised labour, disciplined workers and measured productivity. It turned time into a commodity, something to be saved, spent and wasted. Benjamin Franklin’s adage, ‘time is money’, became the mantra of the modern world. We are now so enmeshed in clock-time that we have forgotten there is any other way of being. We live in a state of perpetual hurry, chained to deadlines and schedules. We suffer from a 'time-sickness', a chronic anxiety that we never have enough of it. To escape this tyranny, we must learn to reclaim a different kind of time: a time of slowness, of daydreaming, of unhurried conversation, of simply being.`,
  },

    author: 'Robert Macfarlane',
    url: 'https://aeon.co/essays/we-are-the-first-generations-to-truly-need-wildness',
    genre: 'Environment & Nature',
    duration: 6,
    content: `Wildness is a quality, not a place. It can be found in a crack in a pavement as much as in a remote mountain range. It is the untamed, the unpredictable, the self-willed. It is the force of life itself, in all its chaotic and creative glory. For centuries, we have sought to control and subdue the wild, both in the world around us and within ourselves. We have built cities, dammed rivers and paved over landscapes. We have prized reason over instinct, order over disorder. But in doing so, we have lost something vital. We have become alienated from the very sources of our being.
We now live in the Anthropocene, an epoch defined by human impact on the planet. Genuine wilderness, in the sense of places untouched by humanity, may no longer exist. But wildness persists. It is in the weeds that grow in a derelict lot, the falcon that nests on a skyscraper, the bacteria that thrive in our own guts. We need to learn to recognise and value this wildness wherever we find it. We need to make space for it in our lives and in our landscapes. For it is in the wild that we find resilience, creativity and a deeper connection to the world. It is a reminder that we are not separate from nature, but a part of it. In an age of ecological crisis, re-wilding our world, and ourselves, is not a luxury but a necessity.`,
  },
  {
    id: '6',
    title: 'The power of ritual',
    author: 'Dimitris Xygalatas',
    url: 'https://aeon.co/essays/the-power-of-ritual-from-a-zombie-creating-drug-to-a-sundays-roast',
    genre: 'Anthropology',
    duration: 7,
    content: `Rituals are often seen as relics of a superstitious past, empty of meaning in our rational, secular age. But this is a profound misunderstanding of their nature and function. Rituals are a fundamental part of the human toolkit, a universal technology for managing our social and emotional lives. They are stereotyped sequences of actions that are performed with a sense of formality and significance. They can be grand and public, like a royal coronation, or small and private, like a morning cup of coffee. What they all have in common is their ability to structure our experience, create a sense of order and provide a feeling of control.
Consider the placebo effect. A sugar pill can alleviate pain simply because the patient believes it is a powerful drug. The ritual of the consultation, the white coat of the doctor, the formal prescription – all these contribute to the expectation of healing. Rituals work in a similar way. They are a kind of social placebo. By performing a series of prescribed actions, we signal to ourselves and to others that we are taking a situation seriously. This can be incredibly powerful in moments of high anxiety or uncertainty, such as before an exam, a competition or a surgical operation. The repetitive, predictable nature of ritual can have a calming effect on the nervous system, reducing stress and improving performance. Far from being irrational, rituals are a savvy psychological tool for navigating the complexities of human existence.`,
  },
];
