const crypto = require("crypto")

const md5Sum = function(rawString) {
    return crypto.createHash('md5').update(rawString).digest("hex");
}

const responseJson = function(ctx, data) {
    ctx.status = 200;
    ctx.set("Content-Type", "application/json")
    ctx.body = JSON.stringify(data)
}

const sendMessage = function(ctx, data) {
    let obj = { data }
    responseJson(ctx, obj)
}

const sendError = function(ctx, error) {
    let obj = { error }
    responseJson(ctx, obj)
}

const isEmail = function(str) {
    let re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    if(re.test(str)) {
        return true
    } else {
        return false
    }
}


module.exports = {
    md5Sum,
    sendMessage,
    sendError,
    isEmail
}