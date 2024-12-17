import Ticket from '../models/ticket.model.js';
import TicketDTO from '../dto/ticket.dto.js';  // Importa el DTO

// Crear un ticket
export const createTicket = async (req, res) => {
  const { code, amount, purchaser } = req.body;

  try {
    const newTicket = new Ticket({
      code,
      amount,
      purchaser,
    });

    await newTicket.save();
    const ticketDTO = new TicketDTO(newTicket);

    res.status(201).json({ message: 'Ticket creado con éxito', ticket: ticketDTO });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error al crear el ticket' });
  }
};
