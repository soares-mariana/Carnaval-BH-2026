
import React from 'react';

interface InfoScreenProps {
  onStart: () => void;
}

const InfoScreen: React.FC<InfoScreenProps> = ({ onStart }) => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header className="text-center space-y-4">
        <div className="bg-yellow-400 w-24 h-24 rounded-3xl mx-auto flex items-center justify-center text-5xl shadow-lg rotate-3">🎭</div>
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">Carnaval BH:<br/><span className="text-blue-600">Guia de Folia</span></h1>
        <p className="text-gray-600 font-medium">Seu mentor digital para o Carnaval</p>
      </header>

      <section className="space-y-6">
        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
          <h2 className="font-bold text-blue-800 mb-2 flex items-center">
            <span className="mr-2">🏠</span> Visão Geral
          </h2>
          <p className="text-sm text-blue-700 leading-relaxed">
            Este app foi planejado para o folião que não quer perder tempo. Ele organiza seus blocos preferidos em uma rota lógica, partindo do seu hotel.
          </p>
        </div>

        <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100">
          <h2 className="font-bold text-purple-800 mb-2 flex items-center">
            <span className="mr-2">🏗️</span> Arquitetura (O Segredo)
          </h2>
          <p className="text-sm text-purple-700 leading-relaxed mb-3">
            Imagine que o app é um <strong>Garçom</strong>:
          </p>
          <ul className="text-xs text-purple-800 space-y-2 list-disc pl-4">
            <li><strong>Interface (O Prato):</strong> O que você vê na tela (React/SwiftUI).</li>
            <li><strong>Lógica (A Receita):</strong> O código que calcula a melhor rota.</li>
            <li><strong>Dados (A Despensa):</strong> Onde guardamos seu hotel e blocos.</li>
          </ul>
        </div>

        <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
          <h2 className="font-bold text-green-800 mb-2 flex items-center">
            <span className="mr-2">🗺️</span> Mapas e Rotas
          </h2>
          <p className="text-sm text-green-700 leading-relaxed">
            Para o iPhone, recomendamos o <strong>Apple Maps (MapKit)</strong>: ele é grátis para desenvolvedores iniciantes, gasta menos bateria e já vem no celular.
          </p>
        </div>
      </section>

      <button 
        onClick={onStart}
        className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 active:scale-95 transition-transform"
      >
        Começar meu Planejamento
      </button>

      <footer className="text-center">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Projetado por um Arquiteto Sênior para Você</p>
      </footer>
    </div>
  );
};

export default InfoScreen;
