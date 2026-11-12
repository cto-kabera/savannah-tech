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

function looksLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function looksLikeContact(value) {
  if (looksLikeEmail(value)) return true;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15 && /^[+().\-\s\d]+$/.test(value);
}

function whatsappNumber(value) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 10 && digits.startsWith('0')) digits = `254${digits.slice(1)}`;
  if (digits.length === 9 && digits.startsWith('7')) digits = `254${digits}`;
  return digits;
}

export function classifyContact(value) {
  const contact = typeof value === 'string' ? value.trim() : '';
  if (looksLikeEmail(contact)) {
    return { kind: 'email', label: contact, mailto: `mailto:${contact}` };
  }
  const digits = contact.replace(/\D/g, '');
  if (digits.length >= 7 && digits.length <= 15 && /^[+().\-\s\d]+$/.test(contact)) {
    const tel = `tel:${contact.replace(/[^\d+]/g, '')}`;
    return { kind: 'phone', label: contact, tel, whatsapp: `https://wa.me/${whatsappNumber(contact)}` };
  }
  return { kind: 'unknown', label: contact };
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
