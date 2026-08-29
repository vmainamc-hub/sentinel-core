CREATE TABLE public.trades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  deriv_account_id UUID,
  loginid TEXT,
  contract_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  contract_type TEXT NOT NULL,
  stake NUMERIC,
  duration INTEGER,
  duration_unit TEXT,
  barrier TEXT,
  entry_price NUMERIC,
  exit_price NUMERIC,
  payout NUMERIC,
  profit NUMERIC,
  status TEXT NOT NULL DEFAULT 'open',
  is_virtual BOOLEAN NOT NULL DEFAULT true,
  purchased_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trades TO authenticated;
GRANT ALL ON public.trades TO service_role;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own trades" ON public.trades FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX trades_user_contract_idx ON public.trades (user_id, contract_id);