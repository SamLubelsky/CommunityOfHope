import { Request, Response } from 'express';
import { acceptHelpRequest, getAllHelpRequests, createHelpRequest, getAllActiveHelpRequests, deactivateHelpRequest, getHelpRequest} from '../models/helpRequestModel';
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
    const acceptedHelpRequests = (await getAllActiveHelpRequests()).filter((request)=> request.volunteer_id === volunteer_id);
    if(acceptedHelpRequests.length > 0){
      return res.status(400).json({error: 'You have already accepted a help request'});
    }
    try{
      const chat = await getChat(mom_id, volunteer_id); //will throw an error if chat does not exist
      console.log(chat);
      console.log("Chat already exists");
    } catch{
      console.log("Chat does not exist, creating chat");
      await createChat(volunteer_id, mom_id);
    }
    await acceptHelpRequest(id, volunteer_id);
    res.status(200).json({ message: 'Help request accepted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
export const deactivateRequest = async (req: Request, res: Response): Promise<any> => {
  if(!req.session || !req.session.userId || !req.session.role){
    return res.status(401).json({error: 'You are not logged in'});
  } 
  try {
    const acceptedHelpRequests = (await getAllActiveHelpRequests()).filter((request)=> request.volunteer_id === req.session.userId);
    if(acceptedHelpRequests.length === 0){
      return res.status(400).json({error: 'You have not accepted any help requests'});
    }
    const acceptedHelpRequest = acceptedHelpRequests[0];
    await deactivateHelpRequest(acceptedHelpRequest.id);
    res.status(200).json({ message: 'Help request accepted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
export const getRequestStatus = async (req: Request, res: Response): Promise<any> => {
  if(!req.session || !req.session.userId || !req.session.role){
    return res.status(401).json({error: 'You are not logged in'});
  }
  if(req.session.role !== "Mom"){
    return res.status(401).json({error: 'Only moms are authorized to access this route'});
  }
  try {
    const { userId } = req.session;
    const activeHelpRequests = await getAllActiveHelpRequests();
    const userRequests = activeHelpRequests.filter(request => request.mom_id === userId);
    if(userRequests.length > 0){
      const helpRequest = userRequests[0];
      const {volunteer_id} = helpRequest;
      if(volunteer_id){
        const volunteer_data = await getUserData(volunteer_id);
        const volunteer_name = volunteer_data.firstName + ' ' + volunteer_data.lastName;
        res.status(200).json({ status: 'Accepted', volunteerName: volunteer_name });
      } else{
        res.status(200).json({ status: 'Requested'});
      }
    } else{
      res.status(200).json({ status: 'Not Requested' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
// Add other controller functions (getById, update, delete)...