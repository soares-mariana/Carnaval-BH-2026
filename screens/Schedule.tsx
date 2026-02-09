
import React from 'react';
import { AppState } from '../types';

interface Props {
  appState: AppState;
}

const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-');
  const dates: Record<string, string> = { '01': 'Sábado', '02': 'Domingo', '03': 'Segunda', '04': 'Terça' };
  return `${day}/${month} (${dates[day] || 'Dia'})`;
};

const Schedule: React.FC<Props> = ({ appState }) => {
  const { hotel, bloquinhos } = appState;

  if (!hotel && bloquinhos.length === 0) {
    return (
      <div className="p-8 text-center h-full flex flex-col justify-center items-center space-y-4 text-gray-400">
        <div className="text-6xl animate-bounce">🗓️</div>
        <p>Roteiro vazio por enquanto...</p>
      </div>
    );
  }

  const groupedByDay = bloquinhos.reduce((acc, bloco) => {
    if (!acc[bloco.date]) acc[bloco.date] = [];
    acc[bloco.date].push(bloco);
    return acc;
  }, {} as Record<string, typeof bloquinhos>);

  const sortedDates = Object.keys(groupedByDay).sort();

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-full pb-24">
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Cronograma</h2>
          <p className="text-xs text-gray-500 italic">Dica: Seus dados estão salvos no seu celular!</p>
        </div>
      </header>

      {sortedDates.map((date) => (
        <div key={date} className="space-y-4">
          <h3 className="bg-blue-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full inline-block shadow-md">
            {formatDate(date)}
          </h3>

          <div className="relative space-y-6 before:content-[''] before:absolute before:left-[1.35rem] before:top-4 before:bottom-4 before:w-0.5 before:bg-blue-100">
            {groupedByDay[date].map((bloco, index) => (
              <div key={bloco.id} className="relative flex gap-4 items-start pl-1">
                <div className="z-10 w-6 h-6 rounded-full bg-pink-500 border-4 border-white shadow-md flex-shrink-0" />
                <div className="flex-1 -mt-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black text-pink-500 uppercase tracking-tighter">Bloco {index + 1}</span>
                    <span className="text-[10px] font-bold text-gray-400">⏰ {bloco.startTime}</span>
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm leading-tight">{bloco.name}</h4>
                  
                  {/* LOCALIZAÇÃO ESCRITA NO CRONOGRAMA */}
                  <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                    <span className="text-gray-400">📍</span> {bloco.address}
                  </p>
                  
                  {bloco.musicStyle && (
                    <p className="text-[10px] text-purple-500 font-bold mt-2 italic">🎸 {bloco.musicStyle}</p>
                  )}

                  {bloco.notes && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                      <p className="text-[10px] text-yellow-800 leading-relaxed font-medium">
                        <span className="mr-1 font-bold">📝 Nota:</span> {bloco.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Schedule;
