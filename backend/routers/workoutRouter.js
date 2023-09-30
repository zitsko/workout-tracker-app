const router = require("express").Router();
const workoutController = require("../controllers/workoutController.js");

router.get("/", workoutController.getAllWorkouts);
router.post("/", workoutController.postWorkout);
router.delete("/:id", workoutController.deleteWorkout);
router.put("/:id", workoutController.updateWorkout);
router.get("/:userId", workoutController.getAllUserWorkout);
router.delete("/", workoutController.deleteAllUserWorkouts);


module.exports = router;