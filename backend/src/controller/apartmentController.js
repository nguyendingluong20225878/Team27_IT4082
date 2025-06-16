const { Apartment, ResidentApartment, Resident } = require('../models/index');
const { Op, fn, col } = require('sequelize');

// Get apartment residents info
const getApartmentResidentsInfo = async (req, res) => {
  try {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = 7;
    const offset = (page - 1) * limit;

    const totalApartments = await Apartment.count();

    const apartments = await Apartment.findAll({
      attributes: ['id', 'status', 'address_number', 'area'],
      include: [
        {
          model: ResidentApartment,
          attributes: ['is_owner'],
          required: false,
          include: [
            {
              model: Resident,
              attributes: ['name', 'phoneNumber', 'email'],
              required: false
            }
          ]
        }
      ],
      offset,
      limit
    });

    const residentCounts = await ResidentApartment.findAll({
      attributes: [
        'apartmentId',
        [fn('COUNT', col('residentId')), 'memberCount']
      ],
      group: ['apartmentId']
    });

    const countMap = {};
    residentCounts.forEach(item => {
      countMap[item.apartmentId] = item.get('memberCount');
    });

    const result = apartments.map(apt => {
      if (!apt) return null;

      const ownerRA = apt.ResidentApartments?.find(ra => ra?.is_owner);
      const resident = ownerRA?.Resident;

      return {
        apartmentId: apt.id,
        address_number: apt.address_number,
        area: apt.area,
        status: apt.status,
        ownerName: resident?.name || null,
        ownerPhoneNumber: resident?.phoneNumber || null,
        ownerEmail: resident?.email || null,
        memberCount: countMap[apt.id] ? parseInt(countMap[apt.id]) : 0
      };
    }).filter(Boolean); // loại bỏ phần tử null

    const totalPages = Math.ceil(totalApartments / limit);

    res.status(200).json({
      success: true,
      message: "Get apartment residents info successfully",
      totalApartments,
      page,
      limit,
      totalPages,
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create apartment(s)
const createApartment = async (req, res) => {
  try {
    const apartmentsData = req.body;

    if (!Array.isArray(apartmentsData) || apartmentsData.length === 0) {
      return res.status(400).json({ message: 'Input must be a non-empty array' });
    }

    for (const item of apartmentsData) {
      if (!item.address_number || !item.area) {
        return res.status(400).json({ message: 'Each apartment must have address_number and area' });
      }
    }

    const apartments = await Apartment.bulkCreate(apartmentsData);

    res.status(201).json({
      success: true,
      message: 'Apartments created successfully',
      data: apartments,
      totalCreated: apartments.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Add apartment and resident
const addApartmentAndResident = async (req, res) => {
  try {
    const { apartmentId, address_number, area, residentData, role_in_family, is_owner, joined_at } = req.body;

    if (!apartmentId || !address_number || !area || !residentData || !residentData.email || !residentData.name || !residentData.phoneNumber || !residentData.gender || !residentData.cic || !residentData.dob || !role_in_family) {
      return res.status(400).json({ message: 'Missing required fields for apartment or resident' });
    }

    const existingApartment = await Apartment.findByPk(apartmentId);
    if (existingApartment) {
      return res.status(409).json({ message: 'Apartment with this ID already exists' });
    }

    const newApartment = await Apartment.create({
      id: apartmentId,
      address_number,
      area,
      status: 'Resident',
    });

    let resident = await Resident.findOne({ where: { cic: residentData.cic } });
    if (!resident) {
      resident = await Resident.create(residentData);
    }

    await ResidentApartment.create({
      residentId: resident.id,
      apartmentId: newApartment.id,
      role_in_family,
      is_owner: is_owner ?? false,
      joined_at: joined_at || new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Apartment and resident added successfully',
      data: { apartment: newApartment, resident }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get unoccupied apartments
const getApartmentUnactive = async (req, res) => {
  try {
    const apartments = await Apartment.findAll({
      where: { status: 'Vacant' },
      attributes: ['id', 'address_number', 'area', 'status'],
    });
    res.status(200).json({
      success: true,
      message: 'Unoccupied apartments fetched successfully',
      data: apartments
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get active apartments
const getApartmentInuse = async (req, res) => {
  try {
    const apartments = await Apartment.findAll({
      where: { status: { [Op.ne]: 'Vacant' } },
      attributes: ['id', 'address_number', 'area', 'status'],
    });
    res.status(200).json({
      success: true,
      message: 'Active apartments fetched successfully',
      data: apartments
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update apartment
const updateApartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { address_number, area, status, owner_id, owner_phone_number, number_of_members } = req.body;

    const apartment = await Apartment.findByPk(id);
    if (!apartment) {
      return res.status(404).json({ success: false, message: 'Apartment not found' });
    }

    apartment.address_number = address_number || apartment.address_number;
    apartment.area = area || apartment.area;
    apartment.status = status || apartment.status;
    apartment.owner_id = owner_id || apartment.owner_id;
    apartment.owner_phone_number = owner_phone_number || apartment.owner_phone_number;
    apartment.number_of_members = number_of_members || apartment.number_of_members;

    await apartment.save();

    res.status(200).json({ success: true, message: 'Apartment updated successfully', data: apartment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete apartment
const deleteApartment = async (req, res) => {
  try {
    const { id } = req.params;
    const apartment = await Apartment.findByPk(id);

    if (!apartment) {
      return res.status(404).json({ success: false, message: 'Apartment not found' });
    }

    await apartment.destroy();
    res.status(200).json({ success: true, message: 'Apartment deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get total apartments
const getTotalApartments = async (req, res) => {
  try {
    const totalApartments = await Apartment.count();
    res.status(200).json({ success: true, message: 'Total apartments fetched successfully', totalApartments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getApartmentResidentsInfo,
  createApartment,
  addApartmentAndResident,
  getApartmentUnactive,
  getApartmentInuse,
  updateApartment,
  deleteApartment,
  getTotalApartments,
};
