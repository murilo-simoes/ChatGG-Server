import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { userRoutes } from "./routes/user";
import { chatRoutes } from "./routes/chat";
import { messageRoutes } from "./routes/messages";

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  // Em produção isso precisa ser uma variável ambiente

  await fastify.register(jwt, {
    secret: "chatgg",
  });

  await fastify.register(userRoutes);
  await fastify.register(chatRoutes);
  await fastify.register(messageRoutes);

  await fastify.listen({ port: 3333 });
}

bootstrap();
