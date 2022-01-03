const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const vision = require("@hapi/vision");
const indexRoutes = require("./routes/indexRoutes");

const init = async () => {
  const server = Hapi.server({
    host: "localhost",
    port: 3000,
  });

  await server.register([Inert, vision]);

  server.views({
    engines: {
      handlebars: require("handlebars"),
    },
    relativeTo: __dirname,
    path: "views",
    layout: true,
    layoutPath: "views/layouts",
  });

  server.route(indexRoutes);

  server.route({
    method: "GET",
    path: "/js/{file*}",
    handler: {
      directory: {
        path: "public/js",
      },
    },
  });

  server.route({
    method: "GET",
    path: "/css/{file*}",
    handler: {
      directory: {
        path: "public/css",
      },
    },
  });

  server.route({
    method: "GET",
    path: "/images/{file*}",
    handler: {
      directory: {
        path: "public/images",
      },
    },
  });

  await server.start();
  console.log("Server is running on: " + server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
