class ProductRepository {
    constructor(dao) {
      this.dao = dao;
    }
  
    getAllProducts() {
      return this.dao.getAll();
    }
  
    getProductById(id) {
      return this.dao.getById(id);
    }
  
    createProduct(productData) {
      return this.dao.create(productData);
    }
  
    updateProduct(id, productData) {
      return this.dao.update(id, productData);
    }
  
    deleteProduct(id) {
      return this.dao.delete(id);
    }
  }
  
  export default ProductRepository;
  