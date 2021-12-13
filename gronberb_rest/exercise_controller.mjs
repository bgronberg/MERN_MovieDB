import * as exercises from './exercise_model.mjs';
import express from 'express';
import { moveMessagePortToContext } from 'worker_threads';

const PORT = 3000;

const app = express();

app.use(express.json());

/**
 * Create a new exercise with the name, reps, weight, units, and date provided in the body
 */
app.post('/exercises', (req, res) => {
    exercises.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(exercise => {
            res.status(201).json(exercise);
        })
        .catch(error => {
            res.status(500).json({Error: error.name, Message: error.message})
        })
});


/**
 * Retrive all exercises. Filtering is currently disabled (empty object is passed to first parameter of findExercises) 
 */
app.get('/exercises', (req, res) => {
    let filter = {};
    exercises.findExercises(filter, '', 0)
        .then(exercises => {
            res.send(exercises);
        })
        .catch(error => {
            res.status(500).json({Error: error.name, Message: error.message})
        });
    }
);

/**
 * Retrieve exercise by _id
 */
app.get('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    
    exercises.findExerciseById(exerciseId)
        .then(exercise =>{
            if (exercise !== null){
                res.json(exercise);
            } else {
                res.status(404).json({Error: 'Resource not found'})
            }
        })
        .catch(error => {
            res.status(500).json({Error: error.name, Message: error.message})
        })
});

/**
 * Update the exercise whose id is provided in the path parameter and set
 * its name, reps, weight, unit, and date values should be provided in the body.
 */
app.put('/exercises/:_id', (req, res) => {
    exercises.replaceExercise(req.params._id, req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(numUpdated => {
            if (numUpdated === 1) {
                res.json({_id: req.params._id, name: req.body.name, reps: req.body.reps, weight: req.body.weight, unit: req.body.unit, date: req.body.date})
            } else {
                res.status(404).json({Error: 'Resource not found'})
            }
        })
        .catch(error => {
            res.status(500).json({Error: error.name, Message: error.message})
        })
});

/**
 * Delete the exercise whose _id is provided in the query parameters
 */
app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1){
                res.status(204).send();
            } else{
                res.status(404).json({Error: 'Resource not found'})
            }
        })
        .catch(error =>{
            res.status(500).json({Error: error.name, Message: error.message})

        })
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});