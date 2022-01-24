let express = require('express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const {
  user_controller,
  post_controller,
  comment_controller,
} = require('./index')
const router = express.Router()

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: '1.0.0',
      title: 'Blog API',
      description: 'User API Information',
      contact: {
        name: 'Amazing Developer',
      },
      servers: [process.env.HOST],
    },
  },
  // ['.routes/*.js']
  apis: ['./src/routes/user_routes.js'],
}
const swaggerDocs = swaggerJsDoc(swaggerOptions)
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
// User routes

router.post('/api/v1/user', user_controller.createUser)
router.post('/api/v1/login', user_controller.loginUser)
/**
 * @swagger
 * /api/v1/users:
 *  get:
 *    description: Use to request all users
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/api/v1/users', user_controller.getAllUsers)
/**
 * @swagger
 * /api/v1/users/:userId:
 *  get:
 *    description: Use to request all users
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/api/v1/users/:userId', user_controller.getUser)
/**
 * @swagger
 * /api/v1/users/update-user/:userId:
 *    put:
 *      description: Update a user
 *    parameters:
 *      - firstName: first name
 *        in: query
 *        description: First name
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully created user
 */
router.put('/api/v1/users/update-user/:userId', user_controller.updateUser)

/**
 * @swagger
 * /api/v1/users/delete-user/{userId}:
 *  delete:
 *      summary: Returns a user by ID.
 *      parameters:
 *        - userId: userId
 *          in: path
 *          required: true
 *          description: The ID of the user to return.
 *          schema:
 *            type: string
 *            format: int64
 *            minimum: 1
 *      responses:
 *        '200':
 *          description: A user object.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  userId:
 *                    type: string
 *                    format: string
 *                    example: 4
 *                  name:
 *                    type: string
 *                    example: Jessica Smith
 *        '400':
 *          description: The specified user ID is invalid (not a number).
 *        '404':
 *          description: A user with the specified ID was not found.
 *        default:
 *          description: Unexpected error
 */
router.delete('/api/v1/users/delete-user/:userId', user_controller.deleteUser)

// Post routes
/**
 * @swagger
 * /api/v1/post:
 *  post:
 *    description: Use to request all users
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/api/v1/post', post_controller.createPost)
/**
 * @swagger
 * /api/v1/posts:
 *  get:
 *    description: Use to request all users
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/api/v1/posts', post_controller.getAllPosts)
/**
 * @swagger
 * /api/v1/posts/:postId:
 *  get:
 *    description: Use to request all users
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/api/v1/posts/:postId', post_controller.getPost)
/**
 * @swagger
 * /api/v1/posts/update-post/:userId:
 *  put:
 *    description: Use to request all users
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.put('/api/v1/posts/update-post/:postId', post_controller.updatePost)
/**
 * @swagger
 * /api/v1/posts/delete-post/:postId:
 *  delete:
 *    description: Use to request all users
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.delete('/api/v1/posts/delete-post/:postId', post_controller.deletePost)

router.put('/api/v1/posts/like-post/:postId', post_controller.likePost)

// Comments
router.post('/api/v1/post/comment', comment_controller.createComment)
router.get(
  '/api/v1/post/:postId/comments',
  comment_controller.getAllCommentsForAPost,
)

router.get('/api/v1/post/comment/:commentId', comment_controller.getComment)
router.put('/api/v1/post/comment/:commentId', comment_controller.likeComment)
router.put(
  '/api/v1/post/commenting/comment/:commentId',
  comment_controller.commentOnAComment,
)
// router.post('/api/v1/post/comment', comment_controller.createComment)

module.exports = router
