// This is the route handler that automatically generates the short url or accepts a custom one 
// if available.
// Generating random strings as an automatically generated short code may look like the easy way 
// out, but the disadvantage is that clashes can occurr. Therefore, to avoid clashes and repeated 
// checks for uniqueness the short codes were generated below in a way that clashes will occur.

module.exports = function (req, res) {

    const port = require('../share/port');
    const validUrl = require('valid-url');
    const isValidCode = require('../share/validateCode');

    const longURL = req.body.url;
    const customCode = req.body.custom;
    const mode = req.body.mode;

    if (mode === 'automatic'){

        if (validUrl.isUri(longURL)) {

            const connection = require('../database/connection');

            connection.beginTransaction(err => {
                if (err) { throw err; }
                connection.query('SELECT next FROM next_code FOR UPDATE',
                    function (error, results, fields) {
                        if (error) {
                            return connection.rollback(() => { throw error });
                        }
                        if (results.length === 1) {
                            let address = results[0].next.split('.');

                            for (let i = address.length - 1; i >= 0; i--) {
                                if (address[i] >= 61) {
                                    address[i] = 0;
                                } else if (address[i] < 61) {
                                    address[i] = (parseInt(address[i]) + 1).toString();
                                    break;
                                }
                            }

                            let addressCode = address.join('.');
                            if (addressCode != '0.0.0.0.0.0') {

                                let charArray = [];
                                const chars = require('../share/chars');

                                for (let i = 0; i < address.length; i++) {
                                    charArray.push(chars[address[i]]);
                                }
                                let shortCode = charArray.join('');

                                connection.query('UPDATE next_code SET next = ?', [addressCode],
                                    (error, results, fields) => {
                                        if (error) throw error;
                                        if (results.affectedRows === 1) {
                                            insertUrl(res, port, connection, shortCode, longURL);
                                        } else {
                                            connection.rollback();
                                            res.json({ errId: 5, status: "error", message: "An error was encountered" });
                                        }
                                    }
                                );
                            } else {
                                connection.rollback();
                                res.json({ errId: 1, status: "error", message: "Limit exceeded" });
                            }
                        } else {
                            connection.query('INSERT INTO next_code SET ?', { next: '0.0.0.0.0.0' },
                                (error, results, fields) => {
                                    if (error) throw error;
                                    if (results.affectedRows === 1) {

                                        let shortCode = 'aaaaaa';

                                        insertUrl(res, port, connection, shortCode, longURL);
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
            res.json({ status: "error", message: "The provided url is invalid" });
        }
    } else {
        if (isValidCode(customCode)) {

            if (validUrl.isUri(longURL)) {

                const connection = require('../database/connection');

                connection.query('SELECT short FROM urls WHERE short = ?', [customCode],
                    (error, results, fields) => {

                        if (error) throw error;

                        if (results.length === 0) {
                            connection.query('INSERT INTO urls SET ?', { short: customCode, original: longURL },
                                (error, results, fields) => {

                                    if (error) throw error;

                                    if (results.affectedRows === 1) {
                                        res.json({
                                            status: "success",
                                            message: "Your short url is http://localhost:3000/" + customCode
                                        });
                                    } else {
                                        res.json({ errId: 3, status: "error", message: "An error was encountered" });
                                    }
                                }
                            );
                        } else {
                            res.json({ errId: 4, status: "error", message: "Your chosen short code has been taken" });
                        }
                    }
                );
            } else {
                res.json({ rid: 4, status: "error", message: "The provided url is invalid" });
            }
        } else {
            res.json({ rid: 6, status: "error", message: "The provided short code is invalid" });
        }
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
                connection.rollback();
                res.json({ errId: 4, status: "error", message: "An error was encountered" });
            }
        }
    );
}