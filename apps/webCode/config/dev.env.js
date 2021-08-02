'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_BASEURL: '"http://47.115.7.143:8080"',/* 正式环境 */
})
