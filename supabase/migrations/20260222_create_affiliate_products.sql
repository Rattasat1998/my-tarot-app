-- Affiliate Products table
CREATE TABLE IF NOT EXISTS affiliate_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2),
    image_url TEXT,
    affiliate_url TEXT NOT NULL,
    category TEXT DEFAULT 'ทั่วไป',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE affiliate_products ENABLE ROW LEVEL SECURITY;

-- Everyone can read active products
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'affiliate_products' AND policyname = 'Anyone can view active products'
    ) THEN
        CREATE POLICY "Anyone can view active products"
            ON affiliate_products FOR SELECT
            USING (is_active = true);
    END IF;
END
$$;

-- Admins can do everything (using profiles.is_admin)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'affiliate_products' AND policyname = 'Admins can insert products'
    ) THEN
        CREATE POLICY "Admins can insert products"
            ON affiliate_products FOR INSERT
            WITH CHECK (
                EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
            );
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'affiliate_products' AND policyname = 'Admins can update products'
    ) THEN
        CREATE POLICY "Admins can update products"
            ON affiliate_products FOR UPDATE
            USING (
                EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
            );
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'affiliate_products' AND policyname = 'Admins can delete products'
    ) THEN
        CREATE POLICY "Admins can delete products"
            ON affiliate_products FOR DELETE
            USING (
                EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
            );
    END IF;
END
$$;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_affiliate_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_update_affiliate_products_updated_at'
    ) THEN
        CREATE TRIGGER trigger_update_affiliate_products_updated_at
            BEFORE UPDATE ON affiliate_products
            FOR EACH ROW
            EXECUTE FUNCTION update_affiliate_products_updated_at();
    END IF;
END
$$;
