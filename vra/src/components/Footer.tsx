export default function Footer() {
    return (
        <footer className="bg-blue-950 text-white py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">FloodWatch India</h3>
                        <p className="text-slate-400 text-sm">
                            Real-time early warning system for flood monitoring and disaster management across India.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
                        <ul className="text-slate-400 text-sm space-y-2">
                            <li>National Disaster Helpline: 1078</li>
                            <li>Police: 100</li>
                            <li>Ambulance: 102</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Resources</h3>
                        <ul className="text-slate-400 text-sm space-y-2">
                            <li>Disaster Guides</li>
                            <li>Shelter Locations</li>
                            <li>Volunteer Register</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-blue-900 text-center text-blue-200 text-sm">
                    &copy; {new Date().getFullYear()} FloodWatch India. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
