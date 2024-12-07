import { Request, Response } from 'express';
import { getAllHelpRequests, createHelpRequest, getAllActiveHelpRequests, deactivateHelpRequest } from '../models/helpRequestModel';

export const getHelpRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const requests = await getAllHelpRequests();
    res.json({ Requests: requests });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const addHelpRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = await createHelpRequest(req.body);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getActiveHelpRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const requests = await getAllActiveHelpRequests();
    res.json({ Requests: requests });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deactivateRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await deactivateHelpRequest(parseInt(id));
    res.status(200).json({ message: 'Help request deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Add other controller functions (getById, update, delete)...