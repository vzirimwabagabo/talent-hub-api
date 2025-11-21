// // seedEvent.js
// //const mongoose = require('mongoose');
// const Event = require('./models/Event'); // Adjust path as needed
// const User = require('./models/User');   // Adjust path as needed

// // Connect to your MongoDB - adjust connection string accordingly
// //const MONGO_URI = 'mongodb://localhost:27017/yourdbname';

// exports.seedEve = async()=> {
//   try {
//     //await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//     // Fetch some users to act as organizers and attendees
//     const users = await User.find().limit(20); // Getting 20 users for selection

//     if (users.length < 5) {
//       console.log('Not enough users in DB to seed events. Add more users first.');
//       process.exit(1);
//     }

//     // Helper function to get random users from list
//     function getRandomUsers(count) {

//       const shuffled = users.sort(() => 0.5 - Math.random());
//       return shuffled.slice(0, count);
//     }

//     // List of sample events
//     const sampleEvents = [
//       {
//         title: "Tech Innovators Meetup 2025",
//         description: "A meetup for tech enthusiasts to discuss the latest trends in software development, AI, and cloud computing.",
//         startDate: new Date('2025-12-01T18:00:00Z'),
//         endDate: new Date('2025-12-01T21:00:00Z'),
//         location: "Silicon Valley Conference Center",
//         isVirtual: false,
//       },
//       {
//         title: "Annual Coding Bootcamp",
//         description: "Intensive bootcamp for aspiring developers covering JavaScript, React, Node.js, and backend design.",
//         startDate: new Date('2025-12-05T09:00:00Z'),
//         endDate: new Date('2025-12-10T17:00:00Z'),
//         location: "Downtown Tech Hub",
//         isVirtual: false,
//       },
//       {
//         title: "Virtual AI Symposium",
//         description: "Online symposium about AI advancements and ethical AI usage featuring prominent speakers worldwide.",
//         startDate: new Date('2025-12-15T15:00:00Z'),
//         endDate: new Date('2025-12-15T19:00:00Z'),
//         location: "Zoom",
//         isVirtual: true,
//       },
//       {
//         title: "Open Source Contributor Summit",
//         description: "Gathering of open source contributors to share projects, tips, and collaborate on new initiatives.",
//         startDate: new Date('2026-01-10T10:00:00Z'),
//         endDate: new Date('2026-01-10T17:00:00Z'),
//         location: "Tech Park Auditorium",
//         isVirtual: false,
//       },
//       {
//         title: "Cloud Computing Workshop",
//         description: "Hands-on workshop to learn AWS, Azure, and Google Cloud fundamentals.",
//         startDate: new Date('2026-01-20T13:00:00Z'),
//         endDate: new Date('2026-01-21T16:00:00Z'),
//         location: "Tech Innovators Lab",
//         isVirtual: false,
//       },
//       {
//         title: "Hackathon for Social Good",
//         description: "48-hour hackathon focused on creating technology solutions for social causes.",
//         startDate: new Date('2026-02-01T08:00:00Z'),
//         endDate: new Date('2026-02-03T20:00:00Z'),
//         location: "Community Center",
//         isVirtual: false,
//       },
//       {
//         title: "Mobile App Dev Conference",
//         description: "Conference for mobile developers on the latest trends in iOS and Android app development.",
//         startDate: new Date('2026-02-15T09:00:00Z'),
//         endDate: new Date('2026-02-16T17:00:00Z'),
//         location: "City Expo Hall",
//         isVirtual: false,
//       },
//       {
//         title: "Cybersecurity Awareness Webinar",
//         description: "Online webinar about current cybersecurity threats and best practices for businesses.",
//         startDate: new Date('2026-03-05T14:00:00Z'),
//         endDate: new Date('2026-03-05T16:00:00Z'),
//         location: "Webinar Platform",
//         isVirtual: true,
//       },
//       {
//         title: "Front-end Frameworks Bootcamp",
//         description: "Learn React, Vue, and Angular basics in one accelerated week-long bootcamp.",
//         startDate: new Date('2026-03-20T09:00:00Z'),
//         endDate: new Date('2026-03-25T17:00:00Z'),
//         location: "Tech Academy",
//         isVirtual: false,
//       },
//       {
//         title: "DevOps Essentials Seminar",
//         description: "Seminar on automation, CI/CD, and infrastructure as code with hands-on demonstrations.",
//         startDate: new Date('2026-04-02T10:00:00Z'),
//         endDate: new Date('2026-04-02T15:00:00Z'),
//         location: "Innovation Center",
//         isVirtual: false,
//       },
//     ];

//     const eventsToInsert = sampleEvents.map((event) => {
//       // Select one random organizer
//       const organizer = users[Math.floor(Math.random() * users.length)]._id;
//       // Select 3-7 random attendees
//       const attendees = getRandomUsers(Math.floor(Math.random() * 5) + 3).map(u => u._id);

//       return {
//         ...event,
//         organizer,
//         attendees,
//       };
//     });

//     // Insert events to DB
//     await Event.insertMany(eventsToInsert);

//     console.log(`${eventsToInsert.length} events seeded successfully!`);
//     await mongoose.connection.close();
//   } catch (error) {
//     console.error('Seeding events failed:', error);
//     process.exit(1);
//   }
// }




