
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Login.css'; 

function SignupComponent() {
    // State Hooks for Form Inputs
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // State Hooks for UI Feedback
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        
        setError('');
        setIsLoading(true);
        if (password !== confirmPassword) {
            setError('Error: Passwords do not match.');
            setIsLoading(false);
            return;
        }

        try {
            // API Call targeting backend's signup endpoint
            const response = await fetch('http://localhost:5500/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username, 
                    email,
                    password 
                })
            });

            const data = await response.json();
            setIsLoading(false);

            if (response.ok) {
                // Success if redirected to Login page or Homepage
                alert('Sign Up successful! You can now log in.');
                navigate('/login'); 
            } else {
                // Failure if a display error from server 
                setError(data.error || 'Registration failed. Please check your data.');
            }
        } catch (err) {
            // Network Failure
            setIsLoading(false);
            setError('Network error. Failed to connect to server.');
            console.error("Signup Network Error:", err);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>User Sign Up</h2>
                
                {/* Conditional rendering of the error message */}
                {error && <div className="error-message">{error}</div>}
                
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Registering...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
}

export default SignupComponent;