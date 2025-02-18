import React from 'react';
import explosionImg from '../assets/explosion.png';
import './Explosion.css'

const Explosion = ({ explosion }) => {
    return (
        <img
            src={explosionImg}
            alt="Explosion"
            className='explosion'
            style={{
                position: 'absolute',
                left: `${explosion.col * 32}px`,
                top: `${explosion.row * 32}px`,
                width: '32px',
                height: '32px',
                pointerEvents: 'none',
            }}
        />
    );
};

export default Explosion;
