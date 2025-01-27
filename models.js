const mongoose = require("mongoose")

const Issue = mongoose.model('Issue', {
  project_id: {type: String, required: true },
  issue_title: {type: String, required: true },
  issue_text: {type: String, required: true },
  created_by: {type: String, required: true },
  assigned_to: String,
  status_text: String,
  created_on: Date,
  updated_on: Date,
  open: Boolean,
});

const Project = mongoose.model('Project', {
  name: {type: String, required: true }
});

exports.Issue = Issue;
exports.Project = Project;