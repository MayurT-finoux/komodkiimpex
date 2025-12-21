-- Example Supabase PostgreSQL schema for Komodki Impex

-- Product Categories Table
CREATE TABLE product_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    categories TEXT[], -- Array of subcategories
    bg_gradient VARCHAR(255) DEFAULT 'from-blue-600 to-purple-600',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_description TEXT,
    category_id UUID REFERENCES product_categories(id),
    details JSONB, -- Store product specifications as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to get all product categories
CREATE OR REPLACE FUNCTION get_product_categories()
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    description TEXT,
    slug VARCHAR,
    categories TEXT[],
    bg_gradient VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pc.id,
        pc.name,
        pc.description,
        pc.slug,
        pc.categories,
        pc.bg_gradient,
        pc.created_at,
        pc.updated_at
    FROM product_categories pc
    ORDER BY pc.name;
END;
$$ LANGUAGE plpgsql;

-- Function to get products by category
CREATE OR REPLACE FUNCTION get_products_by_category(category_slug TEXT)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    short_description TEXT,
    category_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.short_description,
        p.category_id,
        p.details,
        p.created_at,
        p.updated_at
    FROM products p
    JOIN product_categories pc ON p.category_id = pc.id
    WHERE pc.slug = category_slug
    ORDER BY p.name;
END;
$$ LANGUAGE plpgsql;

-- Sample data insertion
INSERT INTO product_categories (name, description, slug, categories, bg_gradient) VALUES
('Minerals', 'High-quality minerals and ores including iron, copper, zinc, and precious stones sourced from certified suppliers.', 'minerals', ARRAY['Iron Ore', 'Copper', 'Zinc', 'Precious Stones'], 'from-blue-600 to-purple-600'),
('Hardware', 'Comprehensive range of hardware tools, equipment, and industrial supplies for various applications.', 'hardware', ARRAY['Hand Tools', 'Power Tools', 'Fasteners', 'Industrial Supplies'], 'from-orange-600 to-red-600'),
('Petroleum Jelly', 'Premium grade petroleum jelly products for cosmetic, pharmaceutical, and industrial applications.', 'petroleum-jelly', ARRAY['Cosmetic Grade', 'Pharmaceutical', 'Industrial Use', 'White Petroleum'], 'from-teal-600 to-green-600');

-- Sample products
INSERT INTO products (name, short_description, category_id, details) VALUES
('Iron Ore - Grade A', 'Premium iron ore with consistent composition for metallurgy.', 
 (SELECT id FROM product_categories WHERE slug = 'minerals'), 
 '{"Origin": "Indonesia", "Purity": "62% Fe", "Packaging": "Bulk Bags / Containers", "MOQ": "20 MT"}'),
('Copper Concentrate', 'High grade copper concentrate suitable for smelting.', 
 (SELECT id FROM product_categories WHERE slug = 'minerals'), 
 '{"Origin": "Chile", "Concentrate": "25% Cu", "Packaging": "Containers", "MOQ": "10 MT"}'),
('High Torque Wrench Set', 'Durable professional-grade wrenches for industrial use.', 
 (SELECT id FROM product_categories WHERE slug = 'hardware'), 
 '{"Material": "Chrome Vanadium", "Pieces": "10", "Warranty": "2 years"}'),
('Industrial Fasteners Pack', 'Assorted fasteners for large-scale assembly lines.', 
 (SELECT id FROM product_categories WHERE slug = 'hardware'), 
 '{"Material": "Stainless Steel", "Sizes": "M4-M20", "Packaging": "Cartons"}'),
('Cosmetic Grade Jelly 1kg', 'White, odorless petroleum jelly for cosmetic formulations.', 
 (SELECT id FROM product_categories WHERE slug = 'petroleum-jelly'), 
 '{"Grade": "Cosmetic", "NetWeight": "1kg", "ShelfLife": "3 years"}'),
('Industrial Petroleum Jelly 25kg', 'Industrial grade for lubricants and manufacturing.', 
 (SELECT id FROM product_categories WHERE slug = 'petroleum-jelly'), 
 '{"Grade": "Industrial", "NetWeight": "25kg", "Packaging": "Drums"}');