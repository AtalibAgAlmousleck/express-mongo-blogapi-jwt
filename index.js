const express = require("express");
const { connect } = require("mongoose"); //OwhxbZbxu0EW8pYh
require("dotenv").config();
const upload = require('express-fileupload');

const userRoutes = require('./routes/user-routes');
const postRoutes = require('./routes/post-routes');

const { pageNotFound, errorHandler} = require('./middlewares/error-middleware');

const app = express();
app.use(express.json({extend: true}));
app.use(express.urlencoded({extended: true}));
//app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(upload());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);

app.use(pageNotFound);
app.use(errorHandler);

connect(process.env.MONGO_URL).then(
    app.listen(3000, () => console.log(`Server running on port: ${process.env.PORT}`))
).catch(error => {console.log(error);});
