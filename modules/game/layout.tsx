import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://127.0.0.1:8089';

const handOptions = {
  rock: 'Rock',
  paper: 'Paper',
  scissors: 'Scissors',
};

const handKeyOptions = [
  {
    id: handOptions.rock,
    key: 'r',
  },
  {
    id: handOptions.paper,
    key: 'p',
  },
  {
    id: handOptions.scissors,
    key: 's',
  },
];

const GameLayout: NextPage = () => {
  const [response, setResponse] = useState('');
  const [socket, setSocket] = useState(socketIOClient(ENDPOINT));
  const [socketConnected, setSocketConnected] = useState(false);
  const [hand, setHand] = useState('');
  const [userForm, setUserForm] = useState({
    user: '',
  });
  const room = 909;

  useEffect(() => {
    // socket = socketIOClient(ENDPOINT);
    setSocket(socketIOClient(ENDPOINT));

    // CLEAN UP THE EFFECT
    return () => {
      socket ? socket.disconnect() : null;
    };
  }, []);

  // subscribe to the socket event
  useEffect(() => {
    if (!socket) return;
    socket.on('connect', () => {
      setSocketConnected(socket.connected);
    });
    const newLocal = 'winner';
    // console.log('wut');
    socket.on(newLocal, (data) => {
      setResponse(data);
      console.log('response', response);
    });
    socket.on('disconnect', () => {
      setSocketConnected(socket.connected);
    });
  }, [socket]);

  const handleEmmit = () => {
    console.log('emit');
    // const socket = socketIOClient(ENDPOINT);
    socket.emit('chosedHands', {
      room,
      user: userForm.user,
      hand,
    });
  };

  const handleSelectHand = (handSelected: string) => {
    setHand(handSelected);
  };

  return (
    <div>
      <h1>{`Hand selected: ${hand}`}</h1>
      <button onClick={handleEmmit} type="button">
        Emite
      </button>
      type="text"
      <input
        name="user"
        id="user"
        onChange={(e) => setUserForm({ user: e.target.value })}
      />
      <div>{`El usuario usado es: ${userForm.user}`}</div>
      <div>{`En el room: ${room}`}</div>
      <div className="card-container">
        <div
          role="button"
          className="card-item"
          onClick={(e) => handleSelectHand(handOptions.rock)}
        >
          <figure>
            <img
              src={`${process.env.PUBLIC_URL}/assets/rock.png`}
              alt=""
              className="w-100"
            />
          </figure>
          <h2 className="text-center">Rock</h2>
        </div>
        <div
          role="button"
          className="card-item"
          onClick={(e) => handleSelectHand(handOptions.paper)}
        >
          <figure>
            <img
              src={`${process.env.PUBLIC_URL}/assets/paper.png`}
              alt=""
              className="w-100"
            />
          </figure>
          <h2 className="text-center">Paper</h2>
        </div>
        <div
          role="button"
          className="card-item"
          onClick={(e) => handleSelectHand(handOptions.scissors)}
        >
          <figure>
            <img
              src={`${process.env.PUBLIC_URL}/assets/scissors.png`}
              alt=""
              className="w-100"
            />
          </figure>
          <h2 className="text-center">Scissors</h2>
        </div>
      </div>
    </div>
  );
};

export default GameLayout;
