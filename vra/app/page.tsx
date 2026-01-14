import React from 'react';
import { 
  Bell, 
  MapPin, 
  Map as MapIcon, 
  CloudRain, 
  Activity, 
  Users, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

// --- Types ---
interface StateRiskCardProps {
  name: string;
  percentage: number;
  districtsAffected: string;
  rainfall: string;
  color: string;
}

// --- Sub-Components ---

const StatCard = ({ icon: Icon, label, value, subtext, iconBg }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-3">
    <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
      <Icon className="w-5 h-5 text-slate-600" />
    </div>
    <div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-sm font-medium text-slate-600">{label}</div>
      <div className="text-xs text-slate-400 mt-1">{subtext}</div>
    </div>
  </div>
);

const StateRiskCard = ({ name, percentage, districtsAffected, rainfall, color }: StateRiskCardProps) => (
  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
    <div className="relative w-16 h-16 flex-shrink-0">
      {/* Simple SVG Circular Progress */}
      <svg className="w-full h-full" viewBox="0 0 36 36">
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3" />
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${percentage}, 100`} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{percentage}%</span>
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-slate-900">{name}</h4>
      <p className="text-xs text-slate-500">{districtsAffected}</p>
      <div className="flex items-center gap-1 mt-1 text-xs text-blue-600 font-medium">
        <CloudRain size={12} /> {rainfall} rainfall
      </div>
    </div>
  </div>
);

// --- Main Page ---

export default function FloodGuardDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-900 p-1.5 rounded">
            <AlertTriangle className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">FloodGuard India</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Early Warning System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <button className="text-blue-600 bg-slate-100 px-4 py-1.5 rounded-lg">Dashboard</button>
            <button className="hover:text-slate-800 py-1.5">Location Details</button>
            <button className="hover:text-slate-800 py-1.5">India Overview</button>
          </div>
          <div className="relative">
            <Bell className="w-5 h-5 text-slate-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-6 space-y-6">
        
        {/* Banner Alert */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start justify-between">
          <div className="flex gap-3">
            <AlertTriangle className="text-red-500 w-5 h-5 mt-0.5" />
            <div>
              <h3 className="text-red-700 font-bold text-sm">Extreme Flood Warning - Assam</h3>
              <p className="text-red-600 text-sm">Critical flood conditions in Brahmaputra basin. Evacuation advisory in effect for 12 districts.</p>
            </div>
          </div>
          <button className="text-red-400 hover:text-red-600">×</button>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 bg-blue-600 rounded-2xl p-8 text-white relative overflow-hidden flex justify-between items-center">
            <div className="z-10">
              <h2 className="text-3xl font-bold mb-2">FloodGuard India Dashboard</h2>
              <p className="text-blue-100 mb-4 max-w-md">Real-time flood monitoring and early warning system for India. Track flood risks across states and get instant alerts.</p>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                24 Active Alerts
              </div>
            </div>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="white" strokeWidth="4" strokeDasharray="52, 100" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">52%</span>
                <span className="text-[10px] opacity-80 uppercase">National Risk</span>
              </div>
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-red-50 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-500" /></div>
              <span className="text-red-500 text-xs font-bold">↑</span>
            </div>
            <div>
              <div className="text-3xl font-bold">8</div>
              <div className="text-sm text-slate-500">Critical Alerts</div>
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-between">
            <div className="p-2 bg-orange-50 w-fit rounded-lg"><MapIcon className="w-5 h-5 text-orange-500" /></div>
            <div>
              <div className="text-3xl font-bold">18/28</div>
              <div className="text-sm text-slate-500">Affected States</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section>
          <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-slate-100 p-6 rounded-2xl flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><MapPin /></div>
              <div>
                <h4 className="font-bold">View Location Flood Details</h4>
                <p className="text-sm text-slate-500">Check flood conditions for a specific district or city in India</p>
              </div>
            </div>
            <div className="bg-blue-900 text-white p-6 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-blue-950 transition-colors">
              <div className="p-3 bg-blue-800 rounded-xl text-white"><MapIcon /></div>
              <div>
                <h4 className="font-bold">View India Flood Overview</h4>
                <p className="text-sm text-blue-200">National flood situation with state-wise risk analysis</p>
              </div>
            </div>
          </div>
        </section>

        {/* Current Situation */}
        <section>
          <h3 className="text-lg font-bold mb-4">Current Situation</h3>
          <div className="grid grid-cols-4 gap-6">
            <StatCard icon={CloudRain} label="Avg. Rainfall Today" value="156mm" subtext="Above normal" iconBg="bg-blue-50" />
            <StatCard icon={Activity} label="Disaster Impact" value="38%" subtext="Moderate severity" iconBg="bg-orange-50" />
            <StatCard icon={Users} label="Population Affected" value="4.5Cr" subtext="Across 18 states" iconBg="bg-indigo-50" />
            <StatCard icon={AlertTriangle} label="Severe Risk States" value="1" subtext="Assam" iconBg="bg-red-50" />
          </div>
        </section>

        {/* High Risk States */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">High Risk States</h3>
            <button className="text-sm text-blue-600 font-medium flex items-center gap-1">View All <ChevronRight size={16}/></button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <StateRiskCard name="Assam" percentage={85} districtsAffected="28 of 35 districts affected" rainfall="342mm" color="#ef4444" />
            <StateRiskCard name="Bihar" percentage={68} districtsAffected="22 of 38 districts affected" rainfall="285mm" color="#f97316" />
            <StateRiskCard name="West Bengal" percentage={62} districtsAffected="12 of 23 districts affected" rainfall="258mm" color="#f59e0b" />
            <StateRiskCard name="Kerala" percentage={71} districtsAffected="10 of 14 districts affected" rainfall="312mm" color="#f97316" />
            <StateRiskCard name="Odisha" percentage={65} districtsAffected="18 of 30 districts affected" rainfall="268mm" color="#f97316" />
          </div>
        </section>

        <footer className="text-center pt-8 text-xs text-slate-400 space-y-1">
          <p>Data updated every 15 minutes • Source: India Meteorological Department</p>
          <p>© 2024 FloodGuard India Early Warning System</p>
        </footer>
      </main>
    </div>
  );
}