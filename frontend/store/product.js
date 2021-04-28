export const state = () => ({
  products: []
});

export const mutations = {
  setProducts(state, products) {
    state.products = products;
  }
};

export const actions = {
  async getProducts({ commit }) {
    const response = await this.$axios
      .get("/api/products")
      .then(response => response)
      .catch(err => err.response);

    if (response.status === 200 && response.data.success) {
      commit("setProducts", response.data.data.products);
    }
  }
};
