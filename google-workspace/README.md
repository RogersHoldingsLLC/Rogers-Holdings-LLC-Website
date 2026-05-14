# Google Workspace Lead Capture Setup

This site is hosted as a static GitHub Pages website, so the simplest production-ready backend is a Google Apps Script web app. The website form submits to Apps Script, and Apps Script uses Google Workspace services to store and process the lead.

## What It Does

- Captures website inquiries from the Rogers Holdings LLC lead form.
- Adds each lead to a Google spreadsheet named `Website Leads`.
- Sends an email notification to `briankeith@rogersholdingsllc.com`.
- Optionally creates a Gmail draft follow-up email to the lead.
- Uses a honeypot field, required-field validation, email validation, message length validation, and a 60-second per-email rate limit.

## Files

- `index.html` contains the website lead form and client-side validation.
- `google-workspace/lead-capture-apps-script.js` is the Google Apps Script backend/API handler.
- `google-workspace/script-properties.example.env` lists the Apps Script environment properties to configure.

## Google Workspace Setup

1. Go to [script.google.com](https://script.google.com/).
2. Create a new Apps Script project named `Rogers Holdings Website Leads`.
3. Paste the contents of `google-workspace/lead-capture-apps-script.js` into `Code.gs`.
4. Open **Project Settings**.
5. Under **Script Properties**, add:

```text
NOTIFICATION_EMAIL=briankeith@rogersholdingsllc.com
CREATE_GMAIL_DRAFT=true
```

`LEADS_SPREADSHEET_ID` is optional. If you leave it blank, the script will create a spreadsheet named `Website Leads` the first time a valid lead is submitted and save the spreadsheet ID automatically.

6. Click **Deploy > New deployment**.
7. Select **Web app**.
8. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
9. Authorize the requested Google permissions for Sheets and Gmail.
10. Copy the deployed web app URL.
11. In `index.html`, set the lead form endpoint:

```html
<form class="lead-form" id="lead-form" data-endpoint="YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL" novalidate>
```

The web app URL is not a secret. Do not put OAuth client secrets, API keys, or private tokens into `index.html`.

## OAuth / API Credential Notes

This approach does not require manually creating OAuth client credentials in Google Cloud for the website. Apps Script handles the Google OAuth authorization flow when you deploy and authorize the web app.

Secrets and configuration belong in Apps Script **Script Properties**, not in the public website repository.

## Manual Test Checklist

After deployment:

1. Open the website contact section.
2. Submit the form with a real test email address.
3. Confirm a spreadsheet named `Website Leads` exists in Google Drive.
4. Confirm the spreadsheet has a row with:
   - Submitted At
   - First Name
   - Last Name
   - Email
   - Phone
   - Company
   - Message
   - Source URL
5. Confirm `briankeith@rogersholdingsllc.com` receives the notification email.
6. If `CREATE_GMAIL_DRAFT=true`, confirm a Gmail draft exists addressed to the lead.
7. Submit the same email twice within 60 seconds and confirm the second submission is rate limited by the backend.
8. Fill the hidden honeypot field using dev tools and confirm the submission is ignored.
9. Submit with an invalid email and confirm the front end blocks it.
10. Test on mobile and desktop.

## Production Notes

- Keep the form endpoint URL current after each Apps Script redeployment.
- If you rotate or recreate the spreadsheet, update `LEADS_SPREADSHEET_ID`.
- If spam increases, add stronger protection such as Google reCAPTCHA or Cloudflare Turnstile through a server-side verification step.
