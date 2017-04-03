const express = require('express');
const multer = require('multer');
const User = require('../models/user');

const upload = multer({ dest: './uploads' });
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
	res.send('respond with a resource');
});

router.get('/register', (req, res, next) => {
	res.render('register', { title: 'Register' });
});

router.get('/login', (req, res, next) => {
	res.render('login', { title: 'Login' });
});

router.post('/register', upload.single('profileimage'), (req, res, next) => {
	console.log('start');
	const name = req.body.name;
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	var profileimage;

	if (req.file) {
		console.log('Uploading File...');
		profileimage = req.file.filename;
	} else {
		console.log('No File Uploaded');
		profileimage = 'noimage.jpg';
	}

	req.checkBody('name', 'Name field is required').notEmpty();
	req.checkBody('email', 'Email field is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username field is required').notEmpty();
	req.checkBody('password', 'Password field is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	const errors = req.validationErrors();

	if (errors) {
		res.render('register', { errors });
	} else {
		console.log('creating user in db');
		const newUser = new User({
			name,
			email,
			username,
			password,
			profileimage
		});
		newUser.save((err, user) => {
			if (err) throw err;
			console.log(user);
		});
		req.flash('success', 'You are now registed and can log in!');
		res.location('/');
		res.redirect('/');
	}
});

router.post('/login', (req, res, next) => {
	res.render('login', { title: 'Login' });
});

module.exports = router;
