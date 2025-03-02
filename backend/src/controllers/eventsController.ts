import { NextFunction, Request, Response } from 'express';
import sql from 'mssql';
import { connectDB } from '../config/db';

export const getEvents = async (req: Request, res: Response) => {
    try {
        const pool = await connectDB();
        
        const result = await pool.request().query(`
            SELECT e.EventID, e.Title, e.Description, e.EventDate, e.LocationID, e.NationID, 
            e.CreatedDate, e.LastModifiedDate,
            l.Name as LocationName, n.Name as NationName
            FROM Events e
            LEFT JOIN Locations l ON e.LocationID = l.LocationID
            LEFT JOIN Nations n ON e.NationID = n.NationID
            ORDER BY e.EventDate
        `);
        
        res.json({ data: result.recordset });
    } catch (error) {
        console.error('Error in getEvents:', error);
        res.status(500).json({ 
            error: 'Failed to fetch events',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
    try {
        const pool = await connectDB();
        const result = await pool
            .request()
            .input('id', sql.Int, req.params.id)
            .query(`
                SELECT e.*, l.Name as LocationName, n.Name as NationName
                FROM Events e
                LEFT JOIN Locations l ON e.LocationID = l.LocationID
                LEFT JOIN Nations n ON e.NationID = n.NationID
                WHERE e.EventID = @id
            `);
        
        if (result.recordset.length === 0) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        
        res.json({ data: result.recordset[0] });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
};

export const addEvent = async (req: Request, res: Response): Promise<void> => {
    const {
        Title,
        Description,
        EventDate,
        LocationID,
        NationID
    } = req.body;

    if (!Title) {
        res.status(400).json({ error: 'Title is required' });
        return;
    }

    try {
        const pool = await connectDB();
        const result = await pool.request()
            .input('Title', sql.NVarChar(200), Title)
            .input('Description', sql.NVarChar(sql.MAX), Description)
            .input('EventDate', sql.NVarChar(100), EventDate)
            .input('LocationID', sql.Int, LocationID || null)
            .input('NationID', sql.Int, NationID || null)
            .query(`
                INSERT INTO Events (
                    Title, Description, EventDate, LocationID, 
                    NationID, CreatedDate, LastModifiedDate
                )
                VALUES (
                    @Title, @Description, @EventDate, @LocationID,
                    @NationID, GETDATE(), GETDATE()
                );
                SELECT SCOPE_IDENTITY() AS EventID;
            `);

        const newEventID = result.recordset[0].EventID;
        res.status(201).json({ message: 'Event added', EventID: newEventID });
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ error: 'Failed to add event' });
    }
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
    const eventId = req.params.id;
    const {
        Title,
        Description,
        EventDate,
        LocationID,
        NationID
    } = req.body;

    if (!Title) {
        res.status(400).json({ error: 'Title is required' });
        return;
    }

    try {
        const pool = await connectDB();
        await pool.request()
            .input('EventID', sql.Int, eventId)
            .input('Title', sql.NVarChar(200), Title)
            .input('Description', sql.NVarChar(sql.MAX), Description)
            .input('EventDate', sql.NVarChar(100), EventDate)
            .input('LocationID', sql.Int, LocationID || null)
            .input('NationID', sql.Int, NationID || null)
            .query(`
                UPDATE Events
                SET Title = @Title,
                    Description = @Description,
                    EventDate = @EventDate,
                    LocationID = @LocationID,
                    NationID = @NationID,
                    LastModifiedDate = GETDATE()
                WHERE EventID = @EventID
            `);

        res.status(200).json({ message: 'Event updated successfully' });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
    const eventId = req.params.id;

    try {
        const pool = await connectDB();
        const result = await pool
            .request()
            .input('id', sql.Int, eventId)
            .query('DELETE FROM Events WHERE EventID = @id');

        if (result.rowsAffected[0] === 0) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
};
