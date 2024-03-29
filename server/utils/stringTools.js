//*****************************************************************/  
//    erratik library
//*****************************************************************/
module.exports = {
    
    randomValueBase64: function(len) {
        var crypto = require('crypto');
        return crypto.randomBytes(Math.ceil(len * 3 / 4)).toString('base64') // convert to base64 format
            .slice(0, len) // return required number of characters
            .replace(/\+/g, '0') // replace '+' with '0
            .replace(/\//g, '0'); // replace '/' with '0'
    }
};