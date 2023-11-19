const express = require('express');
const connectDB = require('./utils/db.utils');

const app = express();
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/user.routes');
app.use('/api/user', userRoutes);
app.get('/api', (req, res) => {
    res.send('API live');
});
console.log(process.env.PORT);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);


    
});