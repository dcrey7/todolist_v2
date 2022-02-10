const express = require("express");
const bodyparser = require("body-parser");
const mongoose=require("mongoose");
const _=require("lodash");


const app = express();



app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-abhi:****@cluster0.sq4dy.mongodb.net/todolistDB",{useNewUrlParser:true});

const itemsSchema={
  name: String
};

const Item= mongoose.model("Item", itemsSchema);
const Item1 = new  Item({name:"welcome to your todo list"});
const Item2 = new  Item({name:"hit + to do add new item "});
const Item3 = new  Item({name:"hit <-- to delete new item"});

const defaultitems=[Item1,Item2,Item3]

const listschema={
  name: String,
  items:[itemsSchema]
};

const List= mongoose.model("list",listschema);





app.get("/", function(req, res) {
   //or date.getday for just the day
Item.find({},function(err, foundItems){

if(foundItems.length===0){
  Item.insertMany(defaultitems, function(err){
    if(err){
      console.log(err);
      }else{
      console.log("succsefully adding all new variables runing");
      }
  });
    res.redirect("/");
  }else{  res.render("list", {
    listtitle: "Today",
    newitem: foundItems
  });
}

});
})


app.get("/:customListName",function(req,res){
  const customlistname=_.capitalize(req.params.customListName);
  List.findOne({name:customlistname}, function(err,foundlist){
    if(!err){
      if(!foundlist){
        const list= new List({
          name:customlistname,
          items:defaultitems
        });
        list.save();
        res.redirect("/"+customlistname);
      }else{
        res.render("list",{listtitle: foundlist.name, newitem:foundlist.items})
      }
    }
  });


});



app.post("/", function(req, res) {
  const itemname = req.body.newitem;
  const listname = req.body.list;

  const item= new Item({
    name:itemname
  })
   if(listname==="Today"){
     item.save();
     res.redirect("/");
   }else{
     List.findOne({name:listname},function(err,foundlist){
       foundlist.items.push(item);
       foundlist.save();
       res.redirect("/"+listname);
     })
   }


});



app.post("/delete",function(req,res){
  const checkeditemid= req.body.checkbox;
  const listname=req.body.listname;

  if(listname==="Today"){
    Item.findByIdAndRemove(checkeditemid,function(err){
      if(!err){
        console.log("deleted item");
        res.redirect("/")
      }

    })

  }else{
    List.findOneAndUpdate({name:listname},{$pull:{items:{_id:checkeditemid}}},function(err,foundlist){
      if(!err){
      res.redirect("/"+listname);
    }
  });


}
});




app.get("/work", function(req, res) {
  res.render("list", {
    listtitle: "work list",
    newitem: workitems
  });
});




app.post("/work", function(req, res) {
  const item = req.body.newitem;
  workitems.push(item);
  res.redirect("/work");

})

app.get("/about", function(req, res) {
  res.render("about")
});

app.listen(process.env.PORT||3000, function() {
  console.log("server started on port 3000 or succesfully");
})
