import { Review } from './review';

export interface Activity {
  id: string;
  date: string;
  name: string;
  phoneNumber?: string;
  website?: string;
  openingHours?: string[];
  photos?: string[];
  reviews?: Review[];
  briefDescription?: string;
  geometry: {
    location: { lat: number; lng: number };
    viewport: { northeast: { lat: number; lng: number }; southwest: { lat: number; lng: number } };
  };
}