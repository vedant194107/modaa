import { DatabaseSync } from "node:sqlite";
import path from "path";

const dbPath = path.join(process.cwd(), "thedrop.db");

let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(dbPath);

    // Initialize Database Schema
    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'VIP Client',
        status TEXT DEFAULT 'active',
        member_since TEXT DEFAULT 'JUL 2025',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        image1 TEXT NOT NULL,
        image2 TEXT,
        description TEXT,
        stock INTEGER DEFAULT 50,
        status TEXT DEFAULT 'ACTIVE',
        materials TEXT,
        fit_guide TEXT,
        shipping_info TEXT,
        sustainability TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        order_number TEXT NOT NULL,
        total REAL NOT NULL,
        status TEXT DEFAULT 'PROCESSING',
        items_json TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS wishlist (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product_json TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS addresses (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        label TEXT DEFAULT 'Home',
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        street TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        pincode TEXT NOT NULL,
        country TEXT DEFAULT 'India',
        is_default INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS coupons (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        type TEXT DEFAULT 'PERCENTAGE',
        value REAL NOT NULL,
        min_spend REAL DEFAULT 0,
        active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS product_reviews (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        author TEXT NOT NULL,
        rating INTEGER DEFAULT 5,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        image_url TEXT,
        size TEXT DEFAULT 'M',
        color TEXT DEFAULT 'Milano Red',
        verified INTEGER DEFAULT 1,
        helpful INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS restock_alerts (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        email TEXT NOT NULL,
        status TEXT DEFAULT 'PENDING',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Safely add any new columns to existing SQLite DB
    try { dbInstance.exec(`ALTER TABLE products ADD COLUMN materials TEXT;`); } catch(e){}
    try { dbInstance.exec(`ALTER TABLE products ADD COLUMN fit_guide TEXT;`); } catch(e){}
    try { dbInstance.exec(`ALTER TABLE products ADD COLUMN shipping_info TEXT;`); } catch(e){}
    try { dbInstance.exec(`ALTER TABLE products ADD COLUMN sustainability TEXT;`); } catch(e){}

    // Seed default admin, sample products, and original database orders if empty
    seedDatabase(dbInstance);
  }
  return dbInstance;
}

function seedDatabase(db: DatabaseSync) {
  // Check users
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  if (userCount.count === 0) {
    db.prepare(`
      INSERT INTO users (id, name, email, password, role, member_since)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run("usr_admin", "Admin Director", "admin@thedrop.com", "password", "Admin", "JUL 2025");

    db.prepare(`
      INSERT INTO users (id, name, email, password, role, member_since)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run("usr_vip", "Vedant Dayala", "vedant@thedrop.com", "password", "VIP Client", "AUG 2025");
  }

  // Check products
  const prodCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  if (prodCount.count === 0) {
    const stmt = db.prepare(`
      INSERT INTO products (id, title, category, price, image1, image2, description, stock, materials, fit_guide, shipping_info, sustainability)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      "prod_1",
      "RAVEN DISTRESSED DENIM",
      "Denim",
      245.0,
      "https://lh3.googleusercontent.com/aida-public/AB6AXuArnnoDag-q0ElalEK4sqtvt6w91FtYcY9aGxycQpCOKInmR7cffSVuI_FVMLsBbFD4H4-poBZB7jOnp-_oOwFoavvZXTbPCJ8JAOxItFfA6KjQzry7IpE5ZJKWX7MZBpYzTNY1hHV3OvSkntY8nnBiYCWHXgKpw7c-b39YBevNkM2Ria2q6i_QhJuOwGjUBMfeBYwxjK7tKQ0eeqmCXMzo9IhrpkEzceLaj2VigECxB6AHYemp9n_QuiHvuQp2FkYWXH9IdB2za4M",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBC2bYg0-sJc88bY1LhPq7T1S4b-1P0jG5wY70Hk8XzV62pL5R88y1M-pW7g5eX6q4n2wR7u-T5y8-Q2x1w6h2j8",
      "Heavyweight distressed black denim jacket with red contrast stitching.",
      45,
      "500GSM Heavyweight Japanese Cotton Denim with DWR Finish",
      "Oversized Boxy Silhouette. Model is 6'1 wearing Size L",
      "Express Shipping via DHL. Dispatched within 24 hours.",
      "Ethically tailored in small batches using 100% organic cotton"
    );

    stmt.run(
      "prod_2",
      "ARCHITECT CARGO SYSTEM",
      "Pants",
      180.0,
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBzVdjayF_lzJBVbPYqMV2nBjlzjQqclMmgAF6FyqTau4MAbCGCUfhAGssWRs6ms-axVrRO65YMrU--lPHNw_ypgnrlMZKQ3-TQuY0jn7xSWpR7hG9EAJSc9gZ-B3-INb_F_nxvcc8BpRiuNz1i6i44_YNy_ru8iiDhCvyT6CD5g4abVkQJ6M-fzQle_MmiqRQrsEGo2z1AAkZWEbcbwprfkbCg6uPWmwOx0sp-Qqh6GL0-ehNoVGxsaOz7C4_znAVpl2fkI2fvWUk",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBzVdjayF_lzJBVbPYqMV2nBjlzjQqclMmgAF6FyqTau4MAbCGCUfhAGssWRs6ms-axVrRO65YMrU--lPHNw_ypgnrlMZKQ3-TQuY0jn7xSWpR7hG9EAJSc9gZ-B3-INb_F_nxvcc8BpRiuNz1i6i44_YNy_ru8iiDhCvyT6CD5g4abVkQJ6M-fzQle_MmiqRQrsEGo2z1AAkZWEbcbwprfkbCg6uPWmwOx0sp-Qqh6GL0-ehNoVGxsaOz7C4_znAVpl2fkI2fkI2fvWUk",
      "Multi-pocket modular cargo pants engineered for tactical utility.",
      30,
      "Technical Ripstop Nylon with Anodized Zinc Buckles",
      "Relaxed Tapered Fit with adjustable ankle cinches",
      "Express 2-4 business day worldwide delivery",
      "Zero plastic waste packaging"
    );
  }

  // Check orders
  const orderCount = db.prepare("SELECT COUNT(*) as count FROM orders").get() as { count: number };
  if (orderCount.count === 0) {
    const stmt = db.prepare(`
      INSERT INTO orders (id, user_id, order_number, total, status, items_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      "ord_1",
      "usr_vip",
      "ORD-8942-01",
      245.0,
      "DELIVERED",
      JSON.stringify([{ id: "prod_1", title: "RAVEN DISTRESSED DENIM", price: 245, quantity: 1, size: "L" }]),
      "2026-07-15T10:30:00.000Z"
    );

    stmt.run(
      "ord_2",
      "usr_vip",
      "ORD-7712-02",
      335.0,
      "DISPATCHED",
      JSON.stringify([
        { id: "prod_2", title: "ARCHITECT CARGO SYSTEM", price: 180, quantity: 1, size: "M" },
        { id: "prod_3", title: "CORE 500GSM HOODIE", price: 155, quantity: 1, size: "M" }
      ]),
      "2026-06-20T14:15:00.000Z"
    );

    stmt.run(
      "ord_3",
      "usr_vip",
      "ORD-6540-03",
      210.0,
      "DELIVERED",
      JSON.stringify([{ id: "prod_4", title: "TACTICAL VEST - RED", price: 210, quantity: 1, size: "M" }]),
      "2026-04-10T11:00:00.000Z"
    );
  }

  // Check Coupons
  const couponCount = db.prepare("SELECT COUNT(*) as count FROM coupons").get() as { count: number };
  if (couponCount.count === 0) {
    db.prepare(`
      INSERT INTO coupons (id, code, type, value, min_spend)
      VALUES (?, ?, ?, ?, ?)
    `).run("coup_1", "VIP20", "PERCENTAGE", 20, 100);

    db.prepare(`
      INSERT INTO coupons (id, code, type, value, min_spend)
      VALUES (?, ?, ?, ?, ?)
    `).run("coup_2", "WELCOME50", "FLAT", 50, 200);
  }
}
