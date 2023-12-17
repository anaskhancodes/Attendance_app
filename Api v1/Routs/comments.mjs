import express from 'express';
let router = express.Router()


router.get("/comment/:postId/:commentId", (req, res, next) => {
    res.send('MongoDb poat comment ' + new Date)
    console.log('MongoDb poat comment ', new Date)
})

router.get("/comments/:postId", (req, res, next) => {
    res.send('MongoDb poat comments ' + new Date)
    console.log('MongoDb poat comments ', new Date)
})

router.put("/comment/:postId/:commentId", (req, res, next) => {
    res.send('MongoDb poat comment Update ' + new Date)
    console.log('MongoDb poat comment Update ', new Date)
})

router.delete("/comment/:postId/:commentId", (req, res, next) => {
    res.send('MongoDb poat comment Delete ' + new Date)
    console.log('MongoDb poat comment Delete ', new Date)
})

export default router