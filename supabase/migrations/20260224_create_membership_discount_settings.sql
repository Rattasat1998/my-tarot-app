-- Membership discount settings (single-row config)
CREATE TABLE IF NOT EXISTS membership_discount_settings (
    id SMALLINT PRIMARY KEY DEFAULT 1,
    base_price_baht INTEGER NOT NULL DEFAULT 299,
    discount_amount_baht INTEGER NOT NULL DEFAULT 0,
    discount_duration_days INTEGER NOT NULL DEFAULT 7,
    is_discount_active BOOLEAN NOT NULL DEFAULT false,
    discount_starts_at TIMESTAMPTZ,
    discount_ends_at TIMESTAMPTZ,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT membership_discount_settings_single_row CHECK (id = 1),
    CONSTRAINT membership_discount_non_negative CHECK (discount_amount_baht >= 0),
    CONSTRAINT membership_discount_days_positive CHECK (discount_duration_days > 0),
    CONSTRAINT membership_base_price_positive CHECK (base_price_baht > 0)
);

ALTER TABLE membership_discount_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'membership_discount_settings'
          AND policyname = 'Anyone can view membership discount settings'
    ) THEN
        CREATE POLICY "Anyone can view membership discount settings"
            ON membership_discount_settings FOR SELECT
            USING (true);
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'membership_discount_settings'
          AND policyname = 'Admins can insert membership discount settings'
    ) THEN
        CREATE POLICY "Admins can insert membership discount settings"
            ON membership_discount_settings FOR INSERT
            WITH CHECK (
                EXISTS (
                    SELECT 1
                    FROM profiles
                    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
                )
            );
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'membership_discount_settings'
          AND policyname = 'Admins can update membership discount settings'
    ) THEN
        CREATE POLICY "Admins can update membership discount settings"
            ON membership_discount_settings FOR UPDATE
            USING (
                EXISTS (
                    SELECT 1
                    FROM profiles
                    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
                )
            )
            WITH CHECK (
                EXISTS (
                    SELECT 1
                    FROM profiles
                    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
                )
            );
    END IF;
END
$$;

-- Keep updated_at fresh
CREATE OR REPLACE FUNCTION set_membership_discount_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'trigger_set_membership_discount_settings_updated_at'
    ) THEN
        CREATE TRIGGER trigger_set_membership_discount_settings_updated_at
            BEFORE UPDATE ON membership_discount_settings
            FOR EACH ROW
            EXECUTE FUNCTION set_membership_discount_settings_updated_at();
    END IF;
END
$$;

-- Seed a default row
INSERT INTO membership_discount_settings (id, base_price_baht, discount_amount_baht, discount_duration_days, is_discount_active)
VALUES (1, 299, 0, 7, false)
ON CONFLICT (id) DO NOTHING;
