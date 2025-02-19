var express = require('express');
var router = express.Router();
var connection = require('../db');

router.get('/', function (req, res) {
	var sql = 'SELECT * FROM Rating';
	connection.query(sql, function (err, results) {
		if (err) {
			console.error('Error fetching rating data:', err);
			res
				.status(500)
				.send({ message: 'Error fetching rating data', error: err });
			return;
		}
		res.json(results);
	});
});

router.get('/checkUserRating', (req, res) => {
	const { address, username } = req.query;
	const sql = `SELECT rating FROM Rating WHERE address = ? AND username = ?`;

	connection.query(sql, [address, username], (err, results) => {
		if (err) {
			console.error('Error checking rating:', err);
			return res.status(500).json({ error: 'Database error' });
		}
		if (results.length > 0) {
			res.status(200).json({ hasRated: true, rating: results[0].rating });
		} else {
			res.status(200).json({ hasRated: false });
		}
	});
});

router.post('/addRating', (req, res) => {
	const { username, address, rating } = req.body;
	const sql = `INSERT INTO Rating (username, address, rating) VALUES (?, ?, ?)`;

	connection.query(sql, [username, address, rating], (err) => {
		if (err) {
			console.error('Error adding rating:', err);
			return res.status(500).json({ error: 'Database error' });
		}
		res.status(200).json({ success: true });
	});
});

router.post('/updateRating', (req, res) => {
	const { rating, address, username } = req.body;
	const sql = `UPDATE Rating SET rating = ? WHERE address = ? AND username = ?`;

	connection.query(sql, [rating, address, username], (err) => {
		if (err) {
			console.error('Error updating rating:', err);
			return res.status(500).json({ error: 'Database error' });
		}
		res.status(200).json({ success: true });
	});
});

module.exports = router;
