// src/components/Tile.js
import React from 'react';
import brick from '../assets/brick.png';
import stone from '../assets/stone.png';
import bush from '../assets/bush.png';
import water from '../assets/water.png';
import ice from '../assets/ice.png';
import enemyA from '../assets/enemy_a.png';
import enemyB from '../assets/enemy_b.png';
import enemyC from '../assets/enemy_c.png';
import enemyD from '../assets/enemy_d.png';
import bonusGrenade from '../assets/bonus_grenade.png';
import bonusHelmet from '../assets/bonus_helmet.png';
import bonusClock from '../assets/bonus_clock.png';
import bonusShovel from '../assets/bonus_shovel.png';
import bonusTank from '../assets/bonus_tank.png';
import bonusStar from '../assets/bonus_star.png';
import bonusGun from '../assets/bonus_gun.png';
import bonusBoat from '../assets/bonus_boat.png';
import './Tile.css';

const images = {
  brick,
  stone,
  bush,
  water,
  ice,
  enemy_A: enemyA,
  enemy_B: enemyB,
  enemy_C: enemyC,
  enemy_D: enemyD,
  bonus_grenade: bonusGrenade,
  bonus_helmet: bonusHelmet,
  bonus_clock: bonusClock,
  bonus_shovel: bonusShovel,
  bonus_tank: bonusTank,
  bonus_star: bonusStar,
  bonus_gun: bonusGun,
  bonus_boat: bonusBoat,
};

const Tile = ({ type, style }) => {
  const backgroundImage = images[type] ? `url(${images[type]})` : 'none';
  if (type === 'empty') {
    return <div style={{ width: '32px', height: '32px', backgroundColor: 'black', ...style }} />;
  }
  return (
    <div className="tile" style={{ backgroundImage, backgroundSize: 'cover', ...style }} />
  );
};

export default Tile;
