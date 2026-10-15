export function cropGeometry(width: number, height: number, zoom = 1, x = 0, y = 0) {
  const side = Math.min(width, height) / Math.max(1, zoom);
  return { x: (width - side) / 2 * (1 - Math.max(-1, Math.min(1, x))), y: (height - side) / 2 * (1 - Math.max(-1, Math.min(1, y))), side };
}

export async function prepareProfilePhoto(image: HTMLImageElement, zoom: number, x: number, y: number) {
  const crop = cropGeometry(image.naturalWidth, image.naturalHeight, zoom, x, y);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 768;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas unavailable');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, 768, 768);
  context.drawImage(image, crop.x, crop.y, crop.side, crop.side, 0, 0, 768, 768);
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error('Could not prepare photo')), 'image/jpeg', 0.85));
  return new File([blob], 'profile-photo.jpg', { type: 'image/jpeg' });
}
