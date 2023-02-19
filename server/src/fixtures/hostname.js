// exports.hostname = `${process.env.MATCHA_HOST}${process.env.MATCHA_OUTSIDE_PORT == '80' || process.env.MATCHA_OUTSIDE_PORT == '443' ? '' : ':' + process.env.MATCHA_OUTSIDE_PORT}`
exports.front_hostname = process.env.MATCHA_FRONT_HOST
exports.back_hostname = process.env.MATCHA_BACK_HOST