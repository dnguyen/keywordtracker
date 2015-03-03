var server = require('net').createServer();
var emitter = require('./Emitter.js');
var socketio = require('socket.io');

var IOServer = function(options) {
    var self = this;
    this.io = socketio(options.server);
    this.io.on('connection', function(socket){
        console.log('socket io connection recieved');
        emitter.on('trackhit', function(data) {
            self.newTrackHit(socket, data)
        });
    });
};

/**
 *
 * @return {[type]} [description]
 */
IOServer.prototype.newTrackHit = function(socket, data) {
    console.log('newTrackHit event');
    socket.emit('trackhit', data);
};

module.exports = IOServer;