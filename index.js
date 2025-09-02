// pages/index.js
import { useState } from 'react';
import useWidgets from '../hooks/useWidgets';
import WidgetCard from '../components/WidgetCard';

export default function Home() {
  const { items, loading, error, addWidget, deleteWidget } = useWidgets();
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setFormError('');
    const value = location.trim();
    if (!value) return setFormError('Bitte eine Stadt eingeben.');
    setSubmitting(true);
    try {
      await addWidget(value);
      setLocation('');
    } catch (e) {
      // Fehler kommt bereits aus dem Hook (z. B. Duplikat)
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 680, margin: '40px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>🌤️ Wetter-Dashboard (Frontend-Demo)</h1>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        Widgets werden im Browser gespeichert; Wetterdaten kommen live von Open-Meteo.
      </p>

      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Stadt (z. B. Berlin, Hamburg, Paris)…"
          value={location}
          onChange={e => setLocation(e.target.value)}
          style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }}
        />
        <button disabled={submitting} style={{ background: '#2563eb', color: 'white', border: 0, borderRadius: 8, padding: '10px 16px' }}>
          {submitting ? 'Hinzufügen…' : 'Hinzufügen'}
        </button>
      </form>
      {formError && <div style={{ color: '#b91c1c', marginBottom: 12 }}>{formError}</div>}
      {error && <div style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</div>}
      {loading && <div style={{ marginBottom: 12 }}>Wetter wird aktualisiert…</div>}

      <div>
        {items.map(w => (
          <WidgetCard key={w.id} item={w} onDelete={deleteWidget} />
        ))}
        {!items.length && <div>Noch keine Widgets – füge oben dein erstes hinzu 👆</div>}
      </div>
    </div>
  );
}
