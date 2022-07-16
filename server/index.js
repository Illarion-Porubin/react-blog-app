import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth.js";
import { validationResult } from "express-validator";
import UserModel from "./models/User.js";

// если в type указан module, то импортируем файлы с указанием расширения "./validations/auth.js"

mongoose.connect(`mongodb+srv://NewAdmin:admin123@cluster0.idhsh.mongodb.net/blog?retryWrites=true&w=majority`)
  .then(() => console.log(`DB ok`))
  .catch((err) => console.log(`DB error`, err))


const app = express();
app.use(express.json());

app.post('/auth/login', async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return req.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      return req.status(404).json({
        message: 'Неверный логин или пароль',
      })
    }
  } catch (error) {

  }
})

app.post('/auth/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(8);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    })

    const user = await doc.save();
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'sectret123',
      {
        expiresIn: '30d',
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    })


  } catch (error) {
    console.log(err);
    res.status(500).json({
      message: `Не удалось зарегистрироваться`
    });
  }
});


app.listen(4444, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log(`Server OK`)
});