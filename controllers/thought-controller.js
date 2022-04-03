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

    // PUT update a thought by its _id 
    // /api/thought/:thoughtId
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId}, body, { new: true, runValidators: true })
            .then(dbThoughtData => {
                // if no thought found with id, 404
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },

    // DELETE remove thought by its _id
    // /api/thought/:thoughtId
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(dbThoughtData => {
                // if no thought found with id, 404
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },

    // POST create a reaction
    // /api/thoughts/:thoughtId/reactions
    addReaction({ params, body }, res) {
       Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            {
                new: true,
                runValidators: true
            }
        )
            .then(dbThoughtData => {
                // if no thought found with id, 404
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },

    // DELETE remove a reaction by its id
    // /api/thoughts/:thoughtId/reactions/:reactionId
    removeReaction({ params }, res) {
        Thought.findByIdAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.json(err));
    }
};

module.exports = thoughtController;