// hooks/useWidgets.js
// Zentraler Hook: hält Widgets im State, reichert sie mit Wetter an, kapselt Add/Delete.

import { useEffect, useMemo, useState } from 'react';
import { getAllWidgets, addWidget as addLocal, deleteWidget as deleteLocal } from '../utils/storage';
import { getWeatherByLocation } from '../utils/weather';

export default function useWidgets() {
  const [items, setItems] = useState([]);          // rohe Widgets (ohne Wetter)
  const [enriched, setEnriched] = useState([]);    // Widgets + Wetter
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initial: aus localStorage lesen
  useEffect(() => {
    setItems(getAllWidgets());
  }, []);

  // Immer wenn sich items ändern, Wetter nachladen
  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      setLoading(true);
      setError('');
      try {
        const withWeather = await Promise.all(items.map(async (w) => {
          try {
            const weather = await getWeatherByLocation(w.location);
            return { ...w, weather };
          } catch (e) {
            return { ...w, weather: { error: e.message } };
          }
        }));
        if (!cancelled) setEnriched(withWeather);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    hydrate();
    return () => { cancelled = true; };
  }, [items]);

  async function addWidget(location) {
    try {
      const created = addLocal(location);
      setItems(prev => [created, ...prev]);
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }

  async function deleteWidget(id) {
    deleteLocal(id);
    setItems(prev => prev.filter(w => w.id !== id));
  }

  const state = useMemo(() => ({ items: enriched, loading, error }), [enriched, loading, error]);

  return { ...state, addWidget, deleteWidget };
}
