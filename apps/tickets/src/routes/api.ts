import istAuthenticated from "../middlewares/is-authenticated.middleware";
import TicketsApiController from "../controllers/tickets.controller";
import { Request, Response, Router } from "express";
import OrdersApiController from "../controllers/orders.controller";

const apiRouter: Router = Router();

// Define the API routes for the tickets service
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

// Define the API routes for the orders service
apiRouter.post(
    '/orders/create',
    istAuthenticated,
    async (req: Request, res: Response) => { await new OrdersApiController(req, res).create() }
);
apiRouter.get(
    '/orders/find',
    istAuthenticated,
    async (req: Request, res: Response) => { await new OrdersApiController(req, res).find() }
);
apiRouter.get(
    '/orders/find/:id',
    istAuthenticated,
    async (req: Request, res: Response) => { await new OrdersApiController(req, res).findById() }
);
apiRouter.put(
    '/orders/update/:id',
    istAuthenticated,
    async (req: Request, res: Response) => { await new OrdersApiController(req, res).update() }
);
apiRouter.delete(
    '/orders/delete/:id',
    istAuthenticated,
    async (req: Request, res: Response) => { await new OrdersApiController(req, res).delete() }
);

// apiRouter.all('/*', (req: Request, res: Response) => {
//     res.status(404).send({
//         status: false,
//         message: 'API Not found',
//     })
// });

export default apiRouter;
// This file defines the API routes for the tickets service.