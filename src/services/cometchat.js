export const createAccount = async ({ cometChat, id, fullname, avatar }) => {
  const authKey = `${process.env.REACT_APP_COMETCHAT_AUTH_KEY}`;
  const user = new cometChat.User(id);
  user.setName(fullname);
  user.setAvatar(avatar);
  return await cometChat.createUser(user, authKey);
};

export const login = async (cometChat, user) => {
  if (!user) return;
  const authKey = `${process.env.REACT_APP_COMETCHAT_AUTH_KEY}`;
  return await cometChat.login(user.id, authKey);
};
