var express = require('express');
var userRoutes = require('./routes/userRoutes');
var apartmentRoutes = require('./routes/apartmentRoutes');
var ratingRoutes = require('./routes/ratingRoutes');

var cors = require('cors');

var app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
	res.send({ message: 'Hello' });
});

app.use('/api/users', userRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/ratings', ratingRoutes);

app.listen(80, function () {
	console.log('Node app is running on port 80');
});
