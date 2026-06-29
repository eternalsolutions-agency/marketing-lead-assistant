'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const services = [
  'Sviluppo App',
  'Sviluppo Sito Web',
  'Sviluppo Web App',
  'Calendario Prenotazioni',
  'Gestione Social',
  'Ads Social',
];

const statuses = [
  'Da contattare',
  'Contattato',
  'Interessato',
  'Follow-up',
  'Appuntamento fissato',
  'Preventivo inviato',
  'Chiuso',
  'Perso',
];

const initialLead = {
  businessName: '', sector: '', city: '', website: '', phone: '', email: '',
  contactName: '', service: 'Sviluppo App', status: 'Da contattare', notes: '',
  lastContact: '', nextFollowUp: '', signature: 'Riccardo - AppStream',
};

export default function DashboardPage() {
  const [leads, setLeads] = useState([]);
  const [lead, setLead] = useState(initialLead);
  const [selected, setSelected] = useState(null);
  const [generated, setGenerated] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState('whatsapp');
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('mla_logged') !== 'true') router.push('/');
    loadLeads();
  }, [router]);

  async function loadLeads() {
    const res = await fetch('/api/leads');
    const data = await res.json();
    if (data.leads) setLeads(data.leads);
  }

  async function addNewLead(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    const data = await res.json();
    setLoading(false);
    if (data.lead) {
      setLead(initialLead);
      await loadLeads();
    } else {
      alert(data.error || 'Errore salvataggio lead');
    }
  }

  async function generateText(type = messageType) {
    if (!selected) return;
    setLoading(true);
    setGenerated('');
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...selected, leadId: selected.id, messageType: type, saveHistory: true }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.text) setGenerated(data.text);
    else alert(data.error || 'Errore generazione AI');
  }

  function copyText() {
    navigator.clipboard.writeText(generated);
    alert('Testo copiato');
  }

  const stats = useMemo(() => ({
    total: leads.length,
    todo: leads.filter(l => l.status === 'Da contattare').length,
    contacted: leads.filter(l => l.status === 'Contattato').length,
    interested: leads.filter(l => l.status === 'Interessato').length,
    meetings: leads.filter(l => l.status === 'Appuntamento fissato').length,
  }), [leads]);

  return (
    <main className="min-h-screen bg-[#050816] p-6 text-gray-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-blue-300">Dashboard privata</p>
            <h1 className="text-3xl font-bold text-white">Marketing Lead Assistant</h1>
            <p className="text-gray-400">Gestione lead e messaggi AI firmati Riccardo - AppStream.</p>
          </div>
          <button onClick={() => { localStorage.removeItem('mla_logged'); router.push('/'); }} className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/10">Esci</button>
        </header>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <Stat label="Lead totali" value={stats.total} />
          <Stat label="Da contattare" value={stats.todo} />
          <Stat label="Contattati" value={stats.contacted} />
          <Stat label="Interessati" value={stats.interested} />
          <Stat label="Appuntamenti" value={stats.meetings} />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 lg:col-span-1">
            <h2 className="mb-4 text-xl font-semibold">Nuovo lead</h2>
            <form onSubmit={addNewLead} className="space-y-3">
              <Field label="Nome attività" value={lead.businessName} onChange={v => setLead({ ...lead, businessName: v })} required />
              <Field label="Settore" value={lead.sector} onChange={v => setLead({ ...lead, sector: v })} />
              <Field label="Città" value={lead.city} onChange={v => setLead({ ...lead, city: v })} />
              <Field label="Sito web" value={lead.website} onChange={v => setLead({ ...lead, website: v })} />
              <Field label="Telefono" value={lead.phone} onChange={v => setLead({ ...lead, phone: v })} />
              <Field label="Email" value={lead.email} onChange={v => setLead({ ...lead, email: v })} />
              <Field label="Referente" value={lead.contactName} onChange={v => setLead({ ...lead, contactName: v })} />
              <Select label="Servizio" value={lead.service} options={services} onChange={v => setLead({ ...lead, service: v })} />
              <Select label="Stato" value={lead.status} options={statuses} onChange={v => setLead({ ...lead, status: v })} />
              <textarea className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none focus:border-blue-400" placeholder="Note" value={lead.notes} onChange={e => setLead({ ...lead, notes: e.target.value })} />
              <button disabled={loading} className="w-full rounded-xl bg-blue-500 px-4 py-3 font-semibold hover:bg-blue-400 disabled:opacity-50">Salva lead</button>
            </form>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold">Lead</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-400"><tr><th className="p-2">Azienda</th><th className="p-2">Servizio</th><th className="p-2">Stato</th><th className="p-2">Città</th><th className="p-2">Azioni</th></tr></thead>
                <tbody>
                  {leads.map(l => (
                    <tr key={l.id} className="border-t border-white/10">
                      <td className="p-2 font-medium">{l.businessName}</td>
                      <td className="p-2">{l.service}</td>
                      <td className="p-2">{l.status}</td>
                      <td className="p-2">{l.city}</td>
                      <td className="p-2"><button onClick={() => { setSelected(l); setGenerated(''); }} className="rounded-lg bg-white/10 px-3 py-1 hover:bg-white/20">Apri</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {selected && (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selected.businessName}</h2>
                <p className="text-gray-400">{selected.sector} · {selected.city} · {selected.service}</p>
                <p className="mt-2 text-sm text-gray-300">{selected.notes}</p>
              </div>
              <select value={messageType} onChange={e => setMessageType(e.target.value)} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="call">Script telefonata</option>
                <option value="followup">Follow-up</option>
                <option value="objection">Risposta obiezione</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => generateText('whatsapp')} className="rounded-xl bg-blue-500 px-4 py-2 font-semibold hover:bg-blue-400">Genera WhatsApp</button>
              <button onClick={() => generateText('email')} className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20">Genera Email</button>
              <button onClick={() => generateText('call')} className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20">Script chiamata</button>
              <button onClick={() => generateText('followup')} className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20">Follow-up</button>
              <button onClick={() => generateText('objection')} className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20">Obiezione</button>
            </div>
            {loading && <p className="mt-4 text-blue-300">Elaborazione...</p>}
            {generated && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-gray-100">{generated}</pre>
                <button onClick={copyText} className="mt-4 rounded-xl bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-400">Copia testo</button>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

function Stat({ label, value }) {
  return <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-gray-400">{label}</p><p className="mt-1 text-3xl font-bold text-white">{value}</p></div>;
}

function Field({ label, value, onChange, required }) {
  return <input required={required} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none focus:border-blue-400" placeholder={label} value={value} onChange={e => onChange(e.target.value)} />;
}

function Select({ label, value, options, onChange }) {
  return <select aria-label={label} value={value} onChange={e => onChange(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none focus:border-blue-400">{options.map(o => <option key={o} value={o}>{o}</option>)}</select>;
}
