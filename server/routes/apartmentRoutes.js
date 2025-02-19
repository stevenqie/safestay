var express = require('express');
var router = express.Router();
var connection = require('../db');

router.get('/', function (req, res) {
	var sql = 'SELECT * FROM Apartment';
	connection.query(sql, function (err, results) {
		if (err) {
			console.error('Error fetching apartments data:', err);
			res
				.status(500)
				.send({ message: 'Error fetching apartments data', error: err });
			return;
		}
		res.json(results);
	});
});

router.post('/filter', async (req, res) => {
	const { filters } = req.body;

	if (!Array.isArray(filters) || filters.length === 0) {
		return res.status(400).send('Invalid input. Provide an array of filters.');
	}

	const tempTables = [];
	try {
		// Set isolation level
		await new Promise((resolve, reject) => {
			connection.query(
				'SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;',
				(err) => {
					if (err) return reject(err);
					resolve();
				},
			);
		});

		// Start a transaction
		await new Promise((resolve, reject) => {
			connection.beginTransaction((err) => {
				if (err) return reject(err);
				resolve();
			});
		});

		// Create temporary tables
		for (let i = 0; i < filters.length; i++) {
			const filter = filters[i];
			const tempTableName = `t${i}`;
			tempTables.push(tempTableName);

			// Drop the temporary table if it already exists
			await new Promise((resolve, reject) => {
				const dropTempTableQuery = `DROP TEMPORARY TABLE IF EXISTS ${tempTableName};`;
				connection.query(dropTempTableQuery, (err) => {
					if (err) return reject(err);
					resolve();
				});
			});

			let createTempTableQuery = `
                CREATE TEMPORARY TABLE ${tempTableName} AS
            `;
			let condition =
				filter.bound_type === 'AT_LEAST'
					? `>= ${filter.threshold}`
					: `<= ${filter.threshold}`;
			if (filter.subject === 'STREETLIGHTS') {
				createTempTableQuery += `
                    SELECT a.address, a.safestay_score, a.latitude, a.longitude, a.block
                    FROM Apartment a
                    JOIN Streetlight s ON a.block = s.block
                    GROUP BY a.address, a.safestay_score, a.latitude, a.longitude, a.block
                    HAVING COUNT(s.streetlight_id) ${condition};
                `;
			} else if (filter.subject === 'CRASHES') {
				createTempTableQuery += `
                    SELECT a.address, a.safestay_score, a.latitude, a.longitude, a.block
                    FROM Apartment a
                    JOIN Pedestrian_Crash p ON a.block = p.block
                    GROUP BY a.address, a.safestay_score, a.latitude, a.longitude, a.block
                    HAVING COUNT(p.crash_id) ${condition};
                `;
			} else if (filter.subject === 'SAFESTAY_SCORE') {
				createTempTableQuery += `
                    SELECT * FROM Apartment
                    WHERE safestay_score ${condition};
                `;
			} else {
				createTempTableQuery += `
                    SELECT a.address, a.safestay_score, a.latitude, a.longitude, a.block
                    FROM Apartment a
                    JOIN aptCommunityScore cs ON a.address = cs.address
                    WHERE cs.communityScore ${condition};
                `;
			}

			// Execute query
			await new Promise((resolve, reject) => {
				connection.query(createTempTableQuery, (err) => {
					if (err) return reject(err);
					resolve();
				});
			});
		}

		// Intersect all temporary tables
		const intersectQuery = tempTables.reduce((acc, tableName, index) => {
			if (index === 0) return tableName;
			return `${acc} INNER JOIN ${tableName} USING (address)`;
		});

		const finalQuery = `SELECT * FROM ${intersectQuery};`;
		const rows = await new Promise((resolve, reject) => {
			connection.query(finalQuery, (err, results) => {
				if (err) return reject(err);
				resolve(results);
			});
		});

		// Commit the transaction
		await new Promise((resolve, reject) => {
			connection.commit((err) => {
				if (err) return reject(err);
				resolve();
			});
		});

		// Return results
		res.json(rows);
	} catch (error) {
		console.error('Error during transaction:', error);

		// Rollback the transaction
		await new Promise((resolve) => {
			connection.rollback(() => {
				resolve();
			});
		});

		res.status(500).send('An error occurred while executing the queries.');
	}
});

router.get('/fetchScores', function (req, res) {
	const { address } = req.query;
	var safestayScoreSql = `SELECT safestay_score FROM Apartment WHERE address = '${address}'`;
	var communityScoreSql = `SELECT communityScore AS community_score FROM aptCommunityScore WHERE address = '${address}'`;

	connection.query(
		safestayScoreSql,
		[address],
		function (err, safestayResults) {
			if (err) {
				console.error('Error fetching Safestay Score:', err);
				return res.status(500).send({
					message: 'Error fetching Safestay Score',
					error: err,
				});
			}

			if (safestayResults.length > 0) {
				const safestayScore = safestayResults[0].safestay_score;

				connection.query(
					communityScoreSql,
					[address],
					function (err, communityResults) {
						if (err) {
							console.error('Error fetching Community Score:', err);
							return res.status(500).send({
								message: 'Error fetching Community Score',
								error: err,
							});
						}
						const communityScore =
							communityResults.length > 0
								? communityResults[0].community_score
								: 0;

						return res.status(200).json({
							success: true,
							data: {
								safestay_score: safestayScore,
								community_score: communityScore,
							},
						});
					},
				);
			} else {
				console.log('No Safestay score found for this address');
				return res.status(404).json({
					success: false,
					message: 'No Safestay score found for the provided address',
				});
			}
		},
	);
});

module.exports = router;
