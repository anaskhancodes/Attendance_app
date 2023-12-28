import express from 'express';
import { client } from '../../mongoDb.mjs';
import { ObjectId } from 'mongodb';

const db = client.db("Attendance");
const col = db.collection("StudentAdd");

let router = express.Router();

//-----------------------------------------------------------------------------------------------------
//---------------------------------- POST CREAT -------------------------------------------------------
//-----------------------------------------------------------------------------------------------------

router.post("/post", async (req, res, next) => {
    try {
        if (!req.body.fullName || !req.body.course || !req.body.email || !req.body.id) {
            res.status(400).send("Required parameters are missing");
            return;
        }

        const insertResponse = await col.insertOne({
            id: req.body.id,
            fullName: req.body.fullName,
            course: req.body.course,
            email: req.body.email,
            from: req.body.decoded.email,
            createdOn: new Date()
        });

        console.log("insertResponse", insertResponse);
        res.status(201).send("Student added successfully");
    } catch (e) {
        console.log("Error inserting into MongoDB", e);
        res.status(500).send("Server error, please try later");
    }
});


//-----------------------------------------------------------------------------------------------------
//---------------------------------- GET ALL POST -----------------------------------------------------
//-----------------------------------------------------------------------------------------------------

router.get("/posts", async (req, res, next) => {
    try {
        const cursor = col.find({}).sort({ _id: -1 }).limit(100);
        const result = await cursor.toArray();
        res.send(result);
        console.log("result", result);
    } catch (e) {
        console.log("Error retrieving posts from MongoDB", e);
        res.status(500).send("Server error, please try later");
    }
});

//-----------------------------------------------------------------------------------------------------
//------------------------------- FIND ----------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------

router.get('/post/:postId', async (req, res, next) => {
    if (!ObjectId.isValid(req.params.postId)) {
        res.status(400).send('Post ID must be valid');
        return;
    }

    try {
        let result = await col.findOne({ _id: new ObjectId(req.params.postId) });
        res.send(result);
        console.log("result", result);
    } catch (e) {
        console.log("Error finding post in MongoDB", e);
        res.status(500).send("Server error, please try later");
    }
});

//-----------------------------------------------------------------------------------------------------
//------------------------------ EDIT -----------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------

router.put("/post/:postId", async (req, res, next) => {
    if (!ObjectId.isValid(req.params.postId)) {
        res.status(400).send('Post ID must be valid');
        return;
    }

   if (!req.body.fullName && !req.body.course && !req.body.email) {
        res.status(400).send('');
        return;
    }

    let dataUpdated = {};
    if (req.body.fullName) { dataUpdated.fullName = req.body.fullName };
    // if (req.body.lastName) { dataUpdated.lastName = req.body.lastName };
    // if (req.body.id) { dataUpdated.id = req.body.id };
    if (req.body.course) { dataUpdated.course = req.body.course };
    if (req.body.email) { dataUpdated.email = req.body.email };

    try {
        const updateResponse = await col.updateOne(
            { _id: new ObjectId(req.params.postId) },
            { $set: dataUpdated }
        );

        console.log("updateResponse", updateResponse);
        res.send("Post updated");
    } catch (e) {
        console.log("Error updating post in MongoDB", e);
        res.status(500).send("Server error, please try later");
    }
});

//-----------------------------------------------------------------------------------------------------
//--------------------------- DELETE ------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------

router.delete("/post/:postId", async (req, res, next) => {
    if (!ObjectId.isValid(req.params.postId)) {
        res.status(400).send('Post ID must be valid');
        return;
    }

    try {
        const deleteResponse = await col.deleteOne({ _id: new ObjectId(req.params.postId) });
        console.log("deleteResponse", deleteResponse);
        res.send("Post deleted");
    } catch (e) {
        console.log("Error deleting post in MongoDB", e);
        res.status(500).send("Server error, please try later");
    }
});

//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------

export default router;
