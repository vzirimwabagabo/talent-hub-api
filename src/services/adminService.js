const User = require('../models/User');
const Donation = require('../models/Donation');
const TalentProfile = require('../models/TalentProfile');
const Volunteer = require('../models/Volunteer');
const Message = require('../models/Message');
const Opportunity = require('../models/Opportunity');
const Review = require('../models/Review');

// Helper to map month index to abbreviated name
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Aggregate dashboard statistics including user growth, opportunities, donations, and reviews
async function getStatistics() {
  try {
    // 1. User growth over time (group by year & month of creation)
    const userGrowthRaw = await User.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          users: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const userGrowthData = userGrowthRaw.map(item => ({
      month: monthNames[item._id.month - 1], // zero-based indexing
      users: item.users
    }));

    // 2. Count of opportunities by category
    const opportunityCategoryRaw = await Opportunity.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);
    const opportunityCategoryData = opportunityCategoryRaw.map(c => ({
      category: c._id.charAt(0).toUpperCase() + c._id.slice(1),
      count: c.count
    }));

    // 3. Donation totals by currency
    const donationCurrencyRaw = await Donation.aggregate([
      {
        $group: {
          _id: "$currency",
          value: { $sum: "$amount" }
        }
      }
    ]);
    const donationCurrencyData = donationCurrencyRaw.map(d => ({
      currency: d._id,
      value: d.value
    }));

    // 4. Review rating distribution sorted descendingly by rating
    const ratingDistributionRaw = await Review.aggregate([
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);
    const ratingDistributionData = ratingDistributionRaw.map(r => ({
      rating: `${r._id} stars`,
      count: r.count
    }));

    return {
      userGrowthData,
      opportunityCategoryData,
      donationCurrencyData,
      ratingDistributionData
    };
  } catch (error) {
    console.error('Error aggregating statistics:', error);
    // Consider throwing to propagate error or return empty object
    return { userGrowthData: [], opportunityCategoryData: [], donationCurrencyData: [], ratingDistributionData: [] };
  }
}

// Total count of users in the system
async function getUserCount() {
  return await User.countDocuments();
}

// Total sum of all donations
async function getTotalDonationsAmount() {
  const result = await Donation.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  return result.length > 0 ? result[0].total : 0;
}

// Fetch 5 most recently updated talent profiles including user info
async function getMostActiveTalents() {
  return await TalentProfile.find()
    .sort({ updatedAt: -1 })
    .limit(5)
    .populate('user', 'name email');
}

// Fetch 5 most recently updated volunteers including user info
async function getMostActiveVolunteers() {
  return await Volunteer.find()
    .sort({ updatedAt: -1 })
    .limit(5)
    .populate('user', 'name email');
}

// Count how many messages are unread
async function getUnreadMessagesCount() {
  return await Message.countDocuments({ read: false });
}

module.exports = {
  getUserCount,
  getTotalDonationsAmount,
  getMostActiveTalents,
  getMostActiveVolunteers,
  getUnreadMessagesCount,
  getStatistics
};
