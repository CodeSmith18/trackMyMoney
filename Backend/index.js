const express =  require('express');
const cors =  require('cors');
const bodyParser  = require('body-parser');
const dotenv =  require("dotenv");


const connectMongoDB = require("./db/mongooseConfig.js");
const userRoutes = require("./routes/userRoutes.js");
const transRoutes =  require("./routes/transcationRoutes.js")

dotenv.config();

const corsOptions = {
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
};

const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use('/users',userRoutes);
app.use('/transaction',transRoutes);

const port = 6000;
connectMongoDB();
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})



