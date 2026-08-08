const jwt =
  require("jsonwebtoken");

const Reception =
  require(
    "../models/receptionModel"
  );


// GENERATE TOKEN
const generateToken =
  (id, role) => {

    return jwt.sign(

      {
        id,
        role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "30d",
      }

    );

  };


// ==========================================
// REGISTER RECEPTION
// ==========================================

exports.registerReception =
  async (req, res) => {

    try {

      const {
        fullname,
        email,
        phone,
        password,
        doctorId,
      } = req.body;


      // VALIDATION
      if (
        !fullname ||
        !email ||
        !phone ||
        !password ||
        !doctorId
      ) {

        return res.status(400).json({

          success: false,
          message:
            "Please fill all fields",

        });

      }


      // CHECK EXIST
      const alreadyExists =
        await Reception.findOne({
          email,
        });


      if (alreadyExists) {

        return res.status(400).json({

          success: false,
          message:
            "Reception already exists",

        });

      }


      // CREATE
      const reception =
        await Reception.create({

          fullname,
          email,
          phone,
          password,
          doctorId,

        });


      // RESPONSE
      res.status(201).json({

        success: true,

        message:
          "Reception registered successfully",

        token:
          generateToken(
            reception._id,
            reception.role
          ),

        data: reception,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,
        message: error.message,

      });

    }

  };



// ==========================================
// LOGIN RECEPTION
// ==========================================

exports.loginReception =
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;


      // VALIDATION
      if (
        !email ||
        !password
      ) {

        return res.status(400).json({

          success: false,
          message:
            "Email and password required",

        });

      }


      // FIND USER
      const reception =
        await Reception.findOne({
          email,
        }).select("+password");


      if (!reception) {

        return res.status(400).json({

          success: false,
          message:
            "Invalid email",

        });

      }


      // CHECK PASSWORD
      const isMatch =
        await reception.matchPassword(
          password
        );


      if (!isMatch) {

        return res.status(400).json({

          success: false,
          message:
            "Invalid password",

        });

      }


      // RESPONSE
      res.status(200).json({

        success: true,

        message:
          "Login successful",

        token:
          generateToken(
            reception._id,
            reception.role
          ),

        data: reception,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,
        message: error.message,

      });

    }

  };