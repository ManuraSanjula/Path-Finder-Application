const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
// const {storeHashedPassword, verifyPassword } = require('./password')
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const bcrypt = require('bcryptjs');
const email = "./email";
const dotenv = require('dotenv');
dotenv.config({ path: './.config.env' });

function generateKeyAndIv() {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    return { key, iv };
}

// Function to encrypt text
function encrypt(text, key, iv) {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), content: encrypted };
}

function decrypt(encryptedObj, key) {
    const cleanedInput = encryptedObj.substring(1, encryptedObj.length - 1);
    const pairs = cleanedInput.split(', ');
    const map = {};
    pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        map[key] = value;
    });
    if (!map.iv || !map.content) {
        throw new Error('Invalid encrypted object structure');
    }

    const iv = Buffer.from(map.iv, 'hex');
    const encryptedData = Buffer.from(map.content, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
app.use(express.json());
app.use(cors());

const saltRounds = 10;
const secretKey = "jvkvdvskvdsjkvdsvkdsvkdsvksnvksdnvjsn";
const key = crypto.randomBytes(32);


async function hashPassword(password) {
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (err) {
        console.error("Error hashing password:", err);
        return null;
    }
}

async function verifyPassword(plainPassword, hashedPassword) {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (err) {
        console.error("Error hashing password:", err);
        return false;
    }
}

async function jwt_create(payload) {
    const options = {
        expiresIn: "24h",
    };

    const token = jwt.sign(payload, secretKey, options);
    return token;
}

async function jwt_verify(tokenToVerify) {
    let valid = false;
    jwt.verify(tokenToVerify, secretKey, (err, decoded) => {
        if (err) {
            console.error("Token verification failed:", err);
            valid = false
        } else {
            console.log("Decoded Token:", decoded);
            valid = true
        }
    });
    return valid;
}

async function getEmailFromJWT(tokenToVerify = "") {
    let email = ""
    jwt.verify(tokenToVerify, secretKey, (err, decoded) => {
        if (err) {
            console.log("Token verification failed:", err);
            email = null;
        } else {
            console.log("Decoded Token:", decoded);
            email = decoded.email;
        }
    });
    return email;
}

app.post("/login", async (req, res) => {
    const temp = {
        operation: "read",
        key: req.body.email,
    };
    const headers = {
        "Content-Type": "application/json",
    };
    let response = await axios.post("http://localhost:8081", JSON.stringify(temp), { headers });
    if (response.data) {

        const bytes = CryptoJS.AES.decrypt(response.data, secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);

        if (decrypted == req.body.password) {
            let token = await jwt_create({ email: req.body.email });
            return res.status(200).send({
                token: token
            });
        } else {
            return res.status(400).send({
                message: "Error",
            });
        }
    } else {
        return res.status(401).send({
            error: "User Not Found",
        });
    }
});

app.post("/signin", async (req, res) => {
    const headers = {
        "Content-Type": "application/json",
    };

    const temp = {
        operation: "read",
        key: req.body.email,
    };

    try {
        let response = await axios.post("http://localhost:8081", JSON.stringify(temp), { headers });

        if (response.data) {
            return res.status(400).send({
                error: "User Exists",
            });
        } else {
            const hash = CryptoJS.AES.encrypt(req.body.password, secretKey).toString();
            const data = {
                operation: "insert",
                key: req.body.email,
                value: hash,
            };
            response = await axios.post(
                "http://localhost:8081",
                JSON.stringify(data),
                { headers }
            );
            if (response.data) {
                let token = await jwt_create({ email: req.body.email });
                return res.status(200).send({
                    token: token
                });
            } else {
                return res.statusCode(500).send({
                    error: "Error",
                });
            }
        }
    } catch (error) {
        console.error("Error in /signin route:", error);
        return res.status(500).send({
            error: "Internal Server Error"
        });
    }
});

app.post("/verify-token", async (req, res) => {
    let valid = await jwt_verify(req.body.token)
    return res.status(200).send({
        valid
    });
});

app.post("/travelhistory", async (req, res) => {
    const headers = {
        "Content-Type": "application/json",
    };
    let email = await getEmailFromJWT(req.body.token)
    delete req.body.token

    const temp = {
        operation: "read",
        key: `${email} travel_his`,
    };

    let response = await axios.post(
        "http://localhost:8081",
        JSON.stringify(temp),
        { headers }
    );


    if (response.data) {
        let data = {
            des: req.body.des,
            location: req.body.location,
            userResponse: req.body.userResponse
        }
        response.data.push(data);
        data = {
            operation: "insert",
            key: `${email} travel_his`,
            value: response.data ,
        };
        response = await axios.post(
            "http://localhost:8081",
            JSON.stringify(data),
            { headers }
        );
    } else {
        const data = {
            operation: "insert",
            key: `${email} travel_his`,
            value: [{
                des: req.body.des,
                location: req.body.location,
                userResponse: req.body.userResponse
            }],
        };
        response = await axios.post(
            "http://localhost:8081",
            JSON.stringify(data),
            { headers }
        );
    }
    if (response.data) {
        return res.status(200);
    } else {
        return res.status(500);
    }
});

app.put("/travelhistory", async (req, res) => {
    const headers = {
        "Content-Type": "application/json",
    };
    let email = await getEmailFromJWT(req.body.token)
    delete req.body.token

    const temp = {
        operation: "read",
        key: `${email} travel_his`,
    };

    let response = await axios.post(
        "http://localhost:8081",
        JSON.stringify(temp),
        { headers }
    );

    if (response.data) {
        return res.status(200).send({
            data: response.data
        });
    } else {
        return res.status(500);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
