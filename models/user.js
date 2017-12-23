var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var crypto = require('crypto');

var userSchema = new Schema({
    nickname: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 3,
    },
    name: String,
    avatar: String,
    fbId: Number,
    vkId: Number,
    token: String
}, {
    timestamps: true
});

userSchema.plugin(mongoosePaginate);

userSchema.pre('save', function(next) {
    if (this.token) 
        return next();

    generateToken(this, next)
});

mongoose.model('User', userSchema);

function generateToken(user, done) {
    var token = crypto.randomBytes(64).toString('hex');

    user.model('User').count({ token: token }, function(err, count) {
        if (err) { return done(err); }

        if (!count) {
            user.token = token;
            return done();
        }

        generateToken(user, done);
    });
}