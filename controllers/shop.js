const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const io = require('../socket');
const Post = require('../models/post');
const User = require('../models/user');
const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 10;

  try {
    const totalItems = await Product.find().countDocuments();
    const products = await Product.find()
      .populate('seller')
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    console.log(products);

    res.status(200).json({
      message: 'Fetched posts successfully.',
      products: products,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getMyProducts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 10;

  try {
    const totalItems = await Product.find().countDocuments();
    const products = await Product.find()
      .populate('seller')
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    console.log(products);

    res.status(200).json({
      message: 'Products fetched successfully.',
      products: products,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addProduct = (req, res, next) => {
  console.log(req);
  let theSeller;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const imageUrl = req.file.path.replace('\\', '/');
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    seller: req.userId,
  });

  console.log('Product: ' + product);

  product
    .save()
    .then(result => {
      return User.findById(req.userId);
    })
    .then(user => {
      theSeller = user;
      user.products.push(product);
      return user.save();
    });
  then(user => {
    console.log('User: ' + user);
    res.status(201).json({
      message: 'Product is added successfully!',
      product: product,
      seller: { _id: theSeller._id, name: theSeller.firstname },
    });
  });
};

// exports.createPost = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error('Validation failed, entered data is incorrect.');
//     error.statusCode = 422;
//     throw error;
//   }

//   if (!req.file) {
//     const error = new Error('No image provided.');
//     error.statusCode = 422;
//     throw error;
//   }

//   const imageUrl = req.file.path.replace('\\', '/');
//   const title = req.body.title;
//   const content = req.body.content;

//   const post = new Post({
//     title: title,
//     content: content,
//     imageUrl: imageUrl,
//     creator: req.userId,
//   });

//   /* post
//     .save()
//     .then(result => {
//       return User.findById(req.userId);
//     })
//     .then(user => {
//       creator = user;
//       user.posts.push(post);
//       return user.save();
//     })
//     .then(user => {
//       io.getIO().emit('posts', {
//         action: 'create',
//         post: {
//           ...post._doc,
//           creator: { _id: req.userId, name: user.firstname },
//         },
//       });
//       res.status(201).json({
//         message: 'Post created successfully!',
//         post: post,
//         creator: { _id: creator._id, name: creator.name },
//       });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     }); */

//   try {
//     await post.save();
//     const user = await User.findById(req.userId);
//     console.log(user);
//     user.posts.push(post);
//     await user.save();
//     io.getIO().emit('posts', {
//       action: 'create',
//       post: {
//         ...post._doc,
//         creator: { _id: req.userId, name: user.firstname },
//       },
//     });
//     res.status(201).json({
//       message: 'Post created successfully!',
//       post: post,
//       creator: { _id: user._id, name: user.firstname },
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// /* exports.getPost = (req, res, next) => {
//   const postId = req.params.postId;
//   let postCollected;
//   Post.findById(postId)
//     .then(post => {
//       if (!post) {
//         const error = new Error('Could not find post.');
//         error.statusCode = 404;
//         throw error;
//       }
//       console.log(post.creator);
//       postCollected = post;
//       return post.creator;
//       //res.status(200).json({ message: 'Post fetched.', post: post });
//     })
//     .then(creator => {
//       User.findById(creator);
//     })
//     .then(user => {
//       console.log(user);
//       res.status(200).json({
//         message: 'Post fetched.',
//         post: postCollected,
//         creator: user,
//       });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// }; */

// exports.getPost = async (req, res, next) => {
//   const postId = req.params.postId;
//   const post = await Post.findById(postId).populate('creator');
//   console.log(post);
//   try {
//     if (!post) {
//       const error = new Error('Could not find post.');
//       error.statusCode = 404;
//       throw error;
//     }
//     res.status(200).json({ message: 'Post fetched.', post: post });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// exports.updatePost = (req, res, next) => {
//   const postId = req.params.postId;
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error('Validation failed, entered data is incorrect.');
//     error.statusCode = 422;
//     throw error;
//   }
//   const title = req.body.title;
//   const content = req.body.content;
//   let imageUrl = req.body.image;
//   if (req.file) {
//     imageUrl = req.file.path.replace('\\', '/');
//   }

//   if (!imageUrl) {
//     const error = new Error('No file picked.');
//     error.statusCode = 422;
//     throw error;
//   }

//   Post.findById(postId)
//     .populate('creator')
//     .then(post => {
//       if (!post) {
//         const error = new Error('Could not find post.');
//         error.statusCode = 404;
//         throw error;
//       }

//       if (post.creator._id.toString() !== req.userId) {
//         const error = new Error('Not authorized');
//         error.statusCode = 403;
//         throw error;
//       }

//       if (imageUrl !== post.imageUrl) {
//         clearImage(post.imageUrl);
//       }

//       post.title = title;
//       post.imageUrl = imageUrl;
//       post.content = content;
//       return post.save();
//     })
//     .then(result => {
//       io.getIO().emit('posts', { action: 'update', post: result });
//       res.status(200).json({ message: 'Post updated.', post: result });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };

// exports.deletePost = (req, res, next) => {
//   const postId = req.params.postId;
//   Post.findById(postId)
//     .then(post => {
//       if (!post) {
//         const error = new Error('Could not find post.');
//         error.statusCode = 404;
//         throw error;
//       }

//       if (post.creator.toString() !== req.userId) {
//         const error = new Error('Not authorized');
//         error.statusCode = 403;
//         throw error;
//       }

//       //Check logged in user
//       clearImage(post.imageUrl);
//       return Post.findByIdAndRemove(postId);
//     })
//     .then(result => {
//       return User.findById(req.userId);
//     })
//     .then(user => {
//       user.posts.pull(postId);
//       return user.save();
//     })
//     .then(result => {
//       io.getIO().emit('posts', { action: 'delete', post: postId });
//       res.status(200).json({ message: 'Deleted post.' });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };

// const clearImage = filePath => {
//   filePath = path.join(__dirname, '..', filePath);
//   fs.unlink(filePath, err => console.log(err));
// };
