const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const fs = require('fs')
const mysql = require('mysql')
const readFile = require('filereader')

const crypto = require('crypto');
const con = mysql.createConnection({
  host: 'localhost',
  user: 'workout',
  password: '1234',
  database: 'today_workout_complete',
});

const PROFILE_IMG_DIR = '/root/TWC-BACKEND-BACKUP/public/img/userProfile';
const EMG_DATA_DIR = 'public/emgData';

let storage  = multer.diskStorage({
    destination(req, file, cb) {
        console.log("USER PROFILE IMG SAVE");
        cb(null, PROFILE_IMG_DIR+'/');
    },
    filename(req, file, cb) {
        console.log("USER PROFILE IMG FILENAME");
        cb(null, `${req.body.mail}_${file.originalname}`);
    },
});

let upload = multer({ storage: storage });

// 센서데이터
router.get('/api/sensorData',(req,res)=>{
  
  const sql = "select emg_data_path from sensordata where nickname =?"
  const parameterList=[req.query.nickname]
  accessDB_get(req, res, sql, parameterList)
  
  console.log(req.query);
})

async function clean(file){
    fs.unlink(file, function(err){
        if(err) {
        console.log("Error : ", err)
        }
    })
}

// GET /user 라우터
router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});
//비밀번호변경전 확인
router.post('/api/checkPassword',(req, res) =>{
  const password = req.body.password;
  console.log(req.body);
  // console.log(req);

  const sql ='select password from memberinfo where password=?';
  con.query(sql, req.body.password, function (err, row, fields){
    let checkPassword = false;
    console.log(row);
    if(row.length == 0){ //중복되는게 없으면
      res.send({checkPassword: checkPassword});// 다시 checkid 객체를 클아이언트로 보낸다
      console.log(row);
    }
    else{
      checkPassword = true; // 중복돼서 사용 불가
      
      res.send({checkPassword: checkPassword});
      console.log(row);
    }
  })
})

router.get('/api/sendEmgData',(req,res)=>{
  const sql='select emg_data_path from sensordata where nickname = ?'
  parameterList=[req.query.nickname]
  // const data = fs.readFileSync("/root/TWC-BACKEND-BACKUP/public/emgData"+"/"+Object.values(req.query), {encoding:'utf8', flag:'r'});
  // JSON.stringify(data)
  
  con.query(sql, parameterList, function (err, result, fields){
    
    
    // console.log(row);
    if(err){
      console.log(err);
      res.send("faile")
    } else{
      console.log(req.query);

      let emgList=[];
      console.log('여기;?', Object.values(result[3]));
      
      if(req.query.Year == undefined){          // 다른 사람 운동 데이터 1개 가져오기
        let data = JSON.parse(fs.readFileSync("/root/TWC-BACKEND-BACKUP/public/emgData"+"/"+Object.values(result[result.length-1]), {encoding:'utf8', flag:'r'}));
        for(let i = 0; i < data.sets.length; i++) data.sets[i].emg_data = data.sets[i].emg_data.substring(1, data.sets[i].emg_data.length-1).split(",").map(Number);
        console.log(data);
        emgList.push(data);
      } else {                                  // 캘린더 나의 운동 데이터 가져오기
        for(let i = 0;i<result.length;i++){
          const emgPath=Object.values(result[i]);
          //console.log('??', emgPath[0].split('_'));
          const emgDate=emgPath[0].split('_');
          const emgYear=emgDate[1].substring(0,4)
          const emgMonth=emgDate[1].substring(4,6)
          const emgDay=emgDate[1].substring(6,8)
          if(emgYear == req.query.Year && emgMonth == req.query.Month && emgDay == req.query.Day){
            console.log(emgYear+emgMonth+emgDay);
            let data = JSON.parse(fs.readFileSync("/root/TWC-BACKEND-BACKUP/public/emgData"+"/"+Object.values(result[i]), {encoding:'utf8', flag:'r'}));
            for(let i = 0; i < data.sets.length; i++) data.sets[i].emg_data = data.sets[i].emg_data.substring(1, data.sets[i].emg_data.length-1).split(",").map(Number);
            console.log(data);
            emgList.push(data);
          }
        }

      }
      
      // console.log([...emgList]);
      console.log(JSON.stringify(emgList));
      res.send(emgList);
    }
  })
})

