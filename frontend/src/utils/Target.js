export const getClosestTarget = (enemyPosition, targets) => {
    let closestTarget = null;
    let minDistance = Infinity;
  
    targets.forEach(target => {
      const distance = Math.sqrt(
        Math.pow(enemyPosition.row - target.row, 2) + Math.pow(enemyPosition.col - target.col, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestTarget = target;
      }
    });
  
    return closestTarget;
  };
  
  export const getRandomDirection = () => {
    const directions = ['up', 'down', 'left', 'right'];
    return directions[Math.floor(Math.random() * directions.length)];
  };
  