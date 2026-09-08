const express = require('express');
const router = express.Router();
const { getUsers, getUser, createUser, getUserStats } = require('../controllers/userController');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id/stats', getUserStats);
router.get('/:id', getUser);

module.exports = router;
