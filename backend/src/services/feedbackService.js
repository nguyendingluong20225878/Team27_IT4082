const { FeedbackUser, Resident, Apartment } = require('../models/index');

class FeedbackService {
    async createFeedback(feedbackData) {
        const { residentId, apartmentId, reportType, description } = feedbackData;

        const resident = await Resident.findByPk(residentId);
        if (!resident) {
            throw new Error('Resident not found');
        }

        const apartment = await Apartment.findByPk(apartmentId);
        if (!apartment) {
            throw new Error('Apartment not found');
        }

        return await FeedbackUser.create({
            residentId,
            apartmentId,
            reportType,
            description,
            status: 'Pending',
        });
    }

    async getAllFeedbacks() {
        return await FeedbackUser.findAll({
            include: [
                { model: Resident, attributes: ['name', 'email', 'phoneNumber'] },
                { model: Apartment, attributes: ['address_number'] }
            ],
        });
    }

    async updateFeedbackResponse(id, response) {
        const feedback = await FeedbackUser.findByPk(id);
        if (!feedback) {
            throw new Error('Feedback not found');
        }

        feedback.response = response;
        await feedback.save();
        return feedback;
    }

    async updateFeedbackStatus(id, status) {
        const feedback = await FeedbackUser.findByPk(id);
        if (!feedback) {
            throw new Error('Feedback not found');
        }

        feedback.status = status;
        await feedback.save();
        return feedback;
    }
}

module.exports = new FeedbackService(); 