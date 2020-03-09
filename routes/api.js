/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const assert = require('assert');

const issueSchema = new Schema ({
  project: {type: String, required: true, select: false},
  issue_title: {type: String, required: true},
  issue_text: {type: String, required: true},
  created_by: {type: String, required: true},
  assigned_to: {type: String, required: false},
  status_text: {type: String, required: false},
  created_on: {type: Date, required: true},
  updated_on: {type: Date, required: true},
  open: {type: Boolean, required: true},
  __v: {type: Number, select: false}
});
const IssueTracker = mongoose.model('IssueTracker', issueSchema);

//Not best practice
process.env.MONGO_URI='mongodb+srv://test_user_1:KH4D0tlqYHShP3XX@cluster0-fjcq5.mongodb.net/test?retryWrites=true&w=majority';
process.env.DB='mongodb+srv://test_user_1:KH4D0tlqYHShP3XX@cluster0-fjcq5.mongodb.net/test?retryWrites=true&w=majority';
//const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connection made'))
  .catch(err => console.log(err));

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res, next){
      const project = req.params.project;
      let query = req.query;
      query.project = project;

      IssueTracker.find(query)
        .then( docs => res.json(docs) )
        .catch( err => next(err) );
    })
    
    .post(function (req, res, done){
      const project = req.params.project;
      const newTitle = req.body.issue_title;
      const newText = req.body.issue_text;
      const newCreatedBy = req.body.created_by;
      const newCreatedOn = new Date();
      const isOpen = true;

      let newAssignedTo = req.body.assigned_to;
      let newStatusText = req.body.status_text;
      let newUpdatedOn = req.body.updated_on;

      if (!newAssignedTo) {
        newAssignedTo = "";
      }

      if (!newStatusText) {
        newStatusText = "";
      }

      if (!newUpdatedOn) {
        newUpdatedOn = new Date();
      }

      const newIssueTracker = new IssueTracker({
        project: project,
        issue_title: newTitle,
        issue_text: newText,
        created_by: newCreatedBy,
        assigned_to: newAssignedTo,
        status_text: newStatusText,
        created_on: newCreatedOn,
        updated_on: newUpdatedOn,
        open: isOpen
      });

      // Make sure to catch any errors to avoid unhandled promise rejection
      newIssueTracker.save()
        .then( () => console.log('Success'))
        .catch( (err) => done(err));

      const newId = newIssueTracker._id;
      res.json({
        _id: newId,
        issue_title: newTitle, 
        issue_text: newText,
        created_on: newCreatedOn,
        updated_on: newUpdatedOn,
        created_by: newCreatedBy,
        assigned_to: newAssignedTo,
        open: isOpen,
        status_text: newStatusText
      });

    })
    
    .put(function (req, res){
      const project = req.params.project;
      const projectId = req.body._id;
      const projectTitle = req.body.issue_title;
      const projectText = req.body.issue_text;
      const projectCreatedBy = req.body.created_by;
      const projectAssignedTo = req.body.assigned_to;
      const projectStatus = req.body.status_text;
      const projectOpen = req.body.open;
      const projectUpdatedOn = new Date();

      // Handle no updated fields sent
      if (projectId && !projectTitle && !projectText && !projectStatus && !projectCreatedBy && !projectAssignedTo && !projectOpen) {
        return res.json("no updated field sent");
      }

      const update = {
        project: project,
        issue_title: projectTitle,
        issue_text: projectText,
        created_by: projectCreatedBy,
        assigned_to: projectAssignedTo,
        status_text: projectStatus,
        open: projectOpen,
        updated_on: projectUpdatedOn
      };

      IssueTracker.findByIdAndUpdate(projectId, update, {omitUndefined: true, new : true})
        .then(() => res.json(`successfully updated ${projectId}`))
        .catch(err => {
          console.error(err); 
          res.json(`could not updated ${projectId}`);
        });
    })
    
    .delete(function (req, res, next) {
      const project = req.params.project;
      const deleteId = req.body._id;

      if (!deleteId) {
        return next(res.json('_id error'));
      }

      const filter = {
        project: project,
        _id: deleteId
      }
      IssueTracker.deleteOne({...filter})
        .then( () => {
          console.log('Delete success');
          res.json(`deleted ${deleteId}`);
        })
        .catch( err => {
          console.error(err);
          res.json(`could not delete ${deleteId}`)
        });
    });
    
};