// src/services/matchRequestService.js

const MatchRequest = require('../models/MatchRequest');

// Creates a match request with validation on talent and opportunity relations done by Mongoose
async function createMatchRequest(talentId, opportunity, matchScore = 0, message = '') {
  const matchRequest = new MatchRequest({
    talent: talentId,
    opportunity,
    matchScore,
    message,
    status: 'pending'
  });
  return await matchRequest.save();
}

// Gets all match requests for a talent
async function getMatchRequestsByTalent(talentId) {
  return await MatchRequest.find({ talent: talentId }).populate('opportunity');
}

// Updates the status of a match request (used by admin/supporter)
async function updateMatchRequestStatus(id, status, reviewedBy) {
  // Validate status and reviewedBy role at controller or schema layer; here assumes valid input
  return await MatchRequest.findByIdAndUpdate(id, { status, reviewedBy }, { new: true, runValidators: true });
}

// Deletes a match request by ID
async function deleteMatchRequest(id) {
  return await MatchRequest.findByIdAndDelete(id);
}

module.exports = {
  createMatchRequest,
  getMatchRequestsByTalent,
  updateMatchRequestStatus,
  deleteMatchRequest,
};
