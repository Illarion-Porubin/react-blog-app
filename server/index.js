import express from "express";
import mongoose from "mongoose";
import { handleValidationErrors, checkAuth } from "./utils/index.js";
import { registerValidation, loginValidation, postCreateValidation } from "./validations/validations.js";
import cors from 'cors'
import { UserController, PostController } from "./controllers/index.js";
import multer from "multer";

mongoose.connect(`mongodb+srv://NewAdmin:admin123@cluster0.idhsh.mongodb.net/blog?retryWrites=true&w=majority`)
  .then(() => console.log(`DB ok`))
  .catch((err) => console.log(`DB error`, err))

const app = express();

app.use(cors())

app.use(express.json());

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

app.use('/uploads', express.static('uploads')) //объясняем express, что будем взаимодействовать со статичными файлами

app.post('/upload', upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});


app.post('/auth/login',
  loginValidation,
  handleValidationErrors,
  UserController.login);
app.post('/auth/register',
  registerValidation,
  handleValidationErrors,
  UserController.register);
app.post('/posts',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create);

app.get('/tags', PostController.getLastTags);
app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.get('/auth/me', checkAuth, UserController.getMe);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update);


app.listen(4444, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log(`Server OK`)
});

