const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();

const mysql = require('mysql')
const con = mysql.createConnection({
  host: 'localhost',
  user: 'workout',
  password: '1234',
  database: 'today_workout_complete',
});
const mailAuthDefault = " ";

const PROFILE_IMG_DIR = '/root/TWC-BACKEND-BACKUP/public/img/userProfile';
const POST_IMG_DIR = '/root/TWC-BACKEND-BACKUP/public/img/postPhoto';

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
  

// 4. 게시판 생성 authUtil
router.post('/api/createBoard', (req, res) => {

  const sql = "INSERT INTO board VALUES (NULL, ?, ?, ?, DEFAULT, ?, NULL)"
  const parameterList = [req.body.member_id, req.body.board_name, req.body.code, req.body.availability]

  console.log(req.body);

  accessDB_post(req, res, sql, parameterList)
})

router.get('/api/getBoard', (req, res) => {
  
  const sql = "SELECT board_id, board_name FROM board WHERE availability=1"

  accessDB_get(res, sql, []);
})

//커뮤니티 게시글 최신순부터 나열
router.get('/api/showPostDesc',(req,res) => {
  const sql = 'SELECT * FROM post ORDER BY creation_datetime desc limit ?,? '
  const parameterList=[parseInt(req.query.limit), 9]

  console.log(req.query.limit);



  accessDB_get(req, res, sql, parameterList)
})

//커뮤니티 게시글 오래된순부터 나열
router.get('/api/showPostAsc',(req,res) => {
  const sql = 'SELECT * FROM post ORDER BY creation_datetime asc limit ?,?'
  const parameterList=[parseInt(req.query.limit),9]
  



  accessDB_get(req, res, sql, parameterList)
})

// 게시글 가져오기
router.get('/api/getPostAll',(req, res)=>{

  const sql = "SELECT * FROM post where board_id =? limit ?,?"
  const parameterList =[parseInt(req.query.board_id), parseInt(req.query.limit), 9]
  // console.log(req.query);
  // console.log(parameterList);

  // console.log(req.path);
  accessDB_get(req, res, sql, parameterList)

})

// 6. 댓글 생성
router.post('/api/comments', (req, res) => {

  const sql = "INSERT INTO comments (post_id, nickname, parent_comment_id, ip, content) VALUES (?,?,?,?,?)"
  let parent_comments_id;

  // if (req.body.parent_comments_id == 0)
  //  parent_comments_id = null
  parent_comment_id = null
  // ip=null;
  // post_id=5;
  delete_stats=1;
  const parameterList = [req.body.post_id, req.body.nickname, req.body.parent_comment_id,req.ip, req.body.content]
  
  console.log(req.body);
  console.log("ip는"+req.ip);

  accessDB_post(req, res, sql, parameterList)
})

// 게시물 모든 댓글 보여주기
router.get('/api/showComments',(req,res)=>{
  let id = parseInt(req.query.post_id);
  console.log(parseInt(id));
  const sql = "select * from comments where post_id=?"
  const parameterList=[req.query.post_id]
  // accessDB_get[req,res, sql, parameterList]
  con.query(sql, parameterList, async function (err, result, fields) {
    if (err) {
      console.log(err);
    } else if(result == undefined) {
      console.log('jjj');
      res.send("failure")
    } else {
      console.log(result);
      res.send(result);
    }
  });
  console.log(',,m4');
})


// 7. 게시물 제목 검색 기능 코드
router.get('/api/searchTitle',(req,res)=>{

  console.log(req.query);

  const sql = "select * from post where title LIKE " + "'%"+req.query.title+"%'"
  console.log(sql);
  
  con.query(sql ,function(err, result, fields){
    if (err) {
      console.log(err);
      res.send("failure")
    } else {
      console.log("쿼리 결과");
      console.log(result);
      res.send(result)
    }
  });
})


