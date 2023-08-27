"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// For this dummy REST API we store the Todos here. Only in memory.
let todos = []; // We define the Array with our interface ToDo
const router = (0, express_1.Router)();
// Registering the routes wee need:
// Fetching all todos:
router.get("/", (req, res, next) => {
    res.status(200).json({ todos: todos });
});
// Route to add a Todo:
router.post("/todo", (req, res, next) => {
    // Create a new Todo:
    const newTodo = {
        id: new Date().toISOString(),
        text: req.body.text,
    };
    // Then pushing the new Todo to the todos array:
    todos.push(newTodo);
    // And sending back a response:
    res.status(201).json({
        message: "Added new todo",
        todo: newTodo,
        todos: todos,
    });
});
// Route to update a Todo. We replace the inccoming text of a Todo but keep the id
router.put("/todo/:todoId", (req, res, next) => {
    // Extracting the id from params:
    const tid = req.params.todoId; // todoId is available because we defined it as such in the dynamic part of the route
    // Now we have to find the index of the todo in our array so that we can update it:
    // We coompare the id of every todo in the array with the incoming id. If it is equal we get true and find the index
    const todoIndex = todos.findIndex((todoItem) => todoItem.id === tid);
    // Now we check if todoIndex is set
    if (todoIndex >= 0) {
        // And update the text todo:
        todos[todoIndex] = {
            id: todos[todoIndex].id,
            text: req.body.text,
        };
        // And then return the response. This has to be with a exlplicit return so that we don't send the response below aswell
        return res
            .status(200)
            .json({ message: "Updated Todo successfully.", todos: todos });
    }
    // If we don't find the todo we send back a response telling the user:
    res.status(404).json({ message: "Not Todo with this id found!" });
});
// Route to delete a todo:
router.delete("/todo/:todoId", (req, res, next) => {
    // Here we want to overwrite the todos array wiithout the todo we want to delete:
    // If the todo id of the todo in the array is NOT the id of todo we want to delete it becomes true. Todo passes
    todos = todos.filter((todoItem) => todoItem.id !== req.params.todoId);
    // Then send back the response:
    res.status(200).json({
        message: "Todo deleted successfully.",
        todos: todos,
    });
});
exports.default = router;
