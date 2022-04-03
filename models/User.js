const { Schema, model, Types } = require('mongoose');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: 'Username required!',
            trim: true
        },
        email: {
            type: String,
            required: 'Email address required',
            unique: true,
            match: [/.+@.+\..+/, 'Please add a valid email!']
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true
        }
    }
);

// get total count of User's friends on query
UserSchema.virtual('friendCount').get(function() {
    return this.friends.reduce((total, friend) => total + friend.replies.length + 1, 0);
});

// create User model using the UserSchema
const User = model('User', UserSchema);

// export the User model
module.exports = User;