const adminController = require("../controllers/adminController");

module.exports = [
  {
    method: "GET",
    path: "/admin",
    handler: adminController.getAdminPage,
  },
  {
    method: "GET",
    path: "/admin/add",
    handler: adminController.getAddPage,
  },
  {
    method: "POST",
    path: "/admin/add",
    options: {
      payload: {
        // maxBytes: 209715200,
        output: "stream",
        parse: true,
        multipart: true, // <-- this fixed the media type error
        allow: "multipart/form-data",
      },
    },
    handler: adminController.handleAddPage,
  },
  {
    method: "GET",
    path: "/admin/edit/{id}",
    handler: adminController.getEditPage,
  },
  {
    method: "POST",
    path: "/admin/edit/{id}",
    options: {
      payload: {
        maxBytes: 209715200,
        output: "stream",
        parse: true,
        multipart: true, // <-- this fixed the media type error
        allow: "multipart/form-data",
      },
    },
    handler: adminController.handleEditPage,
  },
  {
    method: "GET",
    path: "/admin/delete/{id}",
    handler: adminController.deleteProject,
  },
];
