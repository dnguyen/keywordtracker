var server = require('net').createServer();
var emitter = require('./Emitter.js');
var socketio = require('socket.io');

var IOServer = function(options) {
    var self = this;
    this.io = socketio(options.server);
    this.io.on('connection', function(socket){
        console.log('socket io connection recieved');
        emitter.on('mentioned', function(data) {
            self.handleNewMention(socket, data)
        });
    });
};

/**
 * Emit mentioned socket event that includes the mention data.
 * @return {[type]} [description]
 */
IOServer.prototype.handleNewMention = function(socket, data) {
    socket.emit('mentioned', data);
};

module.exports = IOServer;