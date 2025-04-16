import { Router } from 'express'
import {requireAuth} from '../authMiddleware'
import { getAutocomplete } from '../controllers/locationController'

const router = Router();

router.get('/autocomplete', requireAuth, getAutocomplete);

export default router;