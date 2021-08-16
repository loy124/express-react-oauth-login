const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const axios = require('axios')
const {verifyToken, makeAccessToken, makeRefreshToken} = require('../../utils/jwt');
const { snsSignUp, isExistSnsId } = require('../../db/user');

dotenv.config();

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
const GOOGLE_AUTH_TOKEN_URL= "https://oauth2.googleapis.com/token"
const GOOGLE_AUTH_REDIRECT_URL = "http://localhost:8000/user/auth/google/callback"
router.post("/auth/silent-refresh", (req, res, next) =>{
  const {refreshToken} = req.cookies;

  const verifyAccessToken = verifyToken(refreshToken);

  if(verifyAccessToken.id){
    // refresh Token 갱신 
    const accessToken = makeAccessToken(verifyAccessToken.id);
    const refreshToken = makeRefreshToken(verifyAccessToken.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true
    });

    return res.json({accessToken})
    
  }
  
  return res.json({test:"Test"})
});

router.get("/auth/google", (req, res, next) => {
    
  // 해당 부분에서 github에 요청을 보낸다 
  return res.redirect(`${GOOGLE_AUTH_URL}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_AUTH_REDIRECT_URL}&response_type=code&include_granted_scopes=true&scope=https://www.googleapis.com/auth/userinfo.email`)
  // return res.json({"test":"test"})
})
router.get("/auth/google/callback", async(req, res, next) => {

    console.log(req.query);
    const {code} = req.query;
try{
  
    const {data} = await axios({
        method: 'POST',
        url: `${GOOGLE_AUTH_TOKEN_URL}`,
        headers:{
            'content-type':'application/x-www-form-urlencoded;charset=utf-8'
        },
        params:{
          grant_type: 'authorization_code',//특정 스트링
          client_id:process.env.GOOGLE_CLIENT_ID,
          client_secret:process.env.GOOGLE_SECRET_ID,
          redirectUri:GOOGLE_AUTH_REDIRECT_URL,
          code:code,
        }
      })

      const access_token = data['access_token'];
  
const {data:me} = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
  const {sub, email, name} = me;
  const userInformation = {
    email: email,
    nickname:name,
    sns_id : sub,
    type:'google',
  };


  const user_id = await isExistSnsId(userInformation.type, userInformation.sns_id);

  // id가 있는경우 가입이 된 상태이기 떄문에 로그인 로직으로 넘긴다
  if(user_id){
    const accessToken = makeAccessToken(user_id);
    const refreshToken = makeRefreshToken(user_id);
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true
    });


  }else{
    const signUpUserId= await snsSignUp(userInformation);
    const refreshToken = makeRefreshToken(signUpUserId);
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true
    });

  }
  

}
catch (error){
  console.log(error);
}

    return res.redirect("http://localhost:3000")
})

module.exports = router;