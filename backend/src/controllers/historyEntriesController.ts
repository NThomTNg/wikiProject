import { Request, Response } from 'express';
import sql from 'mssql';
import { connectDB } from '../config/db';
import { HistoryEntry, HistoryEntryWithRelations } from '../models/types';

export const getHistoryEntries = async (req: Request, res: Response) => {
    try {
        console.log('Fetching history entries...');
        const pool = await connectDB();
        
        const result = await pool.request().query(`
            SELECT h.*, 
                   n.Name as NationName, 
                   c.Name as CharacterName,
                   e.Title as EventTitle,
                   l.Name as LocationName,
                   r.Name as ReligionName
            FROM HistoryEntries h
            LEFT JOIN Nations n ON h.NationID = n.NationID
            LEFT JOIN Characters c ON h.CharacterID = c.CharacterID
            LEFT JOIN Events e ON h.EventID = e.EventID
            LEFT JOIN Locations l ON h.LocationID = l.LocationID
            LEFT JOIN Religions r ON h.ReligionID = r.ReligionID
            ORDER BY h.SortOrder, h.StartYear
        `);
        
        console.log(`Query completed. Found ${result.recordset.length} history entries`);
        res.json({ data: result.recordset as HistoryEntryWithRelations[] });
    } catch (error) {
        console.error('Error in getHistoryEntries:', error);
        res.status(500).json({ 
            error: 'Failed to fetch history entries',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getHistoryEntryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const pool = await connectDB();
        const result = await pool
            .request()
            .input('id', sql.Int, req.params.id)
            .query(`
                SELECT h.*, 
                       n.Name as NationName, 
                       c.Name as CharacterName,
                       e.Title as EventTitle,
                       l.Name as LocationName,
                       r.Name as ReligionName
                FROM HistoryEntries h
                LEFT JOIN Nations n ON h.NationID = n.NationID
                LEFT JOIN Characters c ON h.CharacterID = c.CharacterID
                LEFT JOIN Events e ON h.EventID = e.EventID
                LEFT JOIN Locations l ON h.LocationID = l.LocationID
                LEFT JOIN Religions r ON h.ReligionID = r.ReligionID
                WHERE h.HistoryID = @id
            `);
        
        if (result.recordset.length === 0) {
            res.status(404).json({ error: 'History entry not found' });
            return;
        }
        
        res.json({ data: result.recordset[0] as HistoryEntryWithRelations });
    } catch (error) {
        console.error('Error fetching history entry:', error);
        res.status(500).json({ error: 'Failed to fetch history entry' });
    }
};

export const addHistoryEntry = async (req: Request, res: Response): Promise<void> => {
    const {
        Title,
        Content,
        TimelinePeriod,
        StartYear,
        EndYear,
        Category,
        NationID,
        CharacterID,
        EventID,
        LocationID,
        ReligionID,
        SortOrder,
        ImageURL
    }: Partial<HistoryEntry> = req.body;

    if (!Title) {
        res.status(400).json({ error: 'Title is required' });
        return;
    }

    try {
        const pool = await connectDB();
        const result = await pool.request()
            .input('Title', sql.NVarChar(200), Title)
            .input('Content', sql.NVarChar(sql.MAX), Content)
            .input('TimelinePeriod', sql.NVarChar(100), TimelinePeriod)
            .input('StartYear', sql.Int, StartYear || null)
            .input('EndYear', sql.Int, EndYear || null)
            .input('Category', sql.NVarChar(100), Category)
            .input('NationID', sql.Int, NationID || null)
            .input('CharacterID', sql.Int, CharacterID || null)
            .input('EventID', sql.Int, EventID || null)
            .input('LocationID', sql.Int, LocationID || null)
            .input('ReligionID', sql.Int, ReligionID || null)
            .input('SortOrder', sql.Int, SortOrder || 0)
            .input('ImageURL', sql.NVarChar(500), ImageURL || null)
            .query(`
                INSERT INTO HistoryEntries (
                    Title, Content, TimelinePeriod, StartYear, EndYear,
                    Category, NationID, CharacterID, EventID, LocationID,
                    ReligionID, SortOrder, CreatedDate, LastModifiedDate, ImageURL
                )
                VALUES (
                    @Title, @Content, @TimelinePeriod, @StartYear, @EndYear,
                    @Category, @NationID, @CharacterID, @EventID, @LocationID,
                    @ReligionID, @SortOrder, GETDATE(), GETDATE(), @ImageURL
                );
                SELECT SCOPE_IDENTITY() AS HistoryID;
            `);

        const newHistoryID = result.recordset[0].HistoryID;
        res.status(201).json({ message: 'History entry added', HistoryID: newHistoryID });
    } catch (error) {
        console.error('Error adding history entry:', error);
        res.status(500).json({ error: 'Failed to add history entry' });
    }
};

export const updateHistoryEntry = async (req: Request, res: Response): Promise<void> => {
    const historyId = req.params.id;
    const {
        Title,
        Content,
        TimelinePeriod,
        StartYear,
        EndYear,
        Category,
        NationID,
        CharacterID,
        EventID,
        LocationID,
        ReligionID,
        SortOrder,
        ImageURL
    }: Partial<HistoryEntry> = req.body;

    if (!Title) {
        res.status(400).json({ error: 'Title is required' });
        return;
    }

    try {
        const pool = await connectDB();
        await pool.request()
            .input('HistoryID', sql.Int, historyId)
            .input('Title', sql.NVarChar(200), Title)
            .input('Content', sql.NVarChar(sql.MAX), Content)
            .input('TimelinePeriod', sql.NVarChar(100), TimelinePeriod)
            .input('StartYear', sql.Int, StartYear || null)
            .input('EndYear', sql.Int, EndYear || null)
            .input('Category', sql.NVarChar(100), Category)
            .input('NationID', sql.Int, NationID || null)
            .input('CharacterID', sql.Int, CharacterID || null)
            .input('EventID', sql.Int, EventID || null)
            .input('LocationID', sql.Int, LocationID || null)
            .input('ReligionID', sql.Int, ReligionID || null)
            .input('SortOrder', sql.Int, SortOrder || 0)
            .input('ImageURL', sql.NVarChar(500), ImageURL || null)
            .query(`
                UPDATE HistoryEntries
                SET Title = @Title,
                    Content = @Content,
                    TimelinePeriod = @TimelinePeriod,
                    StartYear = @StartYear,
                    EndYear = @EndYear,
                    Category = @Category,
                    NationID = @NationID,
                    CharacterID = @CharacterID,
                    EventID = @EventID,
                    LocationID = @LocationID,
                    ReligionID = @ReligionID,
                    SortOrder = @SortOrder,
                    LastModifiedDate = GETDATE(),
                    ImageURL = @ImageURL
                WHERE HistoryID = @HistoryID
            `);

        res.status(200).json({ message: 'History entry updated successfully' });
    } catch (error) {
        console.error('Error updating history entry:', error);
        res.status(500).json({ error: 'Failed to update history entry' });
    }
};

export const deleteHistoryEntry = async (req: Request, res: Response): Promise<void> => {
    const historyId = req.params.id;

    try {
        const pool = await connectDB();
        const result = await pool
            .request()
            .input('id', sql.Int, historyId)
            .query('DELETE FROM HistoryEntries WHERE HistoryID = @id');

        if (result.rowsAffected[0] === 0) {
            res.status(404).json({ error: 'History entry not found' });
            return;
        }

        res.status(200).json({ message: 'History entry deleted successfully' });
    } catch (error) {
        console.error('Error deleting history entry:', error);
        res.status(500).json({ error: 'Failed to delete history entry' });
    }
};
