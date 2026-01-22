import express from 'express'
import { createContact, getContacts, deleteContact, updateContact, updateContactStatus, addContactNote, deleteContactNote } from '../controllers/contactController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()
router.use(protect)

router.route('/')
    .get(getContacts)
    .post(createContact)

router.post('/:id/notes', addContactNote)
router.delete('/:id/notes/:noteId', deleteContactNote)

router.patch('/:id/status', updateContactStatus)

router.put('/:id', updateContact)
router.delete('/:id', deleteContact)
    

export default router
