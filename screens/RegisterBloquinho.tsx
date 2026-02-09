
import React, { useState } from 'react';
import { Bloquinho } from '../types';

interface Props {
  onSave: (bloco: Bloquinho) => void;
}

const RegisterBloquinho: React.FC<Props> = ({ onSave }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('2025-03-01');
  const [time, setTime] = useState('10:00');
  const [musicStyle, setMusicStyle] = useState('');
  const [notes, setNotes] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);

  const searchAddress = async () => {
    if (!address) return;
    setIsSearching(true);
    try {
      const query = encodeURIComponent(`${address}, Belo Horizonte, MG, Brasil`);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
      const data = await response.json();

      if (data && data.length > 0) {
        setCoords({
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon)
        });
      } else {
        alert("Endereço do bloco não encontrado. Tente algo como 'Praça da Liberdade' ou 'Rua Sapucaí'.");
      }
    } catch (error) {
      alert("Erro na busca. Tente novamente.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !date) return;

    if (!coords) {
      alert("Clique em 'Buscar' para localizar o bloco no mapa primeiro!");
      return;
    }

    onSave({
      id: Math.random().toString(36).substr(2, 9),
      name,
      address,
      date,
      startTime: time,
      endTime: time,
      latitude: coords.lat,
      longitude: coords.lon,
      musicStyle,
      notes
    });
  };

  return (
    <div className="p-6 space-y-8 h-full bg-white">
      <header className="space-y-2">
        <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-2xl mb-2">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800">Novo Bloquinho</h2>
        <p className="text-sm text-gray-500">Adicione os detalhes da festa!</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5 pb-10">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-pink-600 tracking-widest ml-1">Nome do Bloco</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Baianas Ozadas"
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-pink-600 tracking-widest ml-1">Onde vai ser? (BH)</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setCoords(null);
              }}
              placeholder="Ex: Praça da Estação"
              className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none"
            />
            <button 
              type="button"
              onClick={searchAddress}
              disabled={isSearching}
              className={`px-4 rounded-2xl font-bold text-[10px] uppercase transition-all ${coords ? 'bg-green-500 text-white' : 'bg-pink-500 text-white shadow-md'}`}
            >
              {isSearching ? '...' : coords ? 'Encontrado' : 'Buscar'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-pink-600 tracking-widest ml-1">Data</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-pink-600 tracking-widest ml-1">Horário</label>
            <input 
              type="time" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-pink-600 tracking-widest ml-1">Estilo Musical</label>
          <input 
            type="text" 
            value={musicStyle}
            onChange={(e) => setMusicStyle(e.target.value)}
            placeholder="Ex: Axé, Samba, Rock..."
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-pink-600 tracking-widest ml-1">Observações</label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ponto de encontro, fantasias..."
            rows={2}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none resize-none"
          />
        </div>

        <button 
          type="submit"
          className={`w-full py-4 font-bold rounded-2xl shadow-lg transition-all ${coords ? 'bg-pink-500 text-white shadow-pink-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          Salvar Bloquinho
        </button>
      </form>
    </div>
  );
};

export default RegisterBloquinho;
