import crypto from "crypto"

export default {
    md5Sum: function(rawString) {
        return crypto.createHash('md5').update(rawString).digest("hex");
    }
}