router.get('/api/myEmgDataList', (req, res, next) => {
  const sql='SELECT emg_data_path FROM sensordata WHERE nickname = ?'
  parameterList=[req.query.nickname]
  
  con.query(sql, parameterList, function (err, result, fields){
    if(err){
      console.log(err);
      res.send("faile")
    } else{
      console.log(result);
      res.send(result);
    }
  })
})

router.get('/api/likedPost', (req, res, next) => {
  let sql;
  if(req.query.is_web){
    sql='SELECT * FROM post INNER JOIN likes ON post.post_id = likes.post_id WHERE likes.nickname = ? and post.board_id = ?'
  } else {
    sql='SELECT title AS title, post.emg_data_file as emg_data_file  FROM post INNER JOIN likes ON post.post_id = likes.post_id WHERE likes.nickname = ? and post.board_id = ? and emg_data_file IS NOT NULL'
  }
  
  parameterList=[req.query.nickname, req.query.board_id]
  
  con.query(sql, parameterList, function (err, result, fields){
    if(err){
      console.log(err);
      res.send("faile")
    } else{
      console.log(result);
      res.send(result);
    }
  })
})

router.get('/api/likedEmgData', (req, res, next) => {
  const likedEmgData = JSON.parse(fs.readFileSync("/root/TWC-BACKEND-BACKUP/public/emgData"+"/"+req.query.emgDataFileName, {encoding:'utf8', flag:'r'}));
  for(let i = 0; i < likedEmgData.sets.length; i++) likedEmgData.sets[i].emg_data = likedEmgData.sets[i].emg_data.substring(1, likedEmgData.sets[i].emg_data.length-1).split(",").map(Number);
  console.log(JSON.stringify(likedEmgData));
  res.send(likedEmgData);
})


//비밀번호 변경
router.patch('/api/updatePassword',(req, res)=>{
    const sql = 'update memberinfo set password=? where mail=?';

    
    //const randomSalt=crypto.randomBytes(32).toString("hex");
    const cryptedmail=crypto.pbkdf2Sync(req.body.mail,"salt",65536, 32, "sha512").toString("hex");
    const cryptedpassword = crypto.pbkdf2Sync(req.body.password,"salt",65536, 32, "sha512").toString("hex");
    const passwordWithSalt=cryptedpassword+"$"+cryptedmail;
    // const passwordWithSalt=cryptedpassword+"$"+randomSalt;
    
    const parameterList = [passwordWithSalt, req.body.mail]
    accessDB_post(req, res, sql, parameterList);
})

// 유저 정보 변경(이메일, 이름, 자기소개, 이미지)
router.patch('/api/updateMyInfo', upload.single('profileImage'), function(req,res){ 
    const sql = 'update memberinfo set nickname = ?, introduction = ?, profile_img_path = ?  where mail = ?';
    console.log(req.body);
    console.log(req.file);
    let defaultProfile='default.png'
    console.log("bbbbbbb");
    if(req.file!=undefined){
        newFileName = req.file.filename
    }else{
        newFileName=defaultProfile
    }
    console.log("aaaaaaaa");
    if(newFileName==undefined)
        newFileName = req.body.profile_img_path

    // 기존 이미지 파일 삭제 코드
    console.log(PROFILE_IMG_DIR+'/' + req.body.profile_img_path);
    if(req.body.profile_img_path != undefined){
        newFileName=defaultProfile;
        clean(PROFILE_IMG_DIR + '/' + req.body.profile_img_path);
        
    }
    accessDB_patch(req, res, sql, [req.body.nickname, req.body.introduction, newFileName, req.body.mail])
});

router.post('/api/myPage/emgData', (req, res) => {
  console.log(req.body);
  const emgData = JSON.stringify(req.body)
  const emgDataFile = `${req.body.nickname}$${req.body.workout_name}$${req.body.starting_time}.json`

  fs.writeFileSync(`${EMG_DATA_DIR}/${emgDataFile}`, emgData)
  
  // DB 저장
  const sql = "INSERT INTO sensordata VALUES (?, DEFAULT, ?)"
  const parameterList = [req.body.nickname, emgDataFile]

  con.query(sql, parameterList, function (err, row, fields){
    let checkNickname;
    checkNickname=false;
    console.log(row);
    if(err){
      console.log(err);
      res.send("faile")
    } else{
      console.log(row);
      res.send("success")
    }
  })
});

