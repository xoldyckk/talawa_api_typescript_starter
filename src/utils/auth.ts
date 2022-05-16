import jwt from 'jsonwebtoken';

export const createAccessToken = async (user: any) => {
  const userId = user.id;
  return jwt.sign(
    {
      tokenVersion: user.tokenVersion,
      userId,
      firstName: user._doc.firstName,
      lastName: user._doc.lastName,
      email: user._doc.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
};

export const createRefreshToken = async (user: any) => {
  const userId = user.id;
  return jwt.sign(
    {
      tokenVersion: user.tokenVersion,
      userId,
      firstName: user._doc.firstName,
      lastName: user._doc.lastName,
      email: user._doc.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' }
  );
};

export default { createAccessToken, createRefreshToken };
