export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  url: string;
  title: string;
  mrp: number;
  sale_price: number;
  discount: string;
  condition: string;
  storage: string;
  ram?: string;
  color?: string;
  image_url?: string;
  last_checked: string;
  price_history: PriceEntry[];
  created_at: string;
  updated_at: string;
  is_out_of_stock?: boolean;
}

export interface PriceEntry {
  price: number;
  checked_at: string;
}

export interface PriceAlert {
  id: string;
  product_id: string;
  user_id: string;
  target_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScrapedData {
  title: string;
  mrp: number;
  sale_price: number;
  discount: string;
  condition: string;
  storage: string;
  ram?: string;
  color?: string;
  image_url?: string;
  is_out_of_stock?: boolean;
}