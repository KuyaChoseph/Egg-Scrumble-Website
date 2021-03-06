const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter an password'],
        minlength: [6, 'Minimum password length is 6 characters'],
    },
    first_name: {
        type: String,
        required: [true, 'Please enter yout first name']
    },
    last_name: {
        type: String,
        required: [true, 'Please enter yout last name'],
    },
    code: {
        type: String,
        required: [false, 'Password Reset']
    },
    user_type:{
        type: String,
        required: [true, 'User type not included']
    },
    search_history: {
        type: Array,
        reqrequired: [false, 'Searches']
    },
    cart: {
        type: Array,
        unique: true,
        reqrequired: [false, 'Cart']
    },
    bookmarked: {
        type: Array,
        unique: true,
        reqrequired: [false, 'Bookmark']
    }
});

// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

const User = mongoose.model('user', userSchema);

module.exports = User;
