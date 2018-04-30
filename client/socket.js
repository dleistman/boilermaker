// CLIENT SOCKET

import io from 'socket.io-client';
import { select } from 'd3-selection';

import { store, updatePlayers, updateMap } from './store';
import { createLocalGame, endGame } from './utils/gameLogic';
import { colors } from './utils/constants';

const { dispatch, getState } = store;

const socket = io(window.location.origin);

socket.on('connect', () => {
  console.log('Connected!');

  socket.on('update-players', (numPlayers) => {
    store.dispatch(updatePlayers(numPlayers));
  });

  socket.on('send-game', serverGame => {
    // if there is NOT a current game
    if (!serverGame.isCurrentGame) {
      // create a new game here
      createLocalGame('collab');
    } else {
      const { gameYear, secondsRemaining } = serverGame;
      const isGameOnServer = true;
      createLocalGame('collab', gameYear, secondsRemaining, isGameOnServer);
    }
  });

  socket.on('new-game', () => {
    const { isCurrentGame, isFirstGame } = getState().game;
    if (!isCurrentGame && !isFirstGame) {
      socket.emit('fetch-game');
    }
  });

  socket.on('toggle-state', ({ stateId, party }) => {
    const { isCurrentGame } = getState().game;
    if (isCurrentGame) {
      let newColor;

      if (party === 'democrat') {
        dispatch(updateMap(stateId, 'Democrat'));
      } else if (party === 'republican') {
        dispatch(updateMap(stateId, 'Republican'));
      }

      newColor = colors[party.toLowerCase()];

      select(`#state${stateId}`)
        .style('fill', newColor);
    }
  });

  socket.on('end-game', () => {
    const { isCurrentGame } = getState().game;
    if (isCurrentGame) {
      console.log('calling gameEnd from ln60 in client socket');
      endGame();
    }
  });

});

export default socket;
