const projectsRouter = require('../projects/router');
const actionsRouter = require('../actions/router');

module.exports = server => {
    server.use('/api/projects', projectsRouter)
    server.use('/api/actions', actionsRouter)
}