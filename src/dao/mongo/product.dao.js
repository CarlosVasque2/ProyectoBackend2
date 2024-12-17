import { productModel } from "./models/product.model.js";

class ProductDao {
  async getAll(query, options) {
    try {
      const products = await productModel.paginate(query, options);
      return products;
    } catch (error) {
      console.error("Error al obtener todos los productos:", error.message);
      throw new Error("No se pudieron obtener los productos.");
    }
  }

  async getById(id) {
    try {
      const product = await productModel.findById(id);
      return product;
    } catch (error) {
      console.error("Error al obtener el producto por ID:", error.message);
      throw new Error("No se pudo obtener el producto.");
    }
  }

  async create(data) {
    try {
      const product = await productModel.create(data);
      return product;
    } catch (error) {
      console.error("Error al crear el producto:", error.message);
      throw new Error("No se pudo crear el producto.");
    }
  }

  async update(id, data) {
    try {
      const productUpdate = await productModel.findByIdAndUpdate(id, data, { new: true });
      return productUpdate;
    } catch (error) {
      console.error("Error al actualizar el producto:", error.message);
      throw new Error("No se pudo actualizar el producto.");
    }
  }

  async softDelete(id) {
    try {
      const product = await productModel.findByIdAndUpdate(
        id,
        { status: false },
        { new: true }
      );
      return product;
    } catch (error) {
      console.error("Error al eliminar (soft delete) el producto:", error.message);
      throw new Error("No se pudo eliminar el producto.");
    }
  }
}

export const productDao = new ProductDao();
