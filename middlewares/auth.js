const jwt = require('../modules/jwt');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const authUtil = {
    checkToken: async (req, res, next) => {
        var token = req.headers.token;
        // 토큰 없음 000
        if (!token)
            return res.json({result: "000"});
        // decode
        const user = await jwt.verify(token);
        // 유효기간 만료 001
        if (user === TOKEN_EXPIRED)
            return res.json({result: "001"});
        // 유효하지 않는 토큰 002, 003
        if (user === TOKEN_INVALID)
            return res.json({result: "002"});
        if (user.idx === undefined)
            return res.json({result: "003"});
        req.idx = user.idx;
        next();
    }
}

module.exports = authUtil;