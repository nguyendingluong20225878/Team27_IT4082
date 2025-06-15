const { Fee, Utility_bill, UtilityBillFee } = require('../models/index');
const { Op } = require('sequelize');
const xlsx = require('xlsx');

// Create fee(s)
const createFee = async (req, res) => {
  try {
    let feesData = req.body;
    if (!feesData || (Array.isArray(feesData) && feesData.length === 0)) {
      return res.status(400).json({ message: 'Input must be a non-empty object or array' });
    }
    if (!Array.isArray(feesData)) {
      feesData = [feesData];
    }
    for (const fee of feesData) {
      if (!fee.name || fee.amount == null || !fee.type) {
        return res.status(400).json({ message: 'Each fee must have name, amount, type' });
      }
    }
    const created = await Fee.bulkCreate(feesData, { validate: true });
    res.status(201).json({
      success: true,
      message: 'Fee(s) created successfully',
      data: created,
      totalCreated: created.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get fee(s)
const getFee = async (req, res) => {
  try {
    const fees = await Fee.findAll();
    if (!fees || fees.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No fees found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Fees fetched successfully',
      data: fees
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update fee
const updateFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, description, type, due_date, status } = req.body;

    const fee = await Fee.findByPk(id);
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee not found' });
    }

    fee.name = name || fee.name;
    fee.amount = amount || fee.amount;
    fee.description = description || fee.description;
    fee.type = type || fee.type;
    fee.due_date = due_date || fee.due_date;
    fee.status = status || fee.status;

    await fee.save();

    res.status(200).json({ success: true, message: 'Fee updated successfully', data: fee });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete fee
const deleteFee = async (req, res) => {
  try {
    const { id } = req.params;
    const fee = await Fee.findByPk(id);

    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee not found' });
    }

    await fee.destroy();
    res.status(200).json({ success: true, message: 'Fee deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get fee collection data (Thống kê các khoản thu)
const getFeeCollectionData = async (req, res) => {
  try {
    const feeCollectionData = await UtilityBillFee.findAll({
      attributes: [
        'fee_id',
        [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'totalCollectedAmount']
      ],
      group: ['fee_id'],
      include: [{
        model: Fee,
        attributes: ['name', 'type'],
      }]
    });

    res.status(200).json({ success: true, message: 'Fee collection data fetched successfully', data: feeCollectionData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get fee type distribution (Thống kê các khoản thu)
const getFeeTypeDistribution = async (req, res) => {
  try {
    const feeTypeDistribution = await Fee.findAll({
      attributes: [
        'type',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
        [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'totalAmount']
      ],
      group: ['type'],
    });

    res.status(200).json({ success: true, message: 'Fee type distribution fetched successfully', data: feeTypeDistribution });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get fee summary (Thống kê các khoản thu)
const getFeeSummary = async (req, res) => {
  try {
    const totalFees = await Fee.count();
    const totalAmount = await Fee.sum('amount');

    res.status(200).json({
      success: true,
      message: 'Fee summary fetched successfully',
      data: {
        totalFees,
        totalAmount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Import fees from Excel
const importFeeFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const feesData = xlsx.utils.sheet_to_json(sheet);

    if (!Array.isArray(feesData) || feesData.length === 0) {
      return res.status(400).json({ success: false, message: 'Excel file must contain fee data' });
    }

    for (const fee of feesData) {
      if (!fee.name || fee.amount == null || !fee.type) {
        return res.status(400).json({ success: false, message: 'Each row in Excel must have name, amount, type' });
      }
    }

    const createdFees = await Fee.bulkCreate(feesData, { validate: true });

    res.status(201).json({
      success: true,
      message: 'Fees imported successfully',
      data: createdFees,
      totalImported: createdFees.length
    });
  } catch (err) {
    console.error('Error importing fees from Excel:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  createFee,
  getFee,
  updateFee,
  deleteFee,
  getFeeCollectionData,
  getFeeTypeDistribution,
  getFeeSummary,
  importFeeFromExcel,
}; 