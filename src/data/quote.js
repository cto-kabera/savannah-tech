export const INTERESTS = [
  'CCTV',
  'Access control',
  'Structured cabling',
  'Fire detection',
  'Intrusion detection',
  'PA / Audio-visual',
  'Building management',
  'Power backup',
  'Data center',
  'AMC / maintenance',
];

const LIMITS = { name: 120, contact: 200, message: 4000 };

function cleanLine(value, max) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\r\n]+/g, ' ').replace(/[ \t]+/g, ' ').trim().slice(0, max + 1);
}

function cleanMessage(value, max) {
  if (typeof value !== 'string') return '';
  return value.replace(/\r\n/g, '\n').trim().slice(0, max + 1);
}

function looksLikeContact(value) {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return true;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15 && /^[+().\-\s\d]+$/.test(value);
}

// Returns a quote, a honeypot hit, or a message safe to show the visitor.
export function parseQuote(body) {
  if (!body || typeof body !== 'object') return { error: 'Invalid request.' };
  if (typeof body.website === 'string' && body.website.trim()) return { honeypot: true };

  const name = cleanLine(body.name, LIMITS.name);
  const contact = cleanLine(body.contact, LIMITS.contact);
  const message = cleanMessage(body.message, LIMITS.message);

  if (!name || !contact || !message) {
    return { error: 'Please fill in your name, how to reach you, and a short message.' };
  }
  if (name.length > LIMITS.name || contact.length > LIMITS.contact || message.length > LIMITS.message) {
    return { error: 'That message is too long. Please shorten it and try again.' };
  }
  if (!looksLikeContact(contact)) {
    return { error: 'Enter a phone number or email address so we can reach you.' };
  }

  if (body.interests == null) return { value: { name, contact, message, interests: [] } };
  if (!Array.isArray(body.interests) || body.interests.length > INTERESTS.length) {
    return { error: 'Invalid request.' };
  }
  const allowed = new Set(INTERESTS);
  if (body.interests.some((item) => typeof item !== 'string' || !allowed.has(item))) {
    return { error: 'Invalid request.' };
  }

  return { value: { name, contact, message, interests: [...new Set(body.interests)] } };
}
