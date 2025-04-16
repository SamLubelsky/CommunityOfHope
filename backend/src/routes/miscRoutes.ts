import { Router } from 'express'
import {requireAuth} from '../authMiddleware'
import { getAutocomplete } from '../controllers/locationController'

const router = Router();

router.post('/autocomplete', requireAuth, getAutocomplete);

export default router;