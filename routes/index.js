"use strict";

const userController = require("../controllers/userController.js")
	, jwt = require("jsonwebtoken")
	, config = require("../config");


function isAuthenticated(req, res, next) {
	try{
		let token = req.query.token || req.headers["authorization"].split("Bearer: ")[1];
		if (token) {
			jwt.verify(token, config.jwtSecrect, (err, decoded) => {
				if (err) return res.json(403,{ success: false, message: "Failed to authenticate token." });
				req.decoded = decoded;
				next();
			});
		} else {
			res.json(403,{
				success: false
				, message: "No token provided."
			});
		}
	}
	catch(err){
		res.json(403,{
			success: false
			, message: "No token provided."
		});
	}
}

module.exports = function(app) {

	app.post("/login", userController.authUser);
	app.post("/register", userController.createUser);

	app.get("/user/:id", isAuthenticated, (req,res) => userController.hadPermission("user.read", req, res, userController.readUser));
	app.del("/user/:id", isAuthenticated, (req,res) => userController.hadPermission("user.delete", req, res, userController.deleteUser));
	app.put("/user/:id", isAuthenticated, (req,res) => userController.hadPermission("user.update", req, res, userController.updateUser));

	app.get("/users", isAuthenticated, (req,res) => userController.hadPermission("users.read", req, res, userController.readUsers));
	app.del("/users", isAuthenticated, (req,res) => userController.hadPermission("users.delete", req, res, userController.deleteUsers));


/*
	app.post("/user", isAuthenticated, isAdmin, function(req, res) {

		/*User.remove({ name: "admin2" }, function (err) {
			if (err) return handleError(err);
		});*

		var nick = new User({
			name: req.body.username,
			password: req.body.password,
			admin: false
		});

		nick.save(function(err) {
			if (err) throw err;

			console.log("User saved successfully");
			res.json({ success: true });
		});
	});

	app.del("/users", isAuthenticated, isAdmin, (req, res) =>
		User.remove({name: {"$ne":req.decoded.name }})
		.then(()=>
			res.send(400, {status: 400, data: null, message: req.decoded.name }))
		.catch((err)=>
			res.json({ success: false, message: "Error:"+err }).bind(res, err))
		);

	app.del("/user/:name", isAuthenticated, isAdmin, (req, res) =>
		User.remove({name: name})
		.then(()=>
			res.json({ success: true, message: "User "+name+" removed." }).bind(res, name))
		.catch((res,err)=>
			res.json({ success: false, message: "Error:"+err }).bind(res, err))
		);


	app.get("/users", isAuthenticated, (req, res) =>
	User.find({},(err, users) =>
	res.json(users)));

	app.get("/", isAuthenticated, (req, res) =>
		res.send("Welcome to the Restify Authentication Exemple"));

	app.post("/authme", (req, res) => {
		console.log(req.body.username);
		User
			.findOne({name: req.body.username})
			.then((user) => {
				if(!user || user.password !== req.body.password) Promisse.rejected();
				res.json({
					success: true,
					message: "Enjoy your token!",
					user: user,
					token: jwt.sign(JSON.stringify(user), config.secret)
				});
			})
			.catch(
				(err) =>
				res.json({ success: false, message: "Authentication failed. Wrong user/password." })
			);
	});
*/


};
