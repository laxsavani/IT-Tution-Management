const router = require("express").Router();
const admin_token = require("../middleware/admin.middleware");
const manager_token = require("../middleware/manager.middleware");
const image_upload = require("../helper/multer.helper")
const {
    loginAdmin,
    dashboardAdmin,
    managerRegister,
    recents_updates,
    deleteManager
} = require("../controller/admin.controller");

router.get("/login", (req,res) => {
    const displayErrorEmail = req.displayEmail;
    const displayErrorPassword = req.displayPassword;
    res.render('admin_login', { displayErrorEmail, displayErrorPassword });
});
router.post("/login", loginAdmin);
router.get("/",admin_token, dashboardAdmin);
router.post("/",admin_token, managerRegister);
router.get("/delete_manager/:id",admin_token,deleteManager);
router.post("/recents_updates",admin_token,image_upload.array("image_post"), recents_updates);
 var tokenBlacklist=[];
router.get('/logout',admin_token,async(req,res) => {

    res.cookie('jwt', '', { maxAge: 1 });
    const token = req.headers.authorization;

    tokenBlacklist.push(token);
    res.redirect("/admin");
      
     });

module.exports = router;