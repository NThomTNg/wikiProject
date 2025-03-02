import { NextFunction, Request, Response } from 'express';
import sql from 'mssql';
import { connectDB } from '../config/db';

export const getReligions = async (req: Request, res: Response) => {
    try {
        const pool = await connectDB();
        
        const result = await pool.request().query(`
            SELECT ReligionID, Name, Description, Deities, HolyText,
            Practices, FoundingDate, Hierarchy, CreatedDate, 
            LastModifiedDate, ImageURL
            FROM Religions
        `);
        
        console.log(`Query completed. Found ${result.recordset.length} religions`);
        res.json({ data: result.recordset });
    } catch (error) {
        console.error('Error in getReligions:', error);
        res.status(500).json({ 
            error: 'Failed to fetch religions',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getReligionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const pool = await connectDB();
        const result = await pool
            .request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM Religions WHERE ReligionID = @id');
        
        if (result.recordset.length === 0) {
            res.status(404).json({ error: 'Religion not found' });
            return;
        }
        
        res.json({ data: result.recordset[0] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch religion' });
    }
};

export const addReligion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
        Name,
        Description,
        Deities,
        HolyText,
        Practices,
        FoundingDate,
        Hierarchy,
        ImageURL
    } = req.body;

    if (!Name) {
        res.status(400).json({ error: 'Name is required' });
        return;
    }

    try {
        console.log('Religion data received:', { 
            Name, 
            ImageURL: ImageURL || 'No image provided'
        });

        const pool = await connectDB();
        const result = await pool.request()
            .input('Name', sql.NVarChar(100), Name)
            .input('Description', sql.NVarChar(sql.MAX), Description)
            .input('Deities', sql.NVarChar(sql.MAX), Deities)
            .input('HolyText', sql.NVarChar(sql.MAX), HolyText)
            .input('Practices', sql.NVarChar(sql.MAX), Practices)
            .input('FoundingDate', sql.NVarChar(100), FoundingDate)
            .input('Hierarchy', sql.NVarChar(sql.MAX), Hierarchy)
            .input('ImageURL', sql.NVarChar(255), ImageURL)
            .query(`
                INSERT INTO Religions (
                    Name, Description, Deities, HolyText, 
                    Practices, FoundingDate, Hierarchy, CreatedDate, LastModifiedDate, ImageURL
                )
                VALUES (
                    @Name, @Description, @Deities, @HolyText,
                    @Practices, @FoundingDate, @Hierarchy, GETDATE(), GETDATE(), @ImageURL
                );
                SELECT SCOPE_IDENTITY() AS ReligionID;
            `);

        const newReligionID = result.recordset[0].ReligionID;
        res.status(201).json({ message: 'Religion added', ReligionID: newReligionID });
    } catch (error) {
        console.error('Error adding religion:', error);
        res.status(500).json({ error: 'Failed to add religion' });
    }
};

export const updateReligion = async (req: Request, res: Response): Promise<void> => {
    const religionId = req.params.id;
    const {
        Name,
        Description,
        Deities,
        HolyText,
        Practices,
        FoundingDate,
        Hierarchy,
        ImageURL
    } = req.body;

    try {
        const pool = await connectDB();
        const result = await pool.request()
            .input('id', sql.Int, religionId)
            .input('Name', sql.NVarChar(100), Name)
            .input('Description', sql.NVarChar(sql.MAX), Description)
            .input('Deities', sql.NVarChar(sql.MAX), Deities)
            .input('HolyText', sql.NVarChar(sql.MAX), HolyText)
            .input('Practices', sql.NVarChar(sql.MAX), Practices)
            .input('FoundingDate', sql.NVarChar(100), FoundingDate)
            .input('Hierarchy', sql.NVarChar(sql.MAX), Hierarchy)
            .input('ImageURL', sql.NVarChar(255), ImageURL)
            .query(`
                UPDATE Religions
                SET Name = @Name,
                    Description = @Description,
                    Deities = @Deities,
                    HolyText = @HolyText,
                    Practices = @Practices,
                    FoundingDate = @FoundingDate,
                    Hierarchy = @Hierarchy,
                    ImageURL = @ImageURL,
                    LastModifiedDate = GETDATE()
                WHERE ReligionID = @id
            `);

        if (result.rowsAffected[0] === 0) {
            res.status(404).json({ error: 'Religion not found' });
            return;
        }

        res.status(200).json({ message: 'Religion updated successfully' });
    } catch (error) {
        console.error('Error updating religion:', error);
        res.status(500).json({ error: 'Failed to update religion' });
    }
};

export const deleteReligion = async (req: Request, res: Response): Promise<void> => {
    const religionId = req.params.id;

    try {
        const pool = await connectDB();
        const result = await pool
            .request()
            .input('id', sql.Int, religionId)
            .query('DELETE FROM Religions WHERE ReligionID = @id');

        if (result.rowsAffected[0] === 0) {
            res.status(404).json({ error: 'Religion not found' });
            return;
        }

        res.status(200).json({ message: 'Religion deleted successfully' });
    } catch (error) {
        console.error('Error deleting religion:', error);
        res.status(500).json({ error: 'Failed to delete religion' });
    }
};
