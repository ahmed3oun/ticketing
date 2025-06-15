import istAuthenticated from "../middlewares/is-authenticated.middleware";
import AuthApiController from "../controllers/auth.controller";
import UserApiController from "../controllers/user.controller";
import { Request, Response, Router } from "express";

const apiRouter: Router = Router();


apiRouter.post(
    '/user/login',
    async (req: Request, res: Response) => { await new AuthApiController(req, res).signin() }
);
apiRouter.post(
    '/user/register',
    async (req: Request, res: Response) => { await new AuthApiController(req, res).signup() }
);
apiRouter.post(
    '/user/logout',
    async (req: Request, res: Response) => { await new AuthApiController(req, res).signout() }
);
apiRouter.get(
    '/user/get-current-user',
    istAuthenticated,
    async (req: Request, res: Response) => { await new UserApiController(req, res).getMe() }
);
// apiRouter.post('/user/update-profile', async (req: Request, res: Response) => await new UserApiController(req, res).updateProfile());

// Additional authentication routes
// apiRouter.post('/auth/refresh-token', (req, res) => console.log('Refresh token route hit'));
// apiRouter.post('/auth/forgot-password', (req, res) => console.log('Forgot password route hit'));
// apiRouter.post('/auth/reset-password', (req, res) => console.log('Reset password route hit'));
// apiRouter.post('/auth/verify-email', (req, res) => console.log('Verify email route hit'));
// apiRouter.post('/auth/verify-phone', (req, res) => console.log('Verify phone route hit'));
// apiRouter.post('/auth/change-password', (req, res) => console.log('Change password route hit'));
// apiRouter.post('/auth/send-verification-code', (req, res) => console.log('Send verification code route hit'));
// apiRouter.post('/auth/verify-verification-code', (req, res) => console.log('Verify verification code route hit'));
// apiRouter.post('/auth/update-profile', (req, res) => console.log('Update profile route hit'));
// apiRouter.post('/auth/delete-account', (req, res) => console.log('Delete account route hit'));
// apiRouter.post('/auth/get-user-by-id', (req, res) => console.log('Get user by ID route hit'));
// apiRouter.post('/auth/get-all-users', (req, res) => console.log('Get all users route hit'));
// apiRouter.post('/auth/verify-token', (req, res) => console.log('Verify token route hit'));
// apiRouter.post('/auth/validate-token', (req, res) => console.log('Validate token route hit'));

// apiRouter.get('/auth/get', (req, res: Response<any>) => res.status(200).send())

// apiRouter.all('/*', (req: Request, res: Response) => res.status(404).send({
//     status: false,
//     message: 'API Not found',
// }));

export default apiRouter;
// This file defines the API routes for the authentication service.