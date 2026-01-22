import { useState } from "react";
import { useDispatch } from "react-redux";
import { addContact } from "../features/contacts/contactSlics";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const AddContactModal = ({isOpen, onClose}) => {
    const dispatch = useDispatch()
    const [formData, setFormData] = useState( {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        status: 'Lead'
    })

    if(!isOpen) {
        return null
    }
    const handleSubmit = async(e) => {
        e.preventDefault()
        const resultAction = await dispatch(addContact(formData))

        if(addContact.fulfilled.match(resultAction)) {
            onClose()
        }

    }

    return (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, buttom: 0, background: 'rgba(0,0,0,0.5', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex:1000}}>
            <div style={{background:'white', padding: '30px', borderRadius: '12px', width: '400px', position: 'relative'}}>
                <button onClick={onClose} style={{position: "absolute", top:'15px', right: '15px', border: 'none', background:'none', cursor:'pointer'}}> 
                    <X size={20} color="#64748b"/>
                </button>
                <h3 style={{marginButtom: '20px'}}> Add New Contact </h3>
                <form onSubmit={handleSubmit}>
                    <div style={{marginBottom: '15px'}}>
                        <label style={{display: 'block', fontSize:'14px', color: '#64748b', marginBottom: '5px'}}> First Name: </label>
                        <input type="text" required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }} 
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                    </div>

                    <div style={{marginButtom: '15px'}}>
                        <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '5px' }} > Last Name: </label>
                        <input type="text" required style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0'}} 
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                    </div>

                    <div style={{marginButtom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '5px'}} > Email </label>
                        <input type="email" required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }} 
                            onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>

                    <div style={{marginButtom: '20px'}}>
                        <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '5px' }} > Status </label>
                        <select value={formData.status} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}>
                                <option value='Lead'> Lead </option>
                                <option value="Client"> Client </option>

                        </select>

                    </div>
                    <button type="submit" style={{ width:'100%', backgroundColor: '#3b82f6', color: 'white', border:'none', padding:'12px', borderRadius:'6px', fontWeight:'bold', cursor:'pointer'}}> Save Contact </button>

                </form>
            </div>
        </div>
    )
}

export default AddContactModal