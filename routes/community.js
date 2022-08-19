const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();

const mysql = require('mysql')
const con = mysql.createConnection({
  host: 'localhost',
  user: 'workout',
  password: '1234',
  database: 'Today_workout_complete',
});


const PROFILE_IMG_DIR = 'public/img/userProfile';
const POST_IMG_DIR = 'public/img/postPhoto';

let storage  = multer.diskStorage({
    destination(req, file, cb) {
        console.log("POST IMG SAVE");
        cb(null, POST_IMG_DIR+'/');
    },
    filename(req, file, cb) {
        console.log("POST IMG FILENAME");
        cb(null, `${req.body.nickname}_${new Date().toLocaleString}_${file.originalname}`);
    },
});
  
let upload = multer({ storage: storage });

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

router.get('/board', (req, res) => {
    const sql = "SELECT * FROM board"
    console.log(req.ip);
    console.log(res.url);
    console.log(req.path);
    console.log(req.url);
    console.log(req.url == '/board');
  
    accessDB_get(res, sql, [])
});


// 4. 게시판 생성 authUtil
router.post('/createBoard', (req, res) => {
  
    const sql = "INSERT INTO board VALUES (NULL, ?, ?, ?, DEFAULT, ?, NULL)"
    const parameterList = [req.body.member_id, req.body.board_name, req.body.code, req.body.availability]
  
    console.log(req.body);
  
    accessDB_post(req, res, sql, parameterList)
})
  




// POST 방식 DB 접근 함수
function accessDB_post(req, res, sql, parameterList) {
  
  con.query(sql, parameterList, async function (err, result, fields) {
    if (err) {
      console.log(err);
    } else if(result == undefined || result.length == 0) {
      res.send("failure")
      
    } else {

      console.log("쿼리 결과",result, "paht: ",req.path);
      switch(req.path){
        case '/api/createPost':
          console.log('createPost');
          if(req.file!=undefined){
            res.send({photographic_pathh: req.file.filename})
          }else{
            res.send({photographic_path: 'default.png'})
          }
          break;
        default:
          res.send(result)
          break;

      }

    }
  });
}

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


function accessDB_patch(req, res, sql, parameterList) {
con.query(sql, parameterList, async function (err, result, fields) {
    if (err) {
        console.log(err);
    } else if(result == undefined) {
        res.send("failure")
    } else {
        console.log(result);
        switch(req.path){
          case '/api/createPost':
              if(req.file!=undefined){
                res.send({profile_img_path: req.file.filename})
              }else{
                res.send({profile_img_path: 'default.png'})
              }
              break;
          case '/api/updatePost' :
              if(req.file!=undefined){
                res.send({profile_img_path: req.file.filename})
              }else{
                res.send({profile_img_path: 'default.png'})
              
              }
              break;
          default:
            res.send(result);
            break; 
        }

    }
});
}
module.exports = router;