const { Resident, ResidentApartment } = require('../models/index');

// Create residents
const createResidents = async (req, res) => {
  try {
    let residentsData = req.body;
    if (!residentsData || (Array.isArray(residentsData) && residentsData.length === 0)) {
      return res.status(400).json({ message: 'Input must be a non-empty object or array' });
    }

    if (!Array.isArray(residentsData)) {
      residentsData = [residentsData];
    }

    for (const resident of residentsData) {
      if (!resident.email || !resident.name || !resident.phoneNumber || !resident.gender || !resident.cic || !resident.dob) {
        return res.status(400).json({ message: 'Each resident must have email, name, phoneNumber, gender, cic, dob' });
      }
    }

    const residents = await Resident.bulkCreate(residentsData, { validate: true });

    res.status(201).json({
      success: true,
      message: 'Residents created successfully',
      data: residents,
      totalCreated: residents.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all residents in apartments
const getAllResidentsInApartment = async (req, res) => {
  try {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = 7;
    const offset = (page - 1) * limit;

    const { count, rows } = await ResidentApartment.findAndCountAll({
      include: [
        {
          model: Resident,
          attributes: ['name', 'dob', 'gender', 'id', 'cic', 'email', 'phoneNumber', 'permanentResidence', 'temporaryResidence']
        }
      ],
      attributes: ['role_in_family', 'apartmentId'],
      offset,
      limit
    });

    const totalPages = Math.ceil(count / limit);

    const result = rows.map(ra => ({
      residentId: ra.Resident ? ra.Resident.id : null,
      name: ra.Resident ? ra.Resident.name : null,
      dob: ra.Resident ? ra.Resident.dob : null,
      gender: ra.Resident ? ra.Resident.gender : null,
      role_in_family: ra.role_in_family,
      apartmentId: ra.apartmentId,
      cic: ra.Resident ? ra.Resident.cic : null,
      email: ra.Resident ? ra.Resident.email : null,
      phoneNumber: ra.Resident ? ra.Resident.phoneNumber : null,
      permanentResidence: ra.Resident ? ra.Resident.permanentResidence : null,
      temporaryResidence: ra.Resident ? ra.Resident.temporaryResidence : null,
    }));

    res.status(200).json({
      success: true,
      message: "Get all residents in apartments successfully",
      total: count,
      page,
      limit,
      totalPages,
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get resident by ID (Truy vấn thông tin NK)
const getResidentById = async (req, res) => {
  try {
    const { id } = req.params;
    const resident = await Resident.findByPk(id);

    if (!resident) {
      return res.status(404).json({ success: false, message: 'Resident not found' });
    }

    res.status(200).json({ success: true, message: 'Resident fetched successfully', data: resident });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update resident (Sửa thông tin NK)
const updateResident = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber, gender, dob, cic, permanentResidence, temporaryResidence, status } = req.body;

    const resident = await Resident.findByPk(id);
    if (!resident) {
      return res.status(404).json({ success: false, message: 'Resident not found' });
    }

    resident.name = name || resident.name;
    resident.email = email || resident.email;
    resident.phoneNumber = phoneNumber || resident.phoneNumber;
    resident.gender = gender || resident.gender;
    resident.dob = dob || resident.dob;
    resident.cic = cic || resident.cic;
    resident.permanentResidence = permanentResidence || resident.permanentResidence;
    resident.temporaryResidence = temporaryResidence || resident.temporaryResidence;
    resident.status = status || resident.status;

    await resident.save();

    res.status(200).json({ success: true, message: 'Resident updated successfully', data: resident });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete resident (Xóa thông tin NK)
const deleteResident = async (req, res) => {
  try {
    const { id } = req.params;
    const resident = await Resident.findByPk(id);

    if (!resident) {
      return res.status(404).json({ success: false, message: 'Resident not found' });
    }

    await resident.destroy();
    res.status(200).json({ success: true, message: 'Resident deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete member from apartment (Xóa thành viên khỏi căn hộ)
const deleteMember = async (req, res) => {
  try {
    const { residentId, apartmentId } = req.body;

    if (!residentId || !apartmentId) {
      return res.status(400).json({ message: 'Missing residentId or apartmentId' });
    }

    const residentApartment = await ResidentApartment.findOne({
      where: { residentId, apartmentId }
    });

    if (!residentApartment) {
      return res.status(404).json({ success: false, message: 'Resident not found in this apartment' });
    }

    await residentApartment.destroy();
    res.status(200).json({ success: true, message: 'Resident successfully removed from apartment' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get resident residence info
const getUserResidenceInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const residentApartments = await ResidentApartment.findAll({
      where: { residentId: id },
      include: [{
        model: Apartment,
        attributes: ['id', 'address_number', 'area', 'status'],
      }],
      attributes: ['role_in_family', 'is_owner', 'joined_at'],
    });

    if (!residentApartments || residentApartments.length === 0) {
      return res.status(404).json({ success: false, message: 'Resident residence info not found' });
    }

    res.status(200).json({ success: true, message: 'Resident residence info fetched successfully', data: residentApartments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  createResidents,
  getAllResidentsInApartment,
  getResidentById,
  updateResident,
  deleteResident,
  deleteMember,
  getUserResidenceInfo,
}; 