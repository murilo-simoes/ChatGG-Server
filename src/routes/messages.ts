import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { authenticate } from "../plugins/authenticate";

export async function messageRoutes(fastify: FastifyInstance) {
  fastify.post("/message/send", async (request, reply) => {
    const createUserBody = z.object({
      idSend: z.number(),
      mensagem: z.string(),
      chatId: z.number(),
    });

    const { idSend, mensagem, chatId } = createUserBody.parse(request.body);

    if (mensagem === "") {
      return reply
        .status(400)
        .send({ mensage: "A mensagem não pode ser vazia!" });
    }

    const inGroup = await prisma.userChat.findFirst({
      where: {
        userIdUserChat: idSend,
        chatIdUserChat: chatId,
      },
    });

    if (inGroup) {
      const enviarMensagem = await prisma.messages.create({
        data: {
          sendId: idSend,
          message: mensagem,
          chatId: chatId,
        },
      });

      const updateChat = await prisma.chat.update({
        where: {
          id: chatId,
        },
        data: {
          qtdMens: {
            increment: 1,
          },
        },
      });
      return reply.status(200).send(enviarMensagem);
    } else {
      return reply.status(400).send({
        message: "Você não está no chat então não pode enviar mensagens!",
      });
    }
  });

  fastify.post("/message/texts", async (request, reply) => {
    const createUserBody = z.object({
      chatId: z.number(),
    });

    const { chatId } = createUserBody.parse(request.body);

    const existeChat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
    });

    if (existeChat) {
      const listar = await prisma.messages.findMany({
        where: {
          chatId: chatId,
        },
      });

      return reply.status(200).send(listar);
    } else {
      return reply.status(400).send({ message: "Este chat não existe!" });
    }
  });
}
