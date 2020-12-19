// This is the handler that converts and redirects a short url to the 
// original url.

module.exports = function(req, res){
    
    const shortCode = req.params.shortcode;
    const isValid = require('../share/validateCode');

    if (isValid(shortCode)){

        const connection = require('../database/connection');

        connection.query('SELECT original FROM urls WHERE short = ?', [shortCode], 
            (error, results, fields) => {

                if (error) throw error;

                if (results.length === 1){

                    let originalUrl = results[0].original;

                    connection.query('UPDATE urls SET clicks = clicks + 1 WHERE short = ?', [shortCode], 
                        (error, results, fields) => {

                            if (error) throw error;
                            
                            if (results.affectedRows === 1){
                                res.json({ status: "success", message: "I will redirect to " + originalUrl });
                            } else {
                                res.json({ errId: 1, status: "error", message: "An error was encountered" });
                            }
                        }
                    );
                    
                } else {
                    res.json({ errId: 2, status: "error", message: "Short code does not exist" });
                }
            }
        );
    } else {
        res.json({ errId: 2, status: "error", message: "Invalid url" });
    }
}