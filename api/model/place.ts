import { Review } from './review';

export interface Place {
  id: string;
  name: string;
  phoneNumber?: string;
  website?: string;
  openingHours?: string[];
  photos?: string[];
  reviews?: Review[];
  types: string[];
  formatted_address: string;
  briefDescription?: string;
  geometry: {
    location: { lat: number; lng: number };
    viewport: { northeast: { lat: number; lng: number }; southwest: { lat: number; lng: number } };
  };
}