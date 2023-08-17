const express = require("express");
const dotenv = require("dotenv");
const app = express();
const connectDB = require("./src/db/conn");
const UserModel = require("./src/models/user");
const ApplyModel = require("./src/models/apply")
const path = require("path");
const cors = require("cors")
const nodemailer = require("nodemailer")
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
    res.send("hello");
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


  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: "ankitpansheriya123@gmail.com",
      pass: "kfrexsoxsevhnkdn",
    },
    tls: {
      rejectUnauthorized: false,
    },
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
       if(ApplyData) {
        var mailoption = {
          from: "BlackBull Admin",
          to:"blackbulltechnology@gmail.com",
          subject: "apply for job",
          html: `
          <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
         
      </head>
      <style> 
      .user-row {
        margin-bottom: 14px;
      }
      
      .table-user-information > tbody > tr {
        border-top: 1px solid #ccc;
      }
      
      .table-user-information > tbody > tr:first-child {
        border-top: 0;
      }
      
      .table-user-information > tbody > tr > td {
        border-top: 0;
      }
      
      .panel {
        margin-top: 20px;
        border:2px solid #000
      
      }
      
      .panel-heading{
        background:#000;
        color:#fff;
      }
      </style>
      <body>
      <div className="container">
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xs-offset-0 col-sm-offset-0 col-md-offset-3 col-lg-offset-3 toppad">
          <div className="panel" style="  margin-top: 20px;  border:2px solid #000 ">
            <div className="panel-heading"  style=" background:#000; color:#fff; ">
              <h3 className="panel-title"  style="margin-top:0;>${ApplyData.firstName} ${ApplyData.lastName}</h3>
            </div>
            <div className="panel-body">
              <div className="row">
               
                <div className=" col-md-9 col-lg-9 ">
                  <table className="table table-user-information">
                    <tbody>
                      <tr>
                        <td>Email :</td>
                        <td>${ApplyData.email}</td>
                      </tr>
                      <tr>
                        <td>contact no :</td>
                        <td>${ApplyData.phone}</td>
                      </tr>
                      <tr>
                        <td>Profile :</td>
                        <td>${ApplyData.profile}</td>
                      </tr>
                      <tr>
                        <tr>
                          <td>Apply for :</td>
                          <td>${ApplyData.applyFor}</td>
                        </tr>
                        <tr>
                          <td>Experience :</td>
                          <td>${ApplyData.experienceYear}</td>
                        </tr>
                        <tr>
                          <td>education :</td>
                          <td>${ApplyData.education}</td>
                        </tr>
                        <td>resume :</td>
                        <td><a href="${ApplyData.resume}">resume</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      </body>
      </html>  `  }
        transporter.sendMail(mailoption, function (error, info) {
          if (error) {
            console.log(error);
            res.status(404).json({
              message: "invalid email",
            });
          } else {
            console.log("verification email sent successfully ", info.response);
           
            res.status(200).send("mail is sent successfully");
          }
        });
       }
      
    } catch (error) {
        res.status(500).send(error);
    }
   } );


   app.post("/works", (req,res) => {
  const {name,email,technologies,message} = req.body
  if(name && email && technologies && message){
    var mailoption = {
      from: "BlackBull Admin",
      to:"blackbulltechnology@gmail.com",
      subject: "apply for works",
      html: `
      <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
     
  </head>
  <style> 
  .user-row {
    margin-bottom: 14px;
  }
  
  .table-user-information > tbody > tr {
    border-top: 1px solid #ccc;
  }
  
  .table-user-information > tbody > tr:first-child {
    border-top: 0;
  }
  
  .table-user-information > tbody > tr > td {
    border-top: 0;
  }
  
  .panel {
    margin-top: 20px;
    border:2px solid #000
  
  }
  
  .panel-heading{
    background:#000;
    color:#fff;
  }
  </style>
  <body>
  <div className="container">
  <div className="row">
    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xs-offset-0 col-sm-offset-0 col-md-offset-3 col-lg-offset-3 toppad">
      <div className="panel" style="  margin-top: 20px;  border:2px solid #000 ">
        <div className="panel-heading"  style=" background:#000; color:#fff; ">
          <h3 className="panel-title"  style="margin-top:0;>${name}</h3>
        </div>
        <div className="panel-body">
          <div className="row">
           
            <div className=" col-md-9 col-lg-9">
              <table className="table table-user-information">
                <tbody>
                  <tr>
                    <td>Email :</td>
                    <td>${email}</td>
                  </tr>
                 
                  <tr>
                    <td>Technologies :</td>
                    <td>${technologies}</td>
                  </tr>
                  <tr>
                    <tr>
                      <td>Message :</td>
                      <td>${message}</td>
                    </tr>
                    
                   
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  </body>
  </html>  `  }
    transporter.sendMail(mailoption, function (error, info) {
      if (error) {
        console.log(error);
        res.status(404).json({
          message: "invalid email",
        });
      } else {
        console.log("verification email sent successfully ", info.response);
       
        res.status(200).send("mail is sent successfully");
      }
    });
  }
   })

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
       if(UserData) {
        var mailoption = {
          from: "BlackBull Admin",
          to:"blackbulltechnology@gmail.com",
          subject: "contact",
          html: `  <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">

              <title>blackbull technologies</title>
              <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
            
              
          </head>
        
          <body>
          <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xs-offset-0 col-sm-offset-0 col-md-offset-3 col-lg-offset-3 toppad">
              <div className="panel" style="  margin-top: 20px;  border:2px solid #000 ">
                <div className="panel-heading" style=" background:#000; color:#fff; " >
                  <h3 className="panel-title" style="margin-top:0;>${UserData.name}</h3>
                </div>
                <div className="panel-body">
                  <div className="row">
                   
                    <div className=" col-md-9 col-lg-9 ">
                      <table className="table table-user-information">
                        <tbody>
                          <tr>
                            <td>Email :</td>
                            <td>${UserData.email}</td>
                          </tr>
                          <tr>
                            <td>contact no :</td>
                            <td>${UserData.phone}</td>
                          </tr>
                          <tr>
                            <td>subject :</td>
                            <td>${UserData.subject}</td>
                          </tr>
                          <tr>
                            <tr>
                              <td>message :</td>
                              <td>${UserData.message}</td>
                            </tr>
                           
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
          </body>
          </html>  ` 
        }
        transporter.sendMail(mailoption, function (error, info) {
          if (error) {
            console.log(error);
            res.status(404).json({
              message: "invalid email",
            });
          } else {
            console.log("verification email sent successfully ", info.response);
           
            res.status(200).send("mail is sent successfully");
          }
        });
       }

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

