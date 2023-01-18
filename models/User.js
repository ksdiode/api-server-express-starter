import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      max: 50,
      unique: true,
    },
    name: {
      type: String,
      require: true,
      min: 2,
      max: 50,
    },
    password: {
      type: String,
      require: true,
      min: 2,
    },
  },
  { timestamps: true }
);

async function encodePassword(password) {
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
}

UserSchema.statics.create = async function ({ email, name, password }) {
  password = encodePassword(password);
  const newUser = new this({ email, name, password });
  return await newUser.save();
};

UserSchema.statics.checkPassword = async function (email, password) {
  const user = await this.findOne({ email: email });
  if (!user) return { error: 'User does not exist. ' };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return { error: 'Invalid credentials. ' };

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  delete user.password;
  return { token, user };
};

const User = mongoose.model('User ', UserSchema);
export default User;
