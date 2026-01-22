import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from './authSlice';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); 
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) navigate('/dashboard');
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await dispatch(loginUser({ email, password })).unwrap();
                toast.success('Welcome back!');
            } else {
                // Here you would dispatch a registerUser thunk
                toast.success('Account created! Please sign in.');
                setIsLogin(true);
            }
        } catch (err) {
            toast.error(err || 'Authentication failed');
        }
    };

    const handleForgotPassword =() => {
        toast.info('Password reset link sent to youe email', {
            style: {
            borderRadius: '10px',
            background: '#334155',
            color: '#fff',
        },
        })
    }

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={iconContainerStyle}>
                        {isLogin ? <LogIn size={32} color="#38bdf8" /> : <UserPlus size={32} color="#10b981" />}
                    </div>
                    <h1 style={titleStyle}>{isLogin ? 'CRM PRO' : 'Join CRM PRO'}</h1>
                    <p style={subtitleStyle}>
                        {isLogin ? 'Enter your details to sign in' : 'Start managing your leads today'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={formStyle}>
                    {!isLogin && (
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Full Name</label>
                            <div style={inputWrapperStyle}>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={inputStyleNoIcon}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Email Address</label>
                        <div style={inputWrapperStyle}>
                            <Mail size={18} style={inputIconStyle} />
                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={inputStyle}
                                required
                            />
                        </div>
                    </div>

                    <div style={inputGroupStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label style={labelStyle}>Password</label>
                            {isLogin && <button onClick={handleForgotPassword} style={forgotPassStyle}>Forgot?</button>}
                        </div>
                        <div style={inputWrapperStyle}>
                            <Lock size={18} style={inputIconStyle} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={inputStyle}
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            ...buttonStyle,
                            backgroundColor: isLogin ? '#3b82f6' : '#10b981'
                        }}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div style={footerContainerStyle}>
                    <p style={footerTextStyle}>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </p>
                    <button 
                        onClick={() => setIsLogin(!isLogin)} 
                        style={toggleButtonStyle}
                    >
                        {isLogin ? 'Sign up for free' : 'Back to login'} 
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Updated Styles ---
const containerStyle = {
    height: '100vh', width: '100vw', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif"
};

const cardStyle = {
    backgroundColor: 'white', padding: '48px', borderRadius: '24px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    width: '100%', maxWidth: '440px'
};

const iconContainerStyle = {
    width: '64px', height: '64px', backgroundColor: '#f0f9ff',
    borderRadius: '16px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', margin: '0 auto 16px'
};

const titleStyle = { fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' };
const subtitleStyle = { fontSize: '15px', color: '#64748b', margin: 0 };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '14px', fontWeight: '600', color: '#475569' };
const inputWrapperStyle = { position: 'relative', display: 'flex', alignItems: 'center' };
const inputIconStyle = { position: 'absolute', left: '12px', color: '#94a3b8' };
const inputStyle = { width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none' };
const inputStyleNoIcon = { ...inputStyle, padding: '12px' };

const forgotPassStyle = { fontSize: '12px', color: '#3b82f6', cursor: 'pointer', fontWeight: '600', transition: 'color 0.2s', ':hover': { color: '#2563eb'}};

const buttonStyle = {
    width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
    color: 'white', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '12px'
};

const footerContainerStyle = { textAlign: 'center', marginTop: '32px' };
const footerTextStyle = { fontSize: '14px', color: '#64748b', margin: '0 0 4px 0' };
const toggleButtonStyle = {
    background: 'none', border: 'none', color: '#1e293b', fontWeight: '700',
    fontSize: '14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px'
};

export default AuthPage;