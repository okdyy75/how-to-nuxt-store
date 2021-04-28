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
