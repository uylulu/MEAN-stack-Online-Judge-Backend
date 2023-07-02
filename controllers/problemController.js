const Problem = require('../model/problem');
const User = require('../model/user');
const { log } = require('console');
const asyncHandler = require('express-async-handler');

exports.getAllProblems = asyncHandler(async (req, res, next) => {
    // only get name, id and legend of problems
    var problems = await Problem.find({}, {name: 1, legend: 1, _id: 1, status: 1});    
    var user = await User.findOne({name: req.user});

    console.log(user);

    problems.forEach((problem) => {
        if(user.acceptedProblems.includes(problem.name)) {
            problem.status = "green";
        } else {
            problem.status = "#f1f1f1";
        }
    });

    res.json({status: "success", message: "Problems retrieved successfully!!!", data: problems});
});

exports.getProblem = asyncHandler(async (req, res, next) => {
    var problem = await Problem.findById(req.params.id, {name: 1, legend: 1, _id: 1});
    res.json({status: "success", message: "Problem retrieved successfully!!!", data: problem});
});

exports.addProblem = asyncHandler(async (req, res, next) => {

    var user = await User.findOne({name: req.user});
    
    if(!user.admin) {
        res.json({status: "error", message: "You are not authorized to add problems!!!", data: null});
        return;
    }

    var problem = new Problem();
    problem.add(req.body);

    let inp = problem.addInput();
    inp.then(async () => {
        console.log(problem);

        await problem.save();
        res.json({status: "success", message: "Problem added successfully!!!", data: problem});
    });
});

exports.validateSolution = asyncHandler(async (req, res, next) => {

    var problem = await Problem.findById(req.params.problem_id);
    var user = await User.findOne({name: req.user});
    
    var verdict = await problem.validateSolution(req.body.code);
    
    user.addAcceptedProblem(problem, verdict);

    res.json({status: "success", message: "Solution validated successfully!!!", data: verdict});
});