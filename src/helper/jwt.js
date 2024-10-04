const jwt = require("jsonwebtoken");
module.exports.jwtToken = (email, password) => {
  const token = jwt.sign(
    {
      email: email,
      password: password
    },
    "tytyty", 
    { expiresIn: '1h' } 
  );
  return token;
};