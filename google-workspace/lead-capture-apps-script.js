const SHEET_NAME = 'Website Leads';
const REQUIRED_PROPERTIES = ['NOTIFICATION_EMAIL'];
const OPTIONAL_PROPERTIES = ['LEADS_SPREADSHEET_ID', 'CREATE_GMAIL_DRAFT'];

function doPost(event) {
  try {
    assertConfiguration();

    const lead = normalizeLead(event && event.parameter ? event.parameter : {});

    if (lead.website) {
      return jsonResponse({ ok: true });
    }

    validateLead(lead);
    enforceRateLimit(lead.email);
    appendLeadToSheet(lead);
    sendLeadNotification(lead);

    if (String(getProperty('CREATE_GMAIL_DRAFT')).toLowerCase() === 'true') {
      createFollowUpDraft(lead);
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: error.message || 'Submission failed' });
  }
}

function doGet() {
  return jsonResponse({ ok: true, service: 'Rogers Holdings LLC lead capture' });
}

function normalizeLead(params) {
  return {
    submittedAt: clean(params.submittedAt) || new Date().toISOString(),
    firstName: clean(params.firstName),
    lastName: clean(params.lastName),
    email: clean(params.email).toLowerCase(),
    phone: clean(params.phone),
    company: clean(params.company),
    message: clean(params.message),
    sourceUrl: clean(params.sourceUrl),
    website: clean(params.website)
  };
}

function validateLead(lead) {
  if (!lead.firstName || !lead.lastName || !lead.email || !lead.message) {
    throw new Error('Missing required lead fields.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    throw new Error('Invalid email address.');
  }

  if (lead.message.length > 5000) {
    throw new Error('Message is too long.');
  }
}

function enforceRateLimit(email) {
  const cache = CacheService.getScriptCache();
  const key = 'lead:' + email;

  if (cache.get(key)) {
    throw new Error('Rate limit exceeded.');
  }

  cache.put(key, '1', 60);
}

function appendLeadToSheet(lead) {
  const sheet = getLeadSheet();
  const headers = [
    'Submitted At',
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Company',
    'Message',
    'Source URL'
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    lead.submittedAt,
    lead.firstName,
    lead.lastName,
    lead.email,
    lead.phone,
    lead.company,
    lead.message,
    lead.sourceUrl
  ]);
}

function getLeadSheet() {
  const properties = PropertiesService.getScriptProperties();
  let spreadsheetId = getProperty('LEADS_SPREADSHEET_ID');
  let spreadsheet;

  if (spreadsheetId) {
    spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  } else {
    spreadsheet = SpreadsheetApp.create(SHEET_NAME);
    spreadsheetId = spreadsheet.getId();
    properties.setProperty('LEADS_SPREADSHEET_ID', spreadsheetId);
    spreadsheet.getSheets()[0].setName(SHEET_NAME);
  }

  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function sendLeadNotification(lead) {
  const recipient = getProperty('NOTIFICATION_EMAIL');
  const subject = 'New website inquiry: ' + lead.firstName + ' ' + lead.lastName;
  const body = [
    'New Rogers Holdings LLC website inquiry',
    '',
    'Name: ' + lead.firstName + ' ' + lead.lastName,
    'Email: ' + lead.email,
    'Phone: ' + (lead.phone || 'Not provided'),
    'Company: ' + (lead.company || 'Not provided'),
    'Source: ' + (lead.sourceUrl || 'Not provided'),
    '',
    'Message:',
    lead.message
  ].join('\n');

  GmailApp.sendEmail(recipient, subject, body, {
    name: 'Rogers Holdings LLC Website',
    replyTo: lead.email
  });
}

function createFollowUpDraft(lead) {
  const subject = 'Thank you for contacting Rogers Holdings LLC';
  const body = [
    'Hi ' + lead.firstName + ',',
    '',
    'Thank you for reaching out to Rogers Holdings LLC. I received your inquiry and will review it soon.',
    '',
    'Best,',
    'Rogers Holdings LLC'
  ].join('\n');

  GmailApp.createDraft(lead.email, subject, body, {
    name: 'Rogers Holdings LLC'
  });
}

function assertConfiguration() {
  const missing = REQUIRED_PROPERTIES.filter(function (key) {
    return !getProperty(key);
  });

  if (missing.length) {
    throw new Error('Missing Script Properties: ' + missing.join(', '));
  }
}

function getProperty(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

function clean(value) {
  return String(value || '').trim();
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
