import jwt from "jsonwebtoken";

const TOKEN_KEY = process.env.TOKEN_KEY as string;

export const checkToken = (req: any, res: any, next: any) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return res.sendStatus(401);
	jwt.verify(token, TOKEN_KEY, (err: any, user: any) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
};
