export async function saveDogPhoto(id: string, url: string) {
  const response = await fetch(`/api/customer/dogs/${encodeURIComponent(id)}/photo`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }),
  });
  if (!response.ok) throw new Error('Could not save photo.');
}
