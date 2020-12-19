// This is the route handler that redirects a customized short code which has a clue to 
// which url it is pointing to.

module.exports = function(req, res){

    const custom = req.params.custom;
    const shortCode = req.params.shortcode;

    const isValid = require('../share/validateCode');

    if (isValid(shortCode) && /^[a-z]+$/i.test(custom)){

        const connection = require('../database/connection');

        let short = custom + '/' + shortCode;

        connection.query('SELECT original FROM urls WHERE short = ?', [short], 
            (error, results, fields) => {

                if (error) throw error;

                if (results.length === 1){

                    let originalUrl = results[0].original;

                    connection.query('UPDATE urls SET clicks = clicks + 1 WHERE short = ?', [short], 
                        (error, results, fields) => {

                            if (error) throw error;

                            if (results.affectedRows === 1){
                                res.json({ status: "success", message: "I will redirect to " + originalUrl });
                            } else {
                                res.json({ errId: 2, status: "error", message: "An error was encountered" });
                            }
                        }
                    );

                } else {
                    res.json({ errId: 3, status: "error", message: "Short code not found" });
                }
            }
        );
    } else {
        res.json({ errId: 4, status: "error", message: "Invalid url" });
    }
}