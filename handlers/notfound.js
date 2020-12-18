module.exports = function (req, res){

    const port = require('../share/port');

    res.json({
        status: "200", 
        message: "Current url is http://localhost:" + port + "/" + req.path 
    })
}