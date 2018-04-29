// SERVER SOCKET

const { events } = require('../../client/utils/constants');
const store = require('../store');
const { playersInc, playersDec } = require('../store/game');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`);

    socket.on(events.playersInc, () => {
      store.dispatch(playersInc());
      io.emit(events.updatePlayers, store.getState().game.players);
    });

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`);
      store.dispatch(playersDec());
      io.emit(events.updatePlayers, store.getState().game.players);
    });
  });
};
