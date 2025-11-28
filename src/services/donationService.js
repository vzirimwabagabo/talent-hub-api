// src/services/donationService.js
const Donation = require('../models/Donation');

exports.createDonation = async (userId, amount, description = '') => {
  const donation = new Donation({
    user: userId,
    amount,
    description,
  });
  return await donation.save();
};

exports.getUserDonations = async (userId) => {
  return await Donation.find({ user: userId }).sort({ createdAt: -1 });
};

exports.getAllDonations = async () => {
  return await Donation.find().sort({ createdAt: -1 }).populate('user', 'name email');
};

exports.getDonationById = async (id) => {
  return await Donation.findById(id).populate('user', 'name email');
};

exports.deleteDonation = async (id) => {
  const donation = await Donation.findByIdAndDelete(id);
  if (!donation) {
    throw new Error('Donation not found');
  }
  return donation;
};