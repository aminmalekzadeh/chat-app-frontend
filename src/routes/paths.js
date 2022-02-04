function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_CHAT = '/chat';

// ----------------------------------------------------------------------


const ROOTS_AUTH = '/';


// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify')
};

export const PATH_CHAT = {
  root: ROOTS_CHAT,
  chat: {
    root: path(ROOTS_CHAT, '/chat'),
    new: path(ROOTS_CHAT, '/new'),
    conversation: path(ROOTS_CHAT, '/:conversationKey')
  }
};

