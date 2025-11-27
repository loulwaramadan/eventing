
//This file handles the booking form and not the advising form as the advising form is only concerned with advising.js
document.addEventListener('DOMContentLoaded', () => {
    // This gets the elements using their ids from html and for the bookings api
    const bookingForm = document.getElementById('bookingForm'); 
    const serviceSelect = document.getElementById('eventType'); 
    const bookNowBtn = document.getElementById('bookNowButtonId'); 
    const bookingModal = document.getElementById('bookingModal'); 
    const closeBtn = document.querySelector('.modal-content .close-button');
    const cancelBookingBtn = document.getElementById('cancelBookingBtn');
    
    const token = localStorage.getItem('userToken');
    const API_BOOKING_URL = 'http://localhost:5500/api/bookings';

    if (!token) {
        alert('You must be logged in to book an event.');
        window.location.href = '/login';
        return;
    }


    const goBackAndCloseModal = () => {
        if (bookingModal) bookingModal.style.display = 'none'; 
        if (bookingForm) bookingForm.reset();             
    };

    if (bookNowBtn && bookingModal) {
        bookNowBtn.addEventListener('click', () => { 
            bookingModal.style.display = 'flex'; 
        });
    }

    if (closeBtn) { closeBtn.addEventListener('click', goBackAndCloseModal); }
    if (cancelBookingBtn) { cancelBookingBtn.addEventListener('click', goBackAndCloseModal); }
    
    window.addEventListener('click', (event) => {
        if (event.target === bookingModal) { goBackAndCloseModal(); }
    });


    if (bookingForm) {
        bookingForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 
            
            console.log("Submit handler started. Sending request...");
            
            const formData = {
                service_id: serviceSelect.value, //In order to handle the IDs for the event types in mysql
                event_date: document.getElementById('date').value, 
                event_time: document.getElementById('eventStartTime').value, 
                eventEndTime: document.getElementById('eventEndTime').value, 
                guest_count: parseInt(document.getElementById('guests').value), 
                location: 'Not Specified', 
                notes: ''
            };
            
            console.log("Data Payload:", formData);
            
            try {
                const response = await fetch(API_BOOKING_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify(formData)
                });
    
                const result = await response.json();
    
                if (response.ok) {
                    alert('Success! Booking submitted.');
                    goBackAndCloseModal();
                    window.location.href = '/eventing.html'; 
                } else {
                    
                    console.error('Server response error:', result.error); 
                    
                    if (response.status === 401 || response.status === 403) {
                         alert('Session expired. Please log in again.');
                         localStorage.removeItem('userToken');
                         window.location.href = '/login';
                    } else {
                        // Display the specific error message returned by the server
                        alert('Booking failed: ' + (result.error || 'Unknown error. Check Network tab for details.'));
                    }
                }
            } catch (error) {
                console.error('Network failure during submission:', error);
                alert('Network error. Failed to connect to server.');
            }
        });
    } else {
        // Error logging if the form element is not found on page load
        console.error("Error: The booking form element with ID 'bookingForm' was not found.");
    }
});