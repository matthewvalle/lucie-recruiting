import { useState } from 'react';
import type { UserProfile } from '../lib/auth';
import DashboardHome from './tabs/DashboardHome';
import ProgramsTab from './tabs/ProgramsTab';
import CoachesTab from './tabs/CoachesTab';
import EventsTab from './tabs/EventsTab';
import TimelineTab from './tabs/TimelineTab';
import ContactLogTab from './tabs/ContactLogTab';
import IntelTab from './tabs/IntelTab';

interface DashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

const TABS = [
  { id: 'home', label: 'Overview', icon: '□' },
  { id: 'programs', label: 'Programs', icon: '□' },
  { id: 'coaches', label: 'Coaches', icon: '□' },
  { id: 'events', label: 'Events', icon: '□' },
  { id: 'timeline', label: 'Timeline', icon: '□' },
  { id: 'contacts', label: 'Contact Log', icon: '□' },
  { id: 'intel', label: 'Intel', icon: '□' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome onNavigate={setActiveTab} />;
      case 'programs':
        return <ProgramsTab />;
      case 'coaches':
        return <CoachesTab />;
      case 'events':
        return <EventsTab />;
      case 'timeline':
        return <TimelineTab />;
      case 'contacts':
        return <ContactLogTab />;
      case 'intel':
        return <IntelTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <header className="bg-navy shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">LV</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-semibold text-lg">Lucie Valle</h1>
                <p className="text-white/60 text-xs -mt-0.5">Recruiting Dashboard</p>
              </div>
            </div>

            {/* Desktop Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <span className="text-white/70 text-sm hidden sm:block">
                {user.name}
              </span>
              <button
                onClick={onLogout}
                className="text-white/60 hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                Sign out
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-white/10 px-4 py-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'text-white/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">{renderTab()}</main>
    </div>
  );
}
