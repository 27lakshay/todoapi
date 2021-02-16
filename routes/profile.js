const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/user");

router.put("/update", auth, async (req, res) => {
    try {
        const user = await User.findById(req.currentUser);
        user.name = req.body.change;
        await user.save();
        res.send("Name Updated Successfully");
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/todo", auth, async (req, res) => {
    try {
        const user = await User.findById(req.currentUser);
        const todos = user.todos;
        res.json(todos);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post("/todo/add", auth, async (req, res) => {
    const user = await User.findById(req.currentUser);
    const todos = user.todos;
    todos.push({
        todo: req.body.todo,
    });
    await user.save();
    res.send("maybe");
});
router.put("/todo/update", auth, async (req, res) => {
    const user = await User.findById(req.currentUser);
    const newState = user.todos.find((todo) => todo._id == req.body.todoid);
    newState.todo = req.body.newtodo;
    user.save();
    console.log(user);

    res.send("maybe");
});

router.delete("/todo/delete", auth, async (req, res) => {
    User.findOne({ _id: req.currentUser }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            result.todos.pull(req.body.todoid);
            result.save();
        }
    });
    res.send("maybe");
});

module.exports = router;
