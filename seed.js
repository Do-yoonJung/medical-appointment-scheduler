const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dns = require('dns');
require('dotenv').config();

const User = require('./models/User');

dns.setServers(['8.8.8.8', '1.1.1.1']);

async function createUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const patientPassword = await bcrypt.hash('patient123', 10);
    const receptionistPassword = await bcrypt.hash('reception123', 10);

    await User.deleteMany({});

    await User.create([
      {
        name: 'John Smith',
        email: 'patient@example.com',
        password: patientPassword,
        role: 'patient'
      },
      {
        name: 'Emma Brown',
        email: 'receptionist@example.com',
        password: receptionistPassword,
        role: 'receptionist'
      }
    ]);

    console.log('Test users created successfully');

    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
}

createUsers();