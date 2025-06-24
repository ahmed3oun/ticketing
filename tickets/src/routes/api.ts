import istAuthenticated from "../middlewares/is-authenticated.middleware";
import TicketsApiController from "../controllers/tickets.controller";
import { Request, Response, Router } from "express";

const apiRouter: Router = Router();


apiRouter.post(
    '/tickets/create',
    istAuthenticated,
    async (req: Request, res: Response) => { await new TicketsApiController(req, res).create() }
);
apiRouter.get(
    '/tickets/find',
    istAuthenticated,
    async (req: Request, res: Response) => { await new TicketsApiController(req, res).find() }
);
apiRouter.get(
    '/tickets/find/:id',
    istAuthenticated,
    async (req: Request, res: Response) => { await new TicketsApiController(req, res).findById() }
);
apiRouter.put(
    '/tickets/update/:id',
    istAuthenticated,
    async (req: Request, res: Response) => { await new TicketsApiController(req, res).update() }
);
apiRouter.patch(
    '/tickets/patch/:id',
    istAuthenticated,
    async (req: Request, res: Response) => { await new TicketsApiController(req, res).patch() }
);

// apiRouter.all('/*', (req: Request, res: Response) => {
//     res.status(404).send({
//         status: false,
//         message: 'API Not found',
//     })
// });

export default apiRouter;
// This file defines the API routes for the tickets service.