// 사용자 사진 수정
router.put('/api/updateUserProfile', upload.single('profile_img'), (req, res) => {
    const sql = 'update memberinfo set profile_img_path=? where nickname=?';
    console.log(req.body);
    console.log(req.file);
    console.log(req.file.filename);
    accessDB_put(req, res, sql, [req.file.filename, req.body.nickname])
})

//mypage 자기가 쓴 게시글 전부 가져오기
router.get('/api/myPagePost',(req,res)=>{
    const sql ='select * from post where nickname =? limit ?,?'
    const parameterList=[req.query.nickname, parseInt(req.query.limit),parseInt(req.query.limit)+9]
    accessDB_get(req, res, sql, parameterList)
})





router.post('/api/emgData', (req, res) => {
  console.log(req.body);
  const emgData = JSON.stringify(req.body)
  const emgDataFile = `${req.body.nickname}_${req.body.starting_time}.json`

  fs.writeFileSync(`${EMG_DATA_DIR}/${emgDataFile}`, emgData)
  
  // DB 저장
  const sql = "INSERT INTO sensordata VALUES (?,DEFAULT, ?)"
  const parameterList = [req.body.nickname, emgDataFile]

  con.query(sql, parameterList, function (err, row, fields){
    let checkNickname;
    checkNickname=false;
    console.log(row);
    if(err){
      console.log(err);
      res.send("faile")
    } else{
      console.log(row);
      res.send("success")
    }
  })
});



router.get('/api/calendarEmgDate',(req,res)=>{
  const sql = 'select emg_data_path from sensordata where nickname=?'

  const parameterList =[req.query.nickname]
  // console.log(req.query);
  accessDB_get(req, res, sql, parameterList);
})




//유저정보삭제
router.delete('/api/deleteUserInfo', (req,res)=>{
    const sql = 'delete from memberinfo where mail= ?'

    const parameterList=[req.query.mail]

    console.log(req.query.mail);
    accessDB_post(req, res, sql, parameterList);
})


// GET 방식 DB 접근 함수
function accessDB_get(req, res, sql, parameterList) {
  
  con.query(sql, parameterList, function (err, result, fields) {
    if (err) {
      console.log(err);
      res.send("failure")
    } else if(result == undefined) {
      console.log('-----undefined----');
      res.send("failure")
    } else if(result=="a"){
      //result
      const jsonfile = fs.readFile("../public/emgData"+result);
      console.log('aa', result);
      
      // GET /emgData/얍_20221018_162803_333.json
    } else {
      console.log("쿼리 결과");
      console.log(result, req.path);
      switch (req.path){
        case '/api/getPostAll':
          console.log('getPost11111');
          res.send(result);
          break;
        default:
          res.send(result);
          console.log('aa', result);
          break;
      }
    }
  });
}

// POST 방식 DB 접근 함수
function accessDB_post(req, res, sql, parameterList) {
  
  con.query(sql, parameterList, async function (err, result, fields) {
    if (err) {
      console.log(err);
    } else if(result == undefined) {
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
          res.send(result)
          break
      }
    }
  });
}

function accessDB_put(req, res, sql, parameterList) {
    con.query(sql, parameterList, async function (err, result, fields) {
        if (err) {
        console.log(err);
        } else if(result == undefined) {
        res.send("failure")
        } else {
        console.log(result);
        res.send("success")
        }
    }); 
}



function accessDB_patch(req, res, sql, parameterList) {
    con.query(sql, parameterList, async function (err, result, fields) {
        if (err) {
            console.log(err);
        } else if(result == undefined) {
            res.send("failure")
        } else {
            console.log(result);
            if(req.file!=undefined){
                res.send({profile_img_path: req.file.filename})
            }else{
                res.send({profile_img_path: 'default.png'})
            }
        }
    });
}


module.exports = router;