const jwt = require("jsonwebtoken");
module.exports.genJwt = ( userId,role) => {
  const token = jwt.sign(
    {
      userId: userId,      
      role:role
    },
    "tytyty", 
    { expiresIn: '12h' } 
  );
  return token;
};