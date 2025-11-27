// client/src/components/Auth/Login.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import './Login.css'; 

function LoginComponent() {
    // State hooks for form data and UI feedback
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Submission Handler
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        
        setError('');
        setIsLoading(true); 
        
        try {
            // API Call targeting backend's login endpoint
            const response = await fetch('http://localhost:5500/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: username, 
                    password: password 
                })
            });

            const data = await response.json();
            setIsLoading(false);

            if (response.ok) {
                // Success if then has been stored
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userId', data.user_id); 

                alert('Login successful!');
                // Redirect to HTML homepage file.
                window.location.href = '/eventing.html'; 
            } else {
                // Failure if a display error from server
                setError(data.error || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            // Network Failure
            setIsLoading(false);
            setError('Network error. Failed to connect to server.');
            console.error("Login Network Error:", err);
        }
    };
    //rendering components
    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>User Login</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <label htmlFor="username">Username/Email:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
                
               
                <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
                    Don't have an account? 
                    <Link to="/signup" style={{ marginLeft: '5px', color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
                        Sign up here
                    </Link>
                </p>
              
            </form>
        </div>
    );
}

export default LoginComponent;