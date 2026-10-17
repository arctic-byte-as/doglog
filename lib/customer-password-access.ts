export function canResetCustomerPassword(email: string, role: string, hasTrainer: boolean, adminEmails: string) {
  return role.toUpperCase() === 'CUSTOMER' && !hasTrainer && !adminEmails.split(',').some((value) => value.trim().toLowerCase() === email.toLowerCase());
}
