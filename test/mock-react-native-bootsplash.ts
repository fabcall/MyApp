jest.mock('react-native-bootsplash', () => {
  return {
    hide: jest.fn().mockResolvedValueOnce(undefined),
    show: jest.fn().mockResolvedValueOnce(undefined),
    getVisibilityStatus: jest.fn().mockResolvedValue('hidden'),
  };
});
