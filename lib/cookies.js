import cookie from 'cookie';

const MAX_AGE = 7 * 24 * 60 * 60;

export const setTokenCookie = (token, res) => {
  const newCookie = cookie.serialize('token', token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    path: '/',
  });
  res.setHeader('Set-Cookie', newCookie);
};

export const removeTokenCookie = (res) => {
  const newCookie = cookie.serialize('token', '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', newCookie);
};
