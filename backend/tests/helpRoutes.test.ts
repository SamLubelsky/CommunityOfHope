// backend/routes/helpRoutes.ts
import express from 'express';
import { 
  getAllHelpRequests,
  getHelpRequestById,
  createHelpRequest,
  updateHelpRequest,
  deleteHelpRequest
} from '../models/helpRequestModel';

const router = express.Router();

router.get('/help_requests', async (req, res) => {
  try {
    const requests = await getAllHelpRequests();
    res.json({ help_requests: requests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/help_requests/:id', async (req, res) => {
  try {
    const request = await getHelpRequestById(parseInt(req.params.id));
    res.json({ help_request: request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/help_requests', async (req, res) => {
  try {
    const id = await createHelpRequest(req.body);
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/help_requests/:id', async (req, res) => {
  try {
    await updateHelpRequest(parseInt(req.params.id), req.body);
    res.json({ message: 'Help request updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/help_requests/:id', async (req, res) => {
  try {
    await deleteHelpRequest(parseInt(req.params.id));
    res.json({ message: 'Help request deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;