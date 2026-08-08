import jwt from 'jsonwebtoken';

export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'ZOMATO_3D_SUPER_SECRET_JWT_KEY_2026',
    { expiresIn: '30d' }
  );
};
