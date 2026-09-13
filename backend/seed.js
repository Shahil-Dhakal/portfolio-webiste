import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Profile from './models/Profile.js';
import Project from './models/Project.js';
import ResumeEntry from './models/ResumeEntry.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected. Seeding...');

  await Promise.all([Profile.deleteMany({}), Project.deleteMany({}), ResumeEntry.deleteMany({})]);

  await Profile.create({
    name: 'Shahil Dhakal',
    firstName: 'Shahil',
    role: 'SOFTWARE ENGINEER',
    avatarUrl: '/assets/images/profile.png',

    heroHeading: 'Hello',
    heroSub: "Here's who I am & what I do",
    heroBody: [
      "Software Engineering student by degree, Data Science enthusiast by curiosity, and professional collector of back papers by circumstance. I've worked at a UK study consultancy, hit the gym like my life depends on it, and treat beer as a hydration strategy.",
      "I'm a jack of all trades, master of none, currently pursuing mastery in absolutely everything and therefore mastering nothing. My hobbies include learning random skills at 2 AM, changing career plans every Tuesday, and making people laugh while my back papers laugh at me."
    ],

    chatTagline: 'Talking to a slightly more honest version of my about page.',
    chatFirstUserMessage: "What's with all the back papers?",
    chatFirstBotMessage: 'Character development, mostly. Ask me about the projects instead, those went better.',
    chatSuggestions: ['what have you built?', 'tech stack?', 'why data science?'],
    chatDisclaimer: "You are talking to Shahil's Personal Assistant.",

    socials: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' },
    contact: { phone: '(+977) 9844200409', email: 'contact@shahil.com.np' },
    footerYear: 2026
  });

  await Project.create({
    name: 'Facebook',
    role: 'Lead Engineer, Data Analyst',
    description:
      'Lead Engineer at Facebook, where I architected world-changing systems, optimized infrastructure at massive scale, and personally fixed every bug on the platform. My contributions were so impactful that some people still talk about them today. Just kidding - none of that happened.',
    imageVariant: 'dark',
    order: 0
  });

  await ResumeEntry.create({
    section: 'education',
    dateRange: '2021 – 2026 (Expected)',
    position: 'B.E Software Engineer',
    company: 'Nepal College of Information Technology, Pokhara University',
    location: 'Balkumari, Lalitpur',
    descriptions: ['Still Learning...'],
    order: 0
  });

  console.log('Seed complete.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
