const route= require("express").Router();

const symptomController = require('../controllers/symptomController');
const {authentication,createRoleAuth,editRoleAuth,getRoleAuth,deleteRoleAuth}=require("../middleware/auth")

route.post('/addSymptom',symptomController.upoloadSymptom);
route.get('/list',authentication,symptomController.getSymptomList);
route.get('/fetch/:symptomId', getRoleAuth, symptomController.symptomById);
route.put('/edit/:symptomId', editRoleAuth, symptomController.editById);
route.delete('/delete/:symptomId', deleteRoleAuth, symptomController.deleteSymptom)



//mobile app
route.get('/app/list',symptomController.getSymptomList);

module.exports =route;