const feedbackService = require('../services/feedbackService');

// Create a new feedback
const createFeedbackUser = async (req, res) => {
    try {
        const { residentId, apartmentId, reportType, description } = req.body;

        if (!residentId || !apartmentId || !reportType || !description) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: residentId, apartmentId, reportType, description' 
            });
        }

        const newFeedback = await feedbackService.createFeedback({
            residentId,
            apartmentId,
            reportType,
            description
        });

        res.status(201).json({ 
            success: true, 
            message: 'Feedback created successfully', 
            data: newFeedback 
        });
    } catch (err) {
        if (err.message === 'Resident not found' || err.message === 'Apartment not found') {
            return res.status(404).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get all feedbacks
const getFeedbackUser = async (req, res) => {
    try {
        const feedbacks = await feedbackService.getAllFeedbacks();
        res.status(200).json({ 
            success: true, 
            message: 'Feedbacks fetched successfully', 
            data: feedbacks 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update feedback response
const updateFeedbackUserResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const { response } = req.body;

        if (!response) {
            return res.status(400).json({ 
                success: false, 
                message: 'Response is required' 
            });
        }

        const feedback = await feedbackService.updateFeedbackResponse(id, response);
        res.status(200).json({ 
            success: true, 
            message: 'Feedback response updated successfully', 
            data: feedback 
        });
    } catch (err) {
        if (err.message === 'Feedback not found') {
            return res.status(404).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update feedback status to In Progress
const updateFeedbackUserStatusInProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await feedbackService.updateFeedbackStatus(id, 'In Progress');
        res.status(200).json({ 
            success: true, 
            message: 'Feedback status updated to In Progress', 
            data: feedback 
        });
    } catch (err) {
        if (err.message === 'Feedback not found') {
            return res.status(404).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update feedback status to Resolved
const updateFeedbackUserStatusResolved = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await feedbackService.updateFeedbackStatus(id, 'Resolved');
        res.status(200).json({ 
            success: true, 
            message: 'Feedback status updated to Resolved', 
            data: feedback 
        });
    } catch (err) {
        if (err.message === 'Feedback not found') {
            return res.status(404).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = {
    createFeedbackUser,
    getFeedbackUser,
    updateFeedbackUserResponse,
    updateFeedbackUserStatusInProgress,
    updateFeedbackUserStatusResolved,
}; 