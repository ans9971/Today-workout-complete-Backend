module.exports = {
    secretKey : 'YoUrSeCrEtKeY', // 원하는 시크릿 
    option : {
        algorithm : "HS256", // 해싱 알고리즘
        expiresIn : "30m",  // 토큰 유효 기간
        issuer : "park" // 발행자
    }
}