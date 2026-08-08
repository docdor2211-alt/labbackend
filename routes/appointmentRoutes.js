// // routes/appointmentRoutes.js

// const express =
//   require("express");

// const router =
//   express.Router();

// /* =========================
//    CONTROLLERS
// ========================= */

// const {

//   createAppointment,

//   getAllAppointments,

//   getSingleAppointment,

//   updateAppointmentStatus,

//   deleteAppointment,
//   getMyAppointments,
  

// } = require(
//   "../controllers/appointmentController"
// );

// /* =====================================================
//    CREATE APPOINTMENT
// ===================================================== */

// router.post(

//   "/create",

//   createAppointment

// );
// /* =====================================================
//    GET MY APPOINTMENTS
// ===================================================== */

// router.get(

//   "/my-appointments",

 

//   receptionOnly,

//   getMyAppointments

// );

// /* =====================================================
//    GET ALL APPOINTMENTS
// ===================================================== */

// router.get(

//   "/all",

//   getAllAppointments

// );

// /* =====================================================
//    GET SINGLE APPOINTMENT
// ===================================================== */

// router.get(

//   "/single/:id",

//   getSingleAppointment

// );

// /* =====================================================
//    UPDATE APPOINTMENT STATUS
// ===================================================== */

// router.put(

//   "/update-status/:id",

//   updateAppointmentStatus

// );

// /* =====================================================
//    DELETE APPOINTMENT
// ===================================================== */

// router.delete(

//   "/delete/:id",

//   deleteAppointment

// );

// module.exports =
//   router;



// routes/appointmentRoutes.js

const express =
  require("express");

const router =
  express.Router();

/* =========================
   CONTROLLERS
========================= */

const {

  createAppointment,

  getAllAppointments,

  getSingleAppointment,

  updateAppointmentStatus,

  deleteAppointment,

  getMyAppointments,

} = require(
  "../controllers/appointmentController"
);

/* =========================
   MIDDLEWARE
========================= */

const {

  protect,

  receptionOnly,

} = require(
  "../middleware/authMiddleware"
);

/* =====================================================
   CREATE APPOINTMENT
===================================================== */

router.post(

  "/create",

  protect,

  receptionOnly,

  createAppointment

);

/* =====================================================
   GET MY APPOINTMENTS
===================================================== */

router.get(

  "/my-appointments",

  protect,

  receptionOnly,

  getMyAppointments

);

/* =====================================================
   GET ALL APPOINTMENTS
===================================================== */

router.get(

  "/all",

  protect,

  receptionOnly,

  getAllAppointments

);

/* =====================================================
   GET SINGLE APPOINTMENT
===================================================== */

router.get(

  "/single/:id",

  protect,

  receptionOnly,

  getSingleAppointment

);

/* =====================================================
   UPDATE APPOINTMENT STATUS
===================================================== */

router.put(

  "/update-status/:id",

  protect,

  receptionOnly,

  updateAppointmentStatus

);

/* =====================================================
   DELETE APPOINTMENT
===================================================== */

router.delete(

  "/delete/:id",

  protect,

  receptionOnly,

  deleteAppointment

);

module.exports =
  router;