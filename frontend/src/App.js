import React, { useEffect } from 'react'; // <--- CRITICAL: useEffect imported here
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from './components/Auth/Login'; 
import SignupComponent from './components/Auth/Signup'; 


const StaticRedirect = ({ to }) => {
    useEffect(() => {
        // Forces the browser to navigate to the external file path
        window.location.href = to;
    }, [to]); 
    return null; // Renders nothing while waiting for the redirect
};

const HomePage = () => {
    // Redirect immediately to homepage
    return <StaticRedirect to="/eventing.html" />;
};

function App() {
    return (
        <Router>
            <div className="App">  
                <Routes>
                    <Route path="/" element={<HomePage />} /> 
                    <Route path="/login" element={<LoginComponent />} /> 
                    <Route path="/signup" element={<SignupComponent />} /> 
                </Routes>
            </div>
        </Router>
    );
}
export default App;