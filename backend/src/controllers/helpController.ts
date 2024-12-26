import { Request, Response } from 'express';
import { getAllHelpRequests, createHelpRequest, getAllActiveHelpRequests, deactivateHelpRequest, getHelpRequest } from '../models/helpRequestModel';
import { getUserData, getAllUsers } from '../models/userModel';
import { createChat, getChat } from '../models/chatsModel';
import { getHeapSnapshot } from 'v8';
export const getHelpRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const requests = await getAllHelpRequests();
    const requestsWithNames = await Promise.all(requests.map(async (request) => {
      const momData = await getUserData(String(request.mom_id));
      const mom_name = momData.firstName + ' ' + momData.lastName;
      let volunteer_name = null;
      if(request.volunteer_id){
        const volunteerData = await getUserData(String(request.volunteer_id));
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
      // console.log("requestWithNames(singular): ", requestWithNames);
      return requestWithNames;
    }));
    // console.log("requestsWithNames(plural):", requestsWithNames);
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

export const acceptRequest = async (req: Request, res: Response): Promise<any> => {
  if(!req.session || !req.session.userId || !req.session.role){
    return res.status(401).json({error: 'You are not logged in'});
  } 
  try {
    const volunteer_id = req.session.userId;
    const { id } = req.params;
    const helpRequest = await getHelpRequest(id);
    const {mom_id} = helpRequest
    //create chat if none exists
    try{
      const chat = await getChat(mom_id, volunteer_id); //will throw an error if chat does not exist
      console.log(chat);
      console.log("Chat already exists");
    } catch{
      console.log("Chat does not exist, creating chat");
      await createChat(volunteer_id, mom_id);
    }
    await deactivateHelpRequest(id);
    res.status(200).json({ message: 'Help request accepted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Add other controller functions (getById, update, delete)...