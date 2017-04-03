const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/nodeauth');
const Schema = mongoose.Schema;

const db = mongoose.connection;

const UserSchema = new Schema({
	username: {
		type: String,
		index: true
	},
	password: String,
	email: String,
	name: String,
	profileimage: String
});

module.exports = mongoose.model('User', UserSchema);
