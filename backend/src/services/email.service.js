import { transporter } from "../config/mail.js";

const emailTemplate = (title, greeting, body, details, closing) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">${title}</h2>
    <p style="font-size: 16px; line-height: 1.6;">${greeting}</p>
    <p style="font-size: 16px; line-height: 1.6;">${body}</p>
    <ul style="list-style: none; padding: 0; background: #f8f9fa; border-radius: 4px; padding: 15px;">
      ${details.map(([label, value]) => `
        <li style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
          <strong>${label}:</strong> ${value}
        </li>
      `).join('')}
    </ul>
    <p style="font-size: 16px; line-height: 1.6;">${closing}</p>
    <p style="color: #7f8c8d; font-size: 14px; margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 15px;">
      This is an automated message from Medislot. Please do not reply to this email.
    </p>
  </div>
`;

const formatAppointmentDetails = (data) => [
  ['Appointment ID', data.appointmentId],
  ['Doctor', data.doctorName],
  ['Date', new Date(data.appointmentDate).toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  })],
  ['Time', `${data.appointmentHour}:00`],
  ['Token Number', `#${data.tokenNumber}`]
];

const sendMail = async (jobData, type) => {
  const { patientEmail, patientName } = jobData;
  
  const templates = {
    confirmation: {
      subject: 'Appointment Confirmed - Medislot',
      title: 'Appointment Confirmed ✅',
      greeting: `Dear <strong>${patientName}</strong>,`,
      body: 'We are pleased to confirm your appointment with Medislot. Please find the details below:',
      closing: 'Thank you for choosing Medislot. We look forward to serving you.'
    },
    reminder: {
      subject: 'Appointment Reminder - Medislot',
      title: 'Appointment Reminder ⏰',
      greeting: `Dear <strong>${patientName}</strong>,`,
      body: 'This is a friendly reminder of your upcoming appointment with Medislot:',
      closing: 'Please arrive 10 minutes early for check-in. If you need to reschedule, please contact us.'
    }
  };

  const template = templates[type];
  if (!template) throw new Error(`Invalid email type: ${type}`);

  const details = formatAppointmentDetails(jobData);
  
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: patientEmail,
    subject: template.subject,
    html: emailTemplate(
      template.title,
      template.greeting,
      template.body,
      details,
      template.closing
    )
  });

  console.log(`✅ ${type.charAt(0).toUpperCase() + type.slice(1)} email sent to ${patientEmail}`);
};

export const sendConfirmationEmail = async (jobData) => {
  console.log("📧 Sending confirmation email...");
  await sendMail(jobData, 'confirmation');
};

export const sendReminderEmail = async (jobData) => {
  console.log("⏰ Sending reminder email...");
  await sendMail(jobData, 'reminder');
};