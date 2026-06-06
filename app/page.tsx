import Image from 'next/image';
import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';

const services = [
  {
    title: 'Puppy Course',
    description: 'Early-life support for social confidence, home routines, handling, recall foundations, and polite everyday skills.',
  },
  {
    title: 'Skills Course',
    description: 'Structured progression for core skills such as loose leash walking, recall, settling, play, and handler contact.',
  },
  {
    title: 'Consultations',
    description: 'Individual assessment, training recommendations, and follow-up plans for dogs who need more tailored support.',
  },
  {
    title: 'Private Training',
    description: 'One-to-one coaching for specific goals, owner confidence, and practical training in real-life environments.',
  },
];

export default function Home() {
  return (
    <SiteShell>
      <div className="space-y-8">
        <section className="rounded-[2rem] border border-brand-200 bg-white px-8 py-12 shadow-soft">
          <Image src="/norsepaw-logo.png" alt="Norse Paw" width={3487} height={1038} className="h-auto w-full max-w-sm object-contain" priority />
          <h1 className="mt-8 max-w-3xl text-4xl font-semibold tracking-tight text-brand-950">Positive reinforcement training for dogs and their people.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-brand-900">
            Access courses, private training, consultations, training plans, and skills guidance from one connected owner portal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register/owner" className="rounded-full bg-brand-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
              Complete registration
            </Link>
            <Link href="/login" className="rounded-full border border-brand-200 bg-brand-50 px-5 py-3 text-sm font-semibold text-brand-800 transition hover:border-brand-400 hover:bg-white">
              Sign in
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <article key={service.title} className="flex min-h-44 flex-col justify-between rounded-3xl border border-brand-200 bg-white p-6 text-brand-950 shadow-sm">
              <h2 className="text-xl font-semibold">{service.title}</h2>
              <p className="mt-4 text-sm leading-6 text-brand-700">{service.description}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-brand-200 bg-white p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-brand-950">What owners can access</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {['Training plans', 'Skills library', 'Training library', 'Course content', 'Consultation notes', 'Dog profile updates'].map((item) => (
                <div key={item} className="rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm font-medium text-brand-800">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-brand-200 bg-white p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-brand-950">New here?</h2>
            <p className="mt-3 text-sm leading-6 text-brand-700">
              Start by completing owner registration. You will add your contact details and your dog&apos;s profile so training, services, and notes can be connected to the right account.
            </p>
            <Link href="/register/owner" className="mt-6 inline-flex w-full justify-center rounded-xl bg-brand-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
              Register as an owner
            </Link>
            <p className="mt-4 text-sm text-brand-700">
              Already registered? Use the sign-in page to access your customer view.
            </p>
            <Link href="/login" className="mt-3 inline-flex w-full justify-center rounded-xl border border-brand-200 bg-brand-50 px-5 py-3 text-sm font-semibold text-brand-800 transition hover:bg-white">
              Sign in
            </Link>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
