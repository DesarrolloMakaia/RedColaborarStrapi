module.exports = ({ strapi }) => {
    const logType = {INFO:'INFO', WARNING: 'WARNING', ERROR: 'ERROR'};

    const parseJwt = (token) => {
        let tokenParts = token.split('.');
        if (tokenParts.length > 1)
            return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        else
            return { id: -1, tokenMessage: 'not parsed' }
    }

    const customStrinfy = (message) => {
        return JSON.stringify(message, null, 0);
    }
    const adminPaths = [
        "Information", 
        '/admin/project-settings',
        "/admin/api-tokens", 
        '/admin/webhooks', 
        '/admin/roles', 
        '/admin/users', 
        '/email/settings',
        "/upload/settings", 
        '/users-permissions/roles', 
        '/users-permissions/advanced'
    ]

    const setLog = (message, method, path) => {
        if (message.payload.hasOwnProperty('password')) message.payload.password='********';

        switch (method.toLowerCase()) {
            case "get":
                if (path = '/admin/api-tokens') {
                    console.log(customStrinfy({ ...message, EventType: "Authentication checks", ActionType: "Admin Tokens View", level:logType.INFO }));
                }
                if (path.includes('red-colaborar-rol')) {
                    console.log(customStrinfy({ ...message, EventType: "Authorization checks", ActionType: "Permission Check", level:logType.INFO }));
                    break;
                }
                if (path.includes("content-manager")) {
                    console.log(customStrinfy({ ...message, EventType: "Data Access", ActionType: "Admin content View", level:logType.INFO }));
                    break;
                }                
                if (adminPaths.some(admPath => path.includes(admPath))) {
                    console.log(customStrinfy({ ...message, EventType: "Administrator activity", ActionType: "View Strapi Settings", level:logType.INFO }));
                    break;
                }

            case "post":
                
                if (path.includes('batch-delete') || path.includes('bulk-delete') || path.includes('bulkDelete')) {
                    console.warn(customStrinfy({ ...message, EventType: "Data Deletions", ActionType: "Delete" }));
                    break;
                }
                if (path.includes('unpublish')){
                    console.log(customStrinfy({ ...message, EventType: "Data changes", ActionType: "Created Service Request", level:logType.WARNING }));
                    break;
                }
                if (path.includes('publish')){
                    console.log(customStrinfy({ ...message, EventType: "Data changes", ActionType: "Created Service Request", level:logType.INFO }));
                    break;
                }
                if (path.includes("service-request")) {
                    console.log(customStrinfy({ ...message, EventType: "Account management", ActionType: "Created Service Request", level:logType.INFO }));
                }
                if (path.includes("content-manager")) {
                    console.log(customStrinfy({ ...message, EventType: "Data creation", ActionType: "Admin content create", level:logType.INFO }));
                }
                if (path.includes("register")) {
                    console.warn(customStrinfy({ ...message, EventType: "Account management", ActionType: "User Register", level:logType.WARNING }));
                }                
                if (path === '/admin/login' || path.includes("auth")) {
                    message.payload.password = '********';
                    if (message.status.code === 404) {
                        console.warn(customStrinfy({ ...message, EventType: "Unsuccessful account logon Attempt", ActionType: "Failed Login", level:logType.WARNING }));
                    } else {
                        console.log(customStrinfy({ ...message, EventType: "Successful account logon Attempt", ActionType: "Success Login" }));
                    }
                    break;
                }
                if (path.includes('red-colaborar-roles')) {
                    console.log(customStrinfy({ ...message, EventType: "Privilege functions", ActionType: "Permissions Check", level:logType.INFO }));
                    break;
                }
                if (path === '/admin/users') {
                    console.warn(customStrinfy({ ...message, EventType: "Account management", ActionType: "User Invite", level:logType.WARNING }));
                }
                if (path=='/upload') {
                    console.warn(customStrinfy({ ...message, EventType: "Data creation", ActionType: "File create", level:logType.WARNING }));
                    break;
                }
                if (path=='/upload?') {
                    console.warn(customStrinfy({ ...message, EventType: "Data changes", ActionType: "File modified", level:logType.WARNING }));
                    break;
                }
                break;
            case "put":
                if (adminPaths.some(admPath => path.includes(admPath))) {
                    console.log(customStrinfy({ ...message, EventType: "Administrator activity", ActionType: "Admin Settings update" }));
                }
                if (path.includes("content-manager")) {
                    console.log(customStrinfy({ ...message, EventType: "Data changes", ActionType: "Admin content update" }));
                    break;
                }
                if (path.includes('red-colaborar-roles')) {
                    console.log(customStrinfy({ ...message, EventType: "Privilege functions", ActionType: "Permissions Check", level:logType.INFO }));
                    break;
                }
                if (path.includes('/users-permissions/roles')) {
                    console.log(customStrinfy({ ...message, EventType: "Policy changes", ActionType: "Admin API update" }));
                    break;
                }
                if (path.includes('users-permissions/email-templates')) {
                    console.log(customStrinfy({ ...message, EventType: "Data changes", ActionType: "Email template update" }));
                    break;
                }
                if (path.includes('/admin/users')) {
                    console.log(customStrinfy({ ...message, EventType: "Account management", ActionType: "Change User Settings", level:logType.INFO }));
                    break;
                }                
                if (path.includes('admin/roles/')) {
                    console.log(customStrinfy({ ...message, EventType: "Policy change", ActionType: "Updated user" }));
                    break;
                }

                break;
            default:
                console.log(customStrinfy({ ...message, EventType: "Uncategorized", ActionType: "Other action type" }));

        }
    };


    return async (ctx, next) => {

        let method = ctx.method;
        let pathUrl = ctx.url;
        let userId = 0;

        if (ctx.request.header.authorization && !ctx.request.header.authorization.includes('null'))
            userId = parseJwt(ctx.request.header.authorization).id
        let dataToLog = {
            method: ctx.method,
            userId: userId,
            timestamps: new Date().toISOString(),
            ip: ctx.request.headers['x-forwarded-for'] || ctx.request.headers['X-Real-IP'],
            payload: { ...ctx.request.body },
            path: ctx.request.url,
            env: ctx.app.env,

        };

        try {
            await next();
            let status = { code: ctx.response.status, message: ctx.response.message };
       
            if (userId > 0)
                setLog({ ...dataToLog, status }, method, pathUrl)
        } catch (error) {
            let statusError = { code: ctx.response.status, message: error.message };
            console.log(customStrinfy({ ...dataToLog, status:statusError, EventType: "Uncategorized", ActionType: "next function", level: logType.ERROR }));
            setLog({ ...dataToLog, status: statusError }, method, pathUrl);
        }

    };
};