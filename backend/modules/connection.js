const mongoose = require("mongoose")
const db = mongoose.connect(
    "mongodb+srv://kostask:zeblomadison@cluster0.0pprqos.mongodb.net/workouts?retryWrites=true&w=majority"
)
module.exports = db