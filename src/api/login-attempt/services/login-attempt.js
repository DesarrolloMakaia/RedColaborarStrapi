'use strict';

/**
 * login-attempt service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::login-attempt.login-attempt');
