// console.log("MongoDb express server>>>>>>>> ")

// import apiv1Routs from './Api v1/main.mjs'
import express from 'express';
import path from 'path';
import postRouter from './Api v1/Routs/post.mjs'
import feedRouter from './Api v1/Routs/feed.mjs'
import comentsRouter from './Api v1/Routs/comments.mjs'
import autsRouter from './Api v1/Routs/auth.mjs'
import "dotenv/config"
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken';
import cors from 'cors';
import mongodb from 'mongodb'

const __dirname = path.resolve();


const app = express();
app.use(express.json());
app.use(cookieParser());
// app.use(cors())

app.use("/api/v1", autsRouter);

app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  const token = req.cookies.token;

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log("decoded", new Date(decoded));

    req.body.decoded = {
      isAdmin: decoded.isAdmin,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      email: decoded.email,
    }
    next();
  } catch (err) {
    res.status(401).send({ message: "invalid token" })
  }

  console.log("cookieParser", req.cookies);

})


app.use('/api/v1', postRouter);
app.use('/api/v1', comentsRouter);
app.use('/api/v1', feedRouter);




const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`MongoDB listening on PORT ${PORT}`);
})