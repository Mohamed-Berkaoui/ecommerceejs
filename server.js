const express = require("express");
const { ObjectId } = require("mongodb");
const connectToDb = require("./utils/connecToDb");
require("dotenv").config();

const cluster = connectToDb();

const app = express();

function connectToProductsCollection() {
  const db = cluster.db("ecommerce");
  const prodsCollection = db.collection("products");
  return prodsCollection;
}

app.use(express.urlencoded({ extended: true }));

app.get("/", async function (req, res) {
  const prodsCollection = connectToProductsCollection();
  // const prods=prodsCollection.find().toArray()
  // res.render('index.ejs',{products:prods})  =>error
  //------------------------------------------------------------
  // prodsCollection.find().toArray().then(function(prods){
  //     res.render('index.ejs',{products:prods})
  // })
  const prods = await prodsCollection.find().toArray();
  res.render("index.ejs", { products: prods });
});

app.get("/product/:id", async function (req, res) {
  const prodId = req.params.id;
  const prodsCollection = connectToProductsCollection();
  const product = await prodsCollection.findOne({ _id: new ObjectId(prodId) });
  res.render("product.ejs", { product });
});

app.get("/addproduct", function (_, res) {
  res.render("addproduct.ejs");
});

app.post("/add", async function (req, res) {
  const prodsCollection = connectToProductsCollection();
  const result = await prodsCollection.insertOne(req.body);
  if (result.acknowledged === true) {
    res.redirect("/");
    return;
  }
  res.send("<h1>somthing went wrong</h1>");
});

app.get("/product/update/:id", async function (req, res) {
 try {
    const prodsCollection = connectToProductsCollection();
    const product = await prodsCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    res.render("update.ejs", { product });
 } catch (error) {
    res.end('error')
 }
});
app.post("/update/:id", async function (req, res) { //{title:fsdf,price:}
try {
    const prodsCollection = connectToProductsCollection();
    const updatedProd = await prodsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...req.body } }
    );
  
    res.redirect('/')
    
    
} catch (error) {
    console.log(error)
}
});

const PORT = process.env.PORT;
app.listen(PORT, async function () {
  cluster.connect().then(() => console.log("connect to db and server running"));
});
