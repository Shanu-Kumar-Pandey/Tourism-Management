const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;    
    if (!token) {
        return res.status(403).json({ status: false, msg: 'No token provided' });
    }
    jwt.verify(token, "My_secreat", (err, decoded) => {
        if (err) {
            return res.status(500).json({ status: false, msg: 'Token is invalid' });
        }
        req.user = decoded;
        // console.log(decoded)
        next()
       
    });
}

module.exports ={verifyToken};