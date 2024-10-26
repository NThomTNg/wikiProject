import sql from 'mssql';

const config = {
    user: 'sa',
    password: 'Wiki12345',
    server: 'localhost',
    database: 'FantasyWiki',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

export const connectDB = async () => {
    try {
      const pool = await sql.connect(config);
      console.log('Connected to SQL Server');
      return pool;
    } catch (error) {
      console.error('Database connection failed:', error);
      process.exit(1);
    }
  };
  