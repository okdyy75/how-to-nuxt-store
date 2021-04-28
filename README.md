# サクッと覚えるNuxtストアの使い方

なんとなく使っていたので検証＆使い方を再勉強

## Nuxtのストアとは？
Nuxt内でVuexを使えるようにしたものがストアです
基本はほぼVuexですが、Nuxt用に使いやすくなっています
storeディレクトリ内にファイルを配置して使います

## Vuexとは？
公式の説明だと
> Vuex は Vue.js アプリケーションのための 状態管理パターン + ライブラリです。 これは予測可能な方法によってのみ状態の変異を行うというルールを保証し、アプリケーション内の全てのコンポーネントのための集中型のストアとして機能します。 
https://vuex.vuejs.org/ja/

いまいちピンときませんが、要は各コンポーネント間で共通変数を **ルール化** して使いまわせるみたいな感じです。

## ストア（Vuex）の使いどころは？
Vueにありがちなバケツリレーや、mixinを使いすぎて影響範囲が分からなくなってしまう等を回避できます。
画面遷移をしても各コンポーネント間でデータを持ち回せるので、カートの情報、モーダル、商品編集ページ（コンポーネント数が多いページ）などで使えます
業務では1ページ（1URL）1ストアで作成していますが、1ページで管理しているデータがstoreを見れば一目でわかるのでオススメです。
※ただしコンポーネントで独立している場合は1コンポーネント1ストアにしています


## とりあえずコード！

```
# バックエンド起動
cd app
npm run start
http://localhost:8000/api

# フロントエンド起動
cd frontend
npm run dev
http://localhost:3000
```

### バックエンド
とりあえずnodejsでapiサーバーを立てる

app/app.js
```js

const express = require("express");
const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.json({ success: true });
});
app.get("/api/products", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      products: [
        {
          id: 1,
          name: "りんご",
          price: 100
        },
        {
          id: 2,
          name: "バナナ",
          price: 200
        },
        {
          id: 3,
          name: "みかん",
          price: 300
        }
      ]
    }
  });
});
app.post("/api/cart/checkout", (req, res) => {
  res.json({ success: true });
});

app.listen(port);

```

### フロントエンド

frontend/store/product.js
```js

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


```

frontend/store/cart.js
```js

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

```

frontend/pages/product/index.vue
```vue

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

```

frontend/components/Cart.vue

```vue

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

```

## 解説
基本的にはstateを定義、mutationでデータセット。必要があればaction、getterを使うみたいな使い方が良いと思います。
ちなみにすべてのデータをストア管理する必要はないかと思います。必要があれば使う感じで

### ステート（state）
公式を読みますがピンときません
https://vuex.vuejs.org/ja/guide/state.html

要は共通変数のようなものですね。このstateは基本的にmutationsからしか変更できません。
直接変更しようとすると、エラーが出るはずです。

Cart.vue
```
  data () {
    this.$store.state.cart.products = []
    return {}
  },
```

```
client.js?06a0:103 Error: [vuex] do not mutate vuex store state outside mutation handlers.
```

vueファイルからの使い方としてはmapStateヘルパーを使うか
```
  computed: {
    ...mapState({
      products: state => state.product.products
    })
  },
```

this.$store.stateを使うかです
```
   computed: {
     products() {
       return this.$store.state.product.products
     },
   },
```

### ミューテーション（mutations）
公式を読みますが、これはなんとなく分かります
https://vuex.vuejs.org/ja/guide/mutations.html

> 実際に Vuex のストアの状態を変更できる唯一の方法は、ミューテーションをコミットすることです。

stateを更新する場合はミューテーションを使います。注意点としてはミューテーションは同期的である必要があります。

vueファイルからの使い方としてはmapMutationsヘルパーを使うか
```
  methods: {
    ...mapMutations({
      cartProductAdd: "cart/productAdd"
    }),
```

this.$store.commitを使うかです
```
   methods: {
     cartProductAdd(product) {
       this.$store.commit("cart/productAdd", product);
     },
```

### アクション（actions）
公式を読みますが、これもなんとなく分かります
https://vuex.vuejs.org/ja/guide/actions.html

> ・アクションは、状態を変更するのではなく、ミューテーションをコミットします。
> ・アクションは任意の非同期処理を含むことができます。

非同期でapiから取得してきたデータを使いたい場合に、アクションを使うと良いかと思います。

vueファイルからの使い方としてはmapActionsヘルパーを使うか
```
  methods: {
    ...mapActions({
      getProducts: "product/getProducts"
    })
```

this.$store.dispatchを使うかです
```
   methods: {
     async getProducts() {
       this.$store.dispatch("product/getProducts");
     }
```

### ゲッター（getters）
公式を読みますが、これもなんとなく分かります
https://vuex.vuejs.org/ja/guide/getters.html

stateの状態を加工して取得したい場合にgetterを使うといいかと思います

vueファイルからの使い方としてはmapActionsヘルパーを使うか
```
  computed: {
    ...mapGetters({
      cartTotalPrice: "cart/totalPrice"
    })
```

this.$store.gettersを使うかです
```
   computed: {
     cartTotalPrice() {
       return this.$store.getters["cart/totalPrice"];
     }
```

### モジュール（module）
素のVuexでは自分でファイルを分けてモジュールで読み込ませてあげる必要がありますが
https://vuex.vuejs.org/ja/guide/modules.html

アプリケーションの構造
https://vuex.vuejs.org/ja/guide/structure.html

参考ソース
https://github.com/vuejs/vuex/blob/dev/examples/shopping-cart/store/index.js

Nuxtのstoreでは
https://ja.nuxtjs.org/docs/2.x/directory-structure/store/

> store ディレクトリの中にあるすべての  .js ファイルは名前空間付きモジュールに変換されます

ので意識せずにモジュールを使うことができます

### Q＆A

- Q. ヘルパー使った方がいいの？this.$storeを使った方がいいの？
ヘルパーを使う方が簡潔に書けるのでオススメです

- たまにでてくる大文字の「types.CHECKOUT_REQUEST」これ何？

ミューテーション・タイプに定数を使用する
https://vuex.vuejs.org/ja/guide/mutations.html#%E3%83%9F%E3%83%A5%E3%83%BC%E3%83%86%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%BB%E3%82%BF%E3%82%A4%E3%83%95%E3%82%9A%E3%81%AB%E5%AE%9A%E6%95%B0%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B

ミューテーションの関数を定数で管理し、コードに対してリントツールのようなツールを利用できるらしいですが、いまいち自分は使いこなせていません

## まとめ
初見だとかなり難しそうに見えますが、使ってみると簡単＆便利なので、ぜひ挑戦してみてください！
