const { randomBytes, createHash } = require('crypto');

function createHashUpdateDigest(clearTextPassword, salt, hfunction = "sha1") {
    return createHash(hfunction).update(clearTextPassword + salt).digest('hex');
}

/*
 * Return a salted and hashed password entry from a
 * clear text password.
 * @param {string} clearTextPassword
 * @return {object} passwordEntry
 * where passwordEntry is an object with two string
 * properties:
 *      salt - The salt used for the password.
 *      hash - The sha1 hash of the password and salt
 */
function makePasswordEntry(clearTextPassword) {
    const salt = randomBytes(8).toString('hex');
    const hash = createHashUpdateDigest(clearTextPassword + salt);
    return { salt: salt, hash: hash };
}

/*
 * Return true if the specified clear text password
 * and salt generates the specified hash.
 * @param {string} hash
 * @param {string} salt
 * @param {string} clearTextPassword
 * @return {boolean}
 */
function doesPasswordMatch(hash, salt, clearTextPassword) {
    return hash === createHashUpdateDigest(clearTextPassword + salt);
}


module.exports = {
    makePasswordEntry,
    doesPasswordMatch,
}