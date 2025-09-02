import React from 'react';

export default function WidgetCard({ item, onDelete }) {
  const w = item.weather;
  const hasErr = w && w.error;

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: 16, marginBottom: 12,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>
          {item.location} {w?.locationLabel ? `→ ${w.locationLabel}` : ''}
        </div>

        {hasErr ? (
          <div style={{ color: '#b91c1c' }}>Fehler: {w.error}</div>
        ) : w ? (
          <div>
            <div>{w.current?.summary ?? '–'}</div>
            <div>🌡️ {w.current?.temperature}°C · 💨 {w.current?.windspeed} km/h</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Stand: {w.current?.time}</div>
          </div>
        ) : (
          <div>Lade…</div>
        )}
      </div>

      <button
        onClick={() => onDelete(item.id)}
        style={{ background: '#ef4444', color: 'white', border: 0, borderRadius: 8, padding: '8px 12px' }}
      >
        Löschen
      </button>
    </div>
  );
}
