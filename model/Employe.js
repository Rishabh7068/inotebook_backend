const mongoose = require('mongoose');
const { Schema } = mongoose;

const EmployeSchema = new Schema({
      image: {
        type: String, // You can store the image URL or base64 string
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true, // Ensures no two employees can have the same email
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
      },
      mobileNo: {
        type: String,
        required: true,
        match: [/^[0-9]{10}$/, 'Please fill a valid mobile number'], // Validates 10-digit mobile numbers
      },
      designation: {
        type: String,
        enum: ['HR', 'Manager', 'sales'],
        required: true,
      },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'], // Restricting the gender field to specific values
        required: true,
      },
      course: {
        type: String,
        required: true,
      },
      createDate: {
        type: Date,
        required: true,
        default: Date.now, // Auto-generates the date if not provided
      }
});

module.exports = mongoose.model('employee' , EmployeSchema);