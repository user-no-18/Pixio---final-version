import express from 'express';
import { registerUser, loginUser, userCredits } from '../controllers/userController.js';
// import authMiddleware from '../middleware/authMiddleware.js';
import userAuth from '../middlewares/auth.js';
const userRouter = express.Router();

// Public routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);


userRouter.get('/credits', userAuth, userCredits);

export default userRouter;
































// userRouter.post('/pay-razor', userAuth, paymentRazorpay);
// userRouter.post('/verify-razor', userAuth, verifyRazorpay);