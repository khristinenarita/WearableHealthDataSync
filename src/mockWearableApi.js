// src/mockWearableApi.js

export const fetchWearableData = (provider = "Google Fit") => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.05) {
        reject(new Error(`Failed to sync with ${provider}. Please try again.`));
        return;
      }

      const now = new Date();
      const mockData = {
        provider: provider,
        lastSynced: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        date: now.toISOString().split('T')[0],
        metrics: {
          stepCount: Math.floor(7500 + Math.random() * 3000),
          stepGoal: 10000,
          activeEnergyKcal: Math.floor(380 + Math.random() * 250),
          energyGoal: 500,
          distanceKm: (4.5 + Math.random() * 2).toFixed(2),
          avgHeartRateBpm: Math.floor(68 + Math.random() * 12),
          sleepHours: (6.5 + Math.random() * 1.8).toFixed(1),
        }
      };

      resolve(mockData);
    }, 1200);
  });
};