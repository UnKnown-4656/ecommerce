const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function check() {
  try {
    console.log('Checking for broken image URLs in products table...');
    const res = await pool.query('SELECT id, name, image_url FROM products WHERE image_url LIKE \'%1445205170230%\'');
    
    if (res.rows.length > 0) {
      console.log('Found broken products:');
      console.log(JSON.stringify(res.rows, null, 2));
      
      // Fix them - replace with a valid Unsplash URL
      const validUrl = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400';
      for (const row of res.rows) {
        await pool.query('UPDATE products SET image_url = $1 WHERE id = $2', [validUrl, row.id]);
        console.log(`Updated product ${row.id} with valid image URL.`);
      }
    } else {
      console.log('No products found with the broken image ID.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

check();
