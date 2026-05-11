const express = require('express');
const { reelCreateController, getAllReelsController, getReelsByIdController, likesReelController, commentController, editCmntController, deleteCmntController, toggleReelController, reelsSaveController, reelsGetController, addReelsViewController, getReelsViewController } = require('../controllers/reelsController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/reelsUpload');

const router = express.Router();

// routes
// CREATE REEL || POST /api/reels/create-reel
router.post('/createl', authMiddleware, upload.single('file'), reelCreateController);

// GET ALL REELS || GET /api/reels/get-all-reels
router.get('/get-all-reels', authMiddleware, getAllReelsController);

// GET SPECIFIC USER REEL BY ID || GET /api/reels/:id
router.get('/user-reels/:id',  authMiddleware, getReelsByIdController);

// LIKE & UNLIKE REELS || POST
router.post('/likes/:id', authMiddleware, likesReelController);

// ADD COMMENT || POST
router.post('/comment/:id', authMiddleware, commentController);

// EDIT COMMENT
router.put('/edit-comment/:id', authMiddleware, editCmntController);

// DELETE COMMENT
router.delete('/delete-comment/:id', authMiddleware, deleteCmntController);

// COMMENT VIEW AND DISABLED
router.patch('/toggle-comment/:id', authMiddleware, toggleReelController);

// SAVED REELS
router.post('/save/:id', authMiddleware, reelsSaveController);

// GET SAVED REELS
router.get('/saved-reels/list', authMiddleware, reelsGetController);

// REEL VIEW BY USER
router.post('/view/:id', authMiddleware, addReelsViewController);

// GET VIEW COUNT
router.get('/get-views/:id', authMiddleware, getReelsViewController);

// WALLET COINS 
router.post("/wallet/spend", authMiddleware, )

module.exports = router;