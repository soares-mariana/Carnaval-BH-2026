
import React, { useState, useEffect } from 'react';
import { TransportMode, Hotel, Bloquinho, AppState } from './types';
import Home from './screens/Home';
import RegisterHotel from './screens/RegisterHotel';
import RegisterBloquinho from './screens/RegisterBloquinho';
import Schedule from './screens/Schedule';
import InfoScreen from './screens/InfoScreen';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'home' | 'hotel' | 'bloco' | 'itinerary' | 'info'>('info');
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem('carnaval_bh_data');
    return saved ? JSON.parse(saved) : {
      hotel: null,
      bloquinhos: [],
      selectedMode: TransportMode.WALKING
    };
  });

  useEffect(() => {
    localStorage.setItem('carnaval_bh_data', JSON.stringify(appState));
  }, [appState]);

  const addBloquinho = (bloco: Bloquinho) => {
    setAppState(prev => {
      const newBloquinhos = [...prev.bloquinhos, bloco].sort((a, b) => {
        // Ordenação inteligente: Primeiro por data, depois por hora
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      });
      return { ...prev, bloquinhos: newBloquinhos };
    });
    setCurrentTab('home');
  };

  const setHotel = (hotel: Hotel) => {
    setAppState(prev => ({ ...prev, hotel }));
    setCurrentTab('home');
  };

  const removeBloquinho = (id: string) => {
    setAppState(prev => ({
      ...prev,
      bloquinhos: prev.bloquinhos.filter(b => b.id !== id)
    }));
  };

  const renderScreen = () => {
    switch (currentTab) {
      case 'info': return <InfoScreen onStart={() => setCurrentTab('home')} />;
      case 'home': return <Home appState={appState} onRemove={removeBloquinho} />;
      case 'hotel': return <RegisterHotel onSave={setHotel} initialValue={appState.hotel} />;
      case 'bloco': return <RegisterBloquinho onSave={addBloquinho} />;
      case 'itinerary': return <Schedule appState={appState} />;
      default: return <Home appState={appState} onRemove={removeBloquinho} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white border-x border-gray-200 overflow-hidden relative">
      <main className="flex-1 overflow-y-auto pb-20">
        {renderScreen()}
      </main>

      {currentTab !== 'info' && (
        <nav className="ios-tab-bar absolute bottom-0 left-0 right-0 h-20 border-t border-gray-200 flex items-center justify-around px-4 pb-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <TabButton active={currentTab === 'home'} onClick={() => setCurrentTab('home')} label="Mapa" icon="📍" />
          <TabButton active={currentTab === 'hotel'} onClick={() => setCurrentTab('hotel')} label="Hotel" icon="🏨" />
          <TabButton active={currentTab === 'bloco'} onClick={() => setCurrentTab('bloco')} label="Blocos" icon="🎉" />
          <TabButton active={currentTab === 'itinerary'} onClick={() => setCurrentTab('itinerary')} label="Roteiro" icon="📅" />
        </nav>
      )}
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: string }> = ({ active, onClick, label, icon }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center space-y-1 transition-all ${active ? 'text-blue-600 scale-110' : 'text-gray-400'}`}>
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

export default App;
