Project Summary: Gas Station Finder in Cologne 
This project is a Single Page Application (SPA) that displays gas stations in Cologne, Germany. Users can search and sort gas stations by street name. The backend provides CRUD operations to manage the gas station data.

📌 Technologies Used
Frontend (Client-Side)
Languages & Frameworks:

HTML → Structure of the webpage
CSS → Styling the page (Buttons, layout, colors)
JavaScript (Vanilla) → Fetch data from the backend and update UI dynamically
Key Functionalities:

Fetches JSON data from the backend (/streets API)
Allows searching and sorting of gas stations
Displays gas stations with their addresses & locations
Backend (Server-Side)
Language & Framework:

Node.js (JavaScript runtime for backend)
Express.js (Fast framework for creating REST APIs)
Key Functionalities:

CRUD API (Create, Read, Update, Delete) for gas stations
Uses MongoDB Atlas (Cloud database) to store gas station data
Hosted on Render (Free hosting for backend APIs)






Database
MongoDB Atlas (Cloud Database)
Stores gas stations in a collection named streets
Each document (record) contains:

{
  "_id": "ObjectId",
  "adresse": "Street Name",
  "geometry": { "lat": 50.123, "lng": 6.789 }
}


📌 How the Project is Hosted & Connected?
 Backend Deployment (Render)
Code is pushed to GitHub
Render pulls the code from GitHub and runs server.js
API is now available at:
👉 https://tankstellen-backend.onrender.com

2️⃣ Frontend Deployment (GitHub Pages)
Code is in the GitHub repository
GitHub Pages is used to host the frontend
Users can visit the site at:
👉 https://ahdpromise.github.io/tankstellenP/
The frontend fetches data from:
👉 https://tankstellen-backend.onrender.com/streets


/// Explanation of Each File ///
	Frontend Files (GitHub Pages)
	 index.html → The main webpage
	 style.css → CSS styles for layout & design
	 script.js → Fetches & displays gas station data


Backend Files (Render)
	server.js → Main backend file (API logic, CRUD operations)
	.env → Stores MongoDB connection string (not uploaded to GitHub)
	 package.json → Dependencies for Node.js & Express


Summary of Project Flow
- User visits the GitHub Pages site
- Frontend (JavaScript) fetches gas station data from the backend API
- Backend (Node.js + Express) gets data from MongoDB Atlas
- Data is displayed on the website with search & sorting features

Final Setup
** Frontend on GitHub Pages
** Backend on Render
** MongoDB Atlas connected
** GitHub handles version control & deployments



