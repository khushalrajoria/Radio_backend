const Patient = require('../models/userTB');

async function checkMobileExist(mobile)
{
    let CheckMobile = await userTB.findOne({mobile:mobile}).count();
    //console.log(CheckMobile);
    if(CheckMobile!=0)
    {
        return 1;  //mobile no is exist
    } 
    return 0;
}

module.exports = checkMobileExist;