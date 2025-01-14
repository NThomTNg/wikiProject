import { NextFunction, Request, Response } from 'express';
import sql from 'mssql';
import { connectDB } from '../config/db';

export const getNations = async (req: Request, res: Response) => {
    try {
        console.log('Attempting to connect to database...');
        const pool = await connectDB();
        console.log('Database connected, executing query...');
        
        const result = await pool.request().query(`
            SELECT NationID, Name, Government, CapitalLocationID, Description,
                   FoundingDate, MajorReligionID, Culture, Economy,
                   MilitaryStrength, CreatedDate, LastModifiedDate, ImageURL
            FROM Nations
        `);
        
        console.log(`Query completed. Found ${result.recordset.length} nations`);
        res.json({ data: result.recordset });
    } catch (error) {
        console.error('Error in getNations:', error);
        res.status(500).json({ 
            error: 'Failed to fetch nations',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getNationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const pool = await connectDB();
        const result = await pool
            .request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM Nations WHERE NationID = @id');
        
        if (result.recordset.length === 0) {
            res.status(404).json({ error: 'Nation not found' });
            return;
        }
        
        res.json({ data: result.recordset[0] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch nation' });
    }
};

export const addNation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
        Name,
        Government,
        CapitalLocationID,
        Description,
        FoundingDate,
        MajorReligionID,
        Culture,
        Economy,
        MilitaryStrength,
        ImageURL
    } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!Name) {
        res.status(400).json({ error: 'Name is required' });
        return;
    }

    try {
        const pool = await connectDB();
        const result = await pool.request()
            .input('Name', sql.NVarChar(100), Name)
            .input('Government', sql.NVarChar(100), Government)
            .input('CapitalLocationID', sql.Int, CapitalLocationID)
            .input('Description', sql.NVarChar(sql.MAX), Description)
            .input('FoundingDate', sql.NVarChar(100), FoundingDate)
            .input('MajorReligionID', sql.Int, MajorReligionID)
            .input('Culture', sql.NVarChar(sql.MAX), Culture)
            .input('Economy', sql.NVarChar(sql.MAX), Economy)
            .input('MilitaryStrength', sql.NVarChar(100), MilitaryStrength)
            .input('ImageURL', sql.NVarChar(255), ImageURL)
            .query(`
                INSERT INTO Nations (
                    Name, Government, CapitalLocationID, Description, 
                    FoundingDate, MajorReligionID, Culture, Economy, 
                    MilitaryStrength, CreatedDate, LastModifiedDate
                )
                VALUES (
                    @Name, @Government, @CapitalLocationID, @Description,
                    @FoundingDate, @MajorReligionID, @Culture, @Economy,
                    @MilitaryStrength, GETDATE(), GETDATE()
                );
                SELECT SCOPE_IDENTITY() AS NationID;
            `);

const newNationID = result.recordset[0].NationID;
    res.status(201).json({ message: 'Nation added', NationID: newNationID });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add nation' });
    }
};

export const deleteNation = async (req: Request, res: Response): Promise<void> => {
    const nationId = req.params.id;

    try {
        const pool = await connectDB();
        const result = await pool
            .request()
            .input('id', sql.Int, nationId)
            .query('DELETE FROM Nations WHERE NationID = @id');

        if (result.rowsAffected[0] === 0) {
            res.status(404).json({ error: 'Nation not found' });
            return;
        }

        res.status(200).json({ message: 'Nation deleted successfully' });
    } catch (error) {
        console.error('Error deleting nation:', error);
        res.status(500).json({ error: 'Failed to delete nation' });
    }
};
