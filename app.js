const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
require('dotenv').config();
const bcrypt = require('bcrypt');
const dns = require('dns');

const User = require('./models/User');
const Appointment = require('./models/Appointment');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(
  session({
    secret: 'medical-appointment-secret',
    resave: false,
    saveUninitialized: false
  })
);

app.get('/session', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false
    });
  }

  res.json({
    success: true,
    role: req.session.role
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    req.session.userId = user._id;
    req.session.role = user.role;

    res.json({
      success: true,
      role: user.role
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Logout failed.'
      });
    }

    res.json({
      success: true
    });
  });
});

app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all fields.'
      });
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
      role: 'patient'
    });

    await user.save();

    res.json({
      success: true,
      message: 'Account created successfully.'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
});

app.post('/appointments', async (req, res) => {
  try {
    if (!req.session.userId || req.session.role !== 'patient') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized.'
      });
    }

    const { doctor, date, time } = req.body;

    // Check required fields
    if (!doctor || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all appointment fields.'
      });
    }

    // Check if the selected date is in the past
    const selectedDate = new Date(date + 'T00:00:00');
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Please select a future date.'
      });
    }

    // Check if doctor already has an appointment at this time
    const existingAppointment = await Appointment.findOne({
      doctor: doctor,
      date: date,
      time: time
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This appointment time is already booked.'
      });
    }

    // Check if the patient already has an appointment at this time
    const patientConflict = await Appointment.findOne({
      patient: req.session.userId,
      date: date,
      time: time
    });

    if (patientConflict) {
      return res.status(400).json({
        success: false,
        message: 'You already have an appointment at this time.'
      });
    }

    const appointment = new Appointment({
      patient: req.session.userId,
      doctor: doctor,
      date: date,
      time: time,
      status: 'Confirmed'
    });

    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment booked successfully.'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
});

app.get('/appointments/my', async (req, res) => {
  try {
    if (!req.session.userId || req.session.role !== 'patient') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized.'
      });
    }

    const appointments = await Appointment.find({
      patient: req.session.userId
    });

    res.json({
      success: true,
      appointments: appointments
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
});

app.get('/appointments', async (req, res) => {
  try {
    if (!req.session.userId || req.session.role !== 'receptionist') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized.'
      });
    }

    const appointments = await Appointment.find()
      .populate('patient', 'name email');

    res.json({
      success: true,
      appointments: appointments
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
});

app.get('/patients', async (req, res) => {
  try {
    if (!req.session.userId || req.session.role !== 'receptionist') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized.'
      });
    }

    const patients = await User.find(
      { role: 'patient' },
      'name email'
    );

    res.json({
      success: true,
      patients: patients
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
});

app.post('/appointments/receptionist', async (req, res) => {
  try {
    if (!req.session.userId || req.session.role !== 'receptionist') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized.'
      });
    }

    const { patientId, doctor, date, time } = req.body;

    // Check required fields
    if (!patientId || !doctor || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all appointment fields.'
      });
    }

    // Check if the selected date is in the past
    const selectedDate = new Date(date + 'T00:00:00');
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Please select a future date.'
      });
    }

    // Check if doctor already has an appointment at this time
    const existingAppointment = await Appointment.findOne({
      doctor: doctor,
      date: date,
      time: time
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This appointment time is already booked.'
      });
    }

    const patientConflict = await Appointment.findOne({
      patient: patientId,
      date: date,
      time: time
    });

    if (patientConflict) {
      return res.status(400).json({
        success: false,
        message: 'This patient already has an appointment at this time.'
      });
    }

    const appointment = new Appointment({
      patient: patientId,
      doctor: doctor,
      date: date,
      time: time,
      status: 'Confirmed'
    });

    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment created successfully.'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
});

const PORT = 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));
  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});