module.exports = function (req, res) {

    const validUrl = require('valid-url');

    const longURL = req.body.url;
    const customURL = req.body.custom;

    if (validUrl.isUri(longURL)){

        const connection = require('../database/connection');

        connection.beginTransaction(err => {
            if (err) { throw err; }
            connection.query('SELECT next FROM next_code WHERE id = 3 FOR UPDATE', 
                function (error, results, fields){
                    if (error) {
                        return connection.rollback(() => {throw error});
                    }

                    let address = results[0].next.split('.');

                    for (let i = address.length - 1;i >= 0;i--){
                        if (address[i] >= 61){
                            address[i] = 0;
                        } else if (address[i] < 61){
                            address[i] += 1;
                            break;
                        }
                    }

                    let addressJoin = address.join('.');
                    if (addressJoin != '0.0.0.0' && addressJoin != '0.0.0.0.0' && addressJoin != '0.0.0.0.0.0'){
                        
                        let charArray = [];
                        const chars = require('../share/chars');

                        for (let i = 0; i < splitCode.length; i++) {
                            charArray.push(chars[splitCode[i]]);
                        }
                        let shortCode = charArray.join('');
                        if (typeof customURL !== 'undefined') shortCode = customURL + '/' + shortCode;

                        connection.query('INSERT INTO urls SET ?', {short: shortCode, long: longURL}, 
                            (error, results, fields) => {
                                if (error) throw error;
                                if (results.affectedRows === 1){
                                    connection.commit(function (err) {
                                        if (err) {
                                            return connection.rollback(function () {
                                                throw err;
                                            });
                                        }
                                        res.json({ status: "success", message: "Your short url is http://localhost:3000/" + shortCode });
                                    });
                                }
                            }
                        );
                    } else {
                        connection.rollback();
                        res.json({status: "error", message: "Limit exceeded"});
                    }
                }
            );
        });
    } else {
        res.json({status: "error", message: "The provided url is invalid"});
    }
}