// financialRecord.js
const mongoose = require('mongoose');

const financialRecordSchema = new mongoose.Schema({
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    totalBalance: {
        type: Number,
        required: true,
    },
    totalLoanDisbursed: {
        type: Number,
        required: true,
    },
    returnsOnLoans: {
        type: Number,
        required: true,
    },
    netRevenue: {
        type: Number,
        required: true,
    },
});

const FinancialRecord = mongoose.model('FinancialRecord', financialRecordSchema);

module.exports = FinancialRecord;
