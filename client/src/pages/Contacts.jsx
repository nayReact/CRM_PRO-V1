import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteContact, fetchContacts } from '../features/contacts/contactSlics';
import { UserPlus, Trash2, Search, Edit2, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import EditContactModal from '../components/EditContactModal';
import AddContactModal from '../components/AddContactModal';

const Contacts = () => {
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')//search contacts
    const [filterPriority, setFilterPriority] = useState('All')
    const [editingContact, setEditingContact] = useState(null)//edit contacts

    
    // Redux state-Safety check: Fallback to empty array if contacts state is not yet initialized
    const { items = [], loading } = useSelector((state) => state.contacts || {});

    useEffect(() => {
        dispatch(fetchContacts());
    }, [dispatch]);

    //to handle detele
    const handleDelete = async(id) => {
        if(window.confirm('Are you sure? ')) {
            const resultAction = await dispatch(deleteContact(id))
            if(deleteContact.fulfilled.match(resultAction)) {
                toast.success("Contact deleted")
            } else {
                toast.error("Delete failed")
            }
        }
    }

    //filter based on searchTerm
    const filteredItems = items.filter((contact) => {
        const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase()
        const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                             contact.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesPriority = filterPriority === 'All' || contact.priority === filterPriority
        return matchesSearch && matchesPriority
    })
    console.log('search:', searchTerm, 'found:', filteredItems.length)
    //to group the contacts
    const stats = {
        total: items.length,
        leads: filteredItems.filter(item => item.status?.toLowerCase() === 'lead').length,
        clients: filteredItems.filter(item => item.status?.toLowerCase() === 'client').length
    }

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            {/* 1. Header & Stats Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: '0 0 5px 0' }}>Contacts Management</h3>
                    <p style={{ color: '#64748b', margin: 0 }}>Manage your leads and customer relationships</p>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <StatCard label="Total" value={stats.total} color="#3b82f6" />
                    <StatCard label="Leads" value={stats.leads} color="#f59e0b" />
                    <StatCard label="Clients" value={stats.clients} color="#10b981" />
                </div>
            </div>

            {/* 2. Toolbar: Search, Filter, and Add Button */}
            <div style={{ 
                display: 'flex', 
                gap: '15px', 
                backgroundColor: 'white', 
                padding: '15px', 
                borderRadius: '12px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                alignItems: 'center' 
            }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                        type='text' 
                        placeholder='Search by name or email...' 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}  
                        style={inputStyle}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Filter size={18} color="#64748b" />
                    <select 
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="All">All Priorities</option>
                        <option value="High"> High Priority</option>
                        <option value="Medium"> Medium Priority</option>
                        <option value="Low"> Low Priority</option>
                    </select>
                </div>

                <button onClick={() => setIsModalOpen(true)} style={addButtonStyle}>
                    <UserPlus size={18} /> Add Contact
                </button>
            </div>

            {/* 3. Table Area */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Priority</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Created</th>
                            <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading contacts...</td>
                            </tr>
                        ) : filteredItems.length > 0 ? (
                            filteredItems.map((contact) => (
                                <tr key={contact._id} style={{ borderBottom: '1px solid #f1f5f9' }} className="table-row-hover">
                                    <td style={tdStyle}>
                                        <Link to={`/contacts/${contact._id}`}
                                            style={{fontWeight: '600', color: '#3b82f6', textDecoration: 'none'}}>
                                                {contact.firstName} {contact.lastName}
                                        </Link>
                                    </td>
                                    <td style={{ ...tdStyle, color: '#64748b' }}>{contact.email}</td>
                                    <td style={tdStyle}>
                                        <span style={getPriorityStyle(contact.priority)}>{contact.priority || 'Medium'}</span>
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={{ 
                                            padding: '4px 10px', 
                                            borderRadius: '20px', 
                                            fontSize: '11px', 
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            backgroundColor: contact.status?.toLowerCase() === 'client' ? '#dcfce7' : '#fef9c3', 
                                            color: contact.status?.toLowerCase() === 'client' ? '#166534' : '#854d0e'
                                        }}>
                                            {contact.status || 'Lead'}
                                        </span>
                                    </td>
                                    <td style={{ ...tdStyle, color: '#94a3b8', fontSize: '13px' }}>
                                        {new Date(contact.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                            <button onClick={() => setEditingContact(contact)} style={actionButtonStyle('#3b82f6')}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(contact._id)} style={actionButtonStyle('#ef4444')}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                                    No contacts found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            <AddContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <EditContactModal 
                isOpen={editingContact !== null} 
                contact={editingContact} 
                onClose={() => setEditingContact(null)} 
            />
        </div>
    );
};

// --- Helper Components & Styles ---

const StatCard = ({ label, value, color }) => (
    <div style={{ backgroundColor: 'white', padding: '12px 20px', borderRadius: '10px', borderLeft: `4px solid ${color}`, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', minWidth: '140px' }}>
        <p style={{ margin: 0, color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>{label}</p>
        <h3 style={{ margin: '4px 0 0 0', color: '#1e293b', fontSize: '20px' }}>{value}</h3>
    </div>
);

const thStyle = { padding: '16px 20px', color: '#475569', fontWeight: '600', fontSize: '14px' };
const tdStyle = { padding: '16px 20px', fontSize: '14px' };

const inputStyle = {
    width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px',
    border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px'
};

const selectStyle = {
    padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc', color: '#475569', fontWeight: '600', cursor: 'pointer', outline: 'none'
};

const addButtonStyle = {
    display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#3b82f6',
    color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600', transition: 'background 0.2s'
};

const actionButtonStyle = (color) => ({
    border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer',
    color: color, padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center'
});

const getPriorityStyle = (priority) => {
    const colors = {
        High: { bg: '#fee2e2', text: '#991b1b' },
        Medium: { bg: '#fef3c7', text: '#92400e' },
        Low: { bg: '#f1f5f9', text: '#475569' }
    };
    const style = colors[priority] || colors.Medium;
    return {
        padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600',
        backgroundColor: style.bg, color: style.text
    };
};

export default Contacts;