export type ConsultationDogOption = {
  id: string;
  name: string;
  breed: string;
  age?: string;
  owner: string;
  customerId?: string | null;
  customer?: { name: string; email: string } | null;
};

// Unlinked dogs stay separate: matching owner names do not prove shared ownership.
export function consultationCustomerKey(dog: ConsultationDogOption) {
  return dog.customerId ? `customer:${dog.customerId}` : `dog:${dog.id}`;
}

export function consultationCustomerOptions(dogs: ConsultationDogOption[]) {
  const options = new Map<string, { key: string; label: string }>();
  for (const dog of dogs) {
    const key = consultationCustomerKey(dog);
    const label = dog.customer
      ? `${dog.customer.name} (${dog.customer.email})`
      : `${dog.owner || 'Owner not recorded'} — ${dog.name} (owner account not connected)`;
    if (!options.has(key)) options.set(key, { key, label });
  }
  return [...options.values()].sort((a, b) => a.label.localeCompare(b.label));
}
