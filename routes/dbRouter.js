var express = require('express');
var router = express.Router();
var Problem = require('../model/problem');
var ProblemController = require('../controllers/problemController');

router.get('/', ProblemController.getAllProblems);

router.get('/:id', ProblemController.getProblem);

router.post('/add', ProblemController.addProblem);

router.post('/submit/:problem_id', ProblemController.validateSolution);

module.exports = router;