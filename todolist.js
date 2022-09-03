const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname+"/date.js");
const mongoose= require("mongoose");
const _ = require("lodash");
const dotenv=require("dotenv").config();
mongoose.connect(process.env.CONNECT_URL , {useNewUrlParser:true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
// item schema
const itemSchema = new mongoose.Schema({
  name:String
});
//schema for customlist
const listSchema = {
  name:String,
  items:[itemSchema]
};

//collection
const Item = mongoose.model("Item",itemSchema);
const List = mongoose.model("List" , listSchema);
const food = new Item({
  name:"food"
});


const study = new Item({
  name:"study"
});

const fun = new Item({
  name:"fun"
});
const defaultItems = [food ,study, fun];

const workItems=[];
app.get("/", function(req , res){
  Item.find( {} , function(err ,x){
    if(x.length===0){
      Item.insertMany(defaultItems , function(err){
        if(err){
          console.log(err);
        }});
res.render("list",{name:date.getDate() , newitemList:x});
    }

    else{

      res.render("list",{name:date.getDate() , newitemList:x});
    }
});

});
app.post("/", function(req , res){
  var item = req.body.newItem;
  const listName = req.body.button;
  console.log(req.body);
  const comeItem = new Item({
      name:item
    });
    if(listName=="today"){
      comeItem.save();
      res.redirect("/");
    }
    else{
      List.findOne({name:listName } , function(err , foundItem){
        foundItem.items.push(comeItem);
        foundItem.save();
        res.redirect("/"+ listName);
      });
    }
});
app.get("/:object",function(req , res){
  const customListName = _.capitalize(req.params.object);
  console.log(customListName);
  List.findOne({name:customListName} , function(err , foundItem){
    if(!err){
      if(!foundItem){
        const list = new List({
          name:customListName,
         items:defaultItems
       });
       list.save();
       res.redirect("/"+ customListName);
      }
      else{
        res.render("list", {name:customListName , newitemList:foundItem.items});
      }
    }
  });
});
app.post("/delete", function(req, res){
  let checked = req.body.Checkbox;
  const listName= req.body.listName;
  console.log(checked);
  if(listName=="today"){
  Item.findByIdAndRemove(checked,function(err){
    if(err){
    console.log(err);
  }
  });
res.redirect("/");
}
else{
  List.findOneAndUpdate({name:listName }, {$pull:{items:{_id:checked}}} , function(err, foundItem){
    if(!err){
      res.redirect("/"+ listName);
    }
  });
}
});

app.listen(process.env.PORT || 3000 , function(){
  console.log("server is running");});
