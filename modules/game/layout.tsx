import clsx from 'clsx';
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
  const [user, setUser] = useState('');
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
      user: user,
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
      <input
        type="text"
        className={clsx(
          'px-2',
          'py-1',
          'placeholder-gray-400',
          'text-gray-600',
          'relative',
          'bg-white bg-white',
          'rounded',
          'text-sm',
          'border border-gray-400',
          'outline-none',
          'focus:outline-none focus:ring',
          'w-full',
        )}
        name="user"
        id="user"
        onChange={(e) => setUser(e.target.value)}
      />
      <div>{`El usuario usado es: ${user}`}</div>
      <div>{`En el room: ${room}`}</div>
      <div className="grid grid-cols-3">
        <div
          role="button"
          className=""
          onClick={() => handleSelectHand(handOptions.rock)}
        >
          <figure>
            <img src={'/assets/rock.png'} alt="" className="w-full" />
          </figure>
          <h2 className="text-center">Rock</h2>
        </div>
        <div
          role="button"
          className="card-item"
          onClick={() => handleSelectHand(handOptions.paper)}
        >
          <figure>
            <img src={'/assets/paper.png'} alt="" className="w-full" />
          </figure>
          <h2 className="text-center">Paper</h2>
        </div>
        <div
          role="button"
          className="card-item"
          onClick={() => handleSelectHand(handOptions.scissors)}
        >
          <figure>
            <img src={'/assets/scissors.png'} alt="" className="w-full" />
          </figure>
          <h2 className="text-center">Scissors</h2>
        </div>
      </div>
    </div>
  );
};

export default GameLayout;
