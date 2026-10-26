// src/App.jsx

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Flame, 
  Footprints, 
  Heart, 
  RefreshCw, 
  PlusCircle, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Utensils, 
  Moon, 
  Watch
} from 'lucide-react';
import { fetchWearableData } from './mockWearableApi';

export default function App() {
  // Wearable State
  const [provider, setProvider] = useState('Google Fit');
  const [wearableData, setWearableData] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);

  // Meal Intake Form State
  const [mealType, setMealType] = useState('Breakfast');
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [notes, setNotes] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loggedMeals, setLoggedMeals] = useState([
    {
      id: 1,
      type: 'Breakfast',
      name: 'Avocado Toast & Scrambled Eggs',
      calories: 420,
      protein: 18,
      time: '08:30 AM',
      photo: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&auto=format&fit=crop&q=60'
    }
  ]);

  // Wearable Sync Handler
  const handleSync = async (selectedProvider = provider) => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const data = await fetchWearableData(selectedProvider);
      setWearableData(data);
    } catch (err) {
      setSyncError(err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    handleSync(provider);
  }, [provider]);

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Meal Log
  const handleMealSubmit = (e) => {
    e.preventDefault();
    if (!mealName || !calories) return;

    const newMeal = {
      id: Date.now(),
      type: mealType,
      name: mealName,
      calories: Number(calories),
      protein: protein ? Number(protein) : 0,
      notes,
      photo: photoPreview || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=300&auto=format&fit=crop&q=60',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setLoggedMeals([newMeal, ...loggedMeals]);
    
    // Reset Form
    setMealName('');
    setCalories('');
    setProtein('');
    setNotes('');
    setPhotoPreview(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-12">
      {/* Top Header */}
      <header className="bg-emerald-600 text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Activity className="w-7 h-7" />
            <h1 className="text-xl font-bold tracking-wide">VitalPulse mHealth</h1>
          </div>
          <span className="text-xs bg-emerald-700 px-3 py-1 rounded-full font-medium">
            Lab 2: Consumer App & Sync
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
        
        {/* SECTION 1: WEARABLE DATA SYNC ENGINE */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Watch className="w-5 h-5 text-emerald-600" /> Wearable Health Data Sync
              </h2>
              <p className="text-sm text-slate-500">
                Simulating REST API connection with mobile health platform APIs.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select 
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-lg p-2 font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Google Fit">Google Fit API</option>
                <option value="Apple HealthKit">Apple HealthKit Bridge</option>
                <option value="Garmin Health">Garmin Connect API</option>
              </select>

              <button
                onClick={() => handleSync(provider)}
                disabled={isSyncing}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
          </div>

          {/* Sync Status Banner */}
          {syncError && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{syncError}</span>
            </div>
          )}

          {/* Wearable Metric Cards */}
          {wearableData && (
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Steps Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <span>Step Count</span>
                  <Footprints className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="mt-2 text-2xl font-bold text-slate-900">
                  {wearableData.metrics.stepCount.toLocaleString()}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Goal: {wearableData.metrics.stepGoal.toLocaleString()} steps
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full" 
                    style={{ width: `${Math.min(100, (wearableData.metrics.stepCount / wearableData.metrics.stepGoal) * 100)}\%` }} ></div> </div> </div>  {/* Active Energy Card */} <div className="bg-slate-50 p-4 rounded-xl border border-slate-100"> <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider"> <span>Active Energy</span> <Flame className="w-4 h-4 text-orange-500" /> </div> <div className="mt-2 text-2xl font-bold text-slate-900"> {wearableData.metrics.activeEnergyKcal} <span className="text-sm font-normal text-slate-500">kcal</span> </div> <div className="mt-1 text-xs text-slate-500"> Goal: {wearableData.metrics.energyGoal} kcal </div> <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden"> <div className="bg-orange-500 h-full rounded-full" style={{ width: `${Math.min(100, (wearableData.metrics.activeEnergyKcal / wearableData.metrics.energyGoal) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Heart Rate Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <span>Avg Heart Rate</span>
                  <Heart className="w-4 h-4 text-rose-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-slate-900">
                  {wearableData.metrics.avgHeartRateBpm} <span className="text-sm font-normal text-slate-500">bpm</span>
                </div>
                <div className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Resting range
                </div>
              </div>

              {/* Sleep Duration Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <span>Sleep Duration</span>
                  <Moon className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-slate-900">
                  {wearableData.metrics.sleepHours} <span className="text-sm font-normal text-slate-500">hrs</span>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Distance: {wearableData.metrics.distanceKm} km
                </div>
              </div>
            </div>
          )}

          {wearableData && (
            <div className="mt-3 text-right text-xs text-slate-400">
              Synced via {wearableData.provider} REST Mock at {wearableData.lastSynced}
            </div>
          )}
        </section>

        {/* SECTION 2: INTAKE FORM AND RECENT LOGS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Meal & Photo Intake Form */}
          <section className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b pb-3">
              <Utensils className="w-5 h-5 text-emerald-600" /> Log Meal Intake
            </h2>

            <form onSubmit={handleMealSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Meal Type</label>
                <select 
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Food / Description</label>
                <input 
                  type="text"
                  placeholder="e.g. Grilled Chicken Salad"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Calories (kcal)</label>
                  <input 
                    type="number"
                    placeholder="e.g. 450"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Protein (g)</label>
                  <input 
                    type="number"
                    placeholder="e.g. 25"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Photo Upload Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Upload Meal Photo</label>
                <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-slate-300 border-dashed rounded-lg hover:border-emerald-500 transition cursor-pointer relative bg-slate-50">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center space-y-1">
                    <Camera className="mx-auto h-8 w-8 text-slate-400" />
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-emerald-600">Click to upload photo</span> or tap camera
                    </div>
                    <p className="text-[10px] text-slate-400">PNG, JPG up to 5MB</p>
                  </div>
                </div>

                {/* Photo Preview */}
                {photoPreview && (
                  <div className="mt-3 relative rounded-lg overflow-hidden border border-slate-200">
                    <img src={photoPreview} alt="Meal preview" className="w-full h-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="absolute top-1 right-1 bg-slate-900/70 text-white text-xs px-2 py-0.5 rounded-full"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Notes / Symptoms</label>
                <textarea 
                  rows="2"
                  placeholder="e.g. Ate post-workout, felt energized"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <PlusCircle className="w-5 h-5" /> Save Meal Entry
              </button>
            </form>
          </section>

          {/* Meal Intake History */}
          <section className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h2 className="text-lg font-semibold mb-4 border-b pb-3 flex justify-between items-center">
              <span>Logged Meals Today</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-normal">
                {loggedMeals.length} Entry{loggedMeals.length !== 1 ? 's' : ''}
              </span>
            </h2>

            {loggedMeals.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                No meals logged today yet. Use the form to submit your first meal!
              </div>
            ) : (
              <div className="space-y-4">
                {loggedMeals.map((meal) => (
                  <div key={meal.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl gap-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={meal.photo} 
                        alt={meal.name} 
                        className="w-16 h-16 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                            {meal.type}
                          </span>
                          <span className="text-xs text-slate-400">{meal.time}</span>
                        </div>
                        <h3 className="font-semibold text-slate-800 text-sm mt-1">{meal.name}</h3>
                        {meal.notes && <p className="text-xs text-slate-500 italic mt-0.5">"{meal.notes}"</p>}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0">
                      <div className="text-sm font-bold text-slate-900">
                        {meal.calories} <span className="text-xs font-normal text-slate-500">kcal</span>
                      </div>
                      {meal.protein > 0 && (
                        <div className="text-xs text-slate-500">
                          {meal.protein}g protein
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}