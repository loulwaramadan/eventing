
My web application describes an event booking system where the users can book different events such as conferences, birthdays & parties, weddings, and proposals where we provide the clients with everything from the location to the setup and all the requirements for the success of the event as per the users’ request. The client can choose between different locations depending on its preferred choice and the number of invitees. Additionally, in order to help the client choose the most suitable setup according to their preferences, an advising session can be booked where advisors can assist and help the clients choose correctly.
Modifications: 
1-	“Our services” dropdown list became more structured and functional on-hover it will appear with correct links redirecting to the corresponding pages. 
2-	Added a login button that would redirect to a form that would help the user login in order to be able to book and if the user don’t have an account a “Invalid username” message will appear so the user can click the button near the “Don’t have an account” and will be directed to a sign in form.
3-	The “x” button at the top of the event booking form is now functional and will return the user to the previously opened page or in some cases to the homepage if the booking has been done from the boo now button in the navigation bar.
4-	A dropdown list has been added in the booking form where the user can select what type of event is booked.
Backend: 
I have created a mysql database with 4 tables: 1-Advising concerned with booking advising sessions to best know which event to book.
2-bookings handles event bookings
3-login/signup handles all the user credentials in order to be able to make a booking
4-options table that handle the different booking options
Front-End:
I have applied changes to the front-end and converted static HTML/JS pages into dynamic, state-driven React components and establish a hybrid routing. 
I have converted the signup and login files into react as well as the files that are in the src folder.
Any external resources used to resolve technical issues or implement features must be referenced below.
•	Resource 1 (React Router): Source: https://reactrouter.com/en/main/hooks/use-navigate
Gemini: https://gemini.google.com/app
W3Schools: https://www.w3schools.com
Claude Ai: https://claude.ai
Note: Regarding the GitHub repository I had to use the terminal on my brother’s PC due to technical issues, therefore the GitHub automatically logged in with his account

