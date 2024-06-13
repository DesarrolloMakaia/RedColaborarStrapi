'use strict';

/**
 * login-attempt router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::login-attempt.login-attempt');
