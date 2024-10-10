const jwt = require("jsonwebtoken");
module.exports.jwtToken = (username, email, password,role) => {
  const token = jwt.sign(
    {
      username:username,
      email: email,
      password: password,
      role:role
    },
    "tytyty", 
    { expiresIn: '1h' } 
  );
  return token;
};