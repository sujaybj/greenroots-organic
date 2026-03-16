// server/utils/whatsappUtils.js
// Twilio SMS + WhatsApp notifications
// Enable: npm install twilio   then add keys to .env

let client = null;

const getClient = () => {
  if (!client && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      const twilio = require('twilio');
      client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    } catch (e) { console.log('Twilio not installed — run npm install twilio'); }
  }
  return client;
};

const fmt = (phone) => {
  const d = phone.replace(/\D/g, '');
  if (d.startsWith('91') && d.length === 12) return `+${d}`;
  if (d.length === 10) return `+91${d}`;
  return `+${d}`;
};

// ── SMS (normal text message to any phone) ───────────────────
const sendSMS = async (phone, body) => {
  try {
    const c = getClient();
    if (!c || !process.env.TWILIO_PHONE_NUMBER) {
      console.log('SMS skipped — Twilio not configured');
      return { success: false };
    }
    const msg = await c.messages.create({ from: process.env.TWILIO_PHONE_NUMBER, to: fmt(phone), body });
    console.log(`✅ SMS → ${fmt(phone)} SID:${msg.sid}`);
    return { success: true };
  } catch (e) { console.error('SMS error:', e.message); return { success: false }; }
};

// ── WhatsApp ──────────────────────────────────────────────────
const sendWhatsApp = async (phone, body) => {
  try {
    const c = getClient();
    if (!c) return { success: false };
    const from = `whatsapp:${process.env.TWILIO_WHATSAPP_FROM || '+14155238886'}`;
    const msg  = await c.messages.create({ from, to: `whatsapp:${fmt(phone)}`, body });
    console.log(`✅ WA → ${fmt(phone)} SID:${msg.sid}`);
    return { success: true };
  } catch (e) { console.error('WA error:', e.message); return { success: false }; }
};

// ── Send to both SMS + WhatsApp ───────────────────────────────
const notifyBoth = async (phone, msg) => {
  await sendSMS(phone, msg);
  await sendWhatsApp(phone, msg);
};

// ── Exported notification functions ──────────────────────────

const sendOTPWhatsApp = async (phone, name, otp) =>
  sendSMS(phone, `GreenRoots: Your OTP is ${otp}. Valid for 10 minutes. Do not share.`);

const sendOrderConfirmationWhatsApp = async (phone, name, order) => {
  const id    = order._id.toString().slice(-8).toUpperCase();
  const items = order.items.map(i => `${i.name} x${i.quantity}`).join(', ');
  notifyBoth(phone,
    `GreenRoots: Order #${id} confirmed!\n` +
    `Items: ${items}\nTotal: Rs.${order.totalAmount}\n` +
    `Delivery to: ${order.shippingAddress.city}, ${order.shippingAddress.pincode}\n` +
    `Expected in 3-7 days. We deliver to remote areas!`
  );
};

const sendOrderStatusWhatsApp = async (phone, name, order, status) => {
  const id = order._id.toString().slice(-8).toUpperCase();
  const s  = { confirmed:'confirmed & packed', shipped:'shipped', outForDelivery:'out for delivery today', delivered:'delivered', cancelled:'cancelled' };
  notifyBoth(phone, `GreenRoots: Order #${id} is ${s[status] || status}. -Team GreenRoots`);
};

const sendPasswordResetWhatsApp = async (phone, name, otp) =>
  sendSMS(phone, `GreenRoots: Password reset OTP is ${otp}. Valid for 10 minutes.`);

const sendDeliveryReminderWhatsApp = async (phone, name, order) => {
  const id = order._id.toString().slice(-8).toUpperCase();
  notifyBoth(phone, `GreenRoots: Order #${id} arriving tomorrow at ${order.shippingAddress.street}, ${order.shippingAddress.city}. Please be available.`);
};

module.exports = {
  sendSMS, sendWhatsApp,
  sendOTPWhatsApp,
  sendOrderConfirmationWhatsApp,
  sendOrderStatusWhatsApp,
  sendPasswordResetWhatsApp,
  sendDeliveryReminderWhatsApp,
};
