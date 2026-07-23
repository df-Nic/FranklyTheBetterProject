import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { CONTACTS_DATA } from '../data/contacts';
import { ArrowLeft, Search, User, FileText, ChevronRight } from 'lucide-react';
import BackgroundOrb from '../components/ui/BackgroundOrb';

const PayNowContactsPage = () => {
  const { navigate, setPaynowContact } = useApp();
  const [activeTab, setActiveTab] = useState('nric'); // 'nric' (for NRIC/FIN) or 'uen' (for UEN/VPA)
  const [searchQuery, setSearchQuery] = useState('');

  // Handle contact selection
  const handleSelectContact = (contact) => {
    setPaynowContact(contact);
    navigate('paynow-amount');
  };

  // Filter contacts by type and search query
  const filteredContacts = CONTACTS_DATA.filter((contact) => {
    const matchesTab = contact.type === activeTab;
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      (contact.vpa && contact.vpa.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesTab && (searchQuery ? matchesSearch : true);
  });

  return (
    <div className="flex-1 w-full bg-[#F5F5F7] flex flex-col relative overflow-hidden select-none">
      {/* Background Orbs */}
      <BackgroundOrb color="pink" size="300px" className="-top-12 -right-12" />
      <BackgroundOrb color="peach" size="250px" className="top-1/3 -left-12" />

      {/* Header */}
      <header className="pt-6 pb-4 h-auto w-full bg-white/40 backdrop-blur-xl border-b border-white/30 px-4 flex items-center justify-between z-40 shrink-0 sticky top-0">
        <button
          onClick={() => navigate('home')}
          className="w-9 h-9 rounded-full bg-white border border-zinc-200/60 flex items-center justify-center text-zinc-700 active:scale-95 transition-all duration-150 cursor-pointer"
        >
          <ArrowLeft className="w-[18px] h-[18px] stroke-[2.5]" />
        </button>
        <h2 className="text-base font-black text-zinc-950 tracking-tight">PayNow</h2>
        <div className="w-9 h-9" /> {/* Spacer for centering */}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden z-10">
        {/* NRIC/FIN and UEN/VPA selection icons */}
        <div className="flex justify-center items-center gap-12 py-6 shrink-0">
          {/* NRIC/FIN Tab Button */}
          <button
            onClick={() => setActiveTab('nric')}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div
              className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300 relative ${
                activeTab === 'nric'
                  ? 'bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/20 scale-105'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 active:scale-95'
              }`}
            >
              <User className={`w-6 h-6 ${activeTab === 'nric' ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
              {activeTab === 'nric' && (
                <span className="absolute -bottom-1 w-2.5 h-2.5 bg-brand-primary rotate-45" />
              )}
            </div>
            <span
              className={`text-[11px] font-bold tracking-tight transition-colors ${
                activeTab === 'nric' ? 'text-zinc-900' : 'text-zinc-500'
              }`}
            >
              NRIC/FIN
            </span>
          </button>

          {/* UEN/VPA Tab Button */}
          <button
            onClick={() => setActiveTab('uen')}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div
              className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300 relative ${
                activeTab === 'uen'
                  ? 'bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/20 scale-105'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 active:scale-95'
              }`}
            >
              <FileText className={`w-6 h-6 ${activeTab === 'uen' ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
              {activeTab === 'uen' && (
                <span className="absolute -bottom-1 w-2.5 h-2.5 bg-brand-primary rotate-45" />
              )}
            </div>
            <span
              className={`text-[11px] font-bold tracking-tight transition-colors ${
                activeTab === 'uen' ? 'text-zinc-900' : 'text-zinc-500'
              }`}
            >
              UEN/VPA
            </span>
          </button>
        </div>

        {/* Contacts Container Card - rounded top edge */}
        <div className="flex-1 bg-white rounded-t-[28px] border-t border-zinc-200/50 shadow-[0_-8px_30px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden">
          {/* Search Box */}
          <div className="p-4 shrink-0 border-b border-zinc-100">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 stroke-[2.2]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'nric' ? 'Search by name or mobile number' : 'Search by name or UEN/VPA'}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-brand-accent/50 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-2 divide-y divide-zinc-100">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  whileTap={{ backgroundColor: '#F8F9FA' }}
                  onClick={() => handleSelectContact(contact)}
                  className="flex items-center gap-4 py-3.5 px-3 cursor-pointer rounded-xl transition-all"
                >
                  {/* Initials Avatar */}
                  <div className="w-11 h-11 rounded-full bg-slate-500/10 border border-slate-500/5 flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-slate-700 tracking-tight">
                      {contact.initials}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-zinc-900 truncate tracking-tight">
                      {contact.name}
                    </h4>
                    <p className="text-[10px] font-semibold text-zinc-400 mt-0.5 tracking-tight truncate">
                      {contact.phone} {contact.vpa && `• ${contact.vpa}`}
                    </p>
                  </div>

                  {/* Arrow Indicator */}
                  <ChevronRight className="w-4 h-4 text-zinc-300 stroke-[2]" />
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-3">
                  <User className="w-6 h-6 text-zinc-300" />
                </div>
                <p className="text-xs font-bold text-zinc-700">No contacts found</p>
                <p className="text-[10px] text-zinc-400 mt-1 max-w-[180px] leading-normal">
                  Try searching with a different name or number.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayNowContactsPage;
