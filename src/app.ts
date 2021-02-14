import fastify, { FastifyServerOptions, FastifyInstance } from "fastify";
import fastifyCors from "fastify-cors";
import fastifyHelmet from "fastify-helmet";
import fastifyStatic from "fastify-static";
import fastifyMultipart from "fastify-multipart";
import fastifySwagger from "fastify-swagger";
import path from "path";
import middie from "middie";
import { components } from "./schemas/definitions.json";
import helloWorld from "./api/hello-world/routes";

function app(opts: FastifyServerOptions = {}): FastifyInstance {
  const app = fastify(opts);
  const ENV = process.env.NODE_ENV;
  const schemas = components.schemas as { [k: string]: unknown };

  for (const key in schemas) {
    if (Object.prototype.hasOwnProperty.call(schemas, key)) {
      const element = schemas[key];
      app.addSchema(element);
    }
  }
  app.setNotFoundHandler(function (_, reply) {
    reply.header("Content-Type", "text/plain; charset=utf-8").send("hi");
  });
  app.setErrorHandler(function (error, _, reply) {
    this.log.error(error.message);
    reply.status(409).send({ ok: false });
  });
  app.addHook("onClose", (_, done) => {
    done();
  });
  app.register(middie);
  app.register(fastifyCors);
  app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, "data:", "validator.swagger.io"],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });
  app.register(fastifySwagger, {
    routePrefix: "/documentation",
    exposeRoute: ENV === "development" ? true : false,
    mode: "static",
    specification: {
      path: "./docs/v2docs-3.yaml",
      postProcessor: function (swaggerObject) {
        return swaggerObject;
      },
      baseDir: "",
    },
  });
  app.register(fastifyStatic, {
    root: path.join(__dirname, "..", "public"),
    prefix: "/public/",
  });
  app.register(fastifyMultipart, {
    throwFileSizeLimit: true,
    addToBody: true,
    sharedSchemaId: "#multiPartSchema",
  });
  app.register(helloWorld);

  return app;
}

export default app;