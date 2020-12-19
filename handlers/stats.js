// This route handler shows the stats of the short url.

module.exports = function (req, res) {

    const shortCode = req.params.shortcode;

    const isValid = require('../share/validateCode');

    if (isValid(shortCode)){

        const connection = require('../database/connection');

        connection.query('SELECT clicks, access, created FROM urls WHERE short = ?', [shortCode], 
            (error, results, fields) => {

                if (error) throw error;
                
                if (results.length === 1){
                    res.json({ 
                        status: "success", 
                        data: {
                            clicks: results[0].clicks,
                            access: results[0].access,
                            created: results[0].created
                        } 
                    });
                } else {
                    res.json({ status: "error", message: "Short code does not exist" });
                }
            }
        );
    } else {
        res.json({ status: "error", message: "The provided short code is invalid" });
    }
}