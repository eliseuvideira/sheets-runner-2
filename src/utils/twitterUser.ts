let userId: string;

export const twitterUser = {
  getUserId: () => userId,
  setUserId: (id: string) => {
    userId = id;
  },
};
