const { Thought, User } = require('../models');

const thoughtController = {
    // GET get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            // .populate({
            //     path: 'reactions',
            //     select: '-__v'
            // })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
                return;
            });
    },

    // GET one thought by _id 
    // /api/thoughts/:thoughtId
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            // .populate({
            //     path: 'reactions',
            //     select: '-__v'
            // })
            .select('-__v')
            .then(dbThoughtData => {
                // if no thought found with id, 404
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // POST create a new thought and push thought to user's thoughts array
    addThought({ body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { username: body.username },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.status(400).json(err));
    },

    // PUT update a thought by it's _id 
    // /api/thought/:thoughtId
    
}