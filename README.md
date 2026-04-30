 # Subscriber Balance Email Demo

A proof-of-concept full-stack automation system that sends a subscriber their points balance via email using a Node.js/Express backend and an n8n workflow.

## What This Project Does

1. A backend stores demo subscriber information in a SQLite database
2. A backend endpoint triggers an n8n workflow via webhook
3. n8n receives the subscriber ID, fetches their points balance and details from the backend
4. n8n sends a personalised email with the subscriber's name and points balance
5. The full process is tested and documented

## Project Structure
subscriber-dash-email-demo/
├── database/
│   └── init.js
├── routes/
│   └── subscribers.js
├── index.html
├── server.js
├── package.json
├── subscribers.db
├── QA-REPORT.md
├── RESEARCH-REPORT.md
└── DEBUGGING-REPORT.md
## Requirements

- Node.js v18 or higher
- npm
- n8n cloud account free trial or local n8n instance
- Mailtrap account free for test email inbox
- Cloudflare Tunnel to expose local backend

## Setup Instructions

Step 1 - Clone or extract the project and open the folder in VS Code.

Step 2 - Install dependencies by running npm install in the terminal.

Step 3 - Initialise the database by running node database/init.js in the terminal. This creates the SQLite database and seeds it with three demo subscribers.

Step 4 - Start the server by running node server.js in the terminal. Server runs on http://localhost:3000

Step 5 - Expose local backend using Cloudflare Tunnel. Open a new terminal and run npx cloudflared tunnel --url http://localhost:3000 and copy the URL it gives you.

Step 6 - Set up n8n workflow. Import the n8n-workflow.json file into your n8n instance. Update the HTTP Request node URLs with your Cloudflare tunnel URL. Update the SMTP credential with your Mailtrap sandbox credentials. Publish the workflow.

## API Endpoints

GET /api/subscribers/:id
Returns subscriber details by ID.
Example: GET http://localhost:3000/api/subscribers/1
Response: id, email, first_name, last_name, points_balance, created_at

GET /api/get-points-balance?id=1
Returns subscriber points balance by ID.
Example: GET http://localhost:3000/api/get-points-balance?id=1
Response: subscriberId and points_balance

POST /api/trigger-balance-email
Triggers the n8n workflow to send a balance email to the subscriber.
Request body: subscriberId
Response: success true, message, subscriberId

## Demo Subscribers

ID 1 - candidate-test@example.com - Test User - 100 points
ID 2 - demo1@example.com - Demo One - 250 points
ID 3 - demo2@example.com - Grace Sample - 0 points

## Frontend Page

Open your browser and go to http://localhost:3000
Enter a subscriber ID and click Send Balance Email to trigger the workflow from the UI.

## Testing

Import the postman-collection.json file into Postman and run all requests. The collection includes positive and negative tests for all three endpoints.

## n8n Workflow

Import n8n-workflow.json into your n8n instance. The workflow contains four nodes. Webhook Trigger receives subscriberId. Fetch Points Balance calls GET /api/get-points-balance. Fetch Subscriber Details calls GET /api/subscribers/:id. Send Email sends personalised email via Mailtrap SMTP.

## Tools Used

- Node.js and Express
- SQLite with better-sqlite3
- n8n Cloud
- Mailtrap sandbox SMTP
- Cloudflare Tunnel
- Postman
"# subscriber-balance-email-demo" 
