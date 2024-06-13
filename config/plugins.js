module.exports = ({ env }) => ({
  email: {
     config: {
       provider: 'amazon-ses',
       providerOptions: {
         key: env('AWS_SES_KEY'),
         secret: env('AWS_SES_SECRET'),
         amazon:  env('AWS_SES_ZONE'),
       },
       settings: {
         defaultFrom: env('AWS_SES_FROM'),
         defaultReplyTo: env('AWS_SES_REPLYTO'),
       },
     },
   },
   upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        params: {
          Bucket: env('AWS_BUCKET'),
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
 'transformer': {
  enabled: true,
  config: {
    prefix: '/api/',
    responseTransforms: {
      removeAttributesKey: true,
      removeDataKey: true,
    }
  }
}
 });