'use strict';

const IssueModel = require('../models.js').Issue
const ProjectModel = require('../models.js').Project

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get( async (req, res) => {
      let project = req.params.project;
      let resultProject = await ProjectModel.findOne({ name: project })
      let resultIssues = await IssueModel.find({project_id: resultProject._id, ...req.query})
      res.json(resultIssues)
    })
    
    .post(async (req, res) => {
      let project = req.params.project;
      let {issue_title, issue_text, created_by, assigned_to = '', status_text = ''} = req.body
      // check if project exist
      let resultProject = await ProjectModel.findOne({ name: project })
      // if project not exist then create
      if(!resultProject) {
        resultProject = await ProjectModel.create({ 
          name: project
        }).then(result=>result)
      }  
      // create issue
      const resultIssue = await IssueModel.create({ 
        project_id: resultProject._id,
        issue_title, 
        issue_text, 
        created_by, 
        assigned_to,
        status_text, 
        created_on: new Date().toISOString(),
        updated_on: new Date().toISOString(),
        open: true,
      }).then(result=>result)
      .catch(err=>{
        res.json({ error: 'required field(s) missing' })
      })
      res.json(resultIssue) 
    })
    
    .put(async (req, res) => {
      let project = req.params.project;
      let issueId = req.body._id;

      if (Object.keys(req.body).length <= 1 && issueId) { // check if req contains body
        res.json({error: 'no update field(s) sent', '_id': issueId })
        return;
      } else if (!issueId) { // check if put req contains _id
        res.json({error: 'missing _id'})
        return;
      } 

      // check if req _id is valid
      try {
        let resultIssue = await IssueModel.findOne({ _id: issueId })
        if(!resultIssue) {
          res.json({error: 'could not update' , '_id': issueId })
          return;
        }
      } catch (err) {
        res.json({error: 'could not update' , '_id': issueId })
        return;
      }

      try {
        let resultIssue = await IssueModel.updateOne({_id:issueId}, {
          ...req.body,
          updated_on: new Date().toISOString(),
        })
        if (resultIssue.matchedCount >= 1) {
          res.json({result: 'successfully updated', '_id': issueId })
        }
      } catch (err) {
        res.json({error: 'could not update' , '_id': issueId })
      }
    })
    
    .delete( async (req, res) => {
      let issueId = req.body._id

      // check if req has _id 
      if (!issueId) {
        res.json({ error: 'missing _id' })
        return
      }

      // check if req _id exist
      try {
        let resultIssue = await IssueModel.findOne({_id:issueId})
        if(!resultIssue) {
          res.json({ error: 'could not delete', '_id': issueId })
        }
      } catch (err) {
        res.json({ error: 'could not delete', '_id': issueId })
        return
      }

      // delete one
      try {
        let resultIssue = await IssueModel.deleteOne({_id:issueId})
        if(resultIssue) {
          res.json({ result: 'successfully deleted', '_id': issueId })
          return
        }
      } catch (err) {
        res.json({ error: 'could not delete', '_id': issueId })
        return
      }
    });
    
};
