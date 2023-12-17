import express from 'express';
import { client } from '../../mongoDb.mjs';
import { ObjectId } from 'mongodb';

const db = client.db("Attendance");
const col = db.collection("Student_check_out");

let router = express.Router();

//////
router.post("/poststd", async (req, res, next) => {
    try {
        if (!req.body.firstName || !req.body.lastName || !req.body.course || !req.body.id || !req.body.date) {
            res.status(400).send("Required parameters are missing");
            return;
        }

        const insertResponse = await col.insertOne({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            course: req.body.course,
            id: req.body.id,
            date: req.body.date,
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

export default router;