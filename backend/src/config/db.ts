import sql from 'mssql';

export const connectDB = async () => {
    try {
      let config;
      
      if (process.env.DATABASE_URL) {
        // Use environment variables for Azure connection
        config = {
          server: process.env.DB_SERVER || 'thom.database.windows.net',
          database: process.env.DB_NAME || 'FantasyWiki',
          user: process.env.DB_USER || 'thomas',
          password: process.env.DB_PASSWORD || '',
          port: 1433,
          options: {
            encrypt: true,
            trustServerCertificate: false,
            enableArithAbort: true
          }
        };
      } else {
        // Local development
        config = {
          user: process.env.DB_USER || 'sa',
          password: process.env.DB_PASSWORD || 'Wiki12345',
          server: process.env.DB_SERVER || 'localhost',
          database: process.env.DB_NAME || 'FantasyWiki',
          options: {
            encrypt: true,
            trustServerCertificate: true,
          },
        };
      }
      const pool = await sql.connect(config);
      console.log('Connected to SQL Server');
      return pool;
    } catch (error) {
      console.error('Database connection failed:', error);
      process.exit(1);
    }
  };
  