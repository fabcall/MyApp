jest.mock('react-native-config', () => ({
  ENV: 'test',
  BASE_URL: 'https://jsonplaceholder.typicode.com/',
}));
