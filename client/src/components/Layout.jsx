import { useDispatch, useSelector } from "react-redux"; 
import { logout } from "../features/auth/authSlice";
import {LogOut, LayoutDashboard, Users, CheckSquare} from 'lucide-react'
import { Link, useLocation } from "react-router-dom";

const Layout = ({children})=> {
    const dispatch = useDispatch()
    const location = useLocation()
    const {user} = useSelector((state) =>state.auth)
    console.log("Current Redux User Data:", user);

    const isActive = (path) => location.pathname === path

    const navItemStyle = (path) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: isActive(path) ? '#334155' : 'transparent',
        color: isActive(path) ? '#38bdf8' : '#94a3b8',
        marginBottom: '8px',
        textDecoration: 'none'
    });

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
            {/* Sidebar */}
            <div style={{ width: '260px', backgroundColor: '#1e293b', color: 'white', padding: '24px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <h2 style={{ color: '#38bdf8', marginBottom: '40px', fontSize: '24px', fontWeight: 'bold', letterSpacing: '-0.5px' }}> CRM PRO </h2>

                <nav style={{ flex: 1 }}>
                    <Link to='/dashboard' style={navItemStyle('/dashboard')}>
                        <LayoutDashboard size={20} />
                        <span style={{ fontWeight: '500' }}>Dashboard</span>
                    </Link>
                    
                    <Link to='/contacts' style={navItemStyle('/contacts')}>
                        <Users size={20} />
                        <span style={{ fontWeight: '500' }}>Contacts</span>
                    </Link>
                    
                    <Link to='/tasks' style={navItemStyle('/tasks')}>
                        <CheckSquare size={20} />
                        <span style={{ fontWeight: '500' }}>Tasks</span>
                    </Link>
                </nav>

                {/* Optional: User Profile in Sidebar footer */}
                <div style={{ paddingTop: '20px', borderTop: '1px solid #334155', color: '#64748b', fontSize: '13px' }}>
                    Logged in as: <br/>
                    <strong style= {{ color: 'white', display: 'block', marginTop: '4px' }}>
                        {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : (user?.name || user?.email)}
                    </strong>
                </div>
            </div>

            {/* Main Content Wrapper */}
            <div style={{ flex: 1, backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Top Navbar */}
                <header style={{ 
                    height: '64px', 
                    backgroundColor: 'white', 
                    borderBottom: '1px solid #e2e8f0', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '0 32px',
                    flexShrink: 0
                }}>
                    <span style={{ color: '#64748b', fontSize: '15px' }}> 
                        Welcome back, <strong style={{ color: '#1e293b' }}>
                           {user?.name || user?.firstName || user?.username || user?.email?.split('@')[0] || 'User'}
                        </strong>
                    </span>
                    
                    <button 
                        onClick={() => dispatch(logout())} 
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none', background: 'none', color: '#ef4444', fontWeight: '600', fontSize: '14px' }}
                    >
                        <LogOut size={18} /> Logout 
                    </button>
                </header>

                {/* Main scrollable area */}
                <main style={{ 
                    padding: '32px', 
                    flex: 1, 
                    overflowY: 'auto', 
                    width: '100%', 
                    boxSizing: 'border-box' 
                }}>
                    <div style={{ maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Layout;