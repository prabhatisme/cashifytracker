/*
  # Add Cron Job for Hourly Price Updates

  1. New Features
    - Creates a cron job that runs every hour to update product prices
    - Automatically calls the update-prices edge function
    - Ensures all tracked products stay up-to-date

  2. Security
    - Uses pg_cron extension for reliable scheduling
    - Runs with appropriate permissions
*/

-- Enable the pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a cron job that runs every hour to update product prices
SELECT cron.schedule(
  'update-product-prices',
  '0 * * * *', -- Run at the start of every hour
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/update-prices',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
    ),
    body := '{}'::jsonb
  );
  $$
);