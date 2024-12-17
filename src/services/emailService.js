import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configurar el transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Tu correo electrónico
    pass: process.env.EMAIL_PASS,  // Tu contraseña de correo
  },
});

// Función para enviar correo
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado: ' + info.response);
  } catch (error) {
    console.error('Error al enviar el correo: ', error);
  }
};

export default sendEmail;
