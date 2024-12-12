// const symptomModel = require('../models/symptoms');
const specializationModel = require('../models/specialization');
const subspecializationModel = require('../models/subspecialization')
const  specializationSymptomModel = require('../models/specialization');
const ApiError = require('../functions/ApiError');
const {ResponceAPI}=require("../utils/ResponceAPI")
const {specializationSchema, symptomSchema, specializationSymptomSchema} = require('../validation/valid');


const version = process.env.API_VERSION


//add specialization
const addSpecialization = async(req,res)=>{
    try{
        const {specialization}=req.body;
        const { error, value } = specializationSchema.validate(req.body, {
            abortEarly: false,
          });
          if (error) {
            return res.status(400).send(ResponceAPI(false, null, null, 400, error.details[0].message, version))
          }

          const specializationExist = await specializationModel.findOne({specialization: specialization})
          if(specializationExist){
            return res.status(400).send(ResponceAPI(false, null, null, 400, "specializaton is already exist", version))
          }

          const specializationData = await specializationModel.create(req.body);
          return res.status(201).send(ResponceAPI(true, "Specialization added successfully ",specializationData, null, null, version))
    }catch(error){
        ApiError(error,"addSpecialization");
        return res.status(500).send(ResponceAPI(false, null,error.message, 500, "server error", version))
    }
};
const addSubspecialization = async (req, res) => {
  try {
    const { specialization, attachments ,remarkRequired} = req.body;

    const SubspecializationExist = await subspecializationModel.findOne({ Subspecialization: specialization });
    if (SubspecializationExist) {
      return res.status(400).send(ResponceAPI(false, null, null, 400, "specialization is already exist", version));
    }

    // Map over the attachments array to create an array of objects
    const attachmentsData = attachments.map((attachment) => ({
      documentName: attachment.documentName,
      documentType: attachment.documentType,
      isRequired: attachment.isRequired === "true", // Convert string to boolean
    }));

    const SubspecializationData = await subspecializationModel.create({
      Subspecialization: specialization,
      Attachments: attachmentsData,
      remarkRequired:remarkRequired,
    });

    return res.status(201).send(ResponceAPI(true, "SubSpecialization added successfully", SubspecializationData, null, null, version));
  } catch (error) {
    ApiError(error, "addSpecialization");
    return res.status(500).send(ResponceAPI(false, null, error.message, 500, "server error", version));
  }
};

//add symptom and specialization merger
const specializationSymptom = async(req,res)=>{
  try{
    const{specialization,symptom}=req.body;
    const { error, value } = specializationSymptomSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).send(ResponceAPI(false, null, null, 400, error.details[0].message, version))
    }

    const specializationSymptomData = await specializationSymptomModel.create(req.body);
    return res.status(201).send(ResponceAPI(true, "Specialization Symptom added successfully ",specializationSymptomData, null, null, version))
  }catch(error){
    ApiError(error,"specializationSymptom");
    return res.status(500).send(ResponceAPI(false, null,error.message, 500, "server error", version))
  }
};

//list of specialization
const specializationList = async(req,res)=>{
  try{
    const list = await specializationModel.find({},{_id:0,createdAt:0,updatedAt:0,__v:0});
    return res.status(200).send(ResponceAPI(true, "specialization fetch successfully",list, null, null, version));

  }catch(error){
    ApiError(error,"specializationList");
    return res.status(500).send(ResponceAPI(false, null,error.message, 500, "server error", version))
  }
};
const SubspecializationList = async(req,res)=>{
  try{
    const list = await subspecializationModel.find({},{createdAt:0,updatedAt:0,__v:0});
    return res.status(200).send(ResponceAPI(true, "Subspecialization fetch successfully",list, null, null, version));

  }catch(error){
    ApiError(error,"SubspecializationList");
    return res.status(500).send(ResponceAPI(false, null,error.message, 500, "server error", version))
  }
};

//symptom list
const symptomList = async(req,res)=>{
  try{
    const list = await symptomModel.find();
    return res.status(200).send(ResponceAPI(true, "symptom fetch successfully",list, null, null, version));

  }catch(error){
    ApiError(error,"symptomList");
    return res.status(500).send(ResponceAPI(false, null,error.message, 500, "server error", version))
  }
};

//specialization symptom list
const specializationSymptomList = async(req,res)=>{
   try{
    const list = await specializationSymptomModel.find();
    return res.status(200).send(ResponceAPI(true, "specialization symptom fetch successfully",list, null, null, version));
  
  }catch(error){
    ApiError(error,"specializationSymptomList");
    return res.status(500).send(ResponceAPI(false, null,error.message, 500, "server error", version))
   }
};

//symptom list based on specialization
const getSymptomBySpecialization = async(req,res)=>{
  try{
    const{searchText}=req.params;
    const specializationExist = await specializationModel.findOne({specialization:searchText})
    if(!specializationExist){
      return res.status(400).send(ResponceAPI(false, null, null, 400, "Specialization is invalid", version))
    }else{
      const symptomList = await specializationSymptomModel.find({specialization:searchText},{createdAt:0,updatedAt:0,__v:0});
      return res.status(200).send(ResponceAPI(true, "symptom fetch successfully based on specialization",symptomList, null, null, version));
    }

  }catch(error){
    ApiError(error,"getSymptomBySpecialization");
    return res.status(500).send(ResponceAPI(false, null,error.message, 500, "server error", version))
  }
};


module.exports ={
  addSpecialization,
  addSubspecialization,
 // addSymptom,
//   specializationSymptom,
  specializationList,
  SubspecializationList,
//  symptomList,
//   specializationSymptomList,
//   getSymptomBySpecialization
}

