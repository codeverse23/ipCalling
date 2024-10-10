const jwt = require("jsonwebtoken");
module.exports.jwtToken = ( email, password,role) => {
  const token = jwt.sign(
    {
      email: email,
      password: password,
      role:role
    },
    "tytyty", 
    { expiresIn: '1h' } 
  );
  return token;
};