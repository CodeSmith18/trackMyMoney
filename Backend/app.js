const express =  require('express');
const cors =  require('cors');
const bodyParser  = require('body-parser');
const dotenv =  require("dotenv");
const cookieParser = require("cookie-parser"); 
const connectMongoDB = require("./db/mongooseConfig.js");
const userRoutes = require("./routes/userRoutes.js");
const transRoutes =  require("./routes/transcationRoutes.js")

const path = require("path");


dotenv.config();

const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            "https://mymoney.ritikraj.tech",
            "http://localhost:5000",
            "http://mymoney.ritikraj.tech:5000", 
            "http://43.204.14.238:5000"

        ];
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            // Allow requests with no origin (like Postman or curl)
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
};


const app = express();
app.use(bodyParser.json());
app.use(express.json());

const _dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'dist')));





app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/users',userRoutes);
app.use('/transaction',transRoutes);


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 5000 ;
connectMongoDB();
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})



