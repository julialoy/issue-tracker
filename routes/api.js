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
  issue_title: {type: String, required: true},
  issue_text: {type: String, required: true},
  created_by: {type: String, required: true},
  assigned_to: {type: String, required: false},
  status_text: {type: String, required: false},
  created_on: {type: Date, required: true},
  updated_on: {type: Date, required: true},
  open: {type: Boolean, required: true}
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
  
    .get(function (req, res){
      const project = req.params.project;
      
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
      
    })
    
    .delete(function (req, res){
      const project = req.params.project;
      
    });
    
};