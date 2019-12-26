const world = 'world';

const hello = (word: string = world): string => {
  return `Hello ${world}!`;
}

console.log(hello());