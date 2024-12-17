import Ticket from '../models/ticket.model.js';
import { v4 as uuidv4 } from 'uuid';

export const purchaseCart = async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartRepository.getCartById(cid);
    let totalAmount = 0;
    const unavailableProducts = [];

    for (const item of cart.products) {
      const product = await productRepository.getProductById(item.product);
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        totalAmount += product.price * item.quantity;
        await productRepository.updateProduct(product._id, product);
      } else {
        unavailableProducts.push(item.product);
      }
    }

    // Generar ticket
    if (totalAmount > 0) {
      const ticket = new Ticket({
        code: uuidv4(),
        amount: totalAmount,
        purchaser: req.user.email
      });
      await ticket.save();
    }

    // Filtrar productos no disponibles
    cart.products = cart.products.filter(item => unavailableProducts.includes(item.product));
    await cartRepository.updateCart(cid, cart);

    res.json({ message: "Purchase completed", unavailableProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
