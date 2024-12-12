const router = require("express").Router();
const {
  authentication,
  editRoleAuth,
  getRoleAuth,
} = require("../middleware/auth");

const {
  addPatient,
  getPatientList,
  getPatient,
  updatePatient,
  getPatientListForClinic,
} = require("../controllers/patientController");

router.post("/RegisterPatient", addPatient);
router.get("/ListPatient", authentication, getPatientList);
router.get("/getPatient/:patientId", getRoleAuth, getPatient);
router.put("/EditPatient/:patientId", editRoleAuth, updatePatient);
router.get(
  "/PatientListForClinic/:clinicId",
  authentication,
  getPatientListForClinic
);

module.exports = router;
