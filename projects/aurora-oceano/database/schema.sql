-- Aurora Oceano Database Schema
-- Sincronizado com Moloni API

-- Clientes
CREATE TABLE IF NOT EXISTS customers (
    customer_id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    vat VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    zip_code VARCHAR(20),
    country_id INTEGER DEFAULT 1,
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    moloni_sync_at TIMESTAMP
);

-- Produtos
CREATE TABLE IF NOT EXISTS products (
    product_id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    reference VARCHAR(100),
    category_id INTEGER,
    unit VARCHAR(50),
    price DECIMAL(12,2),
    stock DECIMAL(12,2) DEFAULT 0,
    has_stock BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    moloni_sync_at TIMESTAMP
);

-- Faturas
CREATE TABLE IF NOT EXISTS invoices (
    document_id INTEGER PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    date DATE NOT NULL,
    year INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM date)) STORED,
    month INTEGER GENERATED ALWAYS AS (EXTRACT(MONTH FROM date)) STORED,
    document_type VARCHAR(50),
    number VARCHAR(50),
    net_value DECIMAL(12,2),
    gross_value DECIMAL(12,2),
    taxes_value DECIMAL(12,2),
    status INTEGER,
    entity_name VARCHAR(255),
    entity_vat VARCHAR(20),
    salesman_id INTEGER,
    our_reference VARCHAR(255),
    your_reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    moloni_sync_at TIMESTAMP
);

-- Linhas de Fatura (produtos vendidos)
CREATE TABLE IF NOT EXISTS invoice_items (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES invoices(document_id),
    product_id INTEGER REFERENCES products(product_id),
    name VARCHAR(255),
    qty DECIMAL(12,4),
    price DECIMAL(12,4),
    discount DECIMAL(5,2) DEFAULT 0,
    total DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Views para Analytics
CREATE OR REPLACE VIEW monthly_revenue AS
SELECT 
    year,
    month,
    COUNT(*) as invoice_count,
    SUM(net_value) as total_revenue,
    AVG(net_value) as avg_ticket
FROM invoices
GROUP BY year, month
ORDER BY year, month;

CREATE OR REPLACE VIEW customer_ranking AS
SELECT 
    c.customer_id,
    c.name,
    c.city,
    COUNT(i.document_id) as invoice_count,
    SUM(i.net_value) as total_revenue,
    AVG(i.net_value) as avg_ticket,
    MAX(i.date) as last_purchase
FROM customers c
LEFT JOIN invoices i ON c.customer_id = i.customer_id
GROUP BY c.customer_id, c.name, c.city
ORDER BY total_revenue DESC;

CREATE OR REPLACE VIEW yearly_comparison AS
SELECT 
    year,
    COUNT(*) as invoice_count,
    SUM(net_value) as total_revenue,
    AVG(net_value) as avg_ticket
FROM invoices
GROUP BY year
ORDER BY year;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(date);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_year_month ON invoices(year, month);
CREATE INDEX IF NOT EXISTS idx_invoice_items_document ON invoice_items(document_id);

