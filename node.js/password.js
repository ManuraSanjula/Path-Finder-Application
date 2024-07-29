const bcrypt = require('bcrypt');
const saltRounds = 10;

// let storedHashedPassword = null;

function hashPassword(plainTextPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(plainTextPassword, saltRounds, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
    });
}

function comparePassword(plainTextPassword, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainTextPassword, hash, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

async function storeHashedPassword(password) {
    try {
        const hashedPassword = await hashPassword(password);
        console.log('Hashed Password:', hashedPassword);
        storedHashedPassword = hashedPassword; // Store the hash
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
    }
}

async function verifyPassword(enteredPassword,storedHashedPassword) {
    try {
        const isMatch = await comparePassword(enteredPassword, storedHashedPassword);
        if (isMatch) {
            console.log('Password match!');
        } else {
            console.log('Password does not match!');
        }
    } catch (error) {
        console.error('Error comparing passwords:', error);
    }
}

module.exports = {
    storeHashedPassword,
    verifyPassword
};

async function main() {
    var  password = "mySuperSecretPassword"
    let hash = await storeHashedPassword(password);
    await verifyPassword(password,hash); // Should print 'Password match!'
    await verifyPassword('wrongPassword',hash); // Should print 'Password does not match!'
}

main();