// 게시글 삭제
router.delete('/api/deletePost', (req, res) => {
  const sql = 'delete from post where post_id= ?'
  console.log('삭제될 내용들', req.query.post_id);
  console.log(req.body);
  const parameterList=[req.query.post_id]
  console.log(parameterList)
  accessDB_post(req, res, sql, parameterList);
})

// 게시글 수정
// router.patch('/api/updatePost', upload.single('photographic_path'), function(req,res){ 
//   const sql = "update post set title = ?, comment = ?, photographic_path = ?  where post_id = ?";
//   console.log('body 데이터', req.body);
//   console.log('file 데이터', req.file);
//   let defaultphotographicfile='default.png'
//   // console.log("bbbbbbb");
//   if(req.file!=undefined){
//     newFileName = req.file.filename
//   }else{
//       newFileName=defaultphotographicfile
//   }
//   if(newFileName==undefined){
//     newFileName = defaultphotographicfile
//   }
//  // 기존 이미지 파일 삭제 코드
//   console.log(PROFILE_IMG_DIR+'/' + req.body.photographic_path);
//   if(req.body.photographic_path != undefined){
//       newFileName=photographic_path;
//       clean(PROFILE_IMG_DIR + '/' + req.body.photographic_path);
      
//   }
//   const parameterList =[req.body.title, req.body.comment, newFileName,req.body.post_id];
//   console.log('수정 데이터', parameterList);
//   con.query(sql, parameterList, async function (err, result, fields) {
//     if (err) {
//         console.log(err);
//     } else if(result == undefined) {
//         res.send("failure")
//     } else {
//         console.log(result);
//         if(req.file!=undefined){
//             res.send({profile_img_path: req.file.filename})
//         }else{
//             res.send({profile_img_path: 'default.png'})
//         }
//     }
//   });
// });

// 5. 게시글 생성
router.post('/api/createPost', upload.single('photographic_path'), (req, res)=>{
  
  const sql = "INSERT INTO post VALUES (NULL, ?, ?, ?, ?, ?, ?, DEFAULT,NULL,NULL, DEFAULT, DEFAULT,?,DEFAULT,DEFAULT,?,?)"

  console.log(req.body);
  console.log(req.file);
  let defaultphotographicfile='default.png'
  if(req.file!=undefined){
    newFileName = req.file.filename
  }else{
      newFileName=defaultphotographicfile
  }
  if(newFileName==undefined){
    newFileName = defaultphotographicfile
  }
  
  const parameterList =[req.body.board_id, req.body.nickname, req.body.title, req.body.content, req.ip, newFileName, req.body.availabilty_comments,,req.body.likes, req.body.chartname];

  console.log(req.body);
  accessDB_post(req, res, sql, parameterList)
})


// 게시글 수정
router.patch('/api/updatePost', upload.single('photographic_path'), function(req,res){ 
  const sql = "update post set title = ?, comment = ?, photographic_path = ?, chartname = ?  where post_id = ?";
  console.log('body 데이터', req.body);
  console.log('file 데이터', req.file);
  let defaultphotographicfile='default.png'
  // console.log("bbbbbbb");
  if(req.file!=undefined){
    newFileName = req.file.filename
  }else{
      newFileName=defaultphotographicfile
  }
  if(newFileName==undefined){
    newFileName = defaultphotographicfile
  }
 // 기존 이미지 파일 삭제 코드
  console.log(PROFILE_IMG_DIR+'/' + req.body.photographic_path);
  if(req.body.photographic_path != undefined){
      newFileName=photographic_path;
      clean(PROFILE_IMG_DIR + '/' + req.body.photographic_path);
      
  }
  const parameterList =[req.body.title, req.body.comment, newFileName,req.body.chartname , req.body.post_id];
  console.log('수정 데이터', parameterList);
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
});

//댓글 수정
router.patch('/api/updateComment',(req,res) => {
  const sql = "update comments set content=? where nickname=? and post_id=? and Comments_id =?"
  const parameterList =[req.body.content, req.body.nickname, req.body.post_id, req.body.comments_id];
  accessDB_post(req, res, sql, parameterList)
})

