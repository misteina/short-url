module.exports = function(req, res){

    const custom = req.params.custom;
    const shortCode = req.params.custom;

    const isValid = require('../share/validateCode');

    if (isValid(shortCode) && /^[a-z]+$/i.test(custom)){

        const connection = require('../database/connection');

        connection.query('SELECT original FROM urls WHERE short = ? AND custom = ?', 
            [shortCode, custom], 
            (error, results, fields) => {
                if (error) throw error;
                if (results.length === 1){
                    res.redirect('/' + results[0].original);
                } else {
                    res.json({ status: "error", message: "404" });
                }
            }
        );
    } else {
        res.json({ status: "error", message: "Invalid url" });
    }
}