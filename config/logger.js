'use strict';
const {  winston,  formats: { prettyPrint, levelFilter },} = require('@strapi/logger');

module.exports = ({ strapi }) => ({
  transports: [
    new winston.transports.Console({
      level: 'silly',
      defaultMeta: { service: 'user-service' },
      format: winston.format.combine(
        winston.format.json(),
        prettyPrint({ timestamps: 'YYYY-MM-DD hh:mm:ss.SSS' })
      ),
    }),
    
  ],
});