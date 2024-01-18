const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
//const hashPassword = require('./hashedPassword');

const db = require('../config/dbConnection');

const randomstring = require('randomstring');

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const login = async(req,res) => {
    console.log('Login route hit');
    //console.log(req.body.id, req.body.password);
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const  username = req.body.id;
    const password = req.body.password;
    if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
    const sql = "SELECT * FROM USERS WHERE USER_ID = ?";
    db.query(sql,[req.body.id], (err, result) => {
       // `SELECT * FROM USERS WHERE ID = ${db.escape(req.body.id)};`,
        //(err,result) => {
            console.log('SQL Query:', sql);
console.log('Database Result:', result);

            if(err)
            {
                return res.status(400).send({
                    msg:err
                });
            }

            if(!result.length){
                return res.status(401).send({
                    msg:'Id or Password is incorrect!'
                });
            }
            console.log(req.body.password);
            console.log(result[0]['PASSWORD']);
            bcrypt.compare(
                req.body.password,
                result[0]['PASSWORD'],
                (bErr, bResult) => {
                    if(bErr){
                        return res.status(400).send({
                            msg:bErr
                        });
                    }
                    if(bResult){
                        //console.log(JWT_SECRET);
                        const token = jwt.sign({ id: result[0]['ID'],role: result[0]['ROLE']}, JWT_SECRET, { expiresIn: '1h'});
                        // db.query(
                        //     `UPDATE`
                        // )
                        if(result[0]['ROLE'] == "student")
                        {
                            return res.status(200).send({
                                msg: 'Logged In',
                                token,
                                user: result[0],
                                redirectTo: '/firstpage',  // Add the correct URL to redirect
                             });
                            //var studentInfo = result[0];
                            //res.render('firstpage', { studentInfo: studentInfo });
                        }
                        // return res.status(200).send({
                        //     msg:'Logged In',
                        //     token,
                        //     user: result[0]
                        // })
                    }

                    return res.status(401).send({
                        msg:'Id or Password is incorrect!'
                    });
                }
            );
        }
    );
}

module.exports = {
    login
}