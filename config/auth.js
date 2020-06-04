const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
    try {
        const token = request.headers.authorization.split(" ")[1];
        // const decoded = jwt.verify(request.body.token, "secret_key");
        const decoded = jwt.verify(token, "secret_key");
        request.userData = decoded;
        next();
    } catch (error) {
        return response.status(401).json({
            message: "Authenticaion failed"
        });
    }
};