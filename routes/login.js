
const express = require('express');
const path = require('path');

const router = express.Router();
const jwt = require('../modules/jwt');
const crypto = require('crypto');
const mysql = require('mysql')
const con = mysql.createConnection({
  host: 'localhost',
  user: 'workout',
  password: '1234',
  database: 'today_workout_complete',
});

// GET /user 라우터
router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

//nickname 중복검사
router.post('/api/checkNickname',(req, res) =>{
  const nickname = req.body.nickname;
  console.log(req.body);
  // console.log(req);

  const sql ='select nickname from memberinfo where nickname=?';
  con.query(sql, req.body, function (err, row, fields){ //221009 req.body.mail -> req.body로 수정
    let checkNickname;
    checkNickname=false;
    console.log("닉네임 중복검사중 ->"+row);
    if(row.length == 0){ //중복되는게 없으면
      checkNickname = true;// 사용가능
      res.send({checkNickname: checkNickname});// 다시 checkid 객체를 클아이언트로 보낸다
    }
    else{
      checkNickname=false; // 중복돼서 사용 불가
      res.send({checkNickname: checkNickname});
    }
  })
})


//id 중복검사
router.post('/api/checkid',(req, res) =>{
const mail = req.body.mail;
console.log(req.body);
// console.log(req);

const sql ='select mail from memberinfo where mail=?';
con.query(sql, req.body.mail, function (err, row, fields){
    let checkid;
    checkid=false;
    console.log("아이디 중복검사중 ->"+row);
    if(row.length == 0){ //중복되는게 없으면
      checkid = true;// 사용가능
      res.send({checkid: checkid});// 다시 checkid 객체를 클아이언트로 보낸다
    }
    else{
      checkid=false; // 중복돼서 사용 불가
      res.send({checkid: checkid});
    }
})
})

// 1. 회원가입
router.post('/api/join', (req, res) => {
    // 프로필 이미지 저장 및 경로 빼오기
    const profile_img_path = 'default'
    const sql = "INSERT INTO memberinfo VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, '1', default, default, null, null, 1, 1,?)"
    const randomSalt=crypto.randomBytes(32).toString("hex");
    const cryptedmail=crypto.pbkdf2Sync(req.body.mail,"salt",65536, 32, "sha512").toString("hex");
    const cryptedpassword = crypto.pbkdf2Sync(req.body.password,"salt",65536, 32, "sha512").toString("hex");
    const passwordWithSalt=cryptedpassword+"$"+cryptedmail;
    const parameterList = [req.body.mail, passwordWithSalt, req.body.name,  req.body.introduction,
        req.body.phonenumber, req.body.address, req.body.sex, req.body.nickname,  profile_img_path, randomSalt]
    console.log(req.body)
    accessDB_post(req, res, sql, parameterList)
})



// 3. 로그인
router.post('/api/login', (req, res) => {
    console.log('login---------');
    const sql = "SELECT * FROM memberinfo WHERE mail = ? AND password = ?"
    const cryptedmail=crypto.pbkdf2Sync(req.body.mail,"salt",65536, 32, "sha512").toString("hex");
    const cryptedpassword = crypto.pbkdf2Sync(req.body.password,"salt",65536, 32, "sha512").toString("hex");
    const passwordWithSalt=cryptedpassword+"$"+cryptedmail;
    const parameterList = [req.body.mail, passwordWithSalt]
    console.log(cryptedmail);
    console.log(passwordWithSalt);
    console.log(req.body);
    accessDB_post(req, res, sql, parameterList)


})

//아이디 찾기
router.get('/api/findId', (req, res) =>{
  const sql = 'select mail from memberinfo where uesr_name = ? and phonenumber = ?'
  const parameterList=[req.query.uesr_name, req.query.phonenumber]
  accessDB_get(req, res, sql, parameterList);
})


// 비밀번호 찾기
router.get('/api/findPassword', (req,res) => {
  const sql = 'select password from memberinfo where mail = ? and uesr_name = ? and phonenumber = ?'
  const parameterList=[req.query.mail,req.query.uesr_name, req.query.phonenumber]
  accessDB_get(req, res, sql, parameterList);
})

// GET 방식 DB 접근 함수
function accessDB_get(req, res, sql, parameterList) {
  
  con.query(sql, parameterList, function (err, result, fields) {
    if (err) {
      console.log(err);
      res.send("failure")
    } else if(result == undefined || result.length == 0) {
      res.send("failure")
    } else {
      console.log("쿼리 결과");
      console.log(result, req.path);
      switch (req.path){
          case '/api/getPost':
              console.log('getPost');
              res.send(result);
              break;
          case '/api/getPostAll':
              console.log('getPostAll');
              res.send(result);
              break;
          default:
              // result = "success"
              res.send(result)
              break;
      }
    }
  });
}


// POST 방식 DB 접근 함수
function accessDB_post(req, res, sql, parameterList) {
    console.log('post!!!!');
    con.query(sql, parameterList, async function (err, result, fields) {
      if (err) {
        console.log(err);
      } else if(result == undefined || result.length == 0) {
        res.send("failure")
      } else {
  
        console.log("쿼리 결과");
        console.log(result, req.path);
  
        switch (req.path){
          case '/api/join':
            console.log('join');
            const joinJwtToken = await jwt.sign(req.body.mail)
            res.send({token: joinJwtToken.token})
            break
          case '/api/login':
            console.log('login');
            const loginJwtToken = await jwt.sign(req.body.mail)
            res.send({token: loginJwtToken.token, result: result})
            break
          default:
            result = "success"
            console.log(result);
            res.send(result)
            break
        }
      }
    });
  }

module.exports = router;

