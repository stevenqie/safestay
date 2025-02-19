var express = require('express');
var router = express.Router();
var connection = require('../db');

router.get('/', function (req, res) {
	var sql = 'SELECT * FROM User';
	connection.query(sql, function (err, results) {
		if (err) {
			console.error('Error fetching users data:', err);
			res
				.status(500)
				.send({ message: 'Error fetching users data', error: err });
			return;
		}
		res.json(results);
	});
});

router.get('/checkUsername', function (req, res) {
	const username = req.query.username;
	var sql = `SELECT * FROM User WHERE username = '${username}'`;
	connection.query(sql, function (err, results) {
		if (err) {
			console.error('Error checking username:', err);
			res.status(500).send({ message: 'Error checking username', error: err });
			return;
		}
		if (results.length > 0) {
			return res.status(200).json({ userFound: true });
		} else {
			return res.status(200).json({ userFound: false });
		}
	});
});

router.post('/createAccount', function (req, res) {
	var sql = `INSERT INTO User (username, password, first_name, last_name) VALUES ('${req.body.username}', '${req.body.password}', '${req.body.firstName}', '${req.body.lastName}')`;

	connection.query(sql, function (err) {
		if (err) {
			console.error('Error signing up user:', err);
			res
				.status(500)
				.send({ success: false, message: 'Error signing up user', error: err });
			return;
		}
		res.status(200).json({ success: true });
	});
});

router.get('/validateAccount', function (req, res) {
	var sql = `SELECT * FROM User WHERE username = '${req.query.username}' AND password = '${req.query.password}'`;

	connection.query(sql, function (err, results) {
		if (err) {
			console.error('Error checking account:', err);
			res.status(500).send({ message: 'Error checking account', error: err });
			return;
		}
		if (results.length > 0) {
			return res.status(200).json({ success: true });
		} else {
			return res.status(200).json({ success: false });
		}
	});
});

module.exports = router;
