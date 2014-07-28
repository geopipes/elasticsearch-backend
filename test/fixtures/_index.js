module.exports = {
  fields:         require('./fieldsQuery'),
  failedFields:   require('./fieldsFailedQuery'),
  get:            require('./getQuery'),
  mget:           require('./mgetQuery'),
  failedmget:     require('./mgetFailedQuery'),
  put:            require('./putQuery'),
  search:         require('./searchQuery'),
  genericfail:    require('./genericFailure')
}