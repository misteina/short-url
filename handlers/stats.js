module.exports = function (req, res) {

    const shortCode = req.params.shortcode;

    if (/^[a-zA-Z0-9]+$/i.test(shortCode) && shortCode.length >= 4 && shortCode.length <= 6){

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