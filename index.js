const express = require("express")
const app = express()
let {MongoClient} = require("mongodb")
let url = "mongodb+srv://kiran:FoCpvKDqFehImMDR@cluster0.ax89r.mongodb.net/test"
app.use(express.json())
const client = new MongoClient(url)
const port = process.env.PORT || 7000


// api to create mentor details
app.post("/mentor",async (req,res)=>{
    let result = await client.connect()
    let db = await result.db("Mentor")
    let table = await db.collection("table")
    let data = await table.insertOne(req.body) 
    res.json({
        data
    })
})

app.get("/",(req,res)=>{
    res.send("welcome to Student mentor Task")
})

// api to create student details
app.post("/student",async (req,res)=> {
    let result = await client.connect()
    let db = await result.db("student")
    let table = await db.collection("table")
    let data = await table.insertOne(req.body)
    res.json({
        data
    })
})



// api to assign a particular mentor to students
app.get("/assign",async (req,res)=>{
    var mentorList = []
    var studentList = []

    // taking mentor data
    let result = await client.connect()
    let mentordb = await result.db("Mentor")
    let mentortable = await mentordb.collection("table")
    let mentordata = await mentortable.find({},{_id:0,name:1}).toArray()
    mentorList.push(mentordata)


    // taking srudent data
    let studentdb = await result.db("student")
    let studentTable = await studentdb.collection("table")
    let studentData = await studentTable.find({},{_id:0,name:1}).toArray()
    studentList.push(studentData)
    console.log(studentList[0].length)

    for(let i=0;i<studentList[0].length;i++){
        let randomMentor = (n=1) => {
            //[{},{}]
            return mentorList[0].sort(()=>0.5-Math.random()).splice(n,1)
        }
        if(studentList[0][i].Mentorname){

        }else{
            let data = randomMentor()
            console.log("====>",i,data)
            console.log(studentList[0][i])
            studentList[0][i].Mentorname = data[0].name
        }
    }
    let [finalStudentList] = studentList

    // deleteing studentlist and updating mentor name
    let studentMentorDelete = await studentTable.deleteMany({})
    let studentMentorInsert = await studentTable.insertMany(finalStudentList)
    res.json({
        ms:"hi",
        mentorList:mentorList[0],
        studentList:finalStudentList,
        studentMentorInsert
    })
})



// api to change mentor for a particular student
app.put("/changementor",async (req,res)=>{
    res.send(req.body)
    let result = await client.connect()
    let db = await result.db("student")
    let table = await db.collection("table")
    let list = await table.findOne({name:req.body.name})
    console.log(list)
    if(list.name){
        let updateList = await table.updateOne({name:req.body.name},{$set:{Mentorname:req.body.Mentorname}})
        res.send(updateList)
    }else{
        res.send("student record not found")
    }
})



// api to show students for a particular mentor
app.get("/particularmentor",async (req,res)=>{
    let result = await client.connect()
    let db = await result.db("student")
    let table = await db.collection("table")
    let list = await table.find({Mentorname:req.body.Mentorname}).toArray()
    res.json({
        list
    })
})
app.listen(port)