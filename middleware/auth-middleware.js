const jwt = require("jsonwebtoken");

const HTTPError = require("../models/http-error");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; //We send a header named authorization, and the token is preceded by the word Bearer, because it is standard practise. This is why we are splitting the token and getting the second item in the index.
    if (!token) {
      throw new Error("Authentication failed!"); //The error we throw here doesn't really matter because we're creating a new error using the HTTP model in the catch block below. Explained in lesson 178 (6:38) of MERN coiurse on Udemy
    }
    const decodedToken = jwt.verify(token, "jwt-secret"); //if this verification didn't throw an error, then the it means that the is authenticated
    req.userData = { userId: decodedToken._id }; //attaching user id here so that anyr equest after the middleware will be able to use this data
    next();
  } catch (err) {
    const error = new HTTPError("Authentication failed", 401);
    return next(error);
  }
};
