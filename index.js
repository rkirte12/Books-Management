const express = require("express");
// const { route } = require("express/lib/application");
// const { append } = require("express/lib/response")
const mongoose = require("mongoose")
require("dotenv").config();
const userRoutes = require("./routers/userRoutes")

const app = express();

app.use(express.json())

app.use("/books", userRoutes);

mongoose.connect(process.env.MONGO_CONNECTION_URL).then(()=> console.log("Database connceted."));

const port = process.env.PORT;

// app.get('/', (req, res) => {
//     res.send("Hello from this side!");
//})

app.listen(port, ()=>{
    console.log(`Server started on port no- ${port}`);
})
