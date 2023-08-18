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
app.use(cors(
  {"Access-Control-Allow-Origin": "*",
  "Allow-Methods": "GET, POST, DELETE, FETCH",}
));


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



app.post('/upload', upload.single("resume"), async (req, res) => {
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
    if (ApplyData) {
      var mailoption = {
        from: "BlackBull Admin",
        to: "blackbulltechnology@gmail.com",
        subject: "apply for job",
        html: `
        <!doctype html>
        <html lang="en-US">
        
        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>Appointment Reminder Email Template</title>
            <meta name="description" content="Appointment Reminder Email Template">
        </head>
        <style>
            a:hover {text-decoration: underline !important;}
        </style>
        
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                <tr>
                    <td>
                        <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" border="0"
                            align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                            <!-- Logo -->
                            <tr>
                                <td style="text-align:center;">
                                
                                    <img width="60" src="https://www.blackbulltechnologies.in/assets/blackop.png" title="logo" alt="logo">
                                 
                                </td>
                            </tr>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <!-- Email Content -->
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width:670px; background:#fff; border-radius:3px;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);padding:0 40px;">
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <!-- Title -->
                                        <tr>
                                            <td style="padding:0 15px; text-align:center;">
                                                <h1 style="color:#1e1e2d; font-weight:400; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Candidate Details For Job</h1>
                                                <span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; 
                                                width:100px;"></span>
                                            </td>
                                        </tr>
                                        <!-- Details Table -->
                                        <tr>
                                            <td>
                                                <table cellpadding="0" cellspacing="0"
                                                    style="width: 100%; border: 1px solid #ededed">
                                                    <tbody>
                                                        <tr>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)">
                                                                 Name:</td>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056;">
                                                                ${ApplyData.firstName}</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)">
                                                                Email:</td>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056;">
                                                                ${ApplyData.email}</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)">
                                                               Phone:</td>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056;">
                                                                ${ApplyData.phone}</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed;border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)">
                                                               Profile:</td>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056;">
                                                                ${ApplyData.profile}</td>
                                                        </tr>
                                                        <tr>
                                                        <td
                                                            style="padding: 10px; border-bottom: 1px solid #ededed;border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)">
                                                            ApplyFor:</td>
                                                        <td
                                                            style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056;">
                                                            ${ApplyData.applyFor}</td>
                                                    </tr>
                                                        <tr>
                                                            <td
                                                                style="padding: 10px;  border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%;font-weight:500; color:rgba(0,0,0,.64)">
                                                                Experience:</td>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056;">
                                                                ${ApplyData.experienceYear} ${ApplyData.experienceMonth}</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%;font-weight:500; color:rgba(0,0,0,.64)">
                                                              Education:</td>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056; ">
                                                               ${ApplyData.education}</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="padding: 10px; border-right: 1px solid #ededed; width: 35%;font-weight:500; color:rgba(0,0,0,.64)">
                                                                Resume:</td>
                                                            <td style="padding: 10px; color: #455056;"><a href="${ApplyData.resume}">resume</a></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                           
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        
        </html>
          `,  }
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
    console.log("error",error)
    res.status(500).send(error);
  }
});


