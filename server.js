var express = require('express');
var path = require("path")
var bodyParser = require('body-parser');
var cors = require("cors");
var morgan = require("morgan");
const mongoose = require("mongoose");
var bcrypt = require("bcrypt-inzi");
var jwt = require("jsonwebtoken")
var cookieParser = require('cookie-parser')
var SERVER_SECRET = "4321"

let dbURI = "mongodb+srv://dbjahan:dbjahan@cluster0.8ric4.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", function () {
    console.log('Mongoose is connected')
})
mongoose.connection.on("disconnected", function () {
    console.log("Mongoose is disconnected")
})
mongoose.connection.on("error", function (err) {
    console.log("Mongoose connection error", err)
    process.exit(1)
})
process.on('SIGINT', function () {
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log("Mangoose default connection closed")
        process.exit(0)
    })
})

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    gender: String,
    createdOn: { type: Date, 'default': Date.now }
});
var userModel = mongoose.model('users', userSchema);

var app = express();
app.use(cookieParser())
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    credentials: true
}));app.use(morgan('dev'));
app.use("/", express.static(path.resolve(path.join(__dirname, "public"))))
app.post('/signup', (req, res, next) => {
    if (!req.body.name
        || !req.body.email
        || !req.body.password
        || !req.body.phone
        || !req.body.gender) {

        res.status(403).send(`
            please send name, email, passwod, phone and gender in json body.
            e.g:
            {
                "name": "Jahanzaib",
                "email": "jahanzaib@gmail.com",
                "password": "123",
                "phone": "242649826",
                "gender": "Male"
            }`)
        return;
    }
    userModel.findOne({ email: req.body.email }, function (err, data) {
        if (err) {
            console.log(err)
        }
        else if (!data) {
            bcrypt.stringToHash(req.body.password).then(dbPassword => {
                console.log("hash: ", dbPassword);
                var newUser = new userModel({
                    "name": req.body.name,
                    "email": req.body.email,
                    "password": dbPassword,
                    "phone": req.body.phone,
                    "gender": req.body.gender,
                })
                newUser.save((err, data) => {
                    if (!err) {
                        res.send({
                            message: "User created",
                            status: 200
                        })
                    } else {
                        console.log(err);
                        res.status(500).send("user create error, " + err)
                    }
                });
            })
        }
        else {
            res.send({
                message: 'Already registered'
            })
            console.log(data)
        }
    })

})
app.post('/login', (req, res, next) => {
    if (!req.body.lemail || !req.body.lpassword) {
        res.status(403).send(`
            please send email and passwod in json body.
            e.g:
            {
                "email": "jahanzaib@gmail.com",
                "password": "321",
            }`)
        return;
    }
    userModel.findOne({ email: req.body.lemail }, function (err, user) {
        console.log(user)
        if (err) {
            console.log(err)
            res.send({
                message: "Database error",
            })
        }
        else if (user) {
            bcrypt.varifyHash(req.body.lpassword, user.password).then(isMatched => {
                if (isMatched) {
                    const token = jwt.sign({
                        id: user._id,
                        name: user.name,
                        email: user.email,
                    }, SERVER_SECRET)
                    res.send({
                        status: 200,
                        message: "login success",
                        user: {
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                            gender: user.gender,
                        },
                    });
                 
                    res.cookie('jToken', token, {
                        maxAge: 86_400_000,
                        httpOnly: true
                    });

                } else {
                    console.log("not matched");
                    res.status(401).send({
                        message: "incorrect password"
                    })
                }
            }).catch(e => {
                console.log("error: ", e)
            })
        }
        else {
            res.status(403).send({
                message: "user not found"
            });
        }
    })
});

app.use((req, res, next) => {
    if (!req.cookies.jwt) {
        res.status(401).send({
            message: "Please provide token"
        })
        return
    }
        jwt.verify(req.cookies.jwt, SERVER_SECRET, function (err, decoded) {
            if (!err) {
                const issueDate = decoded.iat * 1000;
                const nowDate = new Date().getTime();
                const diff = nowDate - issueDate;
                if (diff > 30000) {
                    res.status(401).send({
                        message: "Token Expired"
                    })
                }
                else {
                    var token = jwt.sign({
                        id: decodedData.id,
                        name: decodedData.name,
                        email: decodedData.email,
                    }, SERVER_SECRET)
                    res.cookie('jwt', token, {
                        maxAge: 86_400_000,
                        httpOnly: true
                    });
                    req.body.jwt = decodedData
                    next();
                }
            }
            else {
                res.status(401).send({
                    message: "Invalid Token"
                })
            }

        })
    })
        app.get("/profile", (req, res, next) => {
            console.log(req.body)
            userModel.findById(req.body.jToken.id, 'name email phone gender createdOn',
                function (err, doc) {
                    if (!err) {
                        res.send({
                            profile: doc
                        })
                    } else {
                        res.status(500).send({
                            message: "server error"
                        })
                    }
                })
        })
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("server is running on: ", PORT);
})