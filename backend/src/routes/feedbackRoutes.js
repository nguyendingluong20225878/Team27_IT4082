const express = require('express');
const router = express.Router();
const feedbackController = require('../controller/feedbackController');
const { verifyTokenAdmin, verifyToken } = require('../middleware/veritify');

// Feedback Management (Tổ trưởng/Tổ phó)
router.post('/', verifyToken, feedbackController.createFeedbackUser);
router.get('/', verifyToken, feedbackController.getFeedbackUser);
router.put('/:id/response', verifyTokenAdmin, feedbackController.updateFeedbackUserResponse);
router.put('/:id/status-in-progress', verifyTokenAdmin, feedbackController.updateFeedbackUserStatusInProgress);
router.put('/:id/status-resolved', verifyTokenAdmin, feedbackController.updateFeedbackUserStatusResolved);

module.exports = router; 