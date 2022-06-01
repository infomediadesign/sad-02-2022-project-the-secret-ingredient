// import { jwt } from '../deps.ts';

// export const notFoundHandler =
//     ('*',
//     (req: any, res: any, next: any) => {
//         const error = new Error(`Not found - ${req.originalUrl}`);
//         res.status(404);
//         next(error);
//     });

// export const auth = (req: any, res: any, next: any) => {
//     const token = req.header('x-auth-token');
//     try {
//         if (!token) return res.status(401).json({ msg: 'No authentiaction token, access denied' });

//         if (!verified) return res.status(401).json({ msg: 'Token verification failed, access denied. ' });
//         req.user = verified._id;
//         next();
//     } catch (error) {
//         next(error);
//     }
// };

// export const errorHandler = (error: any, req, res, next) => {
//     const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//     res.status(statusCode);
//     if (process.env.NODE_ENV === 'production') return res.json({ msg: 'error occurred' });

//     res.json({
//         message: error.message,
//         stack: error.stack,
//         status: statusCode,
//     });
// };
