const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql')
const path = require('path')
// const bodyParser = require('body-parser')
// const indexRouter = require('./routes/index')
const loginRouter = require('./routes/login')
const myPageRouter = require('./routes/mypage')
const communityRouter = require('./routes/community')
const emailauthRouter = require('./routes/emailauth')
const jwt = require('./modules/jwt')
const authUtil = require('./middlewares/auth').checkToken
const multer = require('multer');
const fs = require('fs')
const IMG_DIR = 'public/img';
const PROFILE_IMG_DIR = 'public/img/userProfile';
const POST_IMG_DIR = 'public/img/postPhoto';
const EMG_DATA_DIR = 'public/emgData';

let storage  = multer.diskStorage({ // 2
  destination(req, file, cb) {
    if(req.body.title==undefined){
      console.log("USER PROFILE IMG SAVE");
      cb(null, PROFILE_IMG_DIR+'/');
    } else {
      console.log("POST IMG SAVE");
      cb(null, POST_IMG_DIR+'/');
    }
  },
  filename(req, file, cb) {
    if(req.body.title==undefined){
      console.log("USER PROFILE IMG FILENAME");
      cb(null, `${req.body.mail}_${file.originalname}`);
    } else {
      console.log("POST IMG FILENAME");
      
      cb(null, `${req.body.nickname}_${new Date().toLocaleString}_${file.originalname}`);
    }
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

const con = mysql.createConnection({
  host: 'localhost',
  user: 'workout',
  password: '1234',
  database: 'today_workout_complete',
});


app.use(express.static('public'))
// application/json
app.use(express.json());
// application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
// app.use('/api/login', loginRouter)


// 라우터 설정
// app.use(indexRouter);
app.use(loginRouter)
app.use(communityRouter)
app.use(myPageRouter)
app.use(emailauthRouter)

// 0. 연결 확인 코드
con.connect(function(err) {
  if (err) throw err;
  console.log('Connected');
});

app.post('/uploadFile', upload.single('recfile'), function(req,res){ // 7
  console.log(req.body);
  console.log(req.file);
  res.send("-----")
});

app.get('/', (req, res) => res.send('Hellosdfsd'))

//라우터에서 설정되어 있지 않은 주소로 접속하려 할때
app.all('*', (req, res) => {
  res.status(404).send('PAGE NOT FOUND');
});

app.listen(port, () => {
  
  // public/img 폴더 없으면 생성
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR);
  else console.log("--------------");

  // public/img/userProfile 폴더 없으면 생성
  if (!fs.existsSync(PROFILE_IMG_DIR)) fs.mkdirSync(PROFILE_IMG_DIR);
  else console.log("--------------");

  // public/img/postPhoto 폴더 없으면 생성
  if (!fs.existsSync(POST_IMG_DIR)) fs.mkdirSync(POST_IMG_DIR);
  else console.log("--------------");

  if (!fs.existsSync(EMG_DATA_DIR)) fs.mkdirSync(EMG_DATA_DIR);
  else console.log("--------------");

  console.log('Example prot: ${port}')
})