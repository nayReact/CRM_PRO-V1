import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, deleteTask as deleteTaskAction, toggleTaskStatus } from "../features/tasks/taskSlice";
import { CheckSquare, Plus, Clock, AlertCircle, Trash2, CheckCircle, Circle } from 'lucide-react';
import AddTaskModal from "../components/AddTaskModal";

const Tasks = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.tasks);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    return (
        <div style={{ padding: '30px' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckSquare size={28} color="#3b82f6" />
                    <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: 0 }}> Tasks Management </h3>
                </div>
                <button onClick={() => setIsModalOpen(true)}
                    style={{
                        backgroundColor: '#3b82f6', color: 'white', padding: '10px 20px',
                        borderRadius: "8px", border: 'none', cursor: 'pointer',
                        fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px'
                    }}><Plus size={18} /> Add Task </button>
            </div>

            {/* List Container */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}> Loading tasks ... </div>
                ) : items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <AlertCircle size={40} color='#94a3b8' style={{ marginBottom: '10px' }} />
                        <p style={{ fontSize: '18px', marginBottom: '5px', color: '#64748b' }}> No tasks found </p>
                        <p style={{ fontSize: '14px', color: '#94a3b8' }}>Create your first task to stay organised </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {items.map((task) => (
                            <div key={task._id} style={{
                                padding: '15px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                opacity: task.status === 'Completed' ? 0.6 : 1,
                                transition: '0.3s'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    {/* Status Toggle Button */}
                                    <button 
                                        onClick={() => {
                                            const newStatus = task.status === 'Completed' ? 'To Do' : 'Completed';
                                            dispatch(toggleTaskStatus({ id: task._id, status: newStatus }));
                                        }}
                                        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                                    >
                                        {task.status === 'Completed' ? (
                                            <CheckCircle size={26} color="#10b981" />
                                        ) : (
                                            <Circle size={26} color="#cbd5e1" />
                                        )}
                                    </button>

                                    {/* Task Content */}
                                    <div>
                                        <h4 style={{ 
                                            margin: '0 0 5px 0', 
                                            color: '#1e293b',
                                            textDecoration: task.status === 'Completed' ? 'line-through' : 'none' 
                                        }}>
                                            {task.title}
                                        </h4>
                                        <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#64748b', alignItems: 'center' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={14} /> {new Date(task.dueDate).toLocaleDateString()}
                                            </span>

                                            {task.contactId && (
                                                <span style={{ backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', color: '#475569' }}>
                                                    👤 {task.contactId.firstName} {task.contactId.lastName}
                                                </span>
                                            )}
                                            <span> Priority: <strong>{task.priority}</strong></span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions & Status Badge */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        backgroundColor: task.status === 'Completed' ? '#dcfce7' : '#f1f5f9',
                                        color: task.status === 'Completed' ? '#166534' : '#475569'
                                    }}>
                                        {task.status}
                                    </span>
                                    
                                    <button 
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this task?')) {
                                                dispatch(deleteTaskAction(task._id));
                                            }
                                        }}
                                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Tasks;