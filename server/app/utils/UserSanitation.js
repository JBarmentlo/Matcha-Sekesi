/**
 * Remove Password attribute
 * @param {*} user 
 * @returns user without password attribute
 */
function sanitize_soft(user)
{
    delete user.password
    return user
}

/**
 * Remove Password and mail attribute
 * @param {*} user 
 * @returns user without password or mail attribute
 */
function sanitize_hard(user)
{
    delete user.password
    delete user.mail
    return user
}

module.exports.sanitize_hard = sanitize_hard
module.exports.sanitize_soft = sanitize_soft