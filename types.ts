
export enum TransportMode {
  WALKING = 'caminhada',
  TRANSIT = 'transporte_publico',
  DRIVING = 'carro'
}

export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface Hotel extends Location {}

export interface Bloquinho extends Location {
  date: string; // Formato YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;
  musicStyle?: string; // NOVO: Estilo musical (opcional)
  notes?: string;      // NOVO: Alguma observação (opcional)
}

export interface AppState {
  hotel: Hotel | null;
  bloquinhos: Bloquinho[];
  selectedMode: TransportMode;
}
