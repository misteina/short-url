module.exports = function (req, res) {

    const validUrl = require('valid-url');
    const port = require('../share/port');

    const longURL = req.body.url;
    const customURL = req.body.custom;

    if (validUrl.isUri(longURL)){

        const connection = require('../database/connection');

        connection.beginTransaction(err => {
            if (err) { throw err; }
            connection.query('SELECT code6 FROM next_code WHERE id = 1 FOR UPDATE', 
                function (error, results, fields){
                    if (error) {
                        return connection.rollback(() => {throw error});
                    }
                    if (results.length === 1){
                        let address = results[0].code6.split('.');

                        for (let i = address.length - 1; i >= 0; i--) {
                            if (address[i] >= 61) {
                                address[i] = 0;
                            } else if (address[i] < 61) {
                                address[i] += 1;
                                break;
                            }
                        }

                        let addressJoin = address.join('.');
                        if (addressJoin != '0.0.0.0' && addressJoin != '0.0.0.0.0' && addressJoin != '0.0.0.0.0.0') {

                            let charArray = [];
                            const chars = require('../share/chars');

                            for (let i = 0; i < address.length; i++) {
                                charArray.push(chars[address[i]]);
                            }
                            let shortCode = charArray.join('');
                            if (typeof customURL !== 'undefined') shortCode = customURL + '/' + shortCode;

                            insertUrl(res, port, connection, shortCode, longURL);
                        } else {
                            connection.rollback();
                            res.json({ errId: 1, status: "error", message: "Limit exceeded" });
                        }
                    } else {
                        connection.query('INSERT INTO next_code SET ?', {code6: '0.0.0.0.0.0'}, 
                            (error, results, fields) => {
                                if (error) throw error;
                                if (results.affectedRows === 1){
                                    insertUrl(res, port, connection, 'aaaaaa', longURL);
                                } else {
                                    connection.rollback();
                                    res.json({ errId: 2, status: "error", message: "An error was encountered" });
                                }
                            }
                        );
                    }
                }
            );
        });
    } else {
        res.json({status: "error", message: "The provided url is invalid"});
    }
}

function insertUrl(res, port, connection, shortCode, longURL){
    connection.query('INSERT INTO urls SET ?', { short: shortCode, original: longURL },
        (error, results, fields) => {
            if (error) throw error;
            if (results.affectedRows === 1) {
                connection.commit(function (err) {
                    if (err) {
                        return connection.rollback(function () {
                            throw err;
                        });
                    }
                    res.json({ status: "success", message: "Your short url is http://localhost:" + port + "/" + shortCode });
                });
            } else {
                res.json({ errId: 4, status: "error", message: "An error was encountered" });
            }
            connection.rollback();
        }
    );
}