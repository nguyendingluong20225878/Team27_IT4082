const { Vehicles, Apartment, Fee } = require('../models/index');

// Add a new vehicle (Thêm phương tiện)
const addVehicle = async (req, res) => {
    const { apartmentId, licensePlate, type } = req.body;
    try {
        const isApartmentExist = await Apartment.findOne({
            where: {
                id: apartmentId,
                status: 'Resident'
            }
        });
        if (!isApartmentExist) {
            return res.status(404).json({
                success: false,
                message: 'Apartment not found or inactive'
            });
        }
        const isVehicleExist = await Vehicles.findOne({
            where: {
                licensePlate: licensePlate,
                apartmentId: apartmentId
            }
        });
        if (isVehicleExist) {
            return res.status(409).json({
                success: false,
                message: 'Vehicle already exists for this apartment'
            });
        }

        let feeName = null;
        if (type === "motorcycle") {
            feeName = "Motorbike Parking Fee";
        } else if (type === "car") {
            feeName = "Car Parking Fee";
        }
        let amount = 0;
        if (feeName) {
            const fee = await Fee.findOne({ where: { name: feeName } });
            if (!fee) {
                return res.status(404).json({
                    success: false,
                    message: 'Fee not found for vehicle type'
                });
            }
            amount = fee.amount;
        }

        const newVehicle = await Vehicles.create({
            licensePlate: licensePlate,
            type: type,
            apartmentId: apartmentId,
            amount: amount // Although amount was removed from model, this might be a specific calculation for parking fee, we'll keep it for now as it's from the original logic.
        });
        return res.status(201).json({
            success: true,
            message: 'Vehicle added successfully',
            data: newVehicle
        });
    } catch (error) {
        console.error('Error adding vehicle:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get all vehicles (Truy vấn phí gửi xe - but this retrieves all vehicles, not just fee info)
const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicles.findAll();
        if (!vehicles) {
            return res.status(404).json({
                success: false,
                message: 'Vehicles not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Vehicles retrieved successfully',
            data: vehicles
        });
    } catch (error) {
        console.error('Error getting vehicle:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Update vehicle (Chỉnh sửa loại phương tiện - and other attributes)
const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params; // Vehicle ID
        const { licensePlate, type, apartmentId } = req.body;

        const vehicle = await Vehicles.findByPk(id);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }

        // Update attributes
        vehicle.licensePlate = licensePlate || vehicle.licensePlate;
        vehicle.type = type || vehicle.type;
        vehicle.apartmentId = apartmentId || vehicle.apartmentId;

        // Optionally recalculate amount if type changes and feeName is applicable
        let feeName = null;
        if (vehicle.type === "motorcycle") {
            feeName = "Motorbike Parking Fee";
        } else if (vehicle.type === "car") {
            feeName = "Car Parking Fee";
        }

        if (feeName) {
            const fee = await Fee.findOne({ where: { name: feeName } });
            if (fee) {
                vehicle.amount = fee.amount;
            } else {
                console.warn('Fee not found for updated vehicle type, amount not updated.');
            }
        } else {
            vehicle.amount = 0; // Or handle as per business logic if no fee applies
        }

        await vehicle.save();

        res.status(200).json({ success: true, message: 'Vehicle updated successfully', data: vehicle });
    } catch (err) {
        console.error('Error updating vehicle:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete vehicle (Xóa phương tiện)
const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params; // Vehicle ID
        const vehicle = await Vehicles.findByPk(id);

        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }

        await vehicle.destroy();
        res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
    } catch (err) {
        console.error('Error deleting vehicle:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = {
    addVehicle,
    getVehicles,
    updateVehicle,
    deleteVehicle,
}; 