const Nes = require('nes/client');
const host = window.location.host;
const client = new Nes.Client('ws://' + host);

module.exports = client;
