import express from 'express';
import { client } from '../../mongoDb.mjs';
import { stringToHash, verifyHash, validateHash } from "bcrypt-inzi";
import jwt from 'jsonwebtoken';


const userCollection = client.db("crudDb").collection("users");
let router = express.Router();

// Regular expression for basic email validation
// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


//-----------------------------------------------------------------------------------------------------
//---------------------------------- LOGIN -------------------------------------------------------
//-----------------------------------------------------------------------------------------------------

router.post('/login', async (req, res, next) => {

    if (!req.body?.email || !req.body?.password) {  // if user miss a parameter
        res.status(403).send("Required parameter missing")
        return
    }

    req.body.email = req.body.email.toLowerCase();

    try {
        let result = await userCollection.findOne({ email: req.body.email });
        console.log("result", result)

        if (!result) { // if user is not in DATA base so ( user not found )

            res.status(401).send({
                message: "email or password incorret"
            });
            return;

        } else { // if user alrady in DATA base so ( user found )

            const hashedPasswordMetch = await verifyHash(req.body.password, result.password)

            if (hashedPasswordMetch) {

                const token = jwt.sign({  // JWT token  validation. 
                    isAdmin: false,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    email: req.body.email,
                }, process.env.SECRET, { expiresIn: "720h" });

                res.cookie("token", token, { // Cookies
                    httpOnly: true,
                    secure: true,
                    expires: new Date(Date.now() + 720 * 60 * 60 * 1000)
                })

                res.send({  // after user login
                    message: "Login successful",
                    token: token
                });
                return;

            } else {
                res.status(401)({
                    message: "email or password incorret"
                })
            }
        }

        // res.send(result);
    } catch (e) {
        console.log(e);
        res.status(500).send("Server error, please try leter")
    }

})

//-----------------------------------------------------------------------------------------------------
//---------------------------------- SIGNUP -------------------------------------------------------
//-----------------------------------------------------------------------------------------------------

router.post('/signup', async (req, res, next) => {

    if (!req.body?.firstName || !req.body?.lastName || !req.body?.email || !req.body?.password) {
        res.status(403).send("Required parameter missing")
        return
    }

    if (req.body.email) {

    }

    req.body.email = req.body.email.toLowerCase();

    try {
        let result = await userCollection.findOne({ email: req.body.email });
        console.log("result", result)

        if (!result) { // user not found

            const hashedPassword = await stringToHash(req.body.password);

            const insertResponse = await userCollection.insertOne({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hashedPassword,
                createdOn: new Date()
            })


            console.log("insertResponse", insertResponse);

            res.send({
                message: "SignUp successful",
                // email: req.body.email  // Add user email to the response
            });

        } else {
            res.status(403).send({
                message: "User already exist"
            })
        }

        // res.send(result);
    } catch (e) {
        console.log(e);
        res.status(500).send("Server error, please try leter")
    }
})

export default router