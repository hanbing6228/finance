-- FIP PostgreSQL schema v1
-- Scope: standalone MVP module, data-package driven.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  external_account_id TEXT,
  institution TEXT NOT NULL,
  account_name TEXT NOT NULL,
  official_name TEXT,
  account_type TEXT NOT NULL,
  account_subtype TEXT,
  mask TEXT,
  current_balance NUMERIC(18,2),
  available_balance NUMERIC(18,2),
  credit_limit NUMERIC(18,2),
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  sync_status TEXT NOT NULL DEFAULT 'imported',
  data_start_date DATE,
  data_end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, external_account_id)
);

CREATE TABLE raw_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  source_transaction_id TEXT,
  date DATE NOT NULL,
  posted_datetime TIMESTAMPTZ,
  description TEXT NOT NULL,
  merchant_name TEXT,
  amount NUMERIC(18,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  raw_category_primary TEXT,
  raw_category_detailed TEXT,
  pending BOOLEAN NOT NULL DEFAULT false,
  raw_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, account_id, source, source_transaction_id)
);

CREATE TABLE classification_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  rule_id TEXT NOT NULL,
  version INT NOT NULL DEFAULT 1,
  priority INT NOT NULL,
  rule_name TEXT,
  match JSONB NOT NULL,
  actions JSONB NOT NULL,
  confidence NUMERIC(5,4),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id, rule_id)
);

CREATE TABLE classified_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_id UUID NOT NULL REFERENCES raw_transactions(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  subcategory TEXT,
  treatment TEXT NOT NULL,
  cashflow_layer TEXT NOT NULL,
  normalized_amount NUMERIC(18,2) NOT NULL,
  confidence NUMERIC(5,4),
  rule_id TEXT,
  rule_module_id TEXT,
  review_status TEXT NOT NULL DEFAULT 'needs_review',
  is_spending BOOLEAN NOT NULL DEFAULT false,
  is_income BOOLEAN NOT NULL DEFAULT false,
  is_internal_flow BOOLEAN NOT NULL DEFAULT false,
  is_refund BOOLEAN NOT NULL DEFAULT false,
  is_excluded BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, transaction_id)
);

CREATE TABLE official_facts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  year INT NOT NULL,
  period_start DATE,
  period_end DATE,
  source_document TEXT NOT NULL,
  source_type TEXT NOT NULL,
  metric TEXT NOT NULL,
  value NUMERIC(18,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  confidence NUMERIC(5,4),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE monthly_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  year INT NOT NULL,
  month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  labor_income NUMERIC(18,2) NOT NULL DEFAULT 0,
  financial_income NUMERIC(18,2) NOT NULL DEFAULT 0,
  old_item_recovery NUMERIC(18,2) NOT NULL DEFAULT 0,
  gross_spending NUMERIC(18,2) NOT NULL DEFAULT 0,
  refunds NUMERIC(18,2) NOT NULL DEFAULT 0,
  net_spending NUMERIC(18,2) NOT NULL DEFAULT 0,
  credit_card_payments NUMERIC(18,2) NOT NULL DEFAULT 0,
  savings_transfer NUMERIC(18,2) NOT NULL DEFAULT 0,
  cash_consolidation NUMERIC(18,2) NOT NULL DEFAULT 0,
  liquidity_movement NUMERIC(18,2) NOT NULL DEFAULT 0,
  loan_proceeds NUMERIC(18,2) NOT NULL DEFAULT 0,
  loan_repayment NUMERIC(18,2) NOT NULL DEFAULT 0,
  data_quality JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, year, month)
);

CREATE TABLE credit_card_monthly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  year INT NOT NULL,
  month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  gross_spend NUMERIC(18,2) NOT NULL DEFAULT 0,
  merchant_refunds NUMERIC(18,2) NOT NULL DEFAULT 0,
  net_spend NUMERIC(18,2) NOT NULL DEFAULT 0,
  rewards NUMERIC(18,2) NOT NULL DEFAULT 0,
  statement_credits NUMERIC(18,2) NOT NULL DEFAULT 0,
  payments NUMERIC(18,2) NOT NULL DEFAULT 0,
  statement_balance NUMERIC(18,2),
  minimum_payment NUMERIC(18,2),
  due_date DATE,
  interest_charged NUMERIC(18,2),
  apr NUMERIC(8,4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, card_account_id, year, month)
);

CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metric_name TEXT,
  metric_value NUMERIC(18,2),
  threshold JSONB,
  status TEXT NOT NULL DEFAULT 'open',
  source JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_accounts_user ON accounts(user_id);
CREATE INDEX idx_raw_transactions_user_date ON raw_transactions(user_id, date);
CREATE INDEX idx_raw_transactions_account_date ON raw_transactions(account_id, date);
CREATE INDEX idx_classified_user_treatment ON classified_transactions(user_id, treatment);
CREATE INDEX idx_classified_review_status ON classified_transactions(user_id, review_status);
CREATE INDEX idx_official_facts_user_year_metric ON official_facts(user_id, year, metric);
CREATE INDEX idx_monthly_metrics_user_period ON monthly_metrics(user_id, year, month);
CREATE INDEX idx_credit_card_monthly_user_period ON credit_card_monthly(user_id, year, month);
CREATE INDEX idx_alerts_user_status ON alerts(user_id, status, severity);

