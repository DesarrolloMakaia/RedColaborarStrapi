'use strict';

/**
 * google-analytic service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::google-analytic.google-analytic');
