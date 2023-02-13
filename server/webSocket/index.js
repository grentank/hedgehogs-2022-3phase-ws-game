const { WebSocketServer } = require('ws');
const { User } = require('../db/models');

const wss = new WebSocketServer({ clientTracking: false, noServer: true });

wss.on('connection', (ws, request, wsMap) => {
  const { id } = request.session.user;
  wsMap.set(id, { ws, user: request.session.user, game: {} }); // id -> ws

  for (const [, wsClient] of wsMap) {
    wsClient.ws.send(
      JSON.stringify({
        type: 'SET_ONLINE_FRIENDS',
        payload: Array.from(wsMap.values()).map((el) => el.user),
      }),
    );
  }

  ws.on('message', async (data) => {
    const { type, payload } = JSON.parse(data);

    switch (type) {
      case 'UPDATE_STATUS':
        {
          const user = await User.findByPk(id);
          user.status = payload;
          await user.save();

          wsMap.set(id, { ws, user });
          for (const [, wsClient] of wsMap) {
            wsClient.ws.send(
              JSON.stringify({
                type: 'SET_ONLINE_FRIENDS',
                payload: Array.from(wsMap.values()).map((el) => el.user),
              }),
            );
          }
        }
        break;
      case 'JOIN_GAME':
        {
          const user = await User.findByPk(id);
          wsMap.set(id, { ws, user, game: { gameId: payload, currentValue: 15 } });

          const gamersInRoom = [];
          for (const [, wsClient] of wsMap) {
            if (wsClient.game.gameId === payload) {
              gamersInRoom.push(wsClient);
            }
          }
          if (gamersInRoom.length === 2) {
            gamersInRoom.forEach((gamer, index) =>
              gamer.ws.send(
                JSON.stringify({
                  type: 'game/setGame',
                  payload: {
                    status: 'active',
                    currentValue: 15,
                    players: gamersInRoom.map((gamer) => gamer.user),
                    enemy:
                      wsMap.get(id).user === gamer.user
                        ? gamersInRoom[(index + 1) % 2].user
                        : gamersInRoom[index].user,
                    yourTurn: !!index,
                  },
                }),
              ),
            );
          }
        }
        break;
      case 'MOVE_MADE':
        {
          const user = await User.findByPk(id);
          // wsMap.set(id, { ws, user, game: { gameId: payload, currentValue: 15 } });
          const ourPlayer = wsMap.get(id);
          let enemyPlayer = {};
          for (const [, wsClient] of wsMap) {
            if (
              wsClient.game.gameId === ourPlayer.game.gameId &&
              wsClient.user.id !== ourPlayer.user.id
            ) {
              enemyPlayer = wsClient;
            }
          }
          console.log(enemyPlayer);
          ourPlayer.game.currentValue -= Number(payload);
          enemyPlayer.game.currentValue -= Number(payload);
          ourPlayer.ws.send(
            JSON.stringify({
              type: 'game/setGame',
              payload: {
                status: 'active',
                currentValue: ourPlayer.game.currentValue,
                players: [ourPlayer.user, enemyPlayer.user],
                enemy: enemyPlayer.user,
                yourTurn: false,
              },
            }),
          );
          enemyPlayer.ws.send(
            JSON.stringify({
              type: 'game/setGame',
              payload: {
                status: 'active',
                currentValue: enemyPlayer.game.currentValue,
                players: [ourPlayer.user, enemyPlayer.user],
                enemy: ourPlayer.user,
                yourTurn: true,
              },
            }),
          );
        }
        break;
      default:
        break;
    }
  });

  ws.on('error', () => {
    wsMap.delete(id);
    for (const [, wsClient] of wsMap) {
      wsClient.ws.send(
        JSON.stringify({
          type: 'SET_ONLINE_FRIENDS',
          payload: Array.from(wsMap.values()).map((el) => el.user),
        }),
      );
    }
  });

  ws.on('close', () => {
    wsMap.delete(id);
    for (const [, wsClient] of wsMap) {
      wsClient.ws.send(
        JSON.stringify({
          type: 'SET_ONLINE_FRIENDS',
          payload: Array.from(wsMap.values()).map((el) => el.user),
        }),
      );
    }
  });
});

module.exports = wss;
