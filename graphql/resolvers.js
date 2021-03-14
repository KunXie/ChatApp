const bcrypt = require("bcryptjs");
const { UserInputError, AuthenticationError } = require("apollo-server");

const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const { User } = require("../models");
const { JWT_SECRET } = require("../config/env.json");

module.exports = {
  Query: {
    getUsers: async (parent, args, context, info) => {
      try {
        let user;
        // console.log(context.req.headers.authorization);
        if (context.req && context.req.headers.authorization) {
          const token = context.req.headers.authorization.split("Bearer ")[1];
          jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
            if (err) {
              throw new AuthenticationError("Unauthenticated");
            }
            user = decodedToken;
            // console.log("decoded token", user);
          });
        }

        // get all users except for user self.
        const users = await User.findAll({
          where: { username: { [Op.ne]: user.username } },
        });
        return users;
      } catch (err) {
        // console.log(err);
        throw err;
      }
    },
    login: async (parent, arg) => {
      const { username, password } = arg;
      let errors = {};
      try {
        if (username.trim() === "")
          errors.username = "username must not be empty";

        if (password === "") errors.password = "password must not be empty";

        if (Object.keys(errors).length > 0) {
          throw new UserInputError("bad input", { errors });
        }

        const user = await User.findOne({
          where: { username },
        });

        if (!user) {
          errors.username = " user not found";
          throw new UserInputError("user not found", { errors });
        }

        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
          errors.password = "password is incorrect";
          throw new AuthenticationError("password is incorrect", { errors });
        }

        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token,
        };

        // return user;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    register: async (parent, args, context, info) => {
      let { username, email, password, confirmPassword } = args;
      let errors = {};
      try {
        // Validate input data
        if (email.trim() === "") {
          errors.email = "email must not be empty";
        }
        if (username.trim() === "") {
          errors.username = "username must not be empty";
        }
        if (password.trim() === "") {
          errors.password = "password must not be empty";
        }
        if (confirmPassword.trim() === "") {
          errors.confirmPassword = "repeat password must not be empty";
        }

        if (password !== confirmPassword) {
          errors.confirmPassword = "passwords must match.";
        }

        // db 里面已经有unique了，所以如果有重复的，db会返回错误, 这里可以放到catch那里处理
        // Check if username / email exists
        // const userByUsername = await User.findOne({ where: { username } });
        // const userByEmail = await User.findOne({ where: { email } });

        // if (userByUsername) errors.username = "username already exists";
        // if (userByEmail) errors.email = "email already exists";

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        // Hash password
        password = await bcrypt.hash(password, 6);

        // Create user
        const user = await User.create({
          username,
          email,
          password,
        });

        // Return user
        return user;
      } catch (err) {
        console.log(err);
        if (err.name === "SequelizeUniqueConstraintError") {
          err.errors.forEach(
            (e) => (errors[e.path] = `${e.path} is already taken`)
          );
        } else if (err.name === "SequelizeValidationError") {
          err.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError("Bad input", { errors });
      }
    },
  },
};
