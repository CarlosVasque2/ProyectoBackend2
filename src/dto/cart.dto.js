class CartDTO {
    constructor(cart) {
      this.id = cart._id;
      this.products = cart.products.map(item => ({
        product: item.productId,
        quantity: item.quantity,
      }));
    }
  }
  
  export default CartDTO;
  