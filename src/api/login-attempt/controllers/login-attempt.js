'use strict';

/**
 *  login-attempt controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::login-attempt.login-attempt');
