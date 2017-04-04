const express = require('express');
const multer = require('multer');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const upload = multer({ dest: './uploads' });
const router = express.Router();

function getUserById(id, callback) {
	User.findById(id, callback);
}

function getUserByUsername(username, callback) {
	const query = { username };
	User.findOne(query, callback);
}

function comparePassword(candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		callback(null, isMatch);
	});
}

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

router.post('/login',
	passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: 'Invalid username or passoword' }),
	(req, res) => {
		console.log('logged in!');
		req.flash('success', 'You are now logged in!');
		res.redirect('/');
	});

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	getUserById(id, (err, user) => {
		done(err, user);
	});
});

passport.use(new LocalStrategy((username, password, done) => {
	getUserByUsername(username, (err, user) => {
		if (err) throw err;
		if (!user) {
			return done(null, false, { message: 'Unknown User' });
		}
		comparePassword(password, user.password, (err, isMatch) => {
			if (err) return done(err);
			if (isMatch) {
				return done(null, user);
			} else {
				return done(null, false, { message: 'Invalid Password' });
			}
		});
	});
}));

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
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(newUser.password, salt, (err, hash) => {
				newUser.password = hash;
				newUser.save((err, user) => {
					if (err) throw err;
					console.log(user);
				});
			});
		});
		req.flash('success', 'You are now registed and can log in!');
		res.location('/');
		res.redirect('/');
	}
});

module.exports = router;
