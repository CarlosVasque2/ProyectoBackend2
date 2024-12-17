import mongoose from 'mongoose';

// Definición del esquema de Ticket
const ticketSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
});

// Creamos el modelo basado en el esquema
const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;

