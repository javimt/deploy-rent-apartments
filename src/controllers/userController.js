const { User } = require("../../db");

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const allUsers = await User.findAll();
      res.status(200).json(allUsers);
    } catch (error) { 
      res.status(500).send({ error: error.message });
    }
  },

  getUserById: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findOne({ where: { email: id } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const isAdmin = user.role === "admin";
      const isSuperAdmin = user.role === "superAdmin"
      if (isAdmin) {
        res.status(200).json({ isAdmin: true, redirectUrl: `/user/${user.email}/admin` });
      } else if(isSuperAdmin) {
        res.status(200).json({isSuperAdmin: true, redirectUrl: `/user/${user.email}/admin`})
      } else {
        res.status(200).json({ isAdmin: false, isSuperAdmin: false });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  postUser: async (req, res) => {
    const {name, lastName, email, role, image} = req.body;
    try {
      let user = await User.findOne({ where: { email } });
      if (user) {
        return res.status(400).json({ error: "Email already exists" });
      } 
      user = await User.create({email, name, lastName, image, role});
  //console.log("este es el usuario creado", user)
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  assignAdminRole: async (req, res) => {
    const { id } = req.params;
    const { role } = req.body
    try {
      const currentUser = await User.findOne({ where: { email: id } });
      if (!currentUser) {
        return res.status(404).send({ error: "Usuario no encontrado" });
      }
      if (currentUser === "superAdmin") {
        //return res.status(403).send({ error: "No puedes cambiar tu propio rol" });
        return res.status(201).json({ message: "Access successfully", user: currentUser });
      } 
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      if (user.role === "superAdmin" && user.id === currentUser) {
        return res.status(403).send({ error: "No puedes cambiar tu propio rol" });
      }
      user.role = role;
      await user.save();
      res.status(200).send({ message: "User role updated" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  putUser: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      const updateUser = await user.update(req.body);
      res.status(200).json({ message: "User updated succesfully", updateUser });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      await user.destroy();
      res.status(200).send({ message: "User deleted" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
};
