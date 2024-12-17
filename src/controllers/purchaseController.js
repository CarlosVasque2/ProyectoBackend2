import Ticket from '../models/ticket.model.js'; // Importa el modelo Ticket
import Product from '../models/product.model.js'; // Importa el modelo Product
import { v4 as uuidv4 } from 'uuid'; // Para generar un código único para el ticket
import sendEmail from '../services/emailService.js'; // Importa el servicio de correo

// Función para finalizar compra
export const finalizePurchase = async (req, res) => {
  const { products, purchaser } = req.body;  // Recibe los productos y comprador del cuerpo de la solicitud

  try {
    // Verificar si los productos están disponibles
    const productList = await Product.find({ '_id': { $in: products.map(product => product.id) } });

    if (productList.length !== products.length) {
      return res.status(400).json({ message: 'Algunos productos no están disponibles' });
    }

    // Calcular el monto total
    const totalAmount = products.reduce((sum, product) => {
      const productDetails = productList.find(p => p._id.toString() === product.id);
      return sum + (productDetails.price * product.quantity);  // Calcula el total basado en la cantidad de cada producto
    }, 0);

    // Crear un nuevo ticket
    const newTicket = new Ticket({
      code: uuidv4(),  // Genera un código único para el ticket
      amount: totalAmount,
      purchaser,
    });

    await newTicket.save();

    // Enviar el correo de confirmación al comprador
    await sendEmail(
      purchaser.email,  // Correo del comprador
      'Confirmación de compra',  // Asunto
      `Gracias por tu compra de ${totalAmount}. Tu código de ticket es: ${newTicket.code}. ¡Disfruta de tus productos!`
    );

    // Responder con el ticket generado y el mensaje de éxito
    res.status(201).json({
      message: 'Compra finalizada con éxito',
      ticket: newTicket,  // Se retorna el ticket creado
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al procesar la compra', error });
  }
};
