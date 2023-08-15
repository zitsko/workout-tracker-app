const express = require("express");
const app = express();
const cors =require("cors");
app.use(express.json());
app.use(
    cors({
        origin:"https://workout-tracker-16f1.onrender.com"
    })
);

const workoutRouter = require("./routers/workoutRouter.js")
const userRouter = require("./routers/userRouter.js")


app.use("/workout", workoutRouter);
app.use("/user", userRouter);

const PORT = 3636
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
});