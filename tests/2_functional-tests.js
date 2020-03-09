/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');          
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Required fields test',
            issue_text: 'Fill in all required fields',
            created_by: 'Functional Test - Every required field filled'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, 'Required fields test');
            assert.equal(res.body.issue_text, 'Fill in all required fields');
            assert.equal(res.body.created_by, 'Functional Test - Every required field filled');
            done();
          });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            status_text: 'In QA',
            assigned_to: 'Example test user'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.err, err);
            done();
          });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: "5e612789e8738a52ae689a84"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "no updated field sent");
            done();
          });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: "5e612789e8738a52ae689a84",
            issue_title: "Functional test - One field to update"
          })
          .end(function(err, res) {
            if (err) {
              assert.equal(res.body, `could not update 5e612789e8738a52ae689a84`);
              done();
            }
            assert.equal(res.status, 200);
            assert.equal(res.body, 'successfully updated 5e612789e8738a52ae689a84');
            done();
          });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: "5e612789e8738a52ae689a84",
            issue_title: "Functional test - Multiple fields to update",
            issue_text: "Updating multiple fields",
            created_by: "Chai and Mocha",
            assigned_to: "Chai and Mocha",
            status_text: "In QA"
          })
          .end(function(err, res) {
            if (err) {
              assert.equal(res.body, 'could not update 5e612789e8738a52ae689a84');
              done();
            }
            assert.equal(res.status, 200);
            assert.equal(res.body, 'successfully updated 5e612789e8738a52ae689a84');
            done();
          })
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({created_by: 'Chai and Mocha'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            assert.equal(res.body[0].created_by, 'Chai and Mocha');
            done();
          });
        
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({
            assigned_to: 'Chai and Mocha',
            status_text: 'In QA',
            open: true
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            assert.equal(res.body[0].assigned_to, 'Chai and Mocha');
            assert.equal(res.body[0].status_text, 'In QA');
            assert.equal(res.body[0].open, true);
            done();
          });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({})
          .end(function(err, res) {
            assert.equal(res.body, '_id error');
            done();
          });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({_id: "5e615db5f10b0f52da5c8fe8"})
          .end(function(err, res) {
            if (err) {
              assert.equal(res.body, 'could not delete 5e615db5f10b0f52da5c8fe8');
              done();
            }
            assert.equal(res.status, 200);
            assert.equal(res.body, 'deleted 5e615db5f10b0f52da5c8fe8');
            done();
          })
      });
      
    });

});