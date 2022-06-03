
function validateUserName(name)
{
    return (name.length > 5)
}

function validateMail(mail)
{
	let arobase = false;
	let dot = false;
	for (let i = 0; i < mail.length; i++) {
		if (mail[i] == '@') {
			if (i == 0) {
				return false;
			}
			arobase = true;
		}
		if (mail[i] == '.' && arobase == true) {
			dot = true;
		}
	}
    return (dot)
}

function validatePassword(psw)
{
    return (psw.length > 5)
}

function validateUpdate(item)
{
    return (true)
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
    validateAllWithAlerts,
    validateUpdate
};

export default inputValidate