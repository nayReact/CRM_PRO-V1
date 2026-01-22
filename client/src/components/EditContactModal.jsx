import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { editContact } from "../features/contacts/contactSlics";
import { Contact, X } from "lucide-react";
import toast from "react-hot-toast";

const EditContactModal = ({isOpen,onClose, contact}) => {
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({ 
        firstName: '',
        lastName: '',
        email: '',
        status: 'Lead'
    })
    useEffect(() => {
        if(isOpen && contact && contact._id) {
            console.log('data received in modal', contact)
            setFormData({
                firstName: contact.firstName || '',
                lastName: contact.lastName || '',
                email: contact.email || "",
                status: contact.status || 'Lead'
            })
        }
    }, [isOpen, contact])

    if(!isOpen) {
        return null
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(!contact || !contact._id) {
            toast.error('error: contact id missing')
            return
        }
        const resultAction = await dispatch(editContact({
             id: contact._id, 
             contactData: formData 
            }))
        if(editContact.fulfilled.match(resultAction)) {
            toast.success('Contact updated successfully!')
            onClose()
        } else{
            toast.error(resultAction.payload || 'Update Failed')
        }
    }

    return(
        <div style={{position: 'fixed', top:0, left:0, right:0, buttom:0,backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: "center", zIndex:1000}}>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px', position: 'relative' }}>
                <button onClick={onClose} style={{positon: 'absolute', top:'15px', right:'15px', border: 'none', background:'none', cursor:'pointer' }}>
                     < X size={20} color="#64748b"/> </button>
                     <h3 style={{marginButton: '20px' }}> Edit Contacts </h3>
                     
                     <form onSubmit={handleSubmit}>
                        <div style={{marginBottom:"15px"}}>
                            <label style={{displa: 'block', fontSize:'14px', color:'#64748b', marginBottom:'5px'}}> FirstName </label>
                            <input 
                                type="text"
                                required
                                value={formData.firstName}
                                style={{width: '100%', padding:'8px', borderRadius: '4px', border: '1px solid #e2e8f0'}}
                                onChange={(e)=> setFormData({...formData, firstName: e.target.value})} 
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '5px' }}> Last Name </label>
                            <input 
                                type="text"
                                required
                                value={formData.lastName}
                                style={{width: '100%', padding:'8px', borderRadius: '4px', border: '1px solid #e2e8f0'}}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '5px' }}>Email </label>
                            <input
                                type="text"
                                required
                                value={formData.email}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                                onChange={(e) => setFormData({...formData, email:e.target.value})} 
                            />
                        </div>
                        <div style={{marginButtom: '20px'}}>
                            <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '5px' }}> Status </label>
                            <select 
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status:e.target.value})}
                            >
                                <option value='Lead'> Lead </option>
                                <option value='Client'>Client</option>

                            </select>
                        </div>
                        <button type="submit" style={{width: '100%', backgroundColor: '#3b82f6', color:'white', border:'none', padding:'12px', borderRadius:'6px', fontWeight:'bold', cursor:'pointer' }}> Update Contact </button>
                     </form>
            </div>
        </div>

    )
}

export default EditContactModal