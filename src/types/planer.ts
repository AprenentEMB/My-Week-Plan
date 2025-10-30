export type Activity = {
  id: string;
  titol: string;
  descripcio?: string;
  dia: 'dilluns' | 'dimarts' | 'dimecres' | 'dijous' | 'divendres' | 'dissabte' | 'diumenge';
  temps: string; // Format HH:MM
  durada: number; // Durada en minuts
  completat: boolean;
};
