import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import CustomerDogForm from '@/components/CustomerDogForm';
import CustomerDogProfileForm from '@/components/CustomerDogProfileForm';
import CustomerProfileForm from '@/components/CustomerProfileForm';
import { requireCustomer } from '@/lib/auth';
import { getCustomerDictionary, getCustomerLocale } from '@/lib/i18n/customer';
import prisma from '@/lib/prisma';

export default async function CustomerProfilePage() {
  const user = await requireCustomer();
  const t = getCustomerDictionary(getCustomerLocale());
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

        <SectionCard title={t.profile.registeredDogs}>
          {customer?.dogs.length ? (
            <div className="space-y-4">
              {customer.dogs.map((dog) => (
                <CustomerDogProfileForm
                  key={dog.id}
                  dog={dog}
                  labels={t.forms.dog}
                  imageLabels={t.forms.image}
                  uploadSuccessMessage={t.forms.image.uploadedAndSaved}
                  photoSavedMessage={t.forms.image.photoSaved}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">{t.profile.noDogs}</p>
          )}
        </SectionCard>

        <SectionCard title={t.profile.addAnotherDog}>
          <CustomerDogForm
            disabled={!customer}
            labels={t.forms.dog}
            imageLabels={t.forms.image}
            uploadSuccessMessage={t.forms.image.uploadedAddDog}
          />
        </SectionCard>
      </div>
    </SiteShell>
  );
}
