import express from 'express';
let router = express.Router()


router.get("/feed/userId", (req, res, next) => {
    res.send('MongoDb Feed ' + new Date)
    console.log('MongoDb Feed ', new Date)
})

export default router