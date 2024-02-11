


const cron = require('node-cron');
const FinancialRecord = require('../models/finance/financialrecord.model')
const Account = require('../models/Account/account.model');
const Loan = require('../models/Loan/loan.model');
const moment = require('moment')

// Schedule the cron job to run on the 16th of every month at 00:00 (midnight) in Indian Standard Time
const getBalances = async  (req ,res)=>{
cron.schedule('* * * * *', async () => {
    try {
        // const today = new Date();
        // const month = today.getMonth() + 1; // JavaScript months are zero-based
        // const year = today.getFullYear();


        const today = new Date();
const momentDate = moment(today);
// const formattedDate = momentDate.format("YYYY-MM-DD");

const month = momentDate.format("MM"); // Month in two digits (01-12)
const year = momentDate.format('YYYY')
        // Calculate total balance
        const accounts = await Account.find();
        let totalBalance = 0;
        accounts.forEach(account => {
            totalBalance += account.balance;
        });

        // Calculate total loan disbursed
        const totalLoanDisbursed = await Loan.aggregate([
            {
                $match: {
                    status: 'Approved'
                }
            },
            {
                $group: {
                    _id: null,
                    totalLoanDisbursed: { $sum: "$amount" }
                }
            }
        ]);

        // Calculate total interest earned
        const totalInterestEarned = await Loan.aggregate([
            {
                $match: {
                    status: 'Active'
                }
            },
            {
                $group: {
                    _id: null,
                    totalInterestEarned: {
                        $sum: {
                            $multiply: ["$amount", "$interestRate"]
                        }
                    }
                }
            }
        ]);

        // Calculate net revenue
        const netRevenue = (totalInterestEarned.length > 0 ? totalInterestEarned[0].totalInterestEarned : 0) - (totalLoanDisbursed.length > 0 ? totalLoanDisbursed[0].totalLoanDisbursed : 0);

        // Save the financial record
        const financialRecord = new FinancialRecord({
            month,
            year,
            totalBalance,
            totalLoanDisbursed: (totalLoanDisbursed.length > 0 ? totalLoanDisbursed[0].totalLoanDisbursed : 0),
            returnsOnLoans: (totalInterestEarned.length > 0 ? totalInterestEarned[0].totalInterestEarned : 0),
            netRevenue
        });

        await financialRecord.save();
        console.log('Financial record saved successfully for the 16th of the month.');
    } catch (error) {
        console.error('Error saving financial record:', error);
    }
}, {
    scheduled: true,
    timezone: 'Asia/Kolkata' // Set the timezone to India (Indian Standard Time)
})};
module.exports = {getBalances}