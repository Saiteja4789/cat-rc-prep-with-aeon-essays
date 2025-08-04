import { Essay } from '../types';

// In a real application, this would fetch from a backend that scrapes Aeon.
// For this self-contained app, we'll use an expanded list of pre-loaded content.
const essaysData: Essay[] = [
  {
    id: '1',
    title: 'The meaning of synchronicity',
    author: 'Daniela Muggia',
    url: 'https://aeon.co/essays/what-is-the-meaning-of-a-meaningful-coincidence',
    genre: 'Philosophy & Psychology',
    duration: 6,
    content: `A meaningful coincidence is a funny thing. A mother thinks of her estranged son, and at that moment he phones. A man dreams of a rare beetle, and the next day finds one on his doorstep. The term for such events is synchronicity. The word was coined by the Swiss psychoanalyst Carl Jung to designate the acausal alignment of two or more events, a kind of non-localised correspondence between a mental state and an event in the external world. He introduced the idea in a 1951 lecture, and elaborated it in a 1952 monograph written with the physicist Wolfgang Pauli. For Jung, synchronicities are not just odd little quirks of reality. He came to see them as pointing to a reality that is not fully captured by our conventional ideas of time, space and causality. They hinted at a world in which everything is subtly connected.
The problem with synchronicity is that it is impossible to study systematically. As it is unpredictable, it is not subject to a reproducible experiment. This has left it in a kind of scientific limbo, fascinating to many but anathema to a hard-nosed empirical approach. Sceptics tend to put it down to confirmation bias: we remember the times a weird coincidence happens, and forget all the times it doesn’t. Yet, for those who experience it, synchronicity can be profoundly moving, even life-changing. Jung himself was spurred on his quest by a now-famous synchronicity involving a scarab beetle, an event he recounts in his monograph. A patient was telling him about a dream of a golden scarab when he heard a tapping at the window. He opened it to find a scarabaeid beetle, a cetonia aurata, which he caught and handed to her. The event broke the ice of her rigid rationalism and her therapy began to move forward.`,
  },
  {
    id: '2',
    title: 'The digital afterlife',
    author: 'Elaine Kasket',
    url: 'https://aeon.co/essays/the-unsettling-new-ways-we-are-being-haunted-by-the-dead',
    genre: 'Technology & Society',
    duration: 5,
    content: `We are the first generations to be haunted in this way. On a daily basis, we are being confronted with the fact that the dead do not die, not anymore. They are right there in our pockets, on our screens, in our streams. Our digital devices are populated by ghosts, phantoms and zombies. A ‘ghost’ might be the lingering profile of a deceased person on a social media platform, a digital spectre that can be stumbled upon or sought out. A ‘phantom’ could be an alert or notification that seems to emanate from the deceased, a birthday reminder for someone who will never have another birthday. And a ‘zombie’ might be a profile that has been hacked or algorithmically reanimated, ‘liking’ posts or sending out friend requests from beyond the grave. This digital haunting is a new frontier of grief, a form of mourning that is both protracted and public.
Before the internet, the dead receded. Their letters yellowed, their photographs faded. They became memories, stories told. Now, they are perpetually present, their digital footprints indelible. This raises profound questions. What does it mean to mourn in an age of digital persistence? How do we let go of someone who is always potentially there, just a click away? Companies are already offering services to manage our digital legacies, to curate our post-mortem identities. Some services will even create interactive chatbots from our data, allowing our descendants to ‘talk’ to us after we’re gone. The ethical and psychological ramifications are immense and we are only just beginning to grapple with them. The boundary between life and death, presence and absence, has become porous in a way that is historically unprecedented.`,
  },
  {
    id: '3',
    title: 'On being a machine',
    author: 'George Zarkadakis',
    url: 'https://aeon.co/essays/what-it-means-to-be-a-machine-philosophically-speaking',
    genre: 'Philosophy & AI',
    duration: 7,
    content: `To be a machine, in the classical sense, is to be a composite of parts arranged to perform a function. From the water clocks of antiquity to the steam engines of the Industrial Revolution, machines were conceived as deterministic systems. Their behaviour was, in principle, entirely predictable. Given the initial state and the rules of operation, the future states were fixed. This clockwork view of the Universe, championed by figures such as Pierre-Simon Laplace, extended to living beings. In the 17th century, René Descartes famously argued that animals were mere automata, complex machines without a soul or consciousness. Humans were a special case, a hybrid of machine (the body) and a non-material mind (the soul). This dualism has been a cornerstone of Western philosophy, but it has been progressively eroded by science.
The advent of computers and artificial intelligence has further blurred the line. If a machine can play chess, compose music or even hold a conversation, in what meaningful sense is it different from a human? The Turing test was proposed as an operational definition of intelligence: if a machine's responses are indistinguishable from a human's, it should be considered intelligent. Yet this sidesteps the deeper question of consciousness, of subjective experience. Philosophers call this the ‘hard problem’. We can build machines that simulate intelligence, but we have no idea how to build one that feels. Perhaps consciousness is not a computation but an emergent property of complex biological systems. Or perhaps, as some panpsychists argue, it is a fundamental property of matter itself. The question of what it means to be a machine is no longer just about cogs and levers; it is about the nature of reality and our place within it.`,
  },
  {
    id: '4',
    title: 'The tyranny of time',
    author: 'Jay Griffiths',
    url: 'https://aeon.co/essays/the-tyranny-of-time-and-how-to-escape-its-brutal-reign',
    genre: 'Culture & History',
    duration: 8,
    content: `Clock-time is a tyrant. It is a grid of hours, minutes and seconds imposed on the fluid, cyclical and various rhythms of life. For most of human history, time was not measured but lived. It was tied to the sun and the moon, to the seasons and the tides, to the needs of the body and the demands of the land. This 'natural time' is flexible and qualitative. It has its own texture and mood. There is a time for planting and a time for harvesting, a time for feasting and a time for fasting, a time for work and a time for rest. This is a far cry from the abstract, homogenous and relentless tick-tock of the clock.
The mechanical clock was invented in medieval monasteries to regulate the hours of prayer. It soon escaped the cloister and became the engine of a new capitalist order. It synchronised labour, disciplined workers and measured productivity. It turned time into a commodity, something to be saved, spent and wasted. Benjamin Franklin’s adage, ‘time is money’, became the mantra of the modern world. We are now so enmeshed in clock-time that we have forgotten there is any other way of being. We live in a state of perpetual hurry, chained to deadlines and schedules. We suffer from a 'time-sickness', a chronic anxiety that we never have enough of it. To escape this tyranny, we must learn to reclaim a different kind of time: a time of slowness, of daydreaming, of unhurried conversation, of simply being.`,
  },
  {
    id: '5',
    title: 'Why we need wildness',
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

// Fisher-Yates shuffle algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};


export const getEssays = (): Essay[] => {
  // Return a shuffled list to simulate a dynamic feed
  return shuffleArray(essaysData);
};

export const getEssayById = (id: string): Essay | null => {
  return essaysData.find(essay => essay.id === id) || null;
};