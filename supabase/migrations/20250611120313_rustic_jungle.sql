/*
  # Add Price Alert System

  1. New Tables
    - `price_alerts`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key to products)
      - `user_id` (uuid, foreign key to auth.users)
      - `target_price` (numeric, price threshold)
      - `is_active` (boolean, whether alert is active)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. New Columns
    - Add `color` column to products table
    - Add `ram` column to products table

  3. Security
    - Enable RLS on `price_alerts` table
    - Add policies for users to manage their own alerts
*/

-- Add new columns to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'color'
  ) THEN
    ALTER TABLE products ADD COLUMN color text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'ram'
  ) THEN
    ALTER TABLE products ADD COLUMN ram text DEFAULT '';
  END IF;
END $$;

-- Create price_alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  target_price numeric NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for price_alerts
CREATE POLICY "Users can manage their own price alerts"
  ON price_alerts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS price_alerts_product_id_idx ON price_alerts(product_id);
CREATE INDEX IF NOT EXISTS price_alerts_user_id_idx ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS price_alerts_active_idx ON price_alerts(is_active) WHERE is_active = true;