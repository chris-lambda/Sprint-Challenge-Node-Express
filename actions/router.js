const express = require('express');

const actionsDb = require('../data/helpers/actionModel')

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const actions = await actionsDb.get();
        res.status(200).json(actions);
    } catch(error) {
        res.status(500).json(error);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const action = await actionsDb.get(id)
        res.status(200).json(action);
    } catch(error) {
        res.status(500).json({message: 'Error finding action'});
    }
});

router.post('/create', async (req, res) => {
    try {
        const { body } = req;
        if (!body.project_id || !body.description || !body.notes) {
            res.status(400).json({message: 'project id, description, notes are required'})
        }
        const action = await actionsDb.insert(body)
        res.status(201).json(action);
    } catch(error) {
        error.errno === 19 ?
            res.status(406).json({message: 'error creating action', error})
            :res.status(500).json(error);
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const count = await actionsDb.remove(id);
        
        count
            ? res.status(200).json({message: `${count} action's deleted`})
            : res.status(404).json({message: 'action not found'})
    } catch(error) {
        res.status.apply(500).json(error);
    }
})

router.put('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;

        if (!body.notes && !body.description && body.completed !== null) {
            res.status(400).json({message: 'description, notes or completed required'})
        }

        const updatedProject = await actionsDb.update(id, body);

        updatedProject
            ? res.status(200).json(updatedProject)
            : res.status(404).json({message: 'project not found'})

    } catch(error) {
        res.status(500).json(error);
    }
})


module.exports = router;