import { cartModel } from "./models/cart.model.js";

class CartDao {
  // Obtener todos los carritos
  async getAll() {
    try {
      const carts = await cartModel.find();
      return carts;
    } catch (error) {
      console.error("Error al obtener todos los carritos:", error.message);
      throw new Error("No se pudieron obtener los carritos.");
    }
  }

  // Obtener un carrito por ID
  async getById(id) {
    try {
      const cart = await cartModel.findById(id).populate("products.product");
      if (!cart) throw new Error(`Carrito con ID ${id} no encontrado.`);
      return cart;
    } catch (error) {
      console.error("Error al obtener carrito por ID:", error.message);
      throw new Error("No se pudo obtener el carrito.");
    }
  }

  // Crear un nuevo carrito
  async create() {
    try {
      const cart = await cartModel.create({});
      return cart;
    } catch (error) {
      console.error("Error al crear carrito:", error.message);
      throw new Error("No se pudo crear el carrito.");
    }
  }

  // Actualizar un carrito
  async update(id, data) {
    try {
      const cartUpdate = await cartModel.findByIdAndUpdate(id, data, { new: true });
      if (!cartUpdate) throw new Error(`Carrito con ID ${id} no encontrado.`);
      return cartUpdate;
    } catch (error) {
      console.error("Error al actualizar carrito:", error.message);
      throw new Error("No se pudo actualizar el carrito.");
    }
  }

  // Eliminar un carrito
  async deleteOne(id) {
    try {
      const cart = await cartModel.deleteOne({ _id: id });
      return cart;
    } catch (error) {
      console.error("Error al eliminar carrito:", error.message);
      throw new Error("No se pudo eliminar el carrito.");
    }
  }

  // Agregar un producto al carrito
  async addProductToCart(cid, pid) {
    try {
      const cart = await this.getById(cid); // Reutilizamos la validación de getById
      
      const productInCart = cart.products.find((element) => element.product == pid);
      if (productInCart) {
        productInCart.quantity++;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error.message);
      throw new Error("No se pudo agregar el producto al carrito.");
    }
  }

  // Eliminar un producto del carrito
  async deleteProductToCart(cid, pid) {
    try {
      const cart = await this.getById(cid);
      cart.products = cart.products.filter((element) => element.product != pid);
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error.message);
      throw new Error("No se pudo eliminar el producto del carrito.");
    }
  }

  // Actualizar cantidad de un producto en el carrito
  async updateQuantityProductInCart(cid, pid, quantity) {
    try {
      const cart = await this.getById(cid);
      const product = cart.products.find((element) => element.product == pid);
      if (!product) throw new Error(`Producto con ID ${pid} no encontrado en el carrito.`);

      product.quantity = quantity;

      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al actualizar cantidad de producto:", error.message);
      throw new Error("No se pudo actualizar la cantidad del producto.");
    }
  }

  // Vaciar un carrito
  async clearProductsToCart(cid) {
    try {
      const cart = await this.getById(cid);
      cart.products = [];
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al vaciar carrito:", error.message);
      throw new Error("No se pudo vaciar el carrito.");
    }
  }
}

export const cartDao = new CartDao();


