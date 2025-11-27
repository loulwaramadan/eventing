// advisingForm.js (Final Version with Confirmed Redirect Logic)

document.addEventListener('DOMContentLoaded', () => {
    
    // This is to be able to access the forms using their ids
    const advisingForm = document.getElementById('advisingForm'); 
    const bookingModal = document.getElementById('bookingModal'); 
    const token = localStorage.getItem('userToken'); 
    const API_ADVISING_URL = 'http://localhost:5500/api/advising';

    
    const resetFormAndClose = () => {
        if (advisingForm) advisingForm.reset();
        if (bookingModal) bookingModal.style.display = 'none'; 
        
        // Critical to be able to go back to the homepage
        setTimeout(() => {
            window.location.href = '/eventing.html'; 
        }, 50); // Small 50ms delay
    };
   

    if (!token) {
        alert('You must be logged in to book an appointment.');
        window.location.href = '/login';
        return;
    }

    if (advisingForm) {
        advisingForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 
            
            // Form filling to be able to get the info in the database
            const formData = {
                date: document.getElementById('date').value, 
                start_time: document.getElementById('eventStartTime').value, 
                end_time: document.getElementById('eventEndTime').value,
                
                name: document.getElementById('name').value, 
                email: document.getElementById('email').value, 
            };
            
            try {
                
                const response = await fetch(API_ADVISING_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify(formData)
                });
    
                const result = await response.json();
    
                // if the appointment has been successfully booked a message should appear
                if (response.ok) {
                    alert('Success! Your advising appointment has been submitted.');
                    resetFormAndClose(); // Homepage redirection
                } else if (response.status === 401 || response.status === 403) {
                    alert('Session expired. Please log in again.');
                    localStorage.removeItem('userToken');
                    window.location.href = '/login';
                } else {
                    console.error('Server response error:', result.error); 
                    alert('Appointment booking failed: ' + (result.error || 'Unknown error. Check the server terminal.'));
                }
            } catch (error) {
                console.error('Network failure during submission:', error);
                alert('Network error. Failed to connect to server. Check server status.');
            }
        });
    }
});