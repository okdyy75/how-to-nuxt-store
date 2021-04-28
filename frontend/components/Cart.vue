<template>
  <div class="cart">
    <h2>カート</h2>
    <div v-for="(product, index) in cartProducts" :key="index">
      {{ index }}, {{ product.name }}, {{ product.price }}円
      <button @click="cartProductRemove(product)">カートから削除</button>
    </div>
    <div>合計金額：{{ cartTotalPrice }}</div>
    <button @click="cartCheckout(cartProducts)">購入する</button>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapState({
      cartProducts: state => state.cart.products
    }),
    ...mapGetters({
      cartTotalPrice: "cart/totalPrice"
    })
  },
  methods: {
    ...mapMutations({
      cartProductRemove: "cart/productRemove"
    }),
    ...mapActions({
      cartCheckout: "cart/checkout"
    })
  }
};
// ヘルパーを使わない書き方
// export default {
//   computed: {
//     cartProducts() {
//       return this.$store.state.cart.products;
//     },
//     cartTotalPrice() {
//       return this.$store.getters["cart/totalPrice"];
//     }
//   },
//   methods: {
//     cartProductRemove(product) {
//       this.$store.commit("cart/productRemove", product);
//     },
//     cartCheckout() {
//       this.$store.dispatch("cart/checkout", this.cartProducts);
//     }
//   }
// };
</script>
