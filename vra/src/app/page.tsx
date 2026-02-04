import Link from 'next/link';
import { MapPin, Map, ArrowRight, Activity, CloudRain } from 'lucide-react';
import AlertBanner from '@/components/AlertBanner';
import { ALERTS, WEATHER_METRICS } from '@/lib/mockData';
import TechStackTicker from '@/components/TechStackTicker';

export default function Home() {
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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <h2 className="text-2xl font-semibold text-slate-800">Active Flood Alerts</h2>
          </div>
          <AlertBanner alerts={ALERTS} />
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
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="text-blue-600 mb-1 flex items-center gap-2">
                <Activity className="h-4 w-4" /> Active Warnings
              </div>
              <div className="text-3xl font-bold text-red-500">2</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="text-blue-600 mb-1 flex items-center gap-2">
                <CloudRain className="h-4 w-4" /> Max Rainfall
              </div>
              <div className="text-3xl font-bold text-blue-600">{WEATHER_METRICS.rainfall}mm</div>
            </div>
            {/* Placeholder stats */}
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="text-blue-600 mb-1 flex items-center gap-2">
                Affected States
              </div>
              <div className="text-3xl font-bold text-orange-500">3</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="text-slate-400 mb-1 flex items-center gap-2">
                Monitoring Stations
              </div>
              <div className="text-3xl font-bold text-emerald-600">124</div>
            </div>
          </div>
        </section>
      </div>
      <TechStackTicker />
    </>
  );
}
