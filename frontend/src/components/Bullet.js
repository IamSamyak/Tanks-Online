import React from 'react';
import bulletImg from '../assets/bullet.png';

const Bullet = ({ bullet }) => {
    const bulletStyle = {
        position: 'absolute',
        width: '16px',
        height: '16px',
        transform: (() => {
            switch (bullet.direction) {
                case 'up': return 'rotate(-90deg)';
                case 'down': return 'rotate(90deg)';
                case 'left': return 'rotate(180deg)';
                case 'right': return 'rotate(0deg)';
                default: return 'rotate(0deg)';
            }
        })(),
    };

    switch (bullet.direction) {
        case 'up':
            bulletStyle.left = `${bullet.col * 32 + 24}px`;
            bulletStyle.top = `${bullet.row * 32}px`;
            break;
        case 'down':
            bulletStyle.left = `${bullet.col * 32 + 24}px`;
            bulletStyle.top = `${bullet.row * 32 + 32}px`;
            break;
        case 'left':
            bulletStyle.left = `${bullet.col * 32}px`;
            bulletStyle.top = `${bullet.row * 32 + 24}px`;
            break;
        case 'right':
            bulletStyle.left = `${bullet.col * 32 + 32}px`;
            bulletStyle.top = `${bullet.row * 32 + 24}px`;
            break;
        default:
            bulletStyle.left = `${bullet.col * 32 + 24}px`;
            bulletStyle.top = `${bullet.row * 32 + 24}px`;
            break;
    }

    return <img src={bulletImg} alt="bullet" style={bulletStyle} />;
};

export default Bullet;
