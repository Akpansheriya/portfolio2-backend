const express = require("express");
const dotenv = require("dotenv");
const app = express();
const connectDB = require("./src/db/conn");
const UserModel = require("./src/models/user");
const ApplyModel = require("./src/models/apply")
const path = require("path");
const cors = require("cors")

const multer = require("multer");

const port = process.env.PORT || 8000

//setting path
const staticpath = path.join(__dirname, "./public");



//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(staticpath));
app.use('/public', express.static('public'));
app.use(cors());


// app.get("/" , (req,res) => {
//     res.send("index");
// });

app.get("/", (req, res) => {
    res.render("hello");
});

const storage = multer.diskStorage({
    destination: "./public",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
  });
  
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
     
      cb(null, true);
    } else {
    
      cb(new Error('Only PDF files are allowed.'), false);
    }
  };
  
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter
  });

app.post('/upload', upload.single("resume"), async(req, res) => {
    try {

       
        const ApplyData = new ApplyModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            profile: req.body.profile,
            applyFor: req.body.applyFor,
            experienceYear: req.body.experienceYear,
            experienceMonth: req.body.experienceMonth,
            education: req.body.education,
            resume: req.protocol + "://" + req.get("host") + `/public/${req.file.filename}`,
            detail: req.body.detail
        });
       await ApplyData.save();
       res.send(ApplyData)
      
    } catch (error) {
        res.status(500).send(error);
    }
});



app.post("/contactUs", async (req, res) => {
    
    try {

        
        const UserData = new UserModel({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
           subject:req.body.subject,
            message: req.body.message
        });
        await UserData.save();
        res.send(UserData)
        //  res.status(200)//get("/",{
        //     errorMsg: `Form Submited Successfully`
        // });

    } catch (error) {
        res.status(500).send(error);
    }
});



//load config
dotenv.config({ path: "./config/config.env" });
connectDB();

app.listen(port, () => {
    console.log(`port live at ${port}`);
});

