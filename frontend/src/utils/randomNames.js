const firstNames = [
  'John', 'Emma', 'Michael', 'Sophia', 'William', 'Olivia', 'James', 'Ava',
  'Alexander', 'Isabella', 'Benjamin', 'Mia', 'Elijah', 'Charlotte', 'Lucas',
  'Amelia', 'Mason', 'Harper', 'Logan', 'Evelyn', 'Jacob', 'Abigail', 'Jackson',
  'Emily', 'Sebastian', 'Elizabeth', 'Jack', 'Sofia', 'Owen', 'Avery'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
];

export const getRandomName = () => {
  const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${randomFirstName} ${randomLastName}`;
}; 