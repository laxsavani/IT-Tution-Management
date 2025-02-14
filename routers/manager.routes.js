const router = require("express").Router();
const manager_token = require("../middleware/manager.middleware");
const Enquiry = require("../models/enquiry.model");
const Student = require("../models/student.model");
const uploads = require("../helper/multer.helper");
const {
  loginManager,
  managerAdmin,
  add_enquiry_data,
  delete_enquiry,
  Active,
  deActive,
  update_enquiry_demo,
  update_enquiry_data,
  delete_enq_confirm, 
  change_enq_color,
  default_enq_color,
  add_student_data,
  generate_grid,
  view_addmission_profile,
  pay_fees,
  student_color_number,
  update_student_page,
  update_student_data,
  attendance,
  batch_attendance,
  presents,
  absent,  
} = require("../controller/manager.controller");

router.get("/login", (req, res) => {
  const displayErrorEmail = req.displayEmail;
  const displayErrorPassword = req.displayPassword;
  res.render("manager_login", { displayErrorEmail, displayErrorPassword });
});
router.post("/login",loginManager);
router.get("/", manager_token, managerAdmin);

router.get("/add_enquiry", manager_token, (req, res) => {
  res.render("add_enquiry");
});

router.post("/add_enquiry_data", manager_token, add_enquiry_data);
router.get("/delete_enquiry/:id", manager_token, delete_enquiry);
router.post("/delete_enq_confirm", manager_token, delete_enq_confirm);
router.get("/deActive/:id", manager_token, deActive);
router.get("/Active/:id", manager_token, Active);

router.get("/update_enquiry_demo_page/:id", manager_token, async (req, res) => {
  var data = await Enquiry.findById(req.params.id);
  res.render("update_enquiry_demo", { data });
});

router.get("/update_enquiry/:id", manager_token, async (req, res) => {
  var datas = await Enquiry.findById(req.params.id);
  res.render("update_enquiry", { datas });
});

router.post("/update_enquiry_data", manager_token, update_enquiry_data);
router.post("/update_enquiry_demo", manager_token, update_enquiry_demo);
router.post("/change_color/:id", manager_token, change_enq_color);
router.post("/default_enq_color", manager_token, default_enq_color);
router.get("/add_addmission", manager_token, async (req, res) => {
  var data = await Student.find({});
  res.render("add_addmission", { data });
});

router.post(
  "/add_student_data",
  manager_token,
  uploads.single("image"),
  add_student_data
);
router.get("/view_student", manager_token, async (req, res) => {
  var data = await Student.find({})
  res.render("view_student", { data })
})

router.get("/view_addmission_profile/:id",manager_token,view_addmission_profile)
router.post("/pay_fees", manager_token, pay_fees)
router.get("/update_student/:id", manager_token, update_student_page)
router.post("/update_student_data", manager_token, uploads.single("image"), update_student_data)
router.post("/student_color_number", manager_token, student_color_number)
router.get('/attendance',manager_token,attendance)
router.post('/batch_attendance',manager_token,batch_attendance)
router.get('/present/:id/:batchtime',manager_token,presents)
router.get('/absent/:id/:batchtime',manager_token,absent)

var tokenBlacklist = [];

// router.get("/logout", manager_token, async (req, res) => {
//   res.cookie("jwt", "", { maxAge: 1 });
//   const token = req.headers.authorization;
//   tokenBlacklist.push(token);
//   res.render("manager_login");
// });

router.get("/logout", async (req, res) => {
  try {
    // Clear the JWT cookie on the client side
    res.cookie("jwt", "", { maxAge: 1 });

    // Client-side redirect using JavaScript
    res.send(`
      <html>
      <head>
        <script>
          setTimeout(() => {
            window.location.href = '/manager/login';
          }, 0);
        </script>
      </head>
      <body>
        Logging out...
      </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during logout");
  }
});

module.exports = router;
