const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const path = require('path');


// Middleware
app.use(cors());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

 let isConnected = false;

 async function connectToMongoDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI,{
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        isConnected = true;
        console.log('Connected to MongoDB');
    }catch(error){
        console.error('Error connecting to MongoDB:', error);
         setTimeout(connectToMongoDB, 5000); // Retry after 5 seconds 
        }

        

    }

 // add middleware
 app.use((req, res, next) => {
    if (!isConnected){
        connectToMongoDB();
    }
next();
 })


// Routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;

//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app
