
import React, { useEffect, useRef, useState } from 'react';
import { AppState, Bloquinho } from '../types';

interface HomeProps {
  appState: AppState;
  onRemove: (id: string) => void;
}

const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}`;
};

const Home: React.FC<HomeProps> = ({ appState, onRemove }) => {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const routesGroupRef = useRef<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const focusOnLocation = (lat: number, lng: number, id: string) => {
    setSelectedId(id);
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], 16, {
        duration: 1.5
      });
      if (markersRef.current[id]) {
        markersRef.current[id].openPopup();
      }
    }
  };

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = (window as any).L.map('map-container', {
        zoomControl: false
      }).setView([-19.9245, -43.9352], 14);
      
      (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);

      (window as any).L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
    }

    // Limpeza de elementos antigos
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};
    if (routesGroupRef.current) routesGroupRef.current.remove();
    
    routesGroupRef.current = (window as any).L.featureGroup().addTo(mapRef.current);

    // 1. Adiciona o Hotel (O Centro da Estrela)
    if (appState.hotel) {
      const isHotelSelected = selectedId === 'hotel';
      const hotelIcon = (window as any).L.divIcon({
        html: `<div class="relative">
                <div class="absolute -inset-2 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
                <div class="bg-white p-2 rounded-full shadow-lg border-2 border-blue-500 text-xl relative z-10 transform transition-transform ${isHotelSelected ? 'scale-125' : ''}">🏨</div>
               </div>`,
        className: 'custom-div-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });
      
      const marker = (window as any).L.marker([appState.hotel.latitude, appState.hotel.longitude], { icon: hotelIcon })
        .addTo(mapRef.current)
        .bindPopup(`<b>Meu QG:</b><br>${appState.hotel.name}<br><span style="font-size: 10px; color: #666">${appState.hotel.address}</span>`);
      
      markersRef.current['hotel'] = marker;

      // 2. Cria rotas saindo DO HOTEL para cada BLOQUINHO
      appState.bloquinhos.forEach(bloco => {
        const isSelected = selectedId === bloco.id;
        
        // Criar a linha Hotel -> Bloco
        const routePoints: [number, number][] = [
          [appState.hotel!.latitude, appState.hotel!.longitude],
          [bloco.latitude, bloco.longitude]
        ];

        const polyline = (window as any).L.polyline(routePoints, {
          color: isSelected ? '#3b82f6' : '#ec4899', // Azul se selecionado, Rosa se não
          weight: isSelected ? 5 : 2,
          opacity: isSelected ? 1 : 0.3,
          dashArray: isSelected ? null : '5, 10', // Pontilhado se não selecionado
          lineJoin: 'round'
        }).addTo(routesGroupRef.current);

        // Adiciona o Marcador do Bloco
        const blocoIcon = (window as any).L.divIcon({
          html: `<div class="bg-white p-2 rounded-full shadow-lg border-2 ${isSelected ? 'border-yellow-400 scale-125 z-50' : 'border-pink-500'} text-xl transition-all">🎉</div>`,
          className: 'custom-div-icon',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        const marker = (window as any).L.marker([bloco.latitude, bloco.longitude], { icon: blocoIcon })
          .addTo(mapRef.current)
          .bindPopup(`<b>${bloco.name}</b><br><span style="font-size: 10px; color: #666">${bloco.address}</span>`);
        
        markersRef.current[bloco.id] = marker;
      });
    }

    // Ajuste de zoom inicial
    if (!selectedId && (appState.hotel || appState.bloquinhos.length > 0)) {
      const markers = Object.values(markersRef.current);
      if (markers.length > 0) {
        const group = new (window as any).L.featureGroup(markers);
        mapRef.current.fitBounds(group.getBounds().pad(0.3));
      }
    }
  }, [appState.hotel, appState.bloquinhos, selectedId]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="h-2/5 relative shadow-inner">
        <div id="map-container" className="z-10"></div>
        {selectedId && (
          <button 
            onClick={() => setSelectedId(null)}
            className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-[10px] font-black text-blue-600 uppercase tracking-widest"
          >
            Ver Mapa Geral
          </button>
        )}
      </div>

      <div className="flex-1 p-5 space-y-4 overflow-y-auto rounded-t-3xl bg-gray-50 -mt-6 z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <header className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-black text-gray-800 tracking-tight">Caminhos da Folia</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Saindo sempre do seu QG</p>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
               Offline
             </span>
          </div>
        </header>

        {appState.hotel && (
          <div 
            onClick={() => focusOnLocation(appState.hotel!.latitude, appState.hotel!.longitude, 'hotel')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${selectedId === 'hotel' ? 'bg-blue-600 border-blue-700 shadow-blue-200 shadow-lg scale-[1.02]' : 'bg-white border-blue-100'}`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0 ${selectedId === 'hotel' ? 'bg-white/20 text-white' : 'bg-blue-500 text-white'}`}>🏨</div>
              <div className="flex-1">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedId === 'hotel' ? 'text-blue-100' : 'text-blue-500'}`}>Seu QG (Ponto de Partida)</p>
                <h3 className={`font-bold text-sm ${selectedId === 'hotel' ? 'text-white' : 'text-gray-800'}`}>{appState.hotel.name}</h3>
                <p className={`text-[11px] mt-1 ${selectedId === 'hotel' ? 'text-blue-100' : 'text-gray-500'}`}>📍 {appState.hotel.address}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3 pb-8">
          {appState.bloquinhos.map((bloco) => {
            const isSelected = selectedId === bloco.id;
            return (
              <div 
                key={bloco.id} 
                onClick={() => focusOnLocation(bloco.latitude, bloco.longitude, bloco.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 shadow-sm ${isSelected ? 'bg-pink-500 border-pink-600 shadow-pink-200 shadow-lg scale-[1.02]' : 'bg-white border-gray-100 hover:border-pink-200'}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-pink-50 text-pink-500'}`}>
                    🎉
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-gray-800'}`}>{bloco.name}</h3>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-pink-50 text-pink-500'}`}>
                        {formatDate(bloco.date)}
                      </span>
                    </div>
                    
                    <p className={`text-[11px] mt-1 font-medium ${isSelected ? 'text-pink-100' : 'text-gray-500'}`}>
                      📍 {bloco.address}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-[10px] font-bold ${isSelected ? 'text-pink-100' : 'text-gray-400'}`}>⏰ {bloco.startTime}</span>
                      <span className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-blue-600'}`}>
                        {isSelected ? '← Rota Ativa' : '→ Ver Rota'}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(bloco.id);
                    }} 
                    className={`px-2 ${isSelected ? 'text-white/60 hover:text-white' : 'text-gray-300 hover:text-red-400'}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
