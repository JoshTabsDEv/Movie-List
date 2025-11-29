import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// SSL configuration for Digital Ocean Managed Databases
const getSSLConfig = () => {
  // If DB_SSL is explicitly set to false, don't use SSL
  if (process.env.DB_SSL === 'false') {
    return undefined;
  }

  // For Digital Ocean or when DB_SSL is true
  if (process.env.DB_SSL === 'true' || process.env.DB_HOST?.includes('digitalocean')) {
    // If CA certificate path is provided, use it (more secure)
    if (process.env.DB_CA_CERT_PATH) {
      const caCertPath = path.resolve(process.env.DB_CA_CERT_PATH);
      if (fs.existsSync(caCertPath)) {
        return {
          ca: fs.readFileSync(caCertPath),
          rejectUnauthorized: true
        };
      }
    }
    
    // Otherwise, use rejectUnauthorized: false (works for Digital Ocean)
    // Note: This is less secure but acceptable for managed databases
    return {
      rejectUnauthorized: false
    };
  }

  return undefined;
};

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'movie_list',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: getSSLConfig()
});

export default pool;

