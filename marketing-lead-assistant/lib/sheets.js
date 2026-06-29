import sheets from '@googleapis/sheets';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

function getAuth() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

export async function getSheetsClient() {
  const auth = getAuth();
  return sheets.sheets({ version: 'v4', auth });
}

export function leadFromRow(row = []) {
  return {
    id: row[0] || '',
    createdAt: row[1] || '',
    businessName: row[2] || '',
    sector: row[3] || '',
    city: row[4] || '',
    website: row[5] || '',
    phone: row[6] || '',
    email: row[7] || '',
    contactName: row[8] || '',
    service: row[9] || '',
    status: row[10] || 'Da contattare',
    notes: row[11] || '',
    lastContact: row[12] || '',
    nextFollowUp: row[13] || '',
    signature: row[14] || 'Riccardo - AppStream',
  };
}

export function leadToRow(lead) {
  return [
    lead.id,
    lead.createdAt,
    lead.businessName,
    lead.sector,
    lead.city,
    lead.website,
    lead.phone,
    lead.email,
    lead.contactName,
    lead.service,
    lead.status,
    lead.notes,
    lead.lastContact,
    lead.nextFollowUp,
    lead.signature || 'Riccardo - AppStream',
  ];
}

export async function listLeads() {
  const sheets = await getSheetsClient();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Leads!A2:O',
  });

  return (res.data.values || []).filter((r) => r[0]).map(leadFromRow);
}

export async function addLead(lead) {
  const sheets = await getSheetsClient();

  const newLead = {
    ...lead,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: lead.status || 'Da contattare',
    signature: lead.signature || 'Riccardo - AppStream',
  };

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Leads!A:O',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [leadToRow(newLead)] },
  });

  return newLead;
}

export async function appendHistory(entry) {
  const sheets = await getSheetsClient();

  const row = [
    crypto.randomUUID(),
    new Date().toISOString(),
    entry.leadId || '',
    entry.businessName || '',
    entry.messageType || '',
    entry.service || '',
    entry.text || '',
    entry.signature || 'Riccardo - AppStream',
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Storico!A:H',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });

  return { ok: true };
}
