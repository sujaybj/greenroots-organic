// WhatsApp notifications — disabled until Twilio is configured
// Uncomment and install twilio (npm install twilio) when ready

const sendOTPWhatsApp             = async () => {};
const sendOrderConfirmationWhatsApp = async () => {};
const sendOrderStatusWhatsApp     = async () => {};
const sendPasswordResetWhatsApp   = async () => {};
const sendDeliveryReminderWhatsApp = async () => {};

module.exports = {
  sendOTPWhatsApp,
  sendOrderConfirmationWhatsApp,
  sendOrderStatusWhatsApp,
  sendPasswordResetWhatsApp,
  sendDeliveryReminderWhatsApp,
};