app.post("/works", (req, res) => {
  const { name, email, technologies, message } = req.body
  if (name && email && technologies && message) {
    var mailoption = {
      from: "BlackBull Admin",
      to: "blackbulltechnology@gmail.com",
      subject: "apply for works",
      html: `
      <!doctype html>
      <html lang="en-US">
      
      <head>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          <title>Appointment Reminder Email Template</title>
          <meta name="description" content="Appointment Reminder Email Template">
      </head>
      <style>
          a:hover {text-decoration: underline !important;}
      </style>
      
      <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
          <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
              style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
              <tr>
                  <td>
                      <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" border="0"
                          align="center" cellpadding="0" cellspacing="0">
                          <tr>
                              <td style="height:80px;">&nbsp;</td>
                          </tr>
                          <!-- Logo -->
                          <tr>
                              <td style="text-align:center;">
                              
                                  <img width="60" src="https://www.blackbulltechnologies.in/assets/blackop.png" title="logo" alt="logo">
                               
                              </td>
                          </tr>
                          <tr>
                              <td style="height:20px;">&nbsp;</td>
                          </tr>
                          <!-- Email Content -->
                          <tr>
                              <td>
                                  <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                      style="max-width:670px; background:#fff; border-radius:3px;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);padding:0 40px;">
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                      <!-- Title -->
                                      <tr>
                                          <td style="padding:0 15px; text-align:center;">
                                              <h1 style="color:#1e1e2d; font-weight:400; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Client's Message For Work</h1>
                                              <span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; 
                                              width:100px;"></span>
                                          </td>
                                      </tr>
                                      <!-- Details Table -->
                                      <tr>
                                          <td>
                                              <table cellpadding="0" cellspacing="0"
                                                  style="width: 100%; border: 1px solid #ededed">
                                                  <tbody>
                                                      <tr>
                                                          <td
                                                              style="padding: 10px; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)">
                                                               Client's Name:</td>
                                                          <td
                                                              style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056;">
                                                              ${name}</td>
                                                      </tr>
                                                      <tr>
                                                          <td
                                                              style="padding: 10px; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)">
                                                              Email:</td>
                                                          <td
                                                              style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056;">
                                                              ${email}</td>
                                                      </tr>
                                                      <tr>
                                                          <td
                                                              style="padding: 10px; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)">
                                                             Technologies:</td>
                                                          <td
                                                              style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056;">
                                                              ${technologies}</td>
                                                      </tr>
                                                      <tr>
                                                          <td
                                                              style="padding: 10px; border-bottom: 1px solid #ededed;border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)">
                                                             Message:</td>
                                                          <td
                                                              style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056;">
                                                              ${message}</td>
                                                      </tr>
                                                    
                                                    
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          <tr>
                              <td style="height:20px;">&nbsp;</td>
                          </tr>
                         
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      
      </html>
        `,  }
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
      subject: req.body.subject,
      message: req.body.message
    });
    await UserData.save();
    res.send(UserData)
    if (UserData) {
      var mailoption = {
        from: "BlackBull Admin",
        to: "blackbulltechnology@gmail.com",
        subject: "contact",
        html: `
      <!doctype html>
      <html lang="en-US">
      
      <head>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          <title>Appointment Reminder Email Template</title>
          <meta name="description" content="Appointment Reminder Email Template">
      </head>
      <style>
          a:hover {text-decoration: underline !important;}
      </style>
      
      <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
          <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
              style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
              <tr>
                  <td>
                      <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" border="0"
                          align="center" cellpadding="0" cellspacing="0">
                          <tr>
                              <td style="height:80px;">&nbsp;</td>
                          </tr>
                          <!-- Logo -->
                          <tr>
                              <td style="text-align:center;">
                              
                                  <img width="60" src="https://www.blackbulltechnologies.in/assets/blackop.png" title="logo" alt="logo">
                               
                              </td>
                          </tr>
                          <tr>
                              <td style="height:20px;">&nbsp;</td>
                          </tr>
                          <!-- Email Content -->
                          <tr>
                              <td>
                                  <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                      style="max-width:670px; background:#fff; border-radius:3px;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);padding:0 40px;">
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                      <!-- Title -->
                                      <tr>
                                          <td style="padding:0 15px; text-align:center;">
                                              <h1 style="color:#1e1e2d; font-weight:400; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Contact Details</h1>
                                              <span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; 
                                              width:100px;"></span>
                                          </td>
                                      </tr>
                                      <!-- Details Table -->
                                      <tr>
                                          <td>
                                              <table cellpadding="0" cellspacing="0"
                                                  style="width: 100%; border: 1px solid #ededed">
                                                  <tbody>
                                                      <tr>
                                                          <td
                                                              style="padding: 10px; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)">
                                                               Client's Name:</td>
                                                          <td
                                                              style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056;">
                                                              ${UserData.name}</td>
                                                      </tr>
                                                      <tr>
                                                          <td
                                                              style="padding: 10px; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)">
                                                              Email:</td>
                                                          <td
                                                              style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056;">
                                                              ${UserData.email}</td>
                                                      </tr>
                                                      <tr>
                                                          <td
                                                              style="padding: 10px; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)">
                                                             Phone:</td>
                                                          <td
                                                              style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056;">
                                                              ${UserData.phone}</td>
                                                      </tr>
                                                      <tr>
                                                      <td
                                                          style="padding: 10px; border-bottom: 1px solid #ededed;border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)">
                                                         Subject:</td>
                                                      <td
                                                          style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056;">
                                                          ${UserData.subject}</td>
                                                  </tr>
                                                      <tr>
                                                          <td
                                                              style="padding: 10px; border-bottom: 1px solid #ededed;border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)">
                                                             Message:</td>
                                                          <td
                                                              style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056;">
                                                              ${UserData.message}</td>
                                                      </tr>
                                                    
                                                    
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          <tr>
                              <td style="height:20px;">&nbsp;</td>
                          </tr>
                         
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      
      </html>
        `, 
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

