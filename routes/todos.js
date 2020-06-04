const express = require("express"),
    router = express.Router();

const isLoggedIn = require("../config/auth");
const User = require("../models/user");
const Todo = require("../models/todo");

// Get all Todos
router.get("/", isLoggedIn, function(request, response) {
    User.findById(request.params.userId).populate("todos").exec(function(error, user) {
        if (error) {
            return response.status(400).json({ error: error });
        }
        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }
        response.json(user.todos);
    });
});

// Add a todo
router.post("/", isLoggedIn, function(request, response) {
    let { title, label, duedate, status } = request.body;
    let creator = request.params.userId;
    if (!title) {
        return response.status(400).json({ message: "Title is required" });
    }
    if (!duedate) {
        return response.status(400).json({ message: "Due Date is required" });
    }
    let newTodo = new Todo({ title, label, duedate, status, creator });
    newTodo.save(function(error, todo) {
        if (error) {
            return response.status(400).json({ error: error });
        }
        User.findById(request.params.userId).populate("todos").exec(function(error, user) {
            user.todos.push(todo);
            user.save(function(error, updatedUser) {
                if (error) {
                    return response.status(400).json({ error: error });
                }
                response.json({
                    newTodo: todo,
                    updatedUser: updatedUser
                });
            });
        });
    });
});

router.put("/:todoId", isLoggedIn, function(request, response) {
    if (request.query.archived) {
        Todo.update({ _id: request.params.todoId }, { $set: { archived: request.query.archived } }, function(error, updatedTodo) {
            if (error) {
                return response.status(400).json({ error: error });
            }
            return response.json(updatedTodo);
        });
    }
    if (request.query.status) {
        if (request.query.archived) {
            Todo.update({ _id: request.params.todoId }, { $set: { status: request.query.status } }, function(error, updatedTodo) {
                if (error) {
                    return response.status(400).json({ error: error });
                }
                return response.json(updatedTodo);
            });
        }
    }
    // Todo.findById(request.params.todoId, function(error, foundTodo) {
    //     if (error) {
    //         return response.status(400).json({ error: error });
    //     }
    //     foundTodo.archived = (request.query.archived === "true") ? true : false;
    //     foundTodo.save(function(error, updatedTodo) {
    //         if (error) {
    //             return response.status(400).json({ error: error });
    //         }
    //         return response.json(updatedTodo);
    //     });
    // });
    return response.json({ message: "Update query for status or archived in todo not found." });
});





module.exports = router;