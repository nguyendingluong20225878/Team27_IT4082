const db = require('../config/db');
const Household = db.Household;
// Bạn cần định nghĩa thêm model Resident và Account nếu chưa có

// ================= HOUSEHOLD =================
exports.addHousehold = async (req, res) => {
  try {
    const { address_number, status } = req.body;
    const newHousehold = await Household.create({ address_number, status });
    res.status(201).json({ message: 'Đã thêm hộ khẩu', data: newHousehold });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateHousehold = async (req, res) => {
  try {
    const { householdId } = req.params;
    const { address_number, status } = req.body;
    await Household.update(
      { address_number, status },
      { where: { id: householdId } }
    );
    res.json({ message: 'Đã cập nhật hộ khẩu' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteHousehold = async (req, res) => {
  try {
    const { householdId } = req.params;
    await Household.destroy({ where: { id: householdId } });
    res.json({ message: 'Đã xóa hộ khẩu' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.queryHouseholdInfo = async (req, res) => {
  try {
    const households = await Household.findAll();
    res.json(households);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHouseholdStatistics = async (req, res) => {
  try {
    const total = await Household.count();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= RESIDENT =================
const Resident = db.Resident;

exports.addResident = async (req, res) => {
  try {
    const { name, dob, householdId } = req.body;
    const newResident = await Resident.create({ name, dob, householdId });
    res.status(201).json({ message: 'Đã thêm cư dân', data: newResident });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateResident = async (req, res) => {
  try {
    const { residentId } = req.params;
    const { name, dob, householdId } = req.body;
    await Resident.update(
      { name, dob, householdId },
      { where: { id: residentId } }
    );
    res.json({ message: 'Đã cập nhật cư dân' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteResident = async (req, res) => {
  try {
    const { residentId } = req.params;
    await Resident.destroy({ where: { id: residentId } });
    res.json({ message: 'Đã xóa cư dân' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.queryResidentInfo = async (req, res) => {
  try {
    const residents = await Resident.findAll();
    res.json(residents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getResidentStatistics = async (req, res) => {
  try {
    const total = await Resident.count();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= ACCOUNT =================
const Account = db.Account;

exports.createAccount = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const newAccount = await Account.create({ username, password, role });
    res.status(201).json({ message: 'Đã tạo tài khoản', data: newAccount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { username, password, role } = req.body;
    await Account.update(
      { username, password, role },
      { where: { id: accountId } }
    );
    res.json({ message: 'Đã cập nhật tài khoản' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    await Account.destroy({ where: { id: accountId } });
    res.json({ message: 'Đã xóa tài khoản' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignPermissions = async (req, res) => {
  try {
    const { accountId, role } = req.body;
    await Account.update({ role }, { where: { id: accountId } });
    res.json({ message: 'Đã gán quyền cho tài khoản' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
