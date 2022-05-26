const express = require('express');
const router = express.Router();
const storage = require('../middlewares/storage');
const { login, admin } = require('../middlewares');

const media = require('../controllers/mediaController');
const user = require('../controllers/userController');
const auth = require('../controllers/authController');
const history = require('../controllers/historyController')
const middleware = require('../middlewares');
const upload = require('../middlewares/upload')

//upload media
router.post('/upload/images', login, storage.uploadImage.single('images'), media.createImage)
router.post('/upload/videos', login, admin, storage.uploadVideos.single('videos'), media.createVideo)
router.post('/upload/files', login, storage.uploadFiles.single('files'), media.createFile)

//user controller
router.get('/user/:id', user.showUser);
router.post('/user/register', user.register);
router.put('/user/update-avatar', user.updateAvatar);

//history
router.post('/history', history.createHistory); 
router.get('/history/:id', history.getHistory); 
router.put('/history/:id', history.updateHistory); 
router.delete('/history/:id', history.deleteHistory); 

//auth
router.post('/auth/login', auth.login);
router.get('/auth/who-am-i', middleware.login, auth.whoami);
router.get('/auth/google', auth.googleOAuth);


module.exports = router;