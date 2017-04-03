const express = require('express');
const multer = require('multer');

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

router.post('/register', upload.single('profile.image'), (req, res, next) => {
	const name = req.body.name;
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const password2 = req.body.password2;

	if (req.file) {
		console.log('Uploading File...');
		const profileimage = req.file.filename;
	} else {
		console.log('No File Uploaded');
		const profileimage = 'noimage.jpg';
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
		console.log('No Errors');
	}
});

router.post('/login', (req, res, next) => {
	res.render('login', { title: 'Login' });
});

module.exports = router;
