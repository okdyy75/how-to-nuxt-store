export const state = () => ({
  products: []
});

export const mutations = {
  productAdd(state, product) {
    state.products.push(product);
  },
  productRemove(state, product) {
    state.products.splice(state.products.indexOf(product), 1);
  },
  productClear(state) {
    state.products = [];
  }
};

export const getters = {
  totalPrice: state => {
    return state.products.reduce((sum, product) => sum + product.price, 0);
  }
};

export const actions = {
  async checkout({ commit }, products) {
    const response = await this.$axios
      .post("/api/cart/checkout", {
        products: products
      })
      .then(response => response)
      .catch(err => err.response);

    if (response.status === 200 && response.data.success) {
      commit("productClear");
    }
  }
};
