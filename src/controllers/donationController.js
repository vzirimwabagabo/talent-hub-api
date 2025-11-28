// src/controllers/donationController.js
const donationService = require('../services/donationService');

exports.createDonation = async (req, res, next) => {
  try {
    const { amount, description } = req.body;
    // Ensure amount is a number
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 1) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const donation = await donationService.createDonation(
      req.user._id,
      numAmount,
      description
    );
    res.status(201).json({ success: true, donation });
  } catch (error) {
    next(error);
  }
};

exports.getUserDonations = async (req, res, next) => {
  try {
    const donations = await donationService.getUserDonations(req.user._id);
    res.status(200).json({ success: true, donations });
  } catch (error) {
    next(error);
  }
};

exports.getAllDonations = async (req, res, next) => {
  try {
    const donations = await donationService.getAllDonations();
    res.status(200).json({ success: true, donations });
  } catch (error) {
    next(error);
  }
};

exports.getDonationById = async (req, res, next) => {
  try {
    const donation = await donationService.getDonationById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    res.status(200).json({ success: true, donation });
  } catch (error) {
    next(error);
  }
};

exports.deleteDonation = async (req, res, next) => {
  try {
    await donationService.deleteDonation(req.params.id);
    res.status(200).json({ success: true, message: 'Donation deleted' });
  } catch (error) {
    next(error);
  }
};