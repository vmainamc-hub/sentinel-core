-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  deriv_connected BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- deriv accounts
CREATE TABLE public.deriv_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  loginid TEXT NOT NULL,
  token TEXT NOT NULL,
  currency TEXT,
  is_virtual BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT false,
  balance NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, loginid)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.deriv_accounts TO authenticated;
GRANT ALL ON public.deriv_accounts TO service_role;
ALTER TABLE public.deriv_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own deriv accounts" ON public.deriv_accounts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- preferences
CREATE TABLE public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  min_confidence NUMERIC NOT NULL DEFAULT 70,
  alert_sound BOOLEAN NOT NULL DEFAULT true,
  risk_profile TEXT NOT NULL DEFAULT 'balanced',
  max_daily_loss NUMERIC,
  max_stake NUMERIC,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_preferences TO authenticated;
GRANT ALL ON public.user_preferences TO service_role;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own preferences" ON public.user_preferences FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- learned market state
CREATE TABLE public.apex_market_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  kind TEXT NOT NULL,
  model_version INTEGER NOT NULL DEFAULT 1,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, symbol, kind)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.apex_market_state TO authenticated;
GRANT ALL ON public.apex_market_state TO service_role;
ALTER TABLE public.apex_market_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own market state" ON public.apex_market_state FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- simulated trades
CREATE TABLE public.apex_sim_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  contract TEXT NOT NULL,
  entry_condition TEXT,
  entry_at TIMESTAMPTZ,
  entry_digit INTEGER,
  duration_ticks INTEGER,
  resolved_at TIMESTAMPTZ,
  resolution_digit INTEGER,
  outcome TEXT,
  stake NUMERIC,
  payout NUMERIC,
  pnl NUMERIC,
  detail JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.apex_sim_trades TO authenticated;
GRANT ALL ON public.apex_sim_trades TO service_role;
ALTER TABLE public.apex_sim_trades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own sim trades" ON public.apex_sim_trades FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.sentinel_sim_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  contract TEXT NOT NULL,
  regime TEXT,
  entry_condition TEXT,
  entry_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  entry_digit INTEGER,
  resolution_digit INTEGER,
  duration_ticks INTEGER,
  result TEXT,
  stake NUMERIC,
  pnl NUMERIC,
  direction_score NUMERIC,
  setup_score NUMERIC,
  danger NUMERIC,
  detail JSONB,
  client_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, client_key)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sentinel_sim_trades TO authenticated;
GRANT ALL ON public.sentinel_sim_trades TO service_role;
ALTER TABLE public.sentinel_sim_trades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own sentinel sim trades" ON public.sentinel_sim_trades FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- shared learning tables
CREATE TABLE public.sentinel_combo_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  contract TEXT NOT NULL,
  regime TEXT NOT NULL,
  entry_condition TEXT NOT NULL,
  n INTEGER NOT NULL DEFAULT 0,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  weighted_n NUMERIC,
  weighted_wins NUMERIC,
  expectancy NUMERIC,
  weighted_expectancy NUMERIC,
  net_pnl NUMERIC,
  max_drawdown NUMERIC,
  deterioration_pp NUMERIC,
  current_streak INTEGER,
  longest_losing_streak INTEGER,
  decay_half_life_ms BIGINT,
  version INTEGER NOT NULL DEFAULT 1,
  last_outcome_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (symbol, contract, regime, entry_condition)
);
GRANT SELECT, INSERT, UPDATE ON public.sentinel_combo_stats TO authenticated;
GRANT ALL ON public.sentinel_combo_stats TO service_role;
ALTER TABLE public.sentinel_combo_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users read combo stats" ON public.sentinel_combo_stats FOR SELECT TO authenticated USING (true);
CREATE POLICY "Signed-in users write combo stats" ON public.sentinel_combo_stats FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Signed-in users update combo stats" ON public.sentinel_combo_stats FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.sentinel_learning_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  kind TEXT NOT NULL,
  payload JSONB NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (symbol, kind)
);
GRANT SELECT, INSERT, UPDATE ON public.sentinel_learning_state TO authenticated;
GRANT ALL ON public.sentinel_learning_state TO service_role;
ALTER TABLE public.sentinel_learning_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users read learning state" ON public.sentinel_learning_state FOR SELECT TO authenticated USING (true);
CREATE POLICY "Signed-in users write learning state" ON public.sentinel_learning_state FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Signed-in users update learning state" ON public.sentinel_learning_state FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.sentinel_calibration_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  taken_on DATE NOT NULL DEFAULT CURRENT_DATE,
  version INTEGER NOT NULL DEFAULT 1,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (symbol, taken_on, version)
);
GRANT SELECT, INSERT, UPDATE ON public.sentinel_calibration_snapshots TO authenticated;
GRANT ALL ON public.sentinel_calibration_snapshots TO service_role;
ALTER TABLE public.sentinel_calibration_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users read snapshots" ON public.sentinel_calibration_snapshots FOR SELECT TO authenticated USING (true);
CREATE POLICY "Signed-in users write snapshots" ON public.sentinel_calibration_snapshots FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Signed-in users update snapshots" ON public.sentinel_calibration_snapshots FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- operator journal + feedback
CREATE TABLE public.sentinel_journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  mode TEXT NOT NULL,
  symbol TEXT NOT NULL,
  name TEXT,
  contract TEXT NOT NULL,
  contract_label TEXT,
  opportunity NUMERIC,
  confidence NUMERIC,
  edge_pct NUMERIC,
  danger NUMERIC,
  quality NUMERIC,
  entry_digit_index INTEGER,
  outcome TEXT NOT NULL DEFAULT 'PENDING',
  resolved_digit INTEGER,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, client_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sentinel_journal TO authenticated;
GRANT ALL ON public.sentinel_journal TO service_role;
ALTER TABLE public.sentinel_journal ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own journal" ON public.sentinel_journal FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.sentinel_operator_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  kind TEXT NOT NULL,
  item_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, kind, item_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sentinel_operator_feedback TO authenticated;
GRANT ALL ON public.sentinel_operator_feedback TO service_role;
ALTER TABLE public.sentinel_operator_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own feedback" ON public.sentinel_operator_feedback FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- parity signal track record
CREATE TABLE public.parity_signals (
  id TEXT PRIMARY KEY,
  market TEXT NOT NULL,
  action TEXT NOT NULL,
  confidence NUMERIC,
  entry_formula TEXT,
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  outcome TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.parity_signals TO authenticated;
GRANT ALL ON public.parity_signals TO service_role;
ALTER TABLE public.parity_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users read parity signals" ON public.parity_signals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Signed-in users write parity signals" ON public.parity_signals FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Signed-in users update parity signals" ON public.parity_signals FOR UPDATE TO authenticated USING (true) WITH CHECK (true);