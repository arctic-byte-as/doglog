type ConsultationPdfUser = {
  modes: string[];
  trainer?: { id: string } | null;
  customer?: { id: string } | null;
};

type ConsultationPdfDog = {
  trainerId: string;
  customerId?: string | null;
};

function hasId(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function canDownloadConsultation(user: ConsultationPdfUser, dog: ConsultationPdfDog): boolean {
  if (!user || !dog || !Array.isArray(user.modes)) return false;

  const trainerId = user.trainer?.id;
  const customerId = user.customer?.id;

  return (
    (user.modes.includes('ADMIN') && hasId(trainerId) && hasId(dog.trainerId) && trainerId === dog.trainerId)
    || (user.modes.includes('CUSTOMER') && hasId(customerId) && hasId(dog.customerId) && customerId === dog.customerId)
  );
}
