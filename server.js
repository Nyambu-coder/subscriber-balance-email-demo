 const express = require('express');
 const path = require('path');
 const app = express();
 const PORT =3000;

 //This allows Express to read JSON from request bodies
 app.use(express.json());
app.use(express.static(path.join(__dirname)));

 //Load the routes
 const subscriberRoutes = require('./routes/subscribers');
 app.use('/api', subscriberRoutes);

 app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

 //Start the server
 app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);

 });
