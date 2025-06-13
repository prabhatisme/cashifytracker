/*
  # Add out of stock tracking

  1. New Columns
    - Add `is_out_of_stock` column to products table

  2. Updates
    - Add default value for existing products
*/

-- Add is_out_of_stock column to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'is_out_of_stock'
  ) THEN
    ALTER TABLE products ADD COLUMN is_out_of_stock boolean DEFAULT false;
  END IF;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS products_out_of_stock_idx ON products(is_out_of_stock) WHERE is_out_of_stock = true;