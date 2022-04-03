const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtById,
    addThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction
} = require('../../controllers/thought-controller');

// /api/thoughts
// get all and post thoughts
router
    .route('/')
    .get(getAllThoughts)
    .post(addThought)

// /api/thoughts/:thoughtId
// get one, put, and delete thought
router
    .route('/:thoughtId')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought)

// /api/thoughts/:thoughtId/reactions
// add a reaction for a thought
router.route('/:thoughtId/reactions').post(addReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId
// remove a reaction from a thought
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;