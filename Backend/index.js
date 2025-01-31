const express =  require('express');
const cors =  require('cors');
const bodyParser  = require('body-parser');
const dotenv =  require("dotenv");
const cookieParser = require("cookie-parser"); 


const connectMongoDB = require("./db/mongooseConfig.js");
const userRoutes = require("./routes/userRoutes.js");
const transRoutes =  require("./routes/transcationRoutes.js")

dotenv.config();

const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
};

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/users',userRoutes);
app.use('/transaction',transRoutes);

const port = 5000;
connectMongoDB();
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})



