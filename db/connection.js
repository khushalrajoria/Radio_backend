const mongoose=require('mongoose');
const DB=process.env.DATABASE;

mongoose.set('strictQuery', true);
mongoose.connect(DB,
    {
        useNewUrlParser:true,
        useUnifiedTopology :true,
    }).then(() => {
    console.log(`connection succesfull`);
}).catch((err)=>console.log("database connection not successful", err));
