const db = require('../../models');

const isExistSnsId = async(type, sns_id) => {
    try {
        const result =  await db['social_login'].findOne({
            where:{
                type,
                sns_id
            }
        });
    
        if(result['dataValues'].id){
            return result['dataValues'].id;
        }else{
            throw new Error();
        }
        
    } catch (error) {
        return false;
        
    }
}

const snsSignUp = async({email,nickname, sns_id,type }) => {
    const transaction = await db.sequelize.transaction();
try {

    if (!nickname){
        nickname = email.split("@")[0];
    }
    if(email && nickname){

        try {
            const user = await db['user'].create({
                email,
                nickname
            },{transaction});
            const social_login = await db['social_login'].create({
                sns_id,
                type,
                user_id: user['dataValues'].id
            },{transaction});  

            transaction.commit();
            
            return user['dataValues'].id;
        } catch (error) {
            console.log(error);
            transaction.rollback();
            return false
        }
    }
    
  } catch (error) {
    console.log(error);
    return false;
  }

}
module.exports ={snsSignUp, isExistSnsId}
