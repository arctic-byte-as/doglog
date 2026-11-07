export const customerServiceOptions = [
  { key: 'TAILORED_TRAINING_PLAN', title: 'Tailored Training Plan', description: 'Plan daily exercises, log completed training, and follow your progress.', href: '/customer/services/tailored-training-plan' },
  { key: 'RECOMMENDED_VIDEOS', title: 'Recommended Videos', description: 'Share subject-specific YouTube videos on the customer home page.', href: '/customer/services/recommended-videos' },
  {
    key: 'PUPPY_COURSE',
    title: 'Puppy Course',
    description: 'Show the puppy course in the customer view.',
    href: '/customer/services/puppy-course',
  },
  {
    key: 'SKILLS_COURSE',
    title: 'Skills Course',
    description: 'Show the skills course in the customer view.',
    href: '/customer/services/skills-course',
  },
  {
    key: 'PRIVATE_TRAINING',
    title: 'Private Training',
    description: 'Show private training in the customer view.',
    href: '/customer/services/private-training',
  },
  {
    key: 'CONSULTATIONS',
    title: 'Consultations',
    description: 'Show consultations in the customer view.',
    href: '/customer/services/consultations',
  },
  {
    key: 'OPEN_TRAINING',
    title: 'Open Training',
    description: 'Show open training in the customer view.',
    href: '/customer/services/open-training',
  },
] as const;

export type CustomerServiceKey = (typeof customerServiceOptions)[number]['key'];
