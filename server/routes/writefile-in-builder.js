const Boom = require('boom')
const fs = require('fs');
const FileSystemObject = require('../file-system-object')

// websocket is based on TCP, so multiple websocket requests will arrive in order
// but on the server side, we cannot guarantee that fs write and read stat callback will
// be triggered before the fs watcher callback
// so we use sync call if user use ui builder in noide
module.exports = {
    method: 'PUT',
    path: '/writefile-in-builder',
    config: {
        handler: function (request, reply) {
            const { path, contents } = request.payload;
            try {
                fs.writeFileSync(path, contents, 'utf8');
                const stat = fs.statSync(path);
                return reply(new FileSystemObject(path, stat));
            } catch (err) {
                return reply(Boom.badRequest('Write file failed', err));
            }
        }
    }
};
