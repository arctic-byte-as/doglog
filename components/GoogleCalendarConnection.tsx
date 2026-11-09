'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
type Status = { connected: boolean; email?: string; checkedAt?: string | null; reconnect?: boolean };
export default function GoogleCalendarConnection({ configured, status, result }: { configured: boolean; status: Status; result?: string }) {
  const router = useRouter(), saving = useRef(false);
  const [busy, setBusy] = useState(''), [error, setError] = useState(''), [message, setMessage] = useState(''), [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const button = 'inline-flex min-h-11 items-center justify-center rounded-full border border-brand-200 px-5 py-2 text-sm font-semibold disabled:opacity-50';
  async function action(type: 'connect' | 'check' | 'disconnect') {
    if (saving.current) return; saving.current = true; setBusy(type); setError(''); setMessage('');
    try {
      const response = await fetch(`/api/integrations/google/${type}`, { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || 'The Google connection could not be updated.');
      if (type === 'connect') {
        const url = new URL(data.url); if (url.origin !== 'https://accounts.google.com') throw Error('The Google sign-in address could not be verified.');
        window.location.assign(url.toString()); return;
      }
      setMessage(type === 'check' ? 'Connection checked. Google Calendar is ready.' : 'Google Calendar disconnected from NorsePaw.');
      setConfirmDisconnect(false); router.replace('/services/consultations/google'); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Please try again.'); }
    finally { saving.current = false; setBusy(''); }
  }
  const feedback: Record<string, string> = { connected: 'Google Calendar connected. Use Check connection to verify calendar access.', cancelled: 'Google connection cancelled. Your previous connection, if any, was kept.', failed: 'The Google connection could not be completed. Check that your account is a Google test user, allow calendar access, and try again.', 'sign-in': 'Sign in to NorsePaw as a trainer, then start the Google connection again.' };
  return <section className="space-y-5 rounded-2xl border border-brand-200 bg-white p-6">
    <h1 className="text-2xl font-semibold">Google Calendar & Meet</h1>
    <p className="text-sm leading-6">Connect your trainer account to prepare for online consultation bookings. Google Meet links will be added when consultation scheduling is introduced.</p>
    {!configured ? <p role="status" className="rounded-xl bg-brand-50 p-4 text-sm">Google Calendar setup is not complete in this environment.</p> : <>
      {feedback[result || ''] ? <p role="status" className="rounded-xl bg-brand-50 p-4 text-sm">{feedback[result!]}</p> : null}
      <div className="rounded-xl bg-brand-50 p-4"><p className="font-semibold">{status.connected ? '✓ Connected' : 'Not connected'}</p>{status.email ? <p className="mt-2 text-sm">{status.email}</p> : null}{status.checkedAt ? <p className="mt-2 text-xs">Last checked: {new Date(status.checkedAt).toLocaleString('en-GB', { timeZone: 'Europe/Oslo' })} · Europe/Oslo</p> : null}{status.reconnect ? <p className="mt-2 text-sm">Please reconnect to renew your saved connection.</p> : null}</div>
      <p className="text-sm text-brand-700">Choose your NorsePaw Workspace account in Google. NorsePaw will request permission to manage events on calendars you own. Connecting or checking the connection creates no events and sends no invitations.</p>
      {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}{message ? <p role="status" className="text-sm text-green-800">{message}</p> : null}
      <div className="flex flex-wrap gap-3"><button className={`${button} bg-brand-900 text-white`} disabled={Boolean(busy)} onClick={() => void action('connect')}>{busy === 'connect' ? 'Opening Google…' : status.connected ? 'Reconnect Google Calendar' : 'Connect Google Calendar'}</button>{status.connected ? <><button className={button} disabled={Boolean(busy)} onClick={() => void action('check')}>{busy === 'check' ? 'Checking…' : 'Check connection'}</button><button className={button} disabled={Boolean(busy)} onClick={() => setConfirmDisconnect(true)}>Disconnect</button></> : null}</div>
      {confirmDisconnect ? <div className="space-y-3 rounded-xl border border-brand-200 p-4"><p className="text-sm">Remove this saved connection from NorsePaw? Existing Google events remain unchanged. You can also remove Google permissions in your Google account settings.</p><div className="flex gap-3"><button className={button} disabled={Boolean(busy)} onClick={() => void action('disconnect')}>{busy === 'disconnect' ? 'Disconnecting…' : 'Yes, disconnect'}</button><button className={button} disabled={Boolean(busy)} onClick={() => setConfirmDisconnect(false)}>Keep connection</button></div></div> : null}
    </>}
  </section>;
}
