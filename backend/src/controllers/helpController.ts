import { Request, Response } from 'express';
import { acceptHelpRequest, getAllHelpRequests, createHelpRequest, getAllActiveHelpRequests, deactivateHelpRequest, getHelpRequest} from '../models/helpRequestModel';
import { getUserData, getAllUsers, getAllVolunteers } from '../models/userModel';
import { createChat, getChat } from '../models/chatsModel';
import { getHeapSnapshot } from 'v8';
import { sendNotification, sendNotifications } from "../notifications/notifications";
export const getHelpRequests = async (req: Request, res: Response): Promise<any> => {
  try {
    const requests = await getAllHelpRequests();
    // console.log("requestsWithNames(plural):", requestsWithNames);
    return res.json({ Requests: requests });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const addHelpRequest = async (req: Request, res: Response): Promise<any> => {
  if(req.session.role !== "Mom"){
    return res.status(401).json({error: 'Only moms can create help requests'});
  }
  const activeHelpRequests = await getAllActiveHelpRequests();
  const userRequests = activeHelpRequests.filter(request => request.mom_id === req.session.userId);
  if(userRequests.length > 0){
    return res.status(400).json({error: 'You already have an active help request'});
  }
  try {
    const id = await createHelpRequest(req.body);
    let messageBody = "New help request has been created!";
    if(req.body.emergency){
      let messageBody = "New EMERGENCY help request has been created!";
    }
    const volunteers = await getAllVolunteers();
    const volunteerIds = volunteers.map((volunteer) => volunteer.id);
    const notificationData = {
      sound: 'default',
      body: messageBody,
      data: {},
    }
    sendNotifications(volunteerIds, notificationData);
    return res.status(201).json({ id });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
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

export const getUnclaimedHelpRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const requests = await getAllActiveHelpRequests();
    res.json({ Requests: requests });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};


export const acceptRequest = async (req: Request, res: Response): Promise<any> => {
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

    const notificationData = {
      sound: 'default',
      body: 'Your help request has been accepted!',
      data: {},
    }
    sendNotification(mom_id, notificationData);


    res.status(200).json({ message: 'Help request accepted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
export const deactivateRequest = async (req: Request, res: Response): Promise<any> => {
  try {
    const acceptedHelpRequests = (await getAllActiveHelpRequests()).filter((request)=> request.volunteer_id === req.session.userId);
    if(acceptedHelpRequests.length === 0){
      return res.status(400).json({error: 'You have not accepted any help requests'});
    }
    const acceptedHelpRequest = acceptedHelpRequests[0];
    await deactivateHelpRequest(acceptedHelpRequest.id);
    res.status(200).json({ message: 'Help request deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
export const getRequestStatus = async (req: Request, res: Response): Promise<any> => {
  if(req.session.role === "Volunteer" || req.session.role === "Admin"){
    try {
      const { userId } = req.session;
      const activeHelpRequests = await getAllActiveHelpRequests();
      const userRequests = activeHelpRequests.filter(request => request.volunteer_id === userId);
      if(userRequests.length > 0){
        const helpRequest = userRequests[0];
        const {mom_id} = helpRequest;
        const mom_data = await getUserData(mom_id);
        const mom_name = mom_data.firstName + ' ' + mom_data.lastName;
        res.status(200).json({ status: 'Accepted', momName: mom_name, helpId: helpRequest.id });
      } else{
        res.status(200).json({ status: 'Not Accepted' });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
  if(req.session.role === "Mom"){
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
  }
};
// Add other controller functions (getById, update, delete)...