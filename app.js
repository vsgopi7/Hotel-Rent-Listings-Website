const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });


async function main(){
    await mongoose.connect(mongo_url);
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("hi, i am root");
});

// index route
app.get("/listings",async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
});

//new route

app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");

});

//showroute

app.get("/listings/:id",async (req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
});

//create route

app.post("/listings",wrapAsync(async (req,res,next)=>{

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");

   
}));

//edit route

app.get("/listings/:id/edit",async (req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//update route

app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
});

//delete route

app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    console.log(delListing);
    res.redirect("/listings");
});

// app.get("/testlisting",async (req,res)=>{
//     let samplelisting = new Listing({
//         title:"my new house",
//         description:"by the beach",
//         price:1200,
//         location:"kolkata",
//         country:"india",
//     });
//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
    let {statusCode,message}=err;
    res.status(statusCode).send(message);
});


app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});
