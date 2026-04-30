# Short Research Report: Email Automation System

## Question 1: Should user balance/custom fields be stored in n8n or in the application database? Explain why.

User balance and custom fields should always be stored in the application database, not in n8n.

n8n is a workflow automation tool, not a data store. It is designed to move and transform data between systems, not to hold it permanently. If you store user data inside n8n, you face several problems. First, the data is not easily accessible by other parts of your application. Second, n8n workflows can be deleted, modified, or broken, which would mean losing your data. Third, n8n has no proper querying, indexing, or relational capabilities like a real database does.

The application database, such as SQLite, PostgreSQL, or MySQL, is purpose-built for storing, querying, and managing data reliably. It gives you full control over the data, allows you to run complex queries, and keeps your data safe and consistent even if your automation workflows change.

In this demo, the points_balance field is correctly stored in the SQLite subscribers table. n8n only reads it when needed — it does not own or store it.

## Question 2: Why might a regular Google/Gmail SMTP account be risky for application or bulk emails?

Using a regular Gmail account for sending application or bulk emails carries several risks.

First, Gmail has strict daily sending limits. Personal Gmail accounts can send a maximum of around 500 emails per day. If your application exceeds this, emails will start failing silently or your account may be temporarily blocked.

Second, Google monitors accounts for unusual activity. If your application suddenly sends hundreds of emails, Google may flag the account as suspicious and lock it, blocking all email sending until you verify your identity manually.

Third, using your personal Gmail credentials in an application is a security risk. If your application code is ever exposed or your repository is accidentally made public, your Gmail username and password could be compromised, giving attackers access to your personal email account.

Fourth, Gmail is not designed for transactional or bulk email delivery. It lacks features like bounce handling, delivery tracking, open and click tracking, and unsubscribe management that proper email service providers offer.

For application emails, it is better to use a dedicated email service provider such as Mailgun, SendGrid, Postmark, or Amazon SES, which are designed for reliable, high-volume, trackable email delivery.

## Question 3: If a marketing email platform is not being used, how can email opens, clicks, bounces, and delivery status be tracked?

Without a marketing email platform, you can still track email events by building your own tracking system using the following techniques.

For delivery status and bounces, use an SMTP provider like Mailgun, SendGrid, or Amazon SES that provides webhook notifications. These services send a POST request to your backend whenever an email is delivered, bounced, or marked as spam. Your backend receives these events and logs them to your database.

For email opens, embed a tiny invisible tracking pixel — a one pixel by one pixel image — in your email HTML. The image URL points to your backend, for example /track/open?emailId=123. When the recipient opens the email, their email client loads the image, which triggers a request to your backend, and you record the open event.

For link clicks, replace all links in your email with redirect URLs that point to your backend first, for example /track/click?emailId=123&url=https://yoursite.com. When the recipient clicks the link, your backend logs the click and then redirects them to the original destination.

## Optional: Simple Database Table for Email Event History

```sql
CREATE TABLE email_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subscriber_id INTEGER NOT NULL,
  email_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  status TEXT NOT NULL,
  event_type TEXT,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscriber_id) REFERENCES subscribers(id)
);
```

This table stores one row per email event. The status field can hold values like sent, delivered, bounced, or failed. The event_type field can hold values like open, click, or unsubscribe. This gives you a complete history of all email activity linked back to each subscriber. 
