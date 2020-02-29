const { validationResult } = require('express-validator');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'First Post',
        content: 'This is the first post!',
        imageUrl: 'image/1DX_MARKIII.png',
        creator: {
          name: 'Mark',
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: 'Validation failed', errors: errors.array() });
  }

  const title = req.body.title;
  const content = req.body.content;

  res.status(201).json({
    posts: {
      message: 'Post created successfully!',
      post: {
        id: new Date().toISOString(),
        title: title,
        content: content,
        creator: {
          name: 'Mark',
        },
        createdAt: new Date(),
      },
    },
  });
};
