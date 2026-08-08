const db = require("../database/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Register user

const register = async (req,res)=>{

    const {email,password} = req.body;


    const existingUser = db.prepare(`
        SELECT * FROM users WHERE email = ?
    `).get(email);


    if(existingUser){

        return res.status(400).json({
            message:"User already exists"
        });

    }


    const hashedPassword = await bcrypt.hash(password,10);


    const result = db.prepare(`
        INSERT INTO users
        (email,password)
        VALUES (?,?)
    `).run(
        email,
        hashedPassword
    );


    res.json({

        success:true,
        id:result.lastInsertRowid

    });


};



// Login user

const login = async(req,res)=>{


    const {email,password}=req.body;


    const user = db.prepare(`
        SELECT * FROM users WHERE email=?
    `).get(email);



    if(!user){

        return res.status(400).json({
            message:"Invalid email or password"
        });

    }



    const match = await bcrypt.compare(
        password,
        user.password
    );


    if(!match){

        return res.status(400).json({
            message:"Invalid email or password"
        });

    }



    const token = jwt.sign(
        {
            id:user.id
        },
        "maliflow_secret"
    );



    res.json({

        success:true,
        token,
        user_id:user.id

    });


};


module.exports={
    register,
    login
};