import { Button, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export default function GamePage() {
  const game = useSelector((store) => store.game);
  const [gameId, setGameId] = useState('');
  const dispatch = useDispatch();
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Typography>Room id:</Typography>
          <TextField
            id="standard-basic"
            label="Standard"
            variant="standard"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => dispatch({ type: 'JOIN_GAME', payload: gameId })}
          >
            Join
          </Button>
        </Grid>
      </Grid>
      {game.status === 'active' && (
        <Grid container>
          <Grid item xs={12}>
            <Typography>{game.currentValue}</Typography>
            <Button
              variant="contained"
              disabled={!game.yourTurn}
              onClick={() => dispatch({ type: 'MOVE_MADE', payload: 1 })}
            >
              -1
            </Button>
            <Button
              variant="contained"
              disabled={!game.yourTurn}
              onClick={() => dispatch({ type: 'MOVE_MADE', payload: 2 })}
            >
              -2
            </Button>
            <Button
              variant="contained"
              disabled={!game.yourTurn}
              onClick={() => dispatch({ type: 'MOVE_MADE', payload: 3 })}
            >
              -3
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
}
