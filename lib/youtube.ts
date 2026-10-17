export function youtubeId(value: string) {
  try {
    const url = new URL(value);
    const id = url.hostname === 'youtu.be' ? url.pathname.split('/')[1] : ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(url.hostname) ? (url.pathname === '/watch' ? url.searchParams.get('v') : /^\/(shorts|embed|live)\//.test(url.pathname) ? url.pathname.split('/')[2] : null) : null;
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) && ['https:', 'http:'].includes(url.protocol) ? id : null;
  } catch { return null; }
}

