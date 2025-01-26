import { NextFunction, Request, Response } from 'express';
import sql from 'mssql';
import { connectDB } from '../config/db';

export const getLocations = async (req: Request, res: Response) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT l.*, n.Name as NationName 
      FROM Locations l 
      LEFT JOIN Nations n ON l.NationID = n.NationID
    `);
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};

export const getLocationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT l.*, n.Name as NationName 
        FROM Locations l 
        LEFT JOIN Nations n ON l.NationID = n.NationID 
        WHERE l.LocationID = @id
      `);
    
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }
    
    res.json({ data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch location' });
  }
};

export const createLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { 
    Name, 
    LocationType, 
    Description, 
    NationID, 
    CoordinateX, 
    CoordinateY, 
    Climate, 
    Population 
  } = req.body;

  if (!Name || !LocationType) {
    res.status(400).json({ error: 'Name and LocationType are required' });
    return;
  }

  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input('Name', sql.NVarChar(100), Name)
      .input('LocationType', sql.NVarChar(50), LocationType)
      .input('Description', sql.NVarChar(sql.MAX), Description)
      .input('NationID', sql.Int, NationID)
      .input('CoordinateX', sql.Float, CoordinateX)
      .input('CoordinateY', sql.Float, CoordinateY)
      .input('Climate', sql.NVarChar(50), Climate)
      .input('Population', sql.Int, Population)
      .query(`
        INSERT INTO Locations (
          Name, LocationType, Description, NationID, 
          CoordinateX, CoordinateY, Climate, Population, 
          CreatedDate, LastModifiedDate
        )
        VALUES (
          @Name, @LocationType, @Description, @NationID, 
          @CoordinateX, @CoordinateY, @Climate, @Population, 
          GETDATE(), GETDATE()
        );
        SELECT SCOPE_IDENTITY() AS LocationID;
      `);

    const newLocationID = result.recordset[0].LocationID;
    res.status(201).json({ message: 'Location added', LocationID: newLocationID });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add location' });
  }
};

export const deleteLocation = async (req: Request, res: Response): Promise<void> => {
  const locationId = req.params.id;

  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input('id', sql.Int, locationId)
      .query('DELETE FROM Locations WHERE LocationID = @id');

    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }

    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ error: 'Failed to delete location' });
  }
};
