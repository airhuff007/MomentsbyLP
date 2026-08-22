/**
 * Creator Community lead capture → GoHighLevel
 *
 * POST /.netlify/functions/community-join
 *
 * Required Netlify env vars (never expose client-side):
 *   GHL_API_KEY       — GoHighLevel Private Integration / API token
 *   GHL_LOCATION_ID   — GHL Location ID
 *
 * Optional:
 *   GHL_API_BASE      — default https://services.leadconnectorhq.com
 *   GHL_API_VERSION   — default 2021-07-28
 *
 * See docs/ghl-community-form.md for field and tag mapping.
 */

const GHL_API_BASE = process.env.GHL_API_BASE || 'https://services.leadconnectorhq.com';
const GHL_API_VERSION = process.env.GHL_API_VERSION || '2021-07-28';

const ALLOWED_ROLES = new Set([
  'role-photographer',
  'role-model',
  'role-content-creator',
  'role-videographer',
  'role-makeup-artist',
  'role-stylist',
  'role-brand-owner',
  'role-other',
]);

const ALLOWED_INTERESTS = new Set([
  'interest-collaboration',
  'interest-education',
  'interest-styled-shoots',
  'interest-portfolio',
  'interest-creative-coffee',
  'interest-casting',
  'interest-photography-education',
  'interest-community-calls',
]);

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(body),
  };
}

function parseBody(event) {
  const contentType = String(event.headers['content-type'] || event.headers['Content-Type'] || '');
  const raw = event.body || '';
  const decoded = event.isBase64Encoded ? Buffer.from(raw, 'base64').toString('utf8') : raw;

  if (contentType.includes('application/json')) {
    return JSON.parse(decoded || '{}');
  }

  // application/x-www-form-urlencoded or multipart-ish FormData as urlencoded from fetch+FormData
  // Netlify receives multipart; for FormData from fetch without explicit content-type,
  // browsers set multipart/form-data. Parse urlencoded fallback; for multipart use URLSearchParams-like.
  if (contentType.includes('application/x-www-form-urlencoded') || !contentType) {
    const params = new URLSearchParams(decoded);
    return paramsToObject(params);
  }

  if (contentType.includes('multipart/form-data')) {
    return parseMultipart(decoded, contentType);
  }

  // Last resort: try URLSearchParams
  try {
    return paramsToObject(new URLSearchParams(decoded));
  } catch {
    return {};
  }
}

function paramsToObject(params) {
  const data = {};
  for (const [key, value] of params.entries()) {
    if (key === 'interests') {
      if (!data.interests) data.interests = [];
      data.interests.push(value);
    } else if (key in data) {
      if (!Array.isArray(data[key])) data[key] = [data[key]];
      data[key].push(value);
    } else {
      data[key] = value;
    }
  }
  return data;
}

function parseMultipart(body, contentType) {
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) return {};
  const boundary = boundaryMatch[1] || boundaryMatch[2];
  const parts = body.split('--' + boundary);
  const data = {};

  for (const part of parts) {
    if (!part || part === '--' || part === '--\r\n') continue;
    const sep = part.indexOf('\r\n\r\n');
    if (sep === -1) continue;
    const header = part.slice(0, sep);
    let value = part.slice(sep + 4);
    value = value.replace(/\r\n$/, '').replace(/\r\n--$/, '');
    const nameMatch = header.match(/name="([^"]+)"/i);
    if (!nameMatch) continue;
    const name = nameMatch[1];
    if (name === 'interests') {
      if (!data.interests) data.interests = [];
      data.interests.push(value);
    } else {
      data[name] = value;
    }
  }
  return data;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function normalizeInterests(value) {
  if (!value) return [];
  const list = Array.isArray(value) ? value : [value];
  return list.filter((item) => ALLOWED_INTERESTS.has(item));
}

function buildTags(role, interests) {
  const tags = ['community-member'];
  if (role && ALLOWED_ROLES.has(role)) tags.push(role);
  for (const interest of interests) tags.push(interest);
  return [...new Set(tags)];
}

async function upsertGhlContact(payload) {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) {
    const err = new Error('GoHighLevel is not configured on the server.');
    err.statusCode = 503;
    throw err;
  }

  const response = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: GHL_API_VERSION,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const err = new Error((data && (data.message || data.msg)) || 'GoHighLevel request failed');
    err.statusCode = 502;
    err.details = data;
    throw err;
  }

  return data;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, message: 'Method not allowed' });
  }

  let data;
  try {
    data = parseBody(event);
  } catch {
    return json(400, { ok: false, message: 'Invalid request body' });
  }

  // Honeypot — bots fill this; respond as success without CRM write
  if (String(data.website || '').trim()) {
    return json(200, { ok: true, skipped: true });
  }

  const firstName = String(data.first_name || '').trim();
  const lastName = String(data.last_name || '').trim();
  const email = String(data.email || '').trim().toLowerCase();
  const phone = String(data.phone || '').trim();
  const instagram = String(data.instagram || '').trim();
  const city = String(data.city || '').trim();
  const role = String(data.primary_role || '').trim();
  const consent = String(data.consent || '').trim().toLowerCase();
  const interests = normalizeInterests(data.interests);

  if (!firstName || !lastName || !isValidEmail(email) || !instagram || !city || !role) {
    return json(400, { ok: false, message: 'Missing or invalid required fields' });
  }
  if (!ALLOWED_ROLES.has(role)) {
    return json(400, { ok: false, message: 'Invalid primary role' });
  }
  if (consent !== 'yes') {
    return json(400, { ok: false, message: 'Consent is required' });
  }

  const tags = buildTags(role, interests);
  const locationId = process.env.GHL_LOCATION_ID;

  const customFields = [
    { key: 'instagram', field_value: instagram },
    { key: 'city', field_value: city },
    { key: 'primary_role', field_value: role },
    { key: 'community_source', field_value: String(data.source || 'join-creative-community') },
    { key: 'community_interests', field_value: interests.join(', ') },
  ];

  const contactPayload = {
    locationId,
    firstName,
    lastName,
    email,
    phone: phone || undefined,
    tags,
    source: 'Join Creative Community Form',
    customFields,
  };

  try {
    const result = await upsertGhlContact(contactPayload);
    return json(200, { ok: true, contactId: result.contact && result.contact.id });
  } catch (err) {
    console.error('community-join error', err.message, err.details || '');
    return json(err.statusCode || 500, {
      ok: false,
      message: err.message || 'Unable to save contact',
    });
  }
};
