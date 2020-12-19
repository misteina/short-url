module.exports = function(code){
    if (/^[a-zA-Z0-9]+$/i.test(code) && code.length >= 4 && code.length <= 6){
        return true;
    } else {
        return false;
    }
}