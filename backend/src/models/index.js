const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = require('./user');
const Resident = require('./resident');
const Apartment = require('./apartment');
const Fee = require('./fee');
const Invoice = require('./invoice');
const InvoicePayment = require('./invoicePayment');
const InvoiceFee = require('./invoiceFee');
const UtilityBill = require('./utility_bill');
const Vehicle = require('./vehicles');
const ResidentApartment = require('./residentApartment');

// Define relationships

// Apartment - Resident (through address_number)
Apartment.hasMany(Resident, { foreignKey: 'address_number', sourceKey: 'address_number' });
Resident.belongsTo(Apartment, { foreignKey: 'address_number', targetKey: 'address_number' });

// Resident - ResidentApartment
Resident.hasMany(ResidentApartment, { foreignKey: 'residentId' });
ResidentApartment.belongsTo(Resident, { foreignKey: 'residentId' });

// Apartment - ResidentApartment
Apartment.hasMany(ResidentApartment, { foreignKey: 'apartmentId' });
ResidentApartment.belongsTo(Apartment, { foreignKey: 'apartmentId' });

// Apartment - Vehicle
Apartment.hasMany(Vehicle, { foreignKey: 'apartmentId' });
Vehicle.belongsTo(Apartment, { foreignKey: 'apartmentId' });


// Apartment - UtilityBill
Apartment.hasMany(UtilityBill, { foreignKey: 'address_id' });
UtilityBill.belongsTo(Apartment, { foreignKey: 'address_id' });

// Invoice - InvoicePayment
Invoice.hasMany(InvoicePayment, { foreignKey: 'invoice_id' });
InvoicePayment.belongsTo(Invoice, { foreignKey: 'invoice_id' });

// Apartment - InvoicePayment
Apartment.hasMany(InvoicePayment, { foreignKey: 'apartment_id' });
InvoicePayment.belongsTo(Apartment, { foreignKey: 'apartment_id' });

// Invoice - Fee (through InvoiceFee)
Invoice.belongsToMany(Fee, { through: InvoiceFee, foreignKey: 'invoice_id' });
Fee.belongsToMany(Invoice, { through: InvoiceFee, foreignKey: 'fee_id' });

module.exports = {
    User,
    Resident,
    Apartment,
    Fee,
    Invoice,
    InvoicePayment,
    InvoiceFee,
    UtilityBill,
    Vehicle,
    ResidentApartment,
    sequelize
};