import Contact from "../models/Contact.js";
import { sendResponse } from "../utils/ApiResponse.js";

export const createContact = async(req, res) => {
    try{
        const {firstName, lastName, email, phone, status} = req.body 

        const newContact = await Contact.create({
            firstName, 
            lastName,
            email,
            phone,
            status,
            tenantId: req.user.tenantId
        })
        return sendResponse(res, 201, newContact)
    } catch(error){
        return sendResponse(res, 500, null, error.message)
    }
}

export const getContacts = async(req, res) => {
    try{
        console.log(`Fetching for user: ${req.user.name} | Tenant: ${req.user.tenantId}`)

        const contacts = await Contact.find({ tenantId: req.user.tenantId })
        console.log(`contacts found:${contacts.length}`)
        return sendResponse(res, 200, contacts)
        //res.status(200).json({success:true, count: contacts.length, data: contacts})
    } catch(error){
        return sendResponse(res, 500, null, error.message)
        //res.status(500).json({success:false, message: error.message})
    }
}

export const updateContact = async(req, res) => {
    try {
        const {id} = req.params
        const contact = await Contact.findOne({ _id: id, tenantId: req.user.tenantId })
        if(!contact) {
            return sendResponse(res, 404, null, "Contact not found")
        }
       const updatedContact = await Contact.findByIdAndUpdate( id,
         { $set: req.body },
          {
            new: true,
            runValidators: true
        })
        return sendResponse(res, 200, updatedContact)

    } catch(error) {
        console.log('Update error', error.message)
        return sendResponse(res, 500, null, error.message)
    }
}

export const deleteContact = async(req, res) => {
    try{
        const contact = await Contact.findOneAndDelete({
            _id: req.params.id,
            tenantId: req.user.tenantId
        })
        if(!contact) {
            return sendResponse(res, 404, null, "Contact Not found")
        }
        return sendResponse(res, 200, {id: req.params.id}, "contact deleted")

    } catch(error) {
        return sendResponse(res, 500, null, error.message)
    }
}

export const updateContactStatus = async (req, res) => {
    try {
        const {status} = req.body
        const validateStatuses = ['Lead', 'Client']
        if(!validateStatuses.includes(status)) {
            return sendResponse(res, 400, null, 'Invalid status')
        }

        const contact = await Contact.findOne({
            _id: req.params.id,
            tenantId: req.user.tenantId
        })

        if(!contact) {
            return sendResponse(res, 404, null, 'Contact not found or unauthorised')
        } 

        contact.status = status
        const updatedContact = await contact.save()
        return sendResponse(res, 200, updatedContact)

    } catch(error) {
        console.log('Status update error: ', error.message)
        return sendResponse(res, 500, null, error.message)
    }
}

export const addContactNote = async(req, res) => {
    try { 
        const {text} = req.body
        const contact = await Contact.findOne({
            _id: req.params.id,
            tenantId: req.user.tenantId
        })

        if(!contact) {
            return sendResponse(res, 404, null, 'Contact not found')
        }
        contact.notes.unshift({
            text,
            author: req.user._id
        })
        await contact.save()
    return sendResponse(res, 201, contact.notes[0])
    } catch(error) {
        return sendResponse(res, 500, null, error.message)
    }
}

export const deleteContactNote = async(req, res) => {
    try{
        const {id, noteId } = req.params

        const contact = await Contact.findOneAndUpdate(
            {_id: id, tenantId: req.user.tenantId},
            {$pull: {notes: {_id: noteId }}},
            { new: true }
        )
        if(!contact) {
            return sendResponse(res, 404, null, 'Contact not found or unauthorised')
        }
        return sendResponse(res, 200, {noteId}, "Note deleted successfully ")
    } catch(error){
        return sendResponse(res, 500, null, error.message )
    }
}