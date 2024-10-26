import { NextFunction, Request, Response } from 'express';
import sql from 'mssql';
import { connectDB } from '../config/db';

export const getCharacters = async (req: Request, res: Response) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Characters');
    res.json({ data: result.recordset });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
};

export const getCharacterById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Characters WHERE CharacterID = @id');
    
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Character not found' });
    }
    
    res.json({ data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch character' });
  }
};