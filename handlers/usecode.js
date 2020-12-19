// This handler allows users to choose their own short code if it exists.

module.exports = function(req, res){

    const chosenCode = req.body.code;
    const longURL = req.body.url;
    const custom = req.body.custom;

    const isValidCode = require('../share/validateCode');
    const validUrl = require('valid-url');

    if (isValidCode(chosenCode)){

        if (validUrl.isUri(longURL)){

            const connection = require('../database/connection');

            let short = (typeof custom !== 'undefined')? custom + '/' + chosenCode : chosenCode;

            connection.query('SELECT short FROM urls WHERE short = ?', [short],
                (error, results, fields) => {

                    if (error) throw error;

                    if (results.length === 0) {
                        connection.query('INSERT INTO urls SET ?', { short: short, original: longURL },
                            (error, results, fields) => {

                                if (error) throw error;

                                if (results.affectedRows === 1) {
                                    res.json({
                                        status: "success",
                                        message: "Your short url is http://localhost:3000/" + short
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