
function validateUserName(name)
{
    return (name.length > 5)
}

function validateMail(mail)
{
    return (mail.length > 5)
}

function validatePassword(psw)
{
    return (psw.length > 5)
}

function validateAllWithAlerts(name, mail, psw)
{
    let ok = true

    if (!validateUserName(name)) {
        alert('Please enter a valid username')
        ok = false
    }

    if (!validateMail(mail)) {
        alert('Please enter a valid email')
        ok = false
    }

    if (!validatePassword(psw)) {
        alert('Please enter a valid password')
        ok = false
    }
    console.log("full validate %o", ok)
    return ok
}

// module.export = inputValidate
const inputValidate = {
    validateUserName,
    validateMail,
    validatePassword,
    validateAllWithAlerts
};

export default inputValidate