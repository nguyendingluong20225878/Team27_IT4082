const { Vehicle, Apartment, Fee } = require('../models/index');

// Add a new vehicle (Thêm phương tiện)
const addVehicle = async (req, res) => {
    // Dòng console.log để debug, có thể xóa sau khi sửa xong lỗi
    console.log('[ADD VEHICLE DEBUG] req.body received:', req.body);

    // Destructuring các biến từ req.body.
    // Giữ nguyên tên snake_case ở đây vì frontend đang gửi dữ liệu với tên này.
    const { apartment_id, license_plate, type } = req.body;

    try {
        // 1. Kiểm tra căn hộ có tồn tại không
        const isApartmentExist = await Apartment.findByPk(apartment_id);
        if (!isApartmentExist) {
            return res.status(404).json({
                success: false,
                message: 'Apartment not found'
            });
        }

        // 2. Kiểm tra xem biển số xe đã tồn tại cho căn hộ này chưa
        const isVehicleExist = await Vehicle.findOne({
            where: {
                // SỬA ĐỔI Ở ĐÂY: Sử dụng tên thuộc tính trong model (licensePlate, apartmentId)
                // và gán giá trị từ biến (license_plate, apartment_id) nhận được từ req.body.
                licensePlate: license_plate,
                apartmentId: apartment_id
            }
        });
        if (isVehicleExist) {
            return res.status(409).json({
                success: false,
                message: 'Vehicle already exists for this apartment'
            });
        }

        // 3. Xác định tên phí dựa trên loại xe
        let feeName = null;
        if (type === "motorcycle") feeName = "Motorbike Parking Fee";
        else if (type === "car") feeName = "Car Parking Fee";
        else if (type === "bicycle") feeName = "Bicycle Parking Fee";

        // 4. Tìm và gán số tiền phí
        let amount = 0;
        if (feeName) {
            const fee = await Fee.findOne({ where: { name: feeName } });
            if (!fee) {
                // Trả về lỗi nếu không tìm thấy phí cho loại xe này
                return res.status(400).json({
                    success: false,
                    message: `Fee not found for vehicle type: ${type}. Please configure the fee in the system.`
                });
            }
            amount = fee.amount;
        }

        // 5. Tạo bản ghi Vehicle mới trong database
        // SỬA ĐỔI QUAN TRỌNG NHẤT Ở ĐÂY:
        // Đảm bảo tên thuộc tính được truyền vào `Vehicle.create` khớp với tên được định nghĩa trong model Vehicle (thường là camelCase).
        // Sau đó, gán giá trị từ các biến `snake_case` mà ta đã destructure từ `req.body`.
        const newVehicle = await Vehicle.create({
            licensePlate: license_plate, // Gán giá trị của `license_plate` (từ req.body) vào thuộc tính `licensePlate` của model
            type: type,                  // Giữ nguyên vì tên biến và tên thuộc tính khớp hoặc tự hiểu
            apartmentId: apartment_id,   // Gán giá trị của `apartment_id` (từ req.body) vào thuộc tính `apartmentId` của model
            amount: amount
        });

        // 6. Trả về phản hồi thành công
        return res.status(201).json({
            success: true,
            message: 'Vehicle added successfully',
            data: newVehicle
        });
    } catch (error) {
        // Xử lý lỗi và trả về phản hồi lỗi
        console.error('Error adding vehicle:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message // Hiển thị lỗi chi tiết trong môi trường dev, có thể ẩn trong production
        });
    }
};

// Get all vehicles (Truy vấn phí gửi xe)
const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll();
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

// Update vehicle (Chỉnh sửa phương tiện)
const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        // Đã điều chỉnh để nhận licensePlate và apartmentId (camelCase) từ frontend
        const { licensePlate, type, apartmentId } = req.body;

        const vehicle = await Vehicle.findByPk(id);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }

        // Gán giá trị, sử dụng tên thuộc tính của model (camelCase)
        vehicle.licensePlate = licensePlate !== undefined ? licensePlate : vehicle.licensePlate;
        vehicle.type = type !== undefined ? type : vehicle.type;
        vehicle.apartmentId = apartmentId !== undefined ? apartmentId : vehicle.apartmentId;

        // Cập nhật phí nếu loại xe thay đổi hoặc được cung cấp
        let feeName = null;
        if (vehicle.type === "motorcycle") feeName = "Motorbike Parking Fee";
        else if (vehicle.type === "car") feeName = "Car Parking Fee";
        else if (vehicle.type === "bicycle") feeName = "Bicycle Parking Fee";

        if (feeName) {
            const fee = await Fee.findOne({ where: { name: feeName } });
            if (!fee) {
                return res.status(400).json({
                    success: false,
                    message: `Fee not found for vehicle type: ${vehicle.type}. Please configure the fee in the system.`
                });
            }
            vehicle.amount = fee.amount;
        } else {
            vehicle.amount = 0;
        }

        await vehicle.save();

        res.status(200).json({ success: true, message: 'Vehicle updated successfully', data: vehicle });
    } catch (err) {
        console.error('Error updating vehicle:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// Delete vehicle (Xóa phương tiện)
const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findByPk(id);

        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }

        await vehicle.destroy();
        res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
    } catch (err) {
        console.error('Error deleting vehicle:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// Export các hàm để sử dụng ở nơi khác (ví dụ: trong file routes)
module.exports = {
    addVehicle,
    getVehicles,
    updateVehicle,
    deleteVehicle,
};