import { Painting } from "@/data/paintings";

export interface CartItem {
  painting?: Painting;
  customImage?: string;
  size: string;
  frame: string;
  price: number;
  name: string;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  whatsapp: string;
  address: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
}

export type Screen = 
  | "splash"
  | "home"
  | "gallery"
  | "details"
  | "custom"
  | "cart"
  | "customer"
  | "success";
