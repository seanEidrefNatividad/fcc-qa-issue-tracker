const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
const testId = "6796fdfa8be4a5a167c59f2e";

suite('Functional Tests', function() {
  suite('Routing Tests', function() {
    suite('POST /api/issues/:project', function() {
      test('Create an issue with every field', function (done) {
        chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: 'title',
          issue_text: 'text',
          created_by: 'created by',
          assigned_to: 'assigned to',
          status_text: 'status text',
        })
        .end((err,res) => {
          assert.equal(res.status, '200')
          assert.equal(res.body.issue_title, 'title')
          assert.equal(res.body.issue_text, 'text')
          assert.equal(res.body.created_by, 'created by')
          assert.equal(res.body.assigned_to, 'assigned to')
          assert.equal(res.body.status_text, 'status text')
          done();
        })
      })
      test('Create an issue with only required fields', function (done) {
        chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
          'issue_title': 'title',
          'issue_text': 'text',
          'created_by': 'assigned to',
        })
        .end((err,res) => {
          assert.equal(res.status, '200')
          assert.equal(res.body.issue_title, 'title')
          assert.equal(res.body.issue_text, 'text')
          assert.equal(res.body.created_by, 'assigned to')
          done();
        })
      })
      test('Create an issue with missing required fields', function (done) {
        chai
        .request(server)
        .post('/api/issues/apitest')
        .end((err,res) => {
          assert.equal(res.status, '200')
          assert.equal(res.body.error, 'required field(s) missing')
          done();
        })
      })
    });
    suite('GET /api/issues/:project', function () {
      test('View issues on a project', function (done) {
        chai
        .request(server)
        .get('/api/issues/apitest')
        .end((err,res) => {
          assert.equal(res.status, '200')
          done()
        })
      })
      test('View issues on a project with one filter', function (done) {
        chai
        .request(server)
        .get('/api/issues/apitest')
        .query({open: true})
        .end((err,res) => {
          assert.equal(res.status, '200')
          assert.equal(res.body[0].open, true)
          done()
        })
      })
      test('View issues on a project with multiple filters', function (done) {
        chai
        .request(server)
        .get('/api/issues/apitest')
        .query({open:true, assigned_to: "assigned to"})
        .end((err,res) => {
          assert.equal(res.status, '200')
          assert.equal(res.body[0].open, true)
          done()
        })
      })
    })
    suite('PUT /api/issues/:project', function () {
      test('Update one field on an issue', function(done) {
        chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id:testId, 
          open: false
        })
        .end((err,res) => {
          assert.equal(res.status, '200')
          assert.equal(res.body.result, "successfully updated" )
          assert.equal(res.body._id, testId)
          done();
        })
      })
      test('Update multiple fields on an issue', function(done) {
        chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id:testId, 
          issue_title: 'new',
          issue_text: 'new',
          created_by: 'new',
          assigned_to: 'new',
          status_text: 'new',
          open: true
        })
        .end((err,res) => {
          assert.equal(res.status, '200')
          assert.equal(res.body.result, "successfully updated" )
          assert.equal(res.body._id, testId)
          done();
        })
      })
      test('Update an issue with missing _id', function(done) {
        chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          open: true
        })
        .end((err,res) => {
          assert.equal(res.status, '200')
          assert.equal(res.body.error, "missing _id" )
          done();
        })
      })
      test('Update an issue with no fields to update', function(done) {
        chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id:testId, 
        })
        .end((err,res) => {
          assert.equal(res.status, '200')
          assert.equal(res.body.error, 'no update field(s) sent')
          assert.equal(res.body._id, testId)
          done();
        })
      })
      test('Update an issue with an invalid _id', function(done) {
        chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id:'123', 
          open: true
        })
        .end((err,res) => {
          assert.equal(res.status, '200')
          assert.equal(res.body.error, 'could not update')
          assert.equal(res.body._id, '123')
          done();
        })
      })
    })
    suite('Delete /api/issues/:project', function () {
      test('Delete an issue', function(done) {
        chai
        .request(server)
        .delete('/api/issues/apitest')
        .send({
          _id:'679717ac371440a5ce666741', 
        })
        .end((err,res) => {
          assert.equal(res.status, '200')
          assert.equal(res.body.result, "successfully deleted" )
          assert.equal(res.body._id, '679717ac371440a5ce666741')
          done();
        })
      })
      test('Delete an issue with an invalid _id', function(done) {
        chai
        .request(server)
        .delete('/api/issues/apitest')
        .send({
          _id:'123', 
        })
        .end((err,res) => {
          assert.equal(res.status, '200')
          assert.equal(res.body.error, "could not delete" )
          assert.equal(res.body._id, '123')
          done();
        })
      })
      test('Delete an issue with missing _id', function(done) {
        chai
        .request(server)
        .delete('/api/issues/apitest')
        .end((err,res) => {
          assert.equal(res.status, '200')
          assert.equal(res.body.error, 'missing _id' )
          done();
        })
      })
    });
  });
});
