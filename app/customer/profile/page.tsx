import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import CustomerDogForm from '@/components/CustomerDogForm';
import CustomerDogProfileForm from '@/components/CustomerDogProfileForm';
import CustomerLanguageSwitcher from '@/components/CustomerLanguageSwitcher';
import CustomerProfileForm from '@/components/CustomerProfileForm';
import { requireCustomer } from '@/lib/auth';
import { getCustomerDictionary, getCustomerLocale } from '@/lib/i18n/customer';
import prisma from '@/lib/prisma';

export default async function CustomerProfilePage() {
  const user = await requireCustomer();
  const locale = await getCustomerLocale();
  const t = getCustomerDictionary(locale);
  const customer = await prisma.customer.findUnique({
    where: { id: user.customer.id },
    include: {
      dogs: {
        orderBy: { name: 'asc' },
      },
    },
  });

  return (
    <SiteShell>
      <div className="space-y-8">
        <SectionCard title={t.profile.profile}>
          <CustomerProfileForm customer={customer} labels={t.forms.customerProfile} />
        </SectionCard>

        <SectionCard title={t.profile.languagePreferences}>
          <div className="flex flex-col gap-4 rounded-2xl border border-brand-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-brand-700">{t.profile.languageHelp}</p>
            <CustomerLanguageSwitcher locale={locale} />
          </div>
        </SectionCard>

        <SectionCard title={t.profile.registeredDogs}>
          {customer?.dogs.length ? (
            <div className="space-y-4">
              {customer.dogs.map((dog) => (
                <div key={dog.id} id={`dog-${dog.id}`} className="scroll-mt-6"><CustomerDogProfileForm
                  dog={dog}
                  labels={t.forms.dog}
                  imageLabels={t.forms.image}
                  locale={locale}
                  uploadSuccessMessage={t.forms.image.uploadedAndSaved}
                  photoSavedMessage={t.forms.image.photoSaved}
                /></div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">{t.profile.noDogs}</p>
          )}
        </SectionCard>

        <div id="add-dog" className="scroll-mt-6"><SectionCard title={t.profile.addAnotherDog}>
          <CustomerDogForm
            disabled={!customer}
            labels={t.forms.dog}
            imageLabels={t.forms.image}
                  locale={locale}
            uploadSuccessMessage={t.forms.image.uploadedAddDog}
          />
        </SectionCard></div>
      </div>
    </SiteShell>
  );
}
