// require dependencies
const express = require("express")
const app = express()
const MongoClient = require("mongodb").MongoClient
const PORT = 8005
require("dotenv").config()

// declare database variables
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = "aliens"

// connect to mongodb
MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// set middleware
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// CRUD methods - Read
app.get("/", (req, res) => {
    db.collection("alienData").find().toArray()
        .then(data => {
            let nameList = data.map(item => item.speciesName)
            console.log(nameList)
            res.render("index.ejs", {info: nameList})
        })
        .catch(error => console.log(error))
})

// Create
app.post("/api", (req, res) => {
    console.log("Post heard")
    db.collection("alienData").insertOne(
        req.body
    )
    .then(result => {
        console.log(result)
        res.redirect("/")
    })
    .catch(error => console.error(error))
})

// Update
app.put("/updateEntry", (req, res) => {
    console.log(req.body)
    Object.keys(req.body).forEach(key => {
        if (req.body[key] === null || req.body[key] === undefined || req.body[key] === "") {
            delete req.body[key]
        }
    })
    console.log(req.body)
    db.collection("alienData").findOneAndUpdate(
        {name: req.body.name},
        {
            $set: req.body
        }
    )
    .then(result => {
        console.log(result)
        res.json("Success")
    })
    .catch(error => console.error(error))
})

// Delete (dee-lay-tay)
app.delete("/deleteEntry", (req, res) => {
    db.collection("alienData").deleteOne(
        {name: req.body.name}
    )
    .then(result => {
        console.log(result)
        res.json("Entry deleted")
    })
    .catch(error => console.error(error))
})

// set up localhost on port
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
