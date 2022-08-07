import PostModel from "../models/Post.js"

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts.map(obj => obj.tags).flat().slice(0, 5)

    res.json(tags)
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: `Не удалось получить статьи`
    });
  }
}

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts)
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: `Не удалось получить статьи`
    });
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id // вытаскивем id 
    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 }
      },
      {
        returnDocument: `after`,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: `Не удалось вернуть статьи`
          });
        }
        console.log(doc)
        if (!doc) {
          return res.status(404).json({
            message: `Статья не найдена`
          });
        }
        res.json(doc)
      }
    )
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: `Не удалось получить статьи`
    });
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      imageUrl: req.body.imageUrl,
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      user: req.userId,
    })

    const post = await doc.save()

    res.json(post)
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: `Не удалось создать статью`
    });
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id // вытаскивем id 
    PostModel.findOneAndDelete({
      _id: postId,
    }, (err, doc) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: `Не удалось удалить статьи`
        });
      }
      if (!doc) {
        return res.status(404).json({
          message: `Статья не найдена`
        });
      }

      res.json({
        success: true,
      })
    })

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: `Не удалось получить статьи`
    });
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        imageUrl: req.body.imageUrl,
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        user: req.userId,
      },
    )
    res.json({
      success: true
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: `Не удалось обновить статьи`
    });
  }
}