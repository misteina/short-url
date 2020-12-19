const { connect } = require('../database/connection');

module.exports = function(req, res){
    
    const shortCode = req.params.shortcode;
    const isValid = require('../share/validateCode');

    if (isValid(shortCode)){

        const connection = require('../database/connection');

        connection.query('SELECT original FROM urls WHERE short = ?', [shortCode], 
            (error, results, fields) => {
                if (error) throw error;
                if (results.length === 1){
                    connection.query('UPDATE urls SET clicks = clicks + 1 WHERE short = ?', [shortCode]);
                    res.json({ status: "success", message: "I will redirect to " + results[0].original });
                } else {
                    res.json({ errId: 1, status: "error", message: "Short code does not exist" });
                }
            }
        );
    } else {
        res.json({ errId: 2, status: "error", message: "Invalid url" });
    }
}