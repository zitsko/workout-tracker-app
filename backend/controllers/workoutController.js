const Workout = require("../modules/workout.js");

const getAllWorkouts = async (req, res) => {
  const workouts = await Workout.find();
  res.send(workouts);
};

const postWorkout = async (req, res) => {
  await Workout.create(req.body);
  res.send({ msg: "Workout posted" });
};

const deleteWorkout = async (req, res) => {
  await Workout.deleteOne({ _id: req.params.id });
  res.send({ msg: "Workout deleted" });
};

const updateWorkout = async (req, res) => {
  await Workout.findByIdAndUpdate({ _id: req.params.id }, req.body);
  res.send({ msg: "Workout updated" });
};

const getAllUserWorkout = async (req, res) => {
  const userWorkouts = await Workout.find({ userId: req.params.userId });
  res.send(userWorkouts);
};

module.exports = {
  getAllWorkouts,
  postWorkout,
  deleteWorkout,
  updateWorkout,
  getAllUserWorkout,
};
