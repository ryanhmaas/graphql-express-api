const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserAgentSchema = new Schema({
  userAgent: String,
  ipAddress: String,
  uaType: String,
  uaBrand: String,
  uaName: String,
  uaVersion: String,
  uaUrl: String,
  osName: String,
  osVersion: String,
  browserName: String,
  browserVersion: String,
  engineName: String,
  engineVersion: String,
  datetime: Date,
});

module.exports = mongoose.model('UserAgent', UserAgentSchema);
