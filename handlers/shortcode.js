module.exports = function(req, res){
    
    const shortCode = req.params.shortcode;
    const isValid = require('../share/validateUrl');

    if (isValid(shortCode)){

        const connection = require('../database/connection');

        connection.query('SELECT long FROM urls WHERE short = ?', [shortCode], 
            (error, results, fields) => {
                if (error) throw error;
                if (results.length === 1){
                    res.redirect('/' + results[0].long);
                } else {
                    res.json({ status: "error", message: "404" });
                }
            }
        );
    } else {
        res.json({ status: "error", message: "Invalid url" });
    }
}