module.exports = function(req, res){

    const connection = require('../database/connection');

    connection.query('TRUNCATE TABLE urls');
    connection.query('TRUNCATE TABLE next_code');

    res.json({status: "success", message: "cleared"});
}