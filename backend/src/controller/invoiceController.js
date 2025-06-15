const { Invoice, InvoicePayment, Apartment, Fee, Utility_bill, UtilityBillFee } = require('../models/index');
const { Op } = require('sequelize');
const xlsx = require('xlsx');

// Create a new invoice (Tạo mới khoản thu / Tạo khoản nộp của hộ - for general invoice)
const createInvoice = async (req, res) => {
  try {
    let invoicesData = req.body;
    if (!invoicesData || (Array.isArray(invoicesData) && invoicesData.length === 0)) {
      return res.status(400).json({ message: 'Input must be a non-empty object or array' });
    }
    if (!Array.isArray(invoicesData)) {
      invoicesData = [invoicesData];
    }
    for (const invoice of invoicesData) {
      if (!invoice.name) {
        return res.status(400).json({ message: 'Each invoice must have a name' });
      }
    }
    const created = await Invoice.bulkCreate(invoicesData, { validate: true });
    res.status(201).json({
      success: true,
      message: 'Invoice(s) created successfully',
      data: created,
      totalCreated: created.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all invoices (Truy vấn đợt thu)
const getAllInvoices = async (req, res) => {
  try {
    const activeInvoices = await Invoice.findAll();
    res.status(200).json({
      success: true,
      message: 'Invoices retrieved successfully',
      data: activeInvoices,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get invoice by ID
const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Get invoice by ID successfully',
      data: invoice
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update invoice (Chỉnh sửa khoản thu)
const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    invoice.name = name || invoice.name;
    invoice.description = description || invoice.description;
    invoice.updated_at = new Date();

    await invoice.save();

    res.status(200).json({ success: true, message: 'Invoice updated successfully', data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete invoice (Xóa khoản thu)
const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    // Check if there are any associated invoice payments before deleting
    const hasPayments = await InvoicePayment.count({ where: { invoice_id: id } });
    if (hasPayments > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete invoice with associated payments. Please remove payments first.' });
    }

    await invoice.destroy();
    res.status(200).json({ success: true, message: 'Invoice deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create a new invoice payment (Thêm khoản nộp của hộ - for specific payment)
const createInvoicePayment = async (req, res) => {
  try {
    const { apartmentId, invoiceId, fund_amount, status } = req.body;
    if (!apartmentId || !invoiceId || fund_amount == null) {
      return res.status(400).json({ success: false, message: 'Missing required fields: apartmentId, invoiceId, fund_amount' });
    }

    const invoicePayment = await InvoicePayment.create({
      apartment_id: apartmentId,
      invoice_id: invoiceId,
      fund_amount,
      status: status || 'UNPAID', // Default status
    });

    res.status(201).json({
      success: true,
      message: 'Invoice payment created successfully',
      data: invoicePayment,
    });
  } catch (err) {
    console.error('Error creating invoice payment:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all invoice payments (Truy vấn đợt thu - payments)
const getAllInvoicePayments = async (req, res) => {
  try {
    const { invoiceId, apartmentId } = req.query;
    const whereClause = {};
    if (invoiceId) whereClause.invoice_id = invoiceId;
    if (apartmentId) whereClause.apartment_id = apartmentId;

    const invoicePayments = await InvoicePayment.findAll({
      where: whereClause,
      include: [
        { model: Invoice, attributes: ['name', 'description'] },
        { model: Apartment, attributes: ['address_number'] }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Invoice payments retrieved successfully',
      data: invoicePayments,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update invoice payment (Chỉnh sửa khoản nộp của hộ)
const updateInvoicePayment = async (req, res) => {
  try {
    const { id } = req.params; // InvoicePayment ID
    const { fund_amount, status } = req.body;

    const invoicePayment = await InvoicePayment.findByPk(id);
    if (!invoicePayment) {
      return res.status(404).json({ success: false, message: 'Invoice payment not found' });
    }

    invoicePayment.fund_amount = fund_amount || invoicePayment.fund_amount;
    invoicePayment.status = status || invoicePayment.status;

    await invoicePayment.save();

    res.status(200).json({ success: true, message: 'Invoice payment updated successfully', data: invoicePayment });
  } catch (err) {
    console.error('Error updating invoice payment:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete invoice payment (Xóa khoản nộp của hộ)
const deleteInvoicePayment = async (req, res) => {
  try {
    const { id } = req.params; // InvoicePayment ID
    const invoicePayment = await InvoicePayment.findByPk(id);

    if (!invoicePayment) {
      return res.status(404).json({ success: false, message: 'Invoice payment not found' });
    }

    await invoicePayment.destroy();
    res.status(200).json({ success: true, message: 'Invoice payment deleted successfully' });
  } catch (err) {
    console.error('Error deleting invoice payment:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get unpaid apartments (Thống kê đợt thu)
const getUnpaidApartments = async (req, res) => {
  try {
    // Find apartments that have associated invoice payments with status 'UNPAID'
    const unpaidApartments = await Apartment.findAll({
      include: [{
        model: InvoicePayment,
        where: { status: 'UNPAID' },
        required: true, // Only include apartments that have unpaid payments
        attributes: [] // Don't fetch InvoicePayment attributes directly, just use for filtering
      }],
      attributes: ['id', 'address_number', 'area', 'status'],
      group: ['Apartment.id'], // Group by apartment to get unique apartments
    });

    res.status(200).json({ success: true, message: 'Unpaid apartments fetched successfully', data: unpaidApartments });
  } catch (err) {
    console.error('Error fetching unpaid apartments:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get unpaid apartment details
const getUnpaidApartmentDetails = async (req, res) => {
  try {
    const { apartmentId } = req.query;
    if (!apartmentId) {
      return res.status(400).json({ success: false, message: 'Apartment ID is required' });
    }

    const unpaidDetails = await InvoicePayment.findAll({
      where: { apartment_id: apartmentId, status: 'UNPAID' },
      include: [
        { model: Invoice, attributes: ['name', 'description'] },
        { model: Apartment, attributes: ['address_number'] }
      ],
      attributes: ['id', 'fund_amount', 'status'],
    });

    if (!unpaidDetails || unpaidDetails.length === 0) {
      return res.status(404).json({ success: false, message: 'No unpaid details found for this apartment' });
    }

    res.status(200).json({ success: true, message: 'Unpaid apartment details fetched successfully', data: unpaidDetails });
  } catch (err) {
    console.error('Error fetching unpaid apartment details:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create required fee service for month (Tạo đợt thu phí - This likely generates utility bills based on fees)
const createRequiredFeeServiceForMonth = async (req, res) => {
  try {
    const { month, year } = req.body;

    if (!month || !year) {
      return res.status(400).json({ success: false, message: 'Month and year are required' });
    }

    // Logic to generate utility bills for each apartment based on defined fees
    const apartments = await Apartment.findAll();
    const fees = await Fee.findAll();

    const newUtilityBills = [];
    for (const apartment of apartments) {
      for (const fee of fees) {
        // Check if a utility bill for this apartment and fee for this month/year already exists
        const existingBill = await Utility_bill.findOne({
          where: {
            apartment_id: apartment.id,
            name: fee.name, // Assuming fee name is used for bill name
            date: { [Op.between]: [`${year}-${month}-01`, `${year}-${month}-31`] },
          },
        });

        if (!existingBill) {
          const bill = await Utility_bill.create({
            name: fee.name,
            apartment_id: apartment.id,
            date: new Date(year, month - 1, 1), // First day of the month
            amount: fee.amount, // Initial amount from fee
            status: 'UNPAID',
          });
          newUtilityBills.push(bill);

          // Create a link in UtilityBillFee table
          await UtilityBillFee.create({
            utility_bill_id: bill.id,
            fee_id: fee.id,
            amount: fee.amount,
            status: 'UNPAID',
          });
        }
      }
    }

    res.status(201).json({
      success: true,
      message: `Required fee services generated for ${month}/${year}`,
      data: newUtilityBills,
    });

  } catch (err) {
    console.error('Error creating required fee services:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update payment status (assuming this is for a specific invoice payment, related to Kế toán's job)
const updatePayment = async (req, res) => {
  try {
    const { paymentId, status } = req.body;

    if (!paymentId || !status) {
      return res.status(400).json({ success: false, message: 'Payment ID and status are required' });
    }

    const invoicePayment = await InvoicePayment.findByPk(paymentId);
    if (!invoicePayment) {
      return res.status(404).json({ success: false, message: 'Invoice payment not found' });
    }

    invoicePayment.status = status;
    await invoicePayment.save();

    res.status(200).json({ success: true, message: 'Payment status updated successfully', data: invoicePayment });
  } catch (err) {
    console.error('Error updating payment status:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  createInvoicePayment,
  getAllInvoicePayments,
  updateInvoicePayment,
  deleteInvoicePayment,
  getUnpaidApartments,
  getUnpaidApartmentDetails,
  createRequiredFeeServiceForMonth,
  updatePayment,
}; 