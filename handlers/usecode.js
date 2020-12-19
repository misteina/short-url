module.exports = function(req, res){

    const chosenCode = req.body.code;
    const longURL = req.body.url;

    const isValidCode = require('../share/validateCode');
    const validUrl = require('valid-url');

    if (isValidCode(chosenCode)){

        if (validUrl.isUri(longURL)){

            const connection = require('../database/connection');

            connection.query('SELECT short FROM urls WHERE short = ?', [chosenCode],
                (error, results, fields) => {
                    if (error) throw error;
                    if (results.length === 0) {
                        connection.query('INSERT INTO urls SET ?', { short: chosenCode, original: longURL },
                            (error, results, fields) => {
                                if (error) throw error;
                                if (results.affectedRows === 1) {
                                    res.json({
                                        status: "success",
                                        message: "Your short url is http://localhost:3000/" + chosenCode
                                    });
                                } else {
                                    res.json({ errId: 3, status: "error", message: "An error was encountered" });
                                }
                            }
                        );
                    } else {
                        res.json({ errId: 4, status: "error", message: "Your chosen short code has been taken" });
                    }
                }
            );
        } else {
            res.json({ rid: 4, status: "error", message: "The provided url is invalid" });
        }
    } else {
        res.json({ rid: 6, status: "error", message: "The provided short code is invalid" });
    }
}