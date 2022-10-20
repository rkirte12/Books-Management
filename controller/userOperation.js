const bookDB = require("../model/books");
const jwt = require("jsonwebtoken")
const validator = require("email-validator");
const bcrypt = require("bcrypt");
// const res = require("express/lib/response");

const userSignUp = async(req,res)=>{
    const { username , userEmail , role , userPassword , bookType , bookName } = req.body
    if (username && userEmail && role && userPassword && bookType && bookName) {
        if (validator.validate(userEmail)) {
            var roleId;
            var bookId;

            let account = await bookDB.findOne({email : userEmail})

            if (!account) {
                if (role == "Admin" || role == "admin") {
                    roleId = 1;
                } else if( role == "User" && role == "user") {
                    roleId = 2;
                }
                else {
                    return res.status(400).send({ status : "Error", message : "Please enter role EX. Admin/user"})
                }
                if (roleId) {
                    if (bookType == "Science") {
                        bookId =1;
                    }else if(bookType == "Programming") {
                        bookId = 2;
                    }else if(bookType == "Historical"){
                        bookId = 3;
                    }else if (bookType == "Geographical") {
                        bookId = 4;
                    }else{
                        return res.status(400).send({status : "Sorry This Book Type is not Available, Please Enter Book type ex.Science, Prgramming, Historical, Geographical"})
                    }
                    let salt = await bcrypt.genSalt(12);
                    let hashpassword = await bcrypt.hash(userPassword,salt);
                let doc = new bookDB({
                        username : username,
                        email: userEmail,
                        role : role,
                        roleTypeId : roleId,
                        password : hashpassword,
                        booksType : bookType,
                        bookTypeId : bookId,
                        bookName :bookName
                    })
                    await doc.save();
                    res.status(200).send({status : "Success", message : "User registerd successfully"})
                } else {
                    res.send("Please enter role ex: user")
                }
            } else {
                res.status(400).send({status : "Error", massage : "Your Email id is exist already."})
            }
            
        } else {
            res.status(400).send({status : "Error", massage : "Your Email id is invalid, Please enter valid email ID"})
        }
    } else {
        res.status(400).send({ message: "All Fields are Required!!" });
    }
};

const userLogin = async(req, res) =>{
    const {userEmail , userPassword } = req.body

    try {
        if (userEmail && userPassword) {
            if (validator.validate(userEmail)) {
                let account = await bookDB.findOne({email:userEmail});
                if (account) {
                    const checkLogin = await bcrypt.compare(userPassword, account.password);
                    if (checkLogin) {
                        let token = jwt.sign({userId : account._id}, process.env.SECRET, {
                            expiresIn : "20m"
                        })
                        res.status(200).send({status : "Success", message : "Login Success", token : token});
                    } else {
                        res.status(400).send({status : "Error", message : "Password is incorrect"});
                    }
                } else {
                    res.status(400).send({status : "Error", message : "Email does't exist"});
                }
            } else {
                res.send("Invalid Email, Please Enter Valid Email");
            }
        } else {
            res.send("All Fields are required");
        }
        
    } catch (error) {
        res.send(error);
        console.log(error);
    }
    
}

const viewAll = async(req, res)=>{
    try {
        let record = await bookDB.find();
        res.status(200).send(record);
    } catch (error) {
        res.send(error);
    }
};

const updateBook = async(req,res)=>{
    const { bookName } = req.body
    console.log(bookName);
    console.log(req.params.id);
    bookDB.findOneAndUpdate({_id : req.params.id}, {
    
        $set:{
            bookName : bookName
        }
    }).then(result=>{
        res.send({
            status : "success", message : "Book name is updated"
        })
    }).catch(err=>{
        res.send(err)
    })
}

const deleteRecord = async(req,res)=>{
    const id = req.params.id
    console.log(id);
    try {
       const result = bookDB.findByIdAndDelete(id)
       return res.send(result)
    
    } catch (error) {
        return res.send(error)
    }
}

const sortAsce = async(req,res)=>{
    try {
        const records = await bookDB.find({}).sort({bookName : 1});
        res.status(200).send({total : records.length, records});
    } catch (error) {
        res.send(error)
    }
}

const searchBooks = async(req,res)=>{
    try {
        var regex = new RegExp(req.param.bookName,"i");
        const result = await bookDB.find({username : regex});

        if (result == 0) {
            res.send("Result not found.")
        } else {
            res.status(200).send({status : "Success", result});
        }
    } catch (error) {
        res.send(error);
    }
}
     
const page = async(req,res)=>{
    try {
        const { page = 1, limit = 10 } = req.query
        const data = await bookDB.find().limit(limit * 1).skip((page -1)* limit);
        res.status(200).send({total : data.length, data});
    } catch (error) {
        res.send(error)
    }
}

module.exports = {
    userSignUp,
    userLogin,
    viewAll,
    updateBook,
    sortAsce,
    searchBooks,
    deleteRecord,
    page
}