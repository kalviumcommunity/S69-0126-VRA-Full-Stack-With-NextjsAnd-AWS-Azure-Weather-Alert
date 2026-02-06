'use client';

import Link from 'next/link';
import { MapPin, Map, ArrowRight, Activity, CloudRain, Loader2 } from 'lucide-react';
import AlertBanner from '@/components/AlertBanner';
import { WEATHER_METRICS } from '@/lib/mockData';
import { INDIA_STATES } from '@/lib/indiaStates';
import AnimatedBackground from '@/components/AnimatedBackground';
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
      <AnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Hero Section */}
        <div className="mb-14 text-center sm:text-left relative z-10">
          <h1 className="text-5xl md:text-6xl font-black text-blue-950 tracking-tight mb-4 drop-shadow-sm">
            India Flood <span className="text-blue-600">Early-Warning</span> System
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
            Real-time monitoring and advanced risk assessment for flood management authorities and residents.
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
            <div className="flex items-center p-4 bg-blue-50 rounded-lg text-blue-700 border border-blue-100">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Fetching real-time weather data for all regions...
            </div>
          ) : activeAlerts.length > 0 ? (
            <AlertBanner alerts={activeAlerts} />
          ) : (
            <div className="p-6 bg-green-50/50 backdrop-blur-sm border border-green-200 rounded-2xl text-green-800 flex items-center gap-4 shadow-sm">
              <div className="bg-green-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg">No Critical Alerts</h4>
                <p className="text-slate-600">Current weather conditions across monitored regions are within safe limits.</p>
              </div>
            </div>
          )}
        </section>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Link href="/location" className="group">
            <div className="h-full bg-white/60 backdrop-blur-lg p-8 rounded-[2rem] border border-white/60 shadow-lg hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden group-hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <MapPin className="h-32 w-32 text-blue-600" />
              </div>
              <div className="relative z-10 flex flex-col items-start h-full">
                <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold text-blue-950 mb-3 tracking-tight">Location Details</h3>
                <p className="text-slate-600 mb-8 text-lg flex-1 leading-relaxed">
                  View detailed flood metrics, weather data, and risk impact for your specific region.
                </p>
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-white border border-blue-100 text-blue-600 font-semibold group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  View Location <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          <Link href="/overview" className="group">
            <div className="h-full bg-white/60 backdrop-blur-lg p-8 rounded-[2rem] border border-white/60 shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer relative overflow-hidden group-hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <Map className="h-32 w-32 text-emerald-600" />
              </div>
              <div className="relative z-10 flex flex-col items-start h-full">
                <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Map className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold text-blue-950 mb-3 tracking-tight">National Overview</h3>
                <p className="text-slate-600 mb-8 text-lg flex-1 leading-relaxed">
                  Analyze flood situations across all Indian states with interactive heatmaps.
                </p>
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-white border border-emerald-100 text-emerald-600 font-semibold group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  View India Map <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Brief Summary Stats */}
        <section className="bg-white/60 backdrop-blur-lg rounded-[2rem] p-8 mb-8 border border-white/60 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-blue-950 tracking-tight">Current Situation Summary</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Updated: Just now</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-red-50 to-red-100 border border-red-100 shadow-sm group hover:shadow-md transition-all">
              <div className="text-red-600 mb-2 flex items-center gap-2 font-bold uppercase text-xs tracking-wider">
                <Activity className="h-4 w-4" /> Active Warnings
              </div>
              <div className="text-4xl font-black text-red-600">{activeAlerts.length}</div>
            </div>
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 shadow-sm group hover:shadow-md transition-all">
              <div className="text-blue-600 mb-2 flex items-center gap-2 font-bold uppercase text-xs tracking-wider">
                <CloudRain className="h-4 w-4" /> Max Rainfall
              </div>
              <div className="text-4xl font-black text-blue-600">{WEATHER_METRICS.rainfall}mm</div>
            </div>
            {/* Placeholder stats */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-100 shadow-sm group hover:shadow-md transition-all">
              <div className="text-orange-600 mb-2 flex items-center gap-2 font-bold uppercase text-xs tracking-wider">
                Affected States
              </div>
              <div className="text-4xl font-black text-orange-600">{activeAlerts.length > 0 ? activeAlerts.length : 0}</div>
            </div>
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-100 shadow-sm group hover:shadow-md transition-all">
              <div className="text-emerald-600 mb-2 flex items-center gap-2 font-bold uppercase text-xs tracking-wider">
                Monitoring Stations
              </div>
              <div className="text-4xl font-black text-emerald-600">124</div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
