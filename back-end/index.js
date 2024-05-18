  const express = require('express');
  const mongoose = require('mongoose');
  const UserModel = require('./User');
  const RequestModel = require('./Request');
  const CredentialModel = require('./Credentials');
  var cors = require('cors')

  const app = express();
  const port = 3001;    

  app.use(cors())
  app.use(express.json());

  mongoose.connect('mongodb://127.0.0.1:27017/credentialDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(db => console.log('DB is connected')) // Log success message
  .catch(err => console.log(err)); // Log error message

  // Route for user login
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
      // Find user by username
      const user = await UserModel.findOne({ username });

      // If user not found or password doesn't match, send error response
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // If login successful, send success response
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Route for user signup
  app.post('/signup', async (req, res) => {
    const { name, email, username, password, usertype } = req.body;
  
    try {
      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Create new user
      const newUser = new UserModel({ name, email, username, password, usertype });
      await newUser.save();
  
      // Send success response
      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // API endpoint to fetch request data
app.get('/requests', async (req, res) => {
  try {
    // Fetch request data from the database and populate the userID and credentials fields
    const requestData = await RequestModel.find({}).populate('userID').populate('credentials');
    
    // Log the fetched data for debugging
    console.log('Request data:', requestData);

    // Send the request data as a response
    res.status(200).json(requestData);
  } catch (error) {
    console.error('Error fetching request data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/users', async (req, res) => {
  try {
    // Fetch users data from the database
    const users = await UserModel.find();
    // Send the users data as a response
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

  app.get('/credentials', async (req, res) => {
    try {
        const credentials = await CredentialModel.find();
        res.status(200).json(credentials);
    } catch (error) {
        console.error('Error fetching credentials:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to toggle the status of a request
app.put('/togglestatus/:requestId', async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const { approved, claim_on } = req.body;

    const requestToUpdate = await RequestModel.findById(requestId);

    if (!requestToUpdate) {
      return res.status(404).json({ message: 'Request not found' });
    }

    requestToUpdate.approved = approved;
    requestToUpdate.claim_on = approved ? (claim_on || new Date().toISOString().split('T')[0]) : claim_on;
    
    await requestToUpdate.save();

    res.status(200).json({ message: 'Status toggled successfully', request: requestToUpdate });
  } catch (error) {
    console.error('Error toggling status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

  // Route to toggle the claim status and set claim date of a request
  app.put('/toggleclaimstatus/:requestId', async (req, res) => {
    try {
      const requestId = req.params.requestId;
      const { claimed } = req.body;

      // Find the request by ID
      const requestToUpdate = await RequestModel.findById(requestId);

      if (!requestToUpdate) {
        return res.status(404).json({ message: 'Request not found' });
      }

      // Update the claim status
      requestToUpdate.claimed = claimed;
      if (!claimed) {
        // Set claim date to null if unclaiming
        requestToUpdate.date_claimed = null;
      } else {
        // Set claim date to the current date if claiming
        requestToUpdate.date_claimed = new Date().toISOString().split('T')[0];
      }

      await requestToUpdate.save();

      // Send success response
      res.status(200).json({ message: 'Claim status toggled successfully', request: requestToUpdate });
    } catch (error) {
      console.error('Error toggling claim status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Route to edit a request
  app.put('/update/:requestId', async (req, res) => {
    try {
      const requestId = req.params.requestId;
      const updatedData = req.body;

      // Find the request by ID and update its details
      const updatedRequest = await RequestModel.findByIdAndUpdate(requestId, updatedData, { new: true });

      if (!updatedRequest) {
        return res.status(404).json({ message: 'Request not found' });
      }

      // Send success response with the updated request
      res.status(200).json({ message: 'Request updated successfully', request: updatedRequest });
    } catch (error) {
      console.error('Error editing request:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/credentials', async (req, res) => {
    try {
      // Fetch credentials   data from the database
      const credentials = await CredentialModel.find();
      
      // Send the credentials data as a response
      res.status(200).json(credentials);
    } catch (error) {
      console.error('Error fetching credentials:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Route to create a new request
  app.post('/create/request', async (req, res) => {
    try {
      const { name, credentials, total_pay, approved, claim_date, claim_status } = req.body;

      const user = await UserModel.findOne({ name });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const newRequest = new RequestModel({
        userID: user._id,
        credentials,
        total_pay,
        approved,
        claim_date,
        claim_status,
        date_requested: new Date(),
      });

      await newRequest.save();

      res.status(201).json({ message: 'Request created successfully', request: newRequest });
    } catch (error) {
      console.error('Error creating request:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Route to delete a request
  app.delete('/delete/:requestId', async (req, res) => {
    try {
      const requestId = req.params.requestId;

      // Find the request by ID and delete it
      const deletedRequest = await RequestModel.findByIdAndDelete(requestId);

      if (!deletedRequest) {
        return res.status(404).json({ message: 'Request not found' });
      }

      // Send success response with the deleted request
      res.status(200).json({ message: 'Request deleted successfully', request: deletedRequest });
    } catch (error) {
      console.error('Error deleting request:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // API endpoint to fetch the count of transaction requests for today
  app.get("/requests/today", async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
      const count = await RequestModel.countDocuments({
        date_requested: { $gte: today },
      });
      res.status(200).json({ count });
    } catch (error) {
      console.error("Error fetching transaction requests for today:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // API endpoint to fetch the count of completed requests for today
  app.get("/requests/completed/today", async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
      const count = await RequestModel.countDocuments({
        date_claimed: { $gte: today },
        claimed: true,
      });
      res.status(200).json({ count });
    } catch (error) {
      console.error("Error fetching completed requests for today:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

app.get("/requests/pending", async (req, res) => {
  try {
    const count = await RequestModel.countDocuments({
      approved: false, // Fetch only pending requests
    });
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/requests/per-month', async (req, res) => {
  try {
    const year = new Date().getFullYear(); // Get the current year
    const monthlyRequests = await RequestModel.aggregate([
      {
        $match: {
          date_requested: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year + 1}-01-01`) }
        }
      },
      {
        $group: {
          _id: { $month: '$date_requested' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json(monthlyRequests);
  } catch (error) {
    console.error('Error fetching monthly user requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/users/categories', async (req, res) => {
  try {
    const alumniCount = await UserModel.countDocuments({ usertype: 'alumni' });
    const studentCount = await UserModel.countDocuments({ usertype: 'student' });

    res.status(200).json({ alumni: alumniCount, student: studentCount });
  } catch (error) {
    console.error('Error fetching user categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
