 # Debugging / Bug Investigation Report

## Scenario 1: Wrong Points Balance
**Problem:** The email says the subscriber has 0 points, but the data store shows 100 points.

### What I would check first:
I would start by checking the data directly in the database to confirm the correct value is actually stored there. I would run a direct query against the SQLite database to verify the points_balance field for that subscriber.

### Which endpoint I would test directly:
I would test GET /api/get-points-balance?id=1 directly in Postman to see what value the backend is returning. This isolates whether the problem is in the database, the backend endpoint, the n8n workflow, or the email template.

### How I would prove where the issue is:
I would follow this step by step process:

Step 1 — Test the database directly. Open the SQLite database and run SELECT points_balance FROM subscribers WHERE id = 1. If this returns 0, the problem is in the seed data or a previous update corrupted the value. If it returns 100, the database is correct and the problem is elsewhere.

Step 2 — Test the backend endpoint. Call GET /api/get-points-balance?id=1 in Postman. If it returns 0 but the database shows 100, the backend query has a bug. If it returns 100, the backend is correct.

Step 3 — Test the n8n workflow. Check the Fetch Points Balance node execution in n8n and look at the output data. If the node received 0, the issue is in how n8n is calling the endpoint or parsing the response. If it received 100 but the email shows 0, the issue is in the email template expression.

Step 4 — Check the email template. Look at the HTML in the Send Email node and verify the expression {{ $('Fetch Points Balance').item.json.points_balance }} is referencing the correct node and field name.

### What screenshots or evidence I would provide:
- Screenshot of the database showing the correct points_balance value
- Screenshot of Postman showing the GET /api/get-points-balance response
- Screenshot of the n8n Fetch Points Balance node output showing the data received
- Screenshot of the Send Email node showing the HTML template and expression used
- Screenshot of the actual email received showing the incorrect value

---

## Scenario 2: Email Not Sending
**Problem:** The backend says the workflow was triggered successfully, but no email arrives.

### What systems or logs I would check:
I would check these systems in order. First I would check the n8n Executions tab to see if the workflow ran and whether any node failed. Second I would check the Mailtrap inbox and spam folder to see if the email arrived but went unnoticed. Third I would check the Send Email node output in n8n to see if it returned a success or error response. Fourth I would check the SMTP credential settings in n8n to make sure the host, port, username, and password are all correct.

### How I would determine where the issue is:
If the n8n Executions tab shows the workflow did not run at all, the problem is between the backend and n8n — either the webhook URL is wrong or the workflow is not published. If the workflow ran but the Send Email node failed, the problem is with the SMTP credentials or email provider settings. If the Send Email node shows success but no email arrived, the problem is with the email provider itself — I would check Mailtrap's activity log to see if the email was received and processed.

### What proof I would provide:
- Screenshot of n8n Executions tab showing the execution and its status
- Screenshot of the Send Email node output showing success or error message
- Screenshot of Mailtrap inbox and activity log
- Screenshot of the SMTP credential settings showing host, port, and SSL settings

---

## Scenario 3: n8n Webhook Fails
**Problem:** The backend returns error: Failed to trigger automation workflow.

### What I would test:
First I would test the n8n webhook URL directly using Postman or curl by sending a POST request directly to the webhook URL with a test subscriberId. This tells me immediately whether n8n is reachable at all. If the direct test also fails, the problem is with n8n or the webhook URL itself. If the direct test succeeds, the problem is in how the backend is calling the webhook.

### What logs I would check:
I would check the backend error logs in the terminal to see the exact error message returned when the fetch call fails. I would also check the n8n Executions tab to see if any requests reached n8n at all. I would check whether the Cloudflare tunnel is running because if the tunnel is down, n8n cannot reach the backend even if the webhook itself is fine.

### What possible causes I would investigate:
First — wrong webhook URL. The URL in routes/subscribers.js might have a typo or might be pointing to the test webhook URL instead of the production URL. I would verify the URL matches exactly what is shown in the n8n webhook node under Production URL.

Second — workflow not published. If the n8n workflow is set to Inactive or is in draft mode, the production webhook will not respond. I would check that the workflow is set to Published in n8n.

Third — tunnel not running. If the Cloudflare tunnel is not running, n8n cannot reach the backend to fetch subscriber data, which could cause the workflow to fail after the webhook is received. I would verify all three services are running — the backend server, the Cloudflare tunnel, and n8n.

Fourth — network or firewall issue. The backend server might not have internet access to reach the n8n cloud URL. I would test by running a direct curl command from the same machine to the n8n webhook URL.
