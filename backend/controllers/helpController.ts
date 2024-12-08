import { Request, Response } from 'express';
import { getAllHelpRequests, createHelpRequest, getAllActiveHelpRequests, deactivateHelpRequest } from '../models/helpRequestModel';
import { getUserData, getAllUsers } from '../models/userModel';
export const getHelpRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const requests = await getAllHelpRequests();
    const requestsWithNames = await Promise.all(requests.map(async (request) => {
      const momData = await getUserData(request.mom_id);
      const mom_name = momData.firstName + ' ' + momData.lastName;
      let volunteer_name = null;
      if(request.volunteer_id){
        const volunteerData = await getUserData(request.volunteer_id);
        volunteer_name = volunteerData.firstName + ' ' + volunteerData.lastName;
      }

      const requestWithNames = {
        id: request.id,
        mom_id: request.mom_id,
        volunteer_id: request.volunteer_id,
        description: request.description,
        active: request.active,
        mom_name,
        volunteer_name,
      };
      console.log("requestWithNames(singular): ", requestWithNames);
      return requestWithNames;
    }));
    console.log("requestsWithNames(plural):", requestsWithNames);
    res.json({ Requests: requestsWithNames });
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

export const acceptRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await deactivateHelpRequest(parseInt(id));
    res.status(200).json({ message: 'Help request deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Add other controller functions (getById, update, delete)...