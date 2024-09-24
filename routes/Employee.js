const express = require("express");
const router = express.Router();
const fetchuser = require("../middelware/fetchuser");
const Employe = require("../model/Employe");
const { body, validationResult } = require("express-validator");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


router.post("/addEmployee", 
  fetchuser, 
  upload.single('image'), // Handle file upload
  [
    body("mobileNo", "Enter a valid mobileNo").isNumeric(),
    body("email", "Enter a valid email").isEmail()
  ],
  async (req, res) => {
    const { name , email, mobileNo, gender, designation, course } = req.body;
    const image = req.file;  // Image file

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    try {
      const employe = new Employe({
        name,
        email,
        mobileNo,
        image: image.path, // Save file path or relevant details
        gender,
        designation,
        course
      });
      const saveemployee = await employe.save();
      res.json(saveemployee);
    } catch (error) {
      console.error('Error storing employee data:', error);
      res.status(500).send(error);
    }
  }
);


router.delete("/delete/:id", fetchuser, async (req, res) => {
  try {
    let emp =await Employe.findById(req.params.id);
    if (!emp) {
      return res.status(404).send("not found");
    }
    emp = await Employe.findByIdAndDelete(req.params.id)
    res.json("successfully deleted " +emp );
  } catch (error) {
    console.log(error);
    res.status(500).send("Some Error Occurd");
  }
});

router.get("/fetchallEmployee", fetchuser, async (req, res) => {
  try {
    const employees = await Employe.find();
    
    // Map through employees to include full image URL
    const employeesWithImages = employees.map(emp => ({
      ...emp.toObject(),
      image: emp.image ? `${req.protocol}://${req.get('host')}/${emp.image}` : null 
    }));

    res.json(employeesWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Some error occurred while fetching employees.");
  }
});








router.put("/updateemp/:id", 
  upload.single('image'), // Handle file upload
  fetchuser, 
  async (req, res) => {
    const { name, email, mobileNo, gender, designation, course } = req.body;
    const image = req.file;  // Image file

    // Create an empty object for updated fields
    const newEmp = {};
    if (name) newEmp.name = name;
    if (email) newEmp.email = email;
    if (mobileNo) newEmp.mobileNo = mobileNo;
    if (image) newEmp.image = image.path; // Save file path or relevant details
    if (gender) newEmp.gender = gender;
    if (designation) newEmp.designation = designation;
    if (course) newEmp.course = course;

    try {
      // Check if employee exists
      let emp = await Employe.findById(req.params.id); // Use req.params.id

      if (!emp) {
        return res.status(404).send("Employee not found");
      }
      console.log(req.params.id);

      // Update employee
      emp = await Employe.findByIdAndUpdate(
        req.params.id, // Use req.params.id

        { $set: newEmp },
        { new: true }
      );

      if (!emp) {
        return res.status(404).send("Employee not updated");
      }

      res.json(emp);
      console.log(emp);
    } catch (error) {
      console.error(error);
      res.status(500).send("Some error occurred");
    }
});







module.exports = router;
