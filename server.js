const Glupe = require('glupe');
const config = require('./config');
const sock = require('./server/file-system-watcher');
const appName = require('./package.json').name;
const fs = require('fs');
const path = require('path');
const opn = require('opn');

async function init() {
  const isDevEnv = require('./server/common').isDevEnv;
  config.server.port = await require("find-free-port")(config.server.port).then(([port]) => port);
  Glupe.compose(__dirname, config, function (err, server) {
    if (err) {
      throw err
    }

    const meta = {
      title: 'Noide',
      description: 'Web based code editor',
      keywords: 'code,nodejs,editor,browser',
      author: 'davidjamesstone@github.com',
      favicon: '/public/favicon.ico'
    };

    if (!isDevEnv) {
      const filePath = path.join(process.cwd(), 'noide.config.json');
      console.log(`noide.config.json file path is ${filePath}`);
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(path.join(process.cwd(), 'noide.config.json'));
        const settings = JSON.parse(data);
        config.settings = {
          ...config.settings,
          ...settings
        };
      } else {
        console.error('Cannot find config file, use default settings instead');
      }
    }

    const onPostHandler = function (request, reply) {
      const response = request.response
      if (response.variety === 'view') {
        if (!response.source.context) {
          response.source.context = {}
        }

        /*
         * Apply page meta data
         * to the view context data
         */
        var context = response.source.context
        context.meta = context.meta || {}

        for (var key in meta) {
          if (!context.meta[key]) {
            context.meta[key] = meta[key]
          }
        }
        context.settings = config.settings;
      }
      return reply.continue()
    }

    const preResponse = function (request, reply) {
      var response = request.response
      if (response.isBoom) {
        // An error was raised during
        // processing the request
        var statusCode = response.output.statusCode

        // In the event of 404
        // return the `404` view
        // if (statusCode === 404) {
        //   return reply.view('404').code(statusCode)
        // }

        request.log('error', {
          statusCode: statusCode,
          data: response.data,
          message: response.message
        })

        // The return the `500` view
        // return reply.view('500').code(statusCode)
      }
      return reply.continue()
    }

    server.ext('onPostHandler', onPostHandler)
    server.ext('onPreResponse', preResponse)

    /*
     * Start the server
     */
    server.start(function (err) {
      var details = {
        name: appName,
        uri: server.info.uri
      }

      if (err) {
        details.error = err
        details.message = 'Failed to start ' + details.name
        server.log('error', details)
        throw err
      } else {
        details.config = config;
        details.message = `Started ${details.name} on ${details.uri}`;
        server.log('info', details)
        console.info(details.message)

        if (config.settings.autoOpenBrowser) {
          opn(details.uri);
        }

        sock(server)
        server.subscription('/io')
        server.subscription('/io/pids')
      }
    })
  })
}

init();