import React,{useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "../features/tasks/taskSlice";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { fetchContacts } from "../features/contacts/contactSlics";

const AddTaskModal = ({isOpen, onClose}) => {
    const dispatch = useDispatch()
    const {items: contacts} = useSelector((state)=> state.contacts)

    useEffect(() => {
        if(isOpen && contacts.length === 0) {
            dispatch(fetchContacts())
        }
    }, [isOpen, contacts.length, dispatch])

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        contactId: ''
    })

    if(!isOpen) {
        return null
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        console.log("Form Data being sent:", formData);
            const resultAction = await dispatch(addTask(formData))
            console.log('Result Action: ', resultAction)
            if(addTask.fulfilled.match(resultAction)) {
                toast.success('Task created Successfully')
                onClose()
            setFormData({title: '', description:'', dueDate: '',priority:'Medium', contactId: ''})
        } else {
            const errorMessage = resultAction.payload || 'Something went wrong'
            console.log("Task failed:", resultAction.payload);
            toast.error(errorMessage);
        }
        
        
    }
    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '500px', position: 'relative' }}>
                <button onClick={onClose} style={{position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b'}}>
                    <X size={24} /> 
                </button>
                <h2 style={{marginBottom: '20px', color:'#1e293b'}}> Add New Task </h2>
                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    <input
                        type="text" placeholder="Task Tiltle" required
                        value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                        style={{padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0'}} 
                    />

                    <textarea
                        placeholder="Description" value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        style={{padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '80px'}} 
                    />
                    <div style={{ display:'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                        <input 
                            type="date" required value={formData.dueDate}
                            onChange={(e)=> setFormData({...formData, dueDate:e.target.value})} 
                            style={{padding: '12px', borderRadius: '8px', border: '1px solid #e228f0'}}
                        />
                        <select 
                            value={formData.priority} onChange={(e) =>setFormData({...formData, priority: e.target.value})}
                            style={{ padding:'12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <option value='Low'>Low Priority </option>
                                <option value= 'Medium'> Medium Priority</option>
                                <option value= 'High'> High Priority</option>

                        </select>
                    </div>
                    <select value={formData.contactId} onChange={(e) => setFormData({...formData, contactId: e.target.value})}
                        style={{padding:'12px', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                        <option value=''> Link to contact(Optional)</option>
                        {contacts.map(contact => (
                            <option key={contact._id} value={contact._id}>{contact.firstName} {contact.lastName} </option>
                        ))}
                    </select>
                    <button type="submit" style={{backgroundColor:'#3b82f6', color:'white', padding:'12px', borderRadius:'8px', border:'none', fontWeight:'600', cursor:'pointer', marginTop:'10px'}}> Create Task </button>
                </form>
            </div>
        </div>
    )
}

export default AddTaskModal