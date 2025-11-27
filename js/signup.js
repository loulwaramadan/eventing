// signup.js

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    if (signupForm) {
        signupForm.addEventListener('submit', async function(event) {
            // 1. Stop the default page refresh
            event.preventDefault();

            // 2. Retrieve form values using their IDs
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const first_name = document.getElementById('first_name').value; // Ensure this ID is correct!
            const last_name = document.getElementById('last_name').value;   // Ensure this ID is correct!

            // 3. Basic Client-side Validation (Prevents sending NULL to NOT NULL columns)
            if (!username || !email || !password || !first_name || !last_name) {
                alert('Please fill out all required fields.');
                return;
            }

            // Create the data payload
            const formData = {
                username: username,
                email: email,
                password: password,
                first_name: first_name,
                last_name: last_name
            };

            // Temporary debug check (Check your browser console!)
            console.log('Attempting to send data:', formData); 

            try {
                // 4. Send the data to the backend API
                const response = await fetch('http://localhost:5500/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                // Get JSON data from the response
                const data = await response.json(); 

                // 5. Handle Server Response
                if (response.ok) {
                    // Success (Status 201)
                    alert('Registration successful! You can now log in.');
                    console.log('Server response:', data);
                    // Redirect to the login page
                    window.location.href = 'login.html'; 
                } else {
                    // Server Error (Status 409 for duplicate, 500 for internal error, etc.)
                    console.error('Sign up failed:', data);
                    alert('Error: ' + (data.error || 'An unknown error occurred during registration.'));
                }
            } catch (error) {
                // Network or Fetch Error (e.g., server is down)
                console.error('Fetch failed or server connection lost:', error);
                alert('Connection to the server could not be established. Please try again later.');
            }
        });
    } else {
        console.error('Error: Signup form element not found. Check your HTML ID.');
    }
});