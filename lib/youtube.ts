export function youtubeId(value: string) {
  try {
    const input = value.trim();
    const url = new URL(/^(?:(?:www|m|music)\.)?(?:youtube\.com|youtu\.be)\//i.test(input) ? `https://${input}` : input);
    if (!['https:', 'http:'].includes(url.protocol)) return null;
    const path = url.pathname.replace(/\/+$/, '');
    const id = ['youtu.be', 'www.youtu.be'].includes(url.hostname) ? path.split('/')[1] : ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(url.hostname) ? (path === '/watch' ? url.searchParams.get('v') : /^\/(shorts|embed|live)\//.test(path) ? path.split('/')[2] : null) : null;
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch { return null; }
}
