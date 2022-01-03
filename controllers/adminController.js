const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// const handleFileUpload = (file) => {
//   return new Promise((resolve, reject) => {
//     const filename = file.hapi.filename;
//     const data = file._data;

//     fs.writeFileSync("public/images/portfolio/" + filename, data, (err) => {
//       if (err) {
//         reject(err);
//       }
//       resolve({ message: "Upload successfully!" });
//     });
//   });
// };

let connection;
const DB = async () => {
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "portfolio",
    });
  } catch (err) {
    console.log(err);
  }
};

DB();

exports.getAdminPage = async (request, h) => {
  const [rows, fields] = await connection.query("SELECT * FROM projects");
  // console.log(rows);
  return h.view("admin/index", {
    projects: rows,
  });
};

exports.getAddPage = (request, h) => h.view("admin/add");

exports.handleAddPage = async (request, h) => {
  const { title, description, service, url, client, projectdate } =
    request.payload;
  // console.log(title);
  let projectImageName;
  if (request.payload.projectimage) {
    projectImageName = request.payload.projectimage.hapi.filename;
    // await handleFileUpload(request.payload.projectimage);
    try {
      fs.writeFileSync(
        __dirname + "/../public/images/portfolio/" + projectImageName,
        request.payload.projectimage._data
      );
      // console.log(request.payload.projectimage._data);
    } catch (err) {
      console.log(err);
    }
  } else {
    projectImageName = "noimage.jpg";
  }
  const project = {
    title,
    description,
    service,
    url,
    client,
    date: projectdate,
    image: projectImageName,
  };
  // console.log(project);
  await connection.query("INSERT INTO projects SET ?", project);

  return h.redirect("/admin");
};

exports.getEditPage = async (request, h) => {
  const [rows, fields] = await connection.query(
    "SELECT * FROM projects WHERE id = ?",
    request.params.id
  );
  return h.view("admin/edit", {
    project: rows[0],
  });
};

exports.handleEditPage = async (request, h) => {
  const { title, description, service, url, client, projectdate } =
    request.payload;

  let projectImageName;
  if (request.payload.projectimage) {
    projectImageName = request.payload.projectimage.hapi.filename;
    // const response = await handleFileUpload(request.payload.projectimage);
    try {
      fs.writeFileSync(
        __dirname + "/../public/images/portfolio/" + projectImageName,
        request.payload.projectimage._data
      );
      // console.log(request.payload.projectimage._data);
    } catch (err) {
      console.log(err);
    }
  } else {
    projectImageName = "noimage.jpg";
  }

  const project = {
    title,
    description,
    service,
    url,
    client,
    date: projectdate,
    image: projectImageName,
  };

  await connection.query(
    "UPDATE projects SET ? WHERE id = " + request.params.id,
    project
  );
  return h.redirect("/admin");
};

exports.deleteProject = async (request, h) => {
  const result = await connection.query(
    "DELETE FROM Projects WHERE id = " + request.params.id
  );
  return h.redirect("/admin");
};
