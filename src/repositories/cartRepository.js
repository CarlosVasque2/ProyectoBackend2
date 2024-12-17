class CartRepository {
    constructor(dao) {
      this.dao = dao;
    }
  
    getCartById(id) {
      return this.dao.getById(id);
    }
  
    addProductToCart(cartId, productId, quantity) {
      return this.dao.addProduct(cartId, productId, quantity);
    }
  
    updateCart(cartId, data) {
      return this.dao.update(cartId, data);
    }
  }
  
  export default CartRepository;
  