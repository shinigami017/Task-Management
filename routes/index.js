var express = require("express"),
    router = express.Router();

// Get Landing Page
router.get("/", function(request, response) {
    response.send("Homepage");
});


module.exports = router;