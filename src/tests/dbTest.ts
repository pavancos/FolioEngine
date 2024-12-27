import { Router,json } from "express";

import User from "../models/User.js";
import Folio from "../models/Folio.js";
import CraftBench from "../models/CraftBench.js";



const dbTest = Router();
dbTest.use(json())

dbTest.get('/',(req,res)=>{
    res.send('Hello from dbTest')
})

dbTest.post('/addUser',async (req,res)=>{
    const {username,avatar} = req.body;
    const user = new User({username,avatar});
    await user.save();
    res.send("User Added")
})




export default dbTest;