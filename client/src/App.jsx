import { useEffect } from 'react'
import { fetchTasks } from './features/tasks/taskSlice'
import { fetchContacts } from './features/contacts/contactSlics'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { getMe } from './features/auth/authSlice'
import Login from './features/auth/Login'
import Layout from './components/Layout'
import Contacts from './pages/Contacts'
import Tasks from './pages/Tasks'
import ContactDetail from './pages/ContactDetail'

const DashBoardHome = () => {
    const dispatch = useDispatch()

    const taskState = useSelector((state) => state.tasks)
    const contactState = useSelector((state) => state.contacts)

    const tasks = taskState?.items || []
    const contacts = contactState?.items || []

    useEffect(() => {
        if (tasks.length === 0) dispatch(fetchTasks())
        if (contacts.length === 0) dispatch(fetchContacts())
    }, [dispatch, tasks.length, contacts.length])

    const activeTasksCount = tasks.filter(t => t.status !== 'Completed').length
    const totalContacts = contacts.length

    const recentTasks = [...tasks]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)

    // Modern UI Styles
    const cardStyle = {
        padding: '30px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.06)',
        border: '1px solid #f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    };

    const labelStyle = {
        color: '#64748b',
        margin: '0 0 12px 0',
        fontSize: '13px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: '600'
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: '#1e293b', fontSize: '28px', margin: 0, fontWeight: '800' }}>
                    Dashboard Overview
                </h3>
            </div>

            {/* Stats Grid: Will expand to fill the width */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                gap: '24px' 
            }}>
                <div style={cardStyle}>
                    <h4 style={labelStyle}>Total Contacts</h4>
                    <p style={{ fontSize: '42px', fontWeight: '800', color: '#3b82f6', margin: 0 }}>{totalContacts}</p>
                </div>

                <div style={cardStyle}>
                    <h4 style={labelStyle}>Active Tasks</h4>
                    <p style={{ fontSize: '42px', fontWeight: '800', color: '#10b981', margin: 0 }}>{activeTasksCount}</p>
                </div>

                <div style={cardStyle}>
                    <h4 style={labelStyle}>Estimated Revenue</h4>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <p style={{ fontSize: '42px', fontWeight: '800', color: '#6366f1', margin: 0 }}>
                            ${(totalContacts * 150).toLocaleString()}
                        </p>
                    </div>
                    <small style={{ color: '#94a3b8', marginTop: '8px', fontWeight: '500' }}> Est. based on leads </small>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div style={{ 
                background: 'white', 
                borderRadius: '20px', 
                padding: '32px', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', 
                border: '1px solid #f1f5f9' 
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h4 style={{ color: '#1e293b', margin: 0, fontSize: '20px', fontWeight: '700' }}>Recent Activity</h4>
                    {/* Navigation helper */}
                    <Link to="/tasks" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
                        View All Tasks →
                    </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {recentTasks.length === 0 ? (
                        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}> No recent activity to show. </p>
                    ) : (
                        recentTasks.map(task => (
                            <div key={task._id} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                padding: '16px 0', 
                                borderBottom: '1px solid #f8fafc' 
                            }}>
                                <div>
                                    <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: '#334155', fontSize: '16px' }}>{task.title}</p>
                                    <small style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ color: task.status === 'Completed' ? '#10b981' : '#f59e0b' }}>
                                            {task.status === 'Completed' ? '●' : '○'}
                                        </span>
                                        {task.status === 'Completed' ? 'Finished' : 'Due'}: {new Date(task.dueDate).toLocaleDateString()}
                                    </small>
                                </div>
                                <span style={{
                                    fontSize: '11px',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontWeight: '700',
                                    letterSpacing: '0.025em',
                                    backgroundColor: task.status === 'Completed' ? '#dcfce7' : '#fef9c3',
                                    color: task.status === 'Completed' ? '#166534' : '#854d0e',
                                    textTransform: 'uppercase'
                                }}>
                                    {task.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

function App() {
    const dispatch = useDispatch()
    const { token, loading } = useSelector((state) => state.auth)

    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(getMe())
        }
    }, [dispatch])

    if (loading) return (
        <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
            <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#64748b', fontWeight: '600' }}>Loading CRM Pro...</p>
            </div>
        </div>
    )

    return (
        <>
            <Toaster position='top-right' reverseOrder={false} />
            <Router>
                <Routes>
                    <Route path='/' element={<Navigate to={token ? "/dashboard" : "/login"} />} />
                    <Route path='/login' element={!token ? <Login /> : <Navigate to='/dashboard' />} />                   
                    <Route 
                        path="/dashboard" 
                        element={token ? <Layout><DashBoardHome /></Layout> : <Navigate to="/login" />} 
                    />      
                    <Route 
                        path='/contacts' 
                        element={token ? <Layout><Contacts /></Layout> : <Navigate to='/login' />} 
                    />

                    <Route 
                        path='/tasks' 
                        element={token ? <Layout><Tasks /></Layout> : <Navigate to='/login' />} 
                    />
                    <Route path='/contacts/:id'
                        element={token ?<Layout> <ContactDetail /> </Layout> : <Navigate to='/login' />} 
                    />
                </Routes>
            </Router>
        </>
    );
}

export default App