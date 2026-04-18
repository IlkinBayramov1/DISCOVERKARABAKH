import React from 'react';
import { Bell, Search, Globe, Settings as SettingsIcon } from 'lucide-react';

const TopHeader: React.FC = () => {
    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-10 sticky top-0 z-20 w-full transition-all duration-300">
            {/* Search Section */}
            <div className="flex items-center gap-3 text-slate-400 bg-slate-50/50 px-4 py-2.5 rounded-xl border border-slate-100 w-[420px] focus-within:border-indigo-200 focus-within:bg-white focus-within:shadow-sm focus-within:shadow-indigo-100/20 transition-all duration-300 group">
                <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="İstifadəçi, mülk və ya tranzaksiya axtar..." 
                    className="bg-transparent border-none outline-none text-[13.5px] w-full text-slate-700 placeholder-slate-400 font-medium"
                />
                <div className="flex items-center gap-1.5 opacity-0 group-focus-within:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-slate-300 border border-slate-200 px-1.5 py-0.5 rounded-md uppercase">Esc</span>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
                <button className="p-2.5 text-slate-400 hover:text-indigo-600 transition-all rounded-xl hover:bg-indigo-50/50">
                    <Globe className="w-[18px] h-[18px] stroke-[1.8]" />
                </button>
                <button className="p-2.5 text-slate-400 hover:text-indigo-600 transition-all rounded-xl hover:bg-indigo-50/50">
                    <SettingsIcon className="w-[18px] h-[18px] stroke-[1.8]" />
                </button>
                <div className="w-px h-6 bg-slate-200 mx-2"></div>
                <button className="relative p-2.5 text-slate-400 hover:text-indigo-600 transition-all rounded-xl hover:bg-indigo-50/50">
                    <Bell className="w-[18px] h-[18px] stroke-[1.8]" />
                    <span className="absolute top-[11px] right-[11px] w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
                </button>
            </div>
        </header>
    );
};

export default TopHeader;
