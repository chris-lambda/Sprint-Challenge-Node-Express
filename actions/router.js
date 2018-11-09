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
        if (!body.project_id || !body.description) {
            res.status(400).json({message: 'Project Id and Description required'})
        }
        const actionId = await actionsDb.insert(req.body)
        res.status(201).json(actionId);
    } catch(error) {
        error.errno === 19 ?
            res.status(406).json('action already exists')
            :res.status(500).json(error);
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const count = await actionsDb.remove(id);
        
        count
            ? res.status(200).json({message: `${count} post's deleted`})
            : res.status(404).json({message: 'post not found'})
    } catch(error) {
        res.status.apply(500).json(error);
    }
})

router.put('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const count = await actionsDb.update(id, req.body);

        count
            ? res.status(200).json({message: `${count} post's edited`})
            : res.status(404).json({message: 'post not found'})

    } catch(error) {
        res.status.apply(500).json(error);
    }
})


module.exports = router;