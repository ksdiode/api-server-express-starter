import User from '../models/User.js';

// 사용자 등록
export const register = async (req, res) => {
  try {
    const user = User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 로그인
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error, token, user } = User.checkPassword(email, password);
    if (error) {
      return res
        .status(400)
        .json({ msg: '잘못된 email이거나 비밀번호가 맞지 않습니다.' });
    }

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
