module.exports = function(url){
    if (/^[a-zA-Z0-9]+$/i.test(url) && url.length >= 4 && url.length <= 6){
        return true;
    } else {
        return false;
    }
}