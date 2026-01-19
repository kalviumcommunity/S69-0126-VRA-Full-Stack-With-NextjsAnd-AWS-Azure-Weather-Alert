import Link from 'next/link';
import { Menu, AlertTriangle } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                            <AlertTriangle className="h-8 w-8 text-blue-600" />
                            <span className="font-bold text-xl text-blue-900">FloodWatch India</span>
                        </Link>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                        <Link href="/" className="border-transparent text-gray-500 hover:border-blue-300 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                            Dashboard
                        </Link>
                        <Link href="/location" className="border-transparent text-gray-500 hover:border-blue-300 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                            Location Details
                        </Link>
                        <Link href="/overview" className="border-transparent text-gray-500 hover:border-blue-300 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                            National Overview
                        </Link>
                    </div>
                    <div className="flex items-center sm:hidden">
                        <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                            <span className="sr-only">Open main menu</span>
                            <Menu className="block h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
