const { param } = require('express-validator');

exports.checkIdParamValidator = [
    param('id').isMongoId().withMessage('Invalid Object ID format'),
];
