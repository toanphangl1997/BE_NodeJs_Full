import video from "./video.swagger.js";

const swaggerDocument = {
  openapi: `3.1.0`,
  info: {
    title: "Document API Cyber Media",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:3069",
      description: "Server dưới local",
    },
    {
      url: "http://google.com",
      description: "Server đã được deloy lên product ",
    },
  ],
  components: {
    securitySchemes: {
      longToken: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    ...video,
  },
};

export default swaggerDocument;
