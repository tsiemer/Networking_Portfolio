'use strict';

module.exports = function(app, db) {
    app.get('/admin/:adminId/projects', (req, res, next) => {
        db.Admin.findOne({
            where: {
                id: req.params.adminId
            }
        }).then((result) => {
            if(result){
                db.Project.findAll({}).then(function(result){
                    res.render('admin-views/projects', {projectDetails: result});
                });
            } else {
                res.redirect('/login');
            }
        })
    });
   
    app.get('/projects/createNew', (req, res, next) => {
        res.render('admin-views/new-project');
    });

    app.get('/projects/:page', (req, res, next) => {
        let limit = 10;
        let offset = 0;
        db.Project.findAndCountAll({}).then((data) => {
            let page = req.params.page;
            let pages = Math.ceil(data.count / limit);
                offset = limit * (page - 1);
            db.Project.findAll({
                limit: limit,
                offset: offset,
                order: [
                    ['title', 'ASC']
                ]
            }).then(function(result){
                return res.render('customer-views/projects-index', { data: result, pages})
            })
        })
    });

    app.post('/projects', (req, res, next) => {
        db.Project.create({
            title: req.body.title,
            subtitle: req.body.subtitle,
            description: req.body.description,
            imgUrl: req.body.imgUrl
        }).then(function(result){
            res.render('admin-views/projects-index', {data: result});
        });
    });

    app.get('/project/:projectId', (req, res, next) => {
        db.Project.findOne({
            where: {
                id: req.params.projectId
            }
        }).then(function(result){
            res.render('admin-views/project-details', {data: result});
        });
    });
};