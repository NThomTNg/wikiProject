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

export const addCharacter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { Name, Title, Biography, BirthDate, DeathDate, NationID, ReligionID, ImageURL } = req.body;
    if (!Name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const pool = await connectDB();
    const result = await pool.request()
      .input('Name', sql.NVarChar(100), Name)
      .input('Title', sql.NVarChar(200), Title || null)
      .input('Biography', sql.NVarChar(sql.MAX), Biography || null)
      .input('BirthDate', sql.NVarChar(100), BirthDate || null)
      .input('DeathDate', sql.NVarChar(100), DeathDate || null)
      .input('NationID', sql.Int, NationID || null)
      .input('ReligionID', sql.Int, ReligionID || null)
      .input('ImageURL', sql.NVarChar(255), ImageURL || null)
      .query(`
        INSERT INTO Characters (Name, Title, Biography, BirthDate, DeathDate, NationID, ReligionID, ImageURL, CreatedDate, LastModifiedDate)
        VALUES (@Name, @Title, @Biography, @BirthDate, @DeathDate, @NationID, @ReligionID, @ImageURL, GETDATE(), GETDATE());
        SELECT SCOPE_IDENTITY() AS CharacterID;
      `);

    const newCharacterID = result.recordset[0].CharacterID;
    res.status(201).json({ message: 'Character added', CharacterID: newCharacterID });
  } catch (error) {
    console.error('Error adding character:', error);
    res.status(500).json({ 
      error: 'Failed to add character', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteCharacter = async (req: Request, res: Response): Promise<void> => {
  const characterId = req.params.id; 

  try {
      const pool = await connectDB();
      const result = await pool
          .request()
          .input('id', sql.Int, characterId)
          .query('DELETE FROM Characters WHERE CharacterID = @id');

      if (result.rowsAffected[0] === 0) {
          res.status(404).json({ error: 'Character not found' });
          return;
      }

      res.status(200).json({ message: 'Character deleted successfully' });
  } catch (error) {
      console.error('Error deleting character:', error);
      res.status(500).json({ error: 'Failed to delete character' });
  }
};