// 댓글 삭제
router.delete('/api/deleteComment', (req,res)=>{
  const sql = 'delete from comments where comments_id=? and post_id= ?'
  const parameterList=[req.query.comments_id, req.query.post_id]
  accessDB_post(req, res, sql, parameterList);
})

//댓글 개수 카운트
router.get('/api/countComments',(req,res)=>{
  const sql='select count(comments_id) from comments where post_id=?'
  const parameterList=[req.body.post_id]
  accessDB_get(req, res, sql, parameterList)
})

// 각 카테고리 게시물만 보기
router.get('/api/showAnotherBoard', (req,res) => {
  const sql= 'select * from post where board_id=?'
  const parameterList =[req.query.board_id]
  console.log(req.body);
  accessDB_get(req, res, sql, parameterList)
});

router.get('/api/myPagePost',(req,res)=>{
  const sql = 'select * from post where nickname =? limit ?,?'
  const parameterList=[req.query.nickname, parseInt(req.query.limit),parseInt(req.query.limit) + 9]
  accessDB_get(req, res, sql, parameterList)
})


//게시물 좋아요 누가눌렀는지
router.get('/api/likePostWho',(req,res)=>{
  const sql = 'select nickname from likes where post_id=?'
  //let post_id = 123;
  const parameterList = req.query.post_id;
  console.log('list', parameterList);
  accessDB_get(req,res,sql,parameterList)
})

//게시물 좋아요 개수
router.get('/api/likePostCount',(req,res)=>{
  const sql = 'select count(nickname) from likes where post_id = ?'
  const parameterList = [req.query.post_id]
  accessDB_get(req,res,sql,parameterList)
})

//좋아요 플러스
router.post('/api/likesPlus',(req,res)=>{
  const sql = 'insert into likes values (?, ?)'
  const parameterList = [req.body.post_id,req.body.nickname]
  accessDB_post(req,res,sql,parameterList)
})

//좋아요 마이너스
router.delete('/api/likesMinus',(req,res)=>{
  const sql = 'delete from likes where post_id=? and nickname = ?'
  const parameterList = [req.query.post_id,req.query.nickname]
  accessDB_post(req,res,sql,parameterList) // 함수가 없눼..
})

//조회수 플러스
router.post('/api/viewPlus',(req,res)=>{
  const sql = 'update post views set views=views+1 where post_id=?'
  const parameterList=[req.body.post_id]
  accessDB_post(req, res, sql, parameterList)
})



const nodemailer = require('nodemailer');
const ejs = require('ejs');
var appDir = path.dirname(require.main.filename);


router.post('/api/mailauth', async(req, res) => {
    let authNum = Math.random().toString().substr(2,6);
    mailAuthDefault = authNum;
    let emailTemplete;
    ejs.renderFile(appDir+'/template/authMail.ejs', {authCode : authNum}, function (err, data) {
      if(err){console.log(err)}
      emailTemplete = data;
    });

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: "todayworkoutcomplete@gmail.com",
            pass: "dblab!23",
        },
    });

    let mailOptions = await transporter.sendMail({
        from: `오운완`,
        to: req.body.mail,
        subject: '[오늘운동완료] 비밀번호재설정을 위한 인증번호',
        html: emailTemplete,
    });


    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        console.log("Finish sending email : " + info.response);
        res.send(authNum);
        transporter.close()
    });
});

router.get('/api/authRes',(req,res)=>{
  res.send(mailAuthDefault);
  console.log(mailAuthDefault);
})





// POST 방식 DB 접근 함수
function accessDB_post(req, res, sql, parameterList) {
  
  con.query(sql, parameterList, async function (err, result, fields) {
    console.log('testest', result);
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
      // console.log("쿼리 결과");
      // console.log(result, req.path);
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
              // console.log('whowhowho', result);
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