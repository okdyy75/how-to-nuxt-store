<template>
  <div class="container">
    <div>
      <div class="product">
        <h1>商品一覧ページ</h1>
        <div v-for="product in products" :key="product.id">
          {{ product.name }}, {{ product.price }}円
          <button @click="cartProductAdd(product)">カートに入れる</button>
        </div>
      </div>
      <Cart />
      <NuxtLink to="/">トップ</NuxtLink>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  async fetch() {
    await this.getProducts();
  },
  computed: {
    ...mapState({
      products: state => state.product.products
    })
  },
  methods: {
    ...mapMutations({
      cartProductAdd: "cart/productAdd"
    }),
    ...mapActions({
      getProducts: "product/getProducts"
    })
  }
};
// ヘルパーを使わない書き方
// export default {
//   async fetch() {
//     await this.getProducts();
//   },
//   computed: {
//     products() {
//       return this.$store.state.product.products
//     },
//   },
//   methods: {
//     cartProductAdd(product) {
//       this.$store.commit("cart/productAdd", product);
//     },
//     async getProducts() {
//       this.$store.dispatch("product/getProducts");
//     }
//   }
// };
</script>
