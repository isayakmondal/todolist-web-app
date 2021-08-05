const express = require("express");
const bodyParser = require("body-parser");
const { static } = require("express");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.m0etn.mongodb.net/todolistDB`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Buy Groceries",
});
const item2 = new Item({
  name: "Do Assignments",
});
const item3 = new Item({
  name: "Finsh Binary Trees",
});

const defaultArray = [item1, item2, item3];

app.get("/", (req, res) => {
  let day = date.getDate();
  Item.find({}, (err, result) => {
    if (result.length === 0) {
      Item.insertMany(defaultArray, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Succesfully added default items.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: day, newItems: result });
    }
  });
});

app.get("/:customRoute", (req, res) => {


  res.render("error");
});

// app.post("/work", (req, res) => {
//   let item = req.body.newItems;
//   workItems.push(item);

//   res.redirect("/work");
// });

app.post("/", (req, res) => {
  let itemName = req.body.newItem;
  const item = new Item({
    name: itemName,
  });

  item.save();
  // if (req.body.list === "Work List") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   newItemsArray.push(item);
  //   Item.insertMany(newItemsArray, (err) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log("Succesfully added new item.");
  //     }
  //   });
  //   res.redirect("/");
  // }
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  let checkedItemId = req.body.checkbox;

  Item.findByIdAndDelete(checkedItemId, (err) => {
    if (err) console.log(err);
    else console.log("Deletion Succesful");
  });

  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("Server started successfully.");
});


