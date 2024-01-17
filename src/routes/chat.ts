import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { authenticate } from "../plugins/authenticate";

export async function chatRoutes(fastify: FastifyInstance) {
  fastify.post("/chat/create", async (request, reply) => {
    const createUserBody = z.object({
      nomeChat: z.string(),
      criadorId: z.number(),
    });

    const { nomeChat, criadorId } = createUserBody.parse(request.body);

    if (nomeChat === "" || criadorId === null) {
      return reply.status(400).send({
        message: "Você deve atribuir um nome ao chat!",
      });
    } else {
      const novoChat = await prisma.chat.create({
        data: {
          nomeChat: nomeChat,
          authorId: criadorId,
        },
      });

      const cadastrarChat = await prisma.userChat.create({
        data: {
          userIdUserChat: criadorId,
          chatIdUserChat: novoChat?.id,
        },
      });
    }

    return reply.status(200).send({ message: "Chat criado com sucesso!" });
  });

  fastify.post("/chat/add", async (request, reply) => {
    const createUserBody = z.object({
      email: z.string(),
      chatId: z.number(),
    });

    const { email, chatId } = createUserBody.parse(request.body);

    const usuarioAdicionar = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const existeChat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
    });

    if (usuarioAdicionar) {
      if (existeChat) {
        const jaEstaNoChat = await prisma.userChat.findFirst({
          where: {
            userIdUserChat: usuarioAdicionar?.id,
            chatIdUserChat: chatId,
          },
        });

        if (!jaEstaNoChat) {
          const add = await prisma.userChat.create({
            data: {
              userIdUserChat: usuarioAdicionar.id,
              chatIdUserChat: chatId,
            },
          });

          return reply
            .status(200)
            .send({ message: "Usuário adicionado com sucesso!" });
        } else {
          return reply
            .status(400)
            .send({ message: "Este usuário já está nesse chat!" });
        }
      } else {
        return reply.status(400).send({ message: "Este chat não existe!" });
      }
    } else {
      return reply
        .status(400)
        .send({ message: "Erro ao adicionar um usuário ao chat!" });
    }
  });

  fastify.post("/chat/listar", async (request, reply) => {
    const createUserBody = z.object({
      userId: z.number(),
    });

    const { userId } = createUserBody.parse(request.body);

    const chatsUser = await prisma.userChat.findMany({
      where: {
        userIdUserChat: userId,
      },
    });

    let todosChats = [];

    for (let i = 0; i < chatsUser.length; i++) {
      const chat = await prisma.chat.findUnique({
        where: {
          id: chatsUser[i].chatIdUserChat,
        },
      });
      if (!isObjEmpty(chat)) {
        todosChats.push(chat);
      }
    }

    return reply.status(200).send(todosChats);
  });

  fastify.post("/chat/listarUsers", async (request, reply) => {
    const createUserBody = z.object({
      chatId: z.number(),
    });

    const { chatId } = createUserBody.parse(request.body);

    const chatExiste = await prisma.chat.findMany({
      where: {
        id: chatId,
      },
    });

    if (chatExiste) {
      const todosUsers = await prisma.userChat.findMany({
        where: {
          chatIdUserChat: chatId,
        },
      });

      let todosChats = [];

      if (todosUsers) {
        for (let i = 0; i < todosUsers.length; i++) {
          const chat = await prisma.user.findUnique({
            where: {
              id: todosUsers[i].userIdUserChat,
            },
          });
          if (!isObjEmpty(chat)) {
            todosChats.push(chat);
          }
        }

        return reply.status(200).send(todosChats);
      } else {
        return reply.status(400).send("Esse chat não tem ninguém!!");
      }
    } else {
      return reply.status(400).send("Esse chat não existe!");
    }
  });

  fastify.post("/chat/delete", async (request, reply) => {
    const createUserBody = z.object({
      userId: z.number(),
      chatId: z.number(),
    });

    const { userId, chatId } = createUserBody.parse(request.body);

    const chatCadastrado = await prisma.userChat.findFirst({
      where: {
        userIdUserChat: userId,
        chatIdUserChat: chatId,
      },
    });

    if (chatCadastrado) {
      const sairDoChat = await prisma.userChat.delete({
        where: {
          id: chatCadastrado.id,
        },
      });

      return reply.status(200).send({ message: "Saiu do chat com sucesso!" });
    } else {
      return reply.status(400).send({ message: "Chat não encontrado!" });
    }
  });
}

function isObjEmpty(obj: any) {
  return Object.keys(obj).length === 0;
}
