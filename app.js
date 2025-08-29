const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { app_port } = require('./config');
const { generateRandomKey } = require('./utils/helpers');
const pageRoutes = require('./routes/pages');
const registrationRoutes = require('./routes/registration');
const passwordsRoutes = require('./routes/passwords');
const userqueriesRoutes = require('./routes/userqueries');
const adminauthRoutes = require('./routes/adminauth');
const coursesRoutes = require('./routes/courses');
const mpesaRoutes = require('./routes/mpesa');
const profileRoutes = require('./routes/profile');
const activitiesRoutes = require('./routes/activities');


//creating server
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static('uploads'));

// Session Configuration
const secretKey = generateRandomKey(32);
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true }
}));

// Routes
app.use(pageRoutes);
app.use(registrationRoutes);
app.use(passwordsRoutes);
app.use(userqueriesRoutes);
app.use(adminauthRoutes);
app.use(coursesRoutes);
app.use(mpesaRoutes);
app.use(profileRoutes);
app.use(activitiesRoutes);


server.listen(app_port, () => {
    console.log(`Server is running on port ${app_port}`);
});