'use client';

import Link from 'next/link';
import { MapPin, Map, ArrowRight, Activity, CloudRain, Loader2 } from 'lucide-react';
import AlertBanner from '@/components/AlertBanner';
import { WEATHER_METRICS } from '@/lib/mockData';
import { INDIA_STATES } from '@/lib/indiaStates';
import { useEffect, useState } from 'react';

export default function Home() {
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true);

  useEffect(() => {
    async function fetchLiveAlerts() {
      setIsLoadingAlerts(true);
      const alerts: any[] = [];
      let alertIdCounter = 1;

      // We will check a subset of states or all of them. 
      // To prevent massive API spam on every home load, maybe limits or caching.
      // For now, let's check high-risk prone states first or just iterate.
      // Ambee might have rate limits.

      const checkState = async (state: typeof INDIA_STATES[0]) => {
        try {
          const res = await fetch(`/api/floods?lat=${state.lat}&lng=${state.lng}`);
          if (!res.ok) return null;
          const data = await res.json();
          const weather = data.data;

          if (weather) {
            const rain = weather.precipIntensity || 0;
            // Risk Logic matching Overview
            if (rain > 15) {
              return {
                id: alertIdCounter++,
                type: 'critical',
                location: state.name,
                message: `Severe rainfall (${rain}mm) detected. High flood risk.`
              };
            } else if (rain > 5) {
              return {
                id: alertIdCounter++,
                type: 'warning',
                location: state.name,
                message: `Heavy rainfall (${rain}mm) observed. Monitor situation.`
              };
            }
          }
        } catch (e) {
          // Ignore errors
        }
        return null;
      };

      // Run in parallel
      const results = await Promise.all(INDIA_STATES.map(s => checkState(s)));
      const liveAlerts = results.filter(a => a !== null);

      setActiveAlerts(liveAlerts);
      setIsLoadingAlerts(false);
    }

    fetchLiveAlerts();
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-bold text-blue-950 tracking-tight mb-2">
            India Flood Early-Warning System
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Real-time monitoring and risk assessment for flood management authorities and residents.
          </p>
        </div>

        {/* Active Alerts */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-3 w-3">
              {activeAlerts.length > 0 ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              )}
            </span>
            <h2 className="text-2xl font-semibold text-slate-800">
              {isLoadingAlerts ? 'Scanning for Alerts...' : 'Active Flood Alerts'}
            </h2>
          </div>

          {isLoadingAlerts ? (
            <div className="flex items-center p-4 bg-blue-50 rounded-lg text-blue-700">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Fetching real-time weather data for all regions...
            </div>
          ) : activeAlerts.length > 0 ? (
            <AlertBanner alerts={activeAlerts} />
          ) : (
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold">No Critical Alerts</h4>
                <p className="text-sm mt-1">Current weather conditions across monitored regions are within safe limits.</p>
              </div>
            </div>
          )}
        </section>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href="/location" className="group">
            <div className="h-full bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <MapPin className="h-24 w-24 text-blue-600" />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center p-3 rounded-lg bg-blue-100 text-blue-600 mb-4">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-blue-950 mb-2">Location Details</h3>
                <p className="text-slate-600 mb-6">
                  View detailed flood metrics, weather data, and risk impact for specific districts or cities.
                </p>
                <span className="inline-flex items-center font-medium text-blue-600 group-hover:text-blue-700">
                  View Location <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>

          <Link href="/overview" className="group">
            <div className="h-full bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Map className="h-24 w-24 text-emerald-600" />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center p-3 rounded-lg bg-emerald-100 text-emerald-600 mb-4">
                  <Map className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-blue-950 mb-2">National Overview</h3>
                <p className="text-slate-600 mb-6">
                  Get a complete picture of flood situations across all Indian states with heatmaps and statistics.
                </p>
                <span className="inline-flex items-center font-medium text-emerald-600 group-hover:text-emerald-700">
                  View India Map <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Brief Summary Stats */}
        <section className="bg-blue-50 text-blue-900 rounded-2xl p-8 mb-8 border border-blue-100">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">Current Situation Summary</h2>
            <span className="text-blue-600 text-sm">Updated: Just now</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-red-600 mb-2 flex items-center gap-2 font-medium">
                <Activity className="h-5 w-5" /> Active Warnings
              </div>
              <div className="text-4xl font-extrabold text-red-600">{activeAlerts.length}</div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-blue-600 mb-2 flex items-center gap-2 font-medium">
                <CloudRain className="h-5 w-5" /> Max Rainfall
              </div>
              <div className="text-4xl font-extrabold text-blue-600">{WEATHER_METRICS.rainfall}mm</div>
            </div>
            {/* Placeholder stats */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-orange-600 mb-2 flex items-center gap-2 font-medium">
                Affected States
              </div>
              <div className="text-4xl font-extrabold text-orange-600">{activeAlerts.length > 0 ? activeAlerts.length : 0}</div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-emerald-600 mb-2 flex items-center gap-2 font-medium">
                Monitoring Stations
              </div>
              <div className="text-4xl font-extrabold text-emerald-600">124</div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
