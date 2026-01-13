import React from 'react';
import { 
  AlertTriangle, Bell, CloudRain, Zap, Users, 
  ShieldAlert, ChevronRight, MapPin, Globe, X 
} from 'lucide-react';

export default function FloodGuardDashboard() {
  return (
    <div className="min-h-screen pb-20">
      {/* 1. TOP NAVIGATION */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <div className="bg-[#003366] p-2 rounded-lg">
            <AlertTriangle className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-slate-800">FloodGuard India</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Early Warning System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex bg-gray-100 rounded-full p-1 border border-gray-200">
            <button className="px-5 py-1.5 bg-white shadow-sm rounded-full text-xs font-bold text-slate-800">Dashboard</button>
            <button className="px-5 py-1.5 text-gray-400 text-xs font-bold hover:text-slate-600 transition-colors">Location Details</button>
            <button className="px-5 py-1.5 text-gray-400 text-xs font-bold hover:text-slate-600 transition-colors">India Overview</button>
          </div>
          <div className="relative cursor-pointer p-2 hover:bg-gray-50 rounded-full">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-6 space-y-6">
        
        {/* 2. EXTREME WARNING BANNER */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start justify-between">
          <div className="flex gap-4">
            <div className="mt-1">
              <AlertTriangle className="text-red-500 w-5 h-5" />
            </div>
            <div>
              <h4 className="text-red-600 font-bold text-sm">Extreme Flood Warning - Assam</h4>
              <p className="text-red-500/80 text-sm">Critical flood conditions in Brahmaputra basin. Evacuation advisory in effect for 12 districts.</p>
            </div>
          </div>
          <X className="text-red-300 w-5 h-5 cursor-pointer hover:text-red-500" />
        </div>

        {/* 3. HERO SECTION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Blue Card */}
          <div className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg shadow-blue-100">
            <div className="relative z-10 max-w-md">
              <h2 className="text-3xl font-bold mb-3">FloodGuard India Dashboard</h2>
              <p className="text-blue-50/80 text-sm mb-6 leading-relaxed">
                Real-time flood monitoring and early warning system for India. Track flood risks across states and get instant alerts.
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                24 Active Alerts
              </div>
            </div>
            
            {/* National Risk Circular Progress */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.2)" strokeWidth="12" fill="transparent" />
                  <circle 
                    cx="64" cy="64" r="56" stroke="white" strokeWidth="12" fill="transparent"
                    strokeDasharray={351} strokeDashoffset={351 - (351 * 52) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-2xl font-black italic">52%</span>
              </div>
              <p className="mt-2 text-[10px] uppercase font-bold tracking-widest text-blue-100/60">National Risk</p>
            </div>
          </div>

          {/* Sidebar Stat Cards */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="bg-red-50 p-3 rounded-xl"><AlertTriangle className="text-red-400 w-6 h-6" /></div>
              <div>
                <div className="text-2xl font-bold">8</div>
                <div className="text-xs text-gray-400 font-medium uppercase tracking-tight">Critical Alerts</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="bg-orange-50 p-3 rounded-xl"><Globe className="text-orange-400 w-6 h-6" /></div>
              <div>
                <div className="text-2xl font-bold">18/28</div>
                <div className="text-xs text-gray-400 font-medium uppercase tracking-tight">Affected States</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. QUICK ACTIONS */}
        <section>
          <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <MapPin className="text-blue-600 w-6 h-6 group-hover:text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">View Location Flood Details</h4>
              <p className="text-gray-400 text-sm">Check flood conditions for a specific district or city in India</p>
            </div>
            <div className="bg-[#003366] p-8 rounded-2xl shadow-lg hover:shadow-blue-900/20 transition-shadow cursor-pointer">
              <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Globe className="text-white w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-white">View India Flood Overview</h4>
              <p className="text-blue-100/60 text-sm">National flood situation with state-wise risk analysis</p>
            </div>
          </div>
        </section>

        {/* 5. CURRENT SITUATION */}
        <section>
          <h3 className="font-bold text-slate-800 mb-4">Current Situation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MiniStat icon={<CloudRain className="text-blue-400" />} val="156mm" label="Avg. Rainfall Today" sub="Above normal" />
            <MiniStat icon={<Zap className="text-orange-400" />} val="38%" label="Disaster Impact" sub="Moderate severity" />
            <MiniStat icon={<Users className="text-blue-900" />} val="4.5Cr" label="Population Affected" sub="Across 18 states" />
            <MiniStat icon={<ShieldAlert className="text-red-500" />} val="1" label="Severe Risk States" sub="Assam" />
          </div>
        </section>
      </main>

      <footer className="mt-16 text-center text-[11px] text-gray-400 space-y-1">
        <p>Data updated every 15 minutes • Source: India Meteorological Department</p>
        <p>© 2024 FloodGuard India Early Warning System</p>
      </footer>
    </div>
  );
}

function MiniStat({ icon, val, label, sub }: { icon: React.ReactNode, val: string, label: string, sub: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="bg-gray-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">{icon}</div>
      <div className="text-2xl font-bold text-slate-800">{val}</div>
      <div className="text-xs font-semibold text-slate-500 mt-1">{label}</div>
      <div className="text-[10px] text-gray-400 mt-0.5">{sub}</div>
    </div>
  );
}