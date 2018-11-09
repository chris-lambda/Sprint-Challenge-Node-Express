const express = require('express');

const projectsDb = require('../data/helpers/projectModel')

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const projects= await projectsDb.get();
        res.status(200).json(projects);
    } catch(error) {
        res.status(500).json(error);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const project = await projectsDb.get(id)

        project
            ? res.status(200).json(project)
            : res.status(404).json({message: 'project not found'})
    } catch(error) {
        res.status(500).json({message: 'Error finding project', error});
    }
});

router.get('/actions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const actions = await projectsDb.getProjectActions(id);
        
        if(!actions.length) res.status(200).json({message: 'Project has not actions or doesnt exist'});
        res.status(200).json(actions);
    } catch(error) {
        res.status(500).json(error);
    }
})

router.post('/create', async (req, res) => {
    try {
        const { body } = req;
        if (!body.name || !body.description) {
            res.status(400).json({message: 'name and description required'})
        }
        const project = await projectsDb.insert(req.body)
        res.status(201).json(project);
    } catch(error) {
        error.errno === 19 ?
            res.status(406).json('project already exists')
            :res.status(500).json(error);
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const count = await projectsDb.remove(id);
        
        count
            ? res.status(200).json({message: `${count} project's deleted`})
            : res.status(404).json({message: 'project not found'})
    } catch(error) {
        res.status.apply(500).json(error);
    }
})

router.put('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;

        if (!body.name && !body.description && !body.completed == null) {
            res.status(400).json({message: 'name, description, completed required'})
        }

        const updatedProject = await projectsDb.update(id, body);

        updatedProject
            ? res.status(200).json(updatedProject)
            : res.status(404).json({message: 'project not found'})

    } catch(error) {
        res.status(500).json(error);
    }
})



module.exports = router;