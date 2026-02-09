
import React, { useState } from 'react';
import { Hotel } from '../types';

interface Props {
  onSave: (hotel: Hotel) => void;
  initialValue: Hotel | null;
}

const RegisterHotel: React.FC<Props> = ({ onSave, initialValue }) => {
  const [name, setName] = useState(initialValue?.name || '');
  const [address, setAddress] = useState(initialValue?.address || '');
  const [isSearching, setIsSearching] = useState(false);
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(
    initialValue ? { lat: initialValue.latitude, lon: initialValue.longitude } : null
  );

  const searchAddress = async () => {
    if (!address) return;
    setIsSearching(true);
    try {
      // Buscamos o endereço especificamente em Belo Horizonte para maior precisão
      const query = encodeURIComponent(`${address}, Belo Horizonte, MG, Brasil`);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
      const data = await response.json();

      if (data && data.length > 0) {
        setCoords({
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon)
        });
        // Atualiza o endereço para o nome oficial encontrado, se desejar
        // setAddress(data[0].display_name);
      } else {
        alert("Local não encontrado em BH. Tente ser mais específico (ex: nome da rua e número).");
      }
    } catch (error) {
      alert("Erro ao buscar localização. Verifique sua conexão.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;
    
    if (!coords) {
      alert("Por favor, clique em 'Validar Endereço' primeiro para garantir a precisão no mapa!");
      return;
    }

    onSave({
      id: initialValue?.id || Math.random().toString(36).substr(2, 9),
      name,
      address,
      latitude: coords.lat,
      longitude: coords.lon
    });
  };

  return (
    <div className="p-6 space-y-8 h-full bg-white">
      <header className="space-y-2">
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl mb-2">🏨</div>
        <h2 className="text-2xl font-bold text-gray-800">Seu QG na Folia</h2>
        <p className="text-sm text-gray-500">Onde você vai descansar entre um bloco e outro?</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-blue-600 tracking-widest ml-1">Nome do Hotel / Casa</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Ibis Savassi, Casa da Vovó..."
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-blue-600 tracking-widest ml-1">Endereço em BH</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setCoords(null); // Reseta se mudar o texto
              }}
              placeholder="Ex: Rua Bahia, 1000"
              className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <button 
              type="button"
              onClick={searchAddress}
              disabled={isSearching}
              className={`px-4 rounded-2xl font-bold text-xs uppercase transition-all ${coords ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white shadow-md'}`}
            >
              {isSearching ? '...' : coords ? '✓ OK' : 'Validar'}
            </button>
          </div>
        </div>

        <button 
          type="submit"
          className={`w-full py-4 font-bold rounded-2xl shadow-lg transition-all ${coords ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          {initialValue ? 'Atualizar Localização' : 'Definir meu QG'}
        </button>
      </form>

      {coords && (
        <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex gap-3 animate-in slide-in-from-bottom-2">
          <span className="text-lg">📍</span>
          <div>
            <p className="text-xs font-bold text-green-800 uppercase">Localização Confirmada!</p>
            <p className="text-[10px] text-green-700 leading-relaxed">
              Encontramos o ponto exato para o seu mapa. Agora o cálculo das rotas será ultra preciso.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterHotel;
