module.exports = function(req, res){

    const chosenCode = req.body.code;

    if (/^[a-zA-Z0-9]+$/i.test(chosenCode) && chosenCode.length >= 4 && chosenCode.length <= 6){

        const connection = require('../database/connection');

        connection.query('INSERT INTO urls SET ?', {short: chosenCode}, 
            (error, results, fields) => {
                if (error) res.json({ status: "error", message: "Your chosen short code has been taken" });
                if (results.affectedRows === 1){
                    res.json({ 
                        status: "success", 
                        message: "Your short url is http://localhost:3000/" + chosenCode
                    });
                } else {
                    res.json({ status: "error", message: "Your chosen short code has been taken" });
                }
            }
        );
    } else {
        res.json({ status: "error", message: "The provided short code is invalid" });
    }
}