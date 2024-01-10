const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose"); //OwhxbZbxu0EW8pYh
require("dotenv").config();

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const { pageNotFound, errorHandler} = require('./middlewares/error-middleware');

const app = express();
app.use(express.json({extend: true}));
app.use(express.urlencoded({extended: true}));
//app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);

app.use(pageNotFound);
app.use(errorHandler);

connect(process.env.MONGO_URL).then(
    app.listen(3000, () => console.log(`Server running on port: ${process.env.PORT}`))
).catch(error => {console.log(error);});
