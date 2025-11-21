// scripts/seedUsers.js (or in a seeder file)

const users = [
  // ===== ADMIN =====
  {
    name: "Admin User",
    email: "admin@talenthub.com",
    password: "Password123!",
    role: "admin"
  },

  // ===== PARTICIPANTS (Job Seekers) =====
  {
    name: "Jeanne Uwimana",
    email: "jeanne.uwimana@example.com",
    password: "Password123!",
    role: "participant"
  },
  {
    name: "David Niyonzima",
    email: "david.niyonzima@example.com",
    password: "Password123!",
    role: "participant"
  },
  {
    name: "Marie Mukamana",
    email: "marie.mukamana@example.com",
    password: "Password123!",
    role: "participant"
  },
  {
    name: "Eric Nsabimana",
    email: "eric.nsabimana@example.com",
    password: "Password123!",
    role: "participant"
  },
  {
    name: "Ange Umutoni",
    email: "ange.umutoni@example.com",
    password: "Password123!",
    role: "participant"
  },

  // ===== SUPPORTERS =====
  // Employers
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@techinnovate.com",
    password: "Password123!",
    role: "supporter",
    supporterType: "employer"
  },
  {
    name: "Michael Rodriguez",
    email: "michael.rodriguez@globaljobs.com",
    password: "Password123!",
    role: "supporter",
    supporterType: "employer"
  },
  
  // Donors
  {
    name: "Patricia Williams",
    email: "patricia.williams@impactfund.org",
    password: "Password123!",
    role: "supporter",
    supporterType: "donor"
  },
  {
    name: "Robert Kim",
    email: "robert.kim@futurefoundation.org",
    password: "Password123!",
    role: "supporter",
    supporterType: "donor"
  },
  
  // Volunteers
  {
    name: "Linda Chen",
    email: "linda.chen@communityserve.org",
    password: "Password123!",
    role: "supporter",
    supporterType: "volunteer"
  },
  {
    name: "James Mwizerwa",
    email: "james.mwizerwa@hopenetwork.org",
    password: "Password123!",
    role: "supporter",
    supporterType: "volunteer"
  }
];

module.exports = users;