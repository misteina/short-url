module.exports = {
    isAuto: function(code){
        if (/^[a-zA-Z0-9]+$/i.test(code) && code.length === 6) {
            return true;
        } else {
            return false;
        }
    },
    isCustom: function (code) {
        if (/^[a-zA-Z0-9]+$/i.test(code) && (code.length === 4 || code.length === 5)) {
            return true;
        } else {
            return false;
        }
    },
    isValid: function(code){
        if (/^[a-zA-Z0-9]+$/i.test(code) && (code.length >= 4 || code.length <= 6)) {
            return true;
        } else {
            return false;
        }
    }
}