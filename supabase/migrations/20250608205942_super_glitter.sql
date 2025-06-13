/*
  # Create products table for price tracking

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `url` (text, product URL)
      - `title` (text, product title)
      - `mrp` (numeric, maximum retail price)
      - `sale_price` (numeric, current sale price)
      - `discount` (text, discount percentage)
      - `condition` (text, product condition)
      - `storage` (text, storage capacity)
      - `image_url` (text, product image URL)
      - `last_checked` (timestamptz, last price check)
      - `price_history` (jsonb, array of price entries)
      - `created_at` (timestamptz, when tracking started)
      - `updated_at` (timestamptz, last updated)

  2. Security
    - Enable RLS on `products` table
    - Add policy for users to manage their own products
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  title text NOT NULL,
  mrp numeric NOT NULL DEFAULT 0,
  sale_price numeric NOT NULL DEFAULT 0,
  discount text DEFAULT '0%',
  condition text DEFAULT 'Unknown',
  storage text DEFAULT '',
  image_url text,
  last_checked timestamptz DEFAULT now(),
  price_history jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own products"
  ON products
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS products_user_id_idx ON products(user_id);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products(created_at DESC);