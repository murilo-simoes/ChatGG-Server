import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { authenticate } from "../plugins/authenticate";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/users/count", async () => {
    const count = await prisma.user.count();

    return { count };
  });

  fastify.post("/users/create", async (request, reply) => {
    const createUserBody = z.object({
      nome: z.string(),
      email: z.string(),
      password: z.string(),
    });

    const { nome, email, password } = createUserBody.parse(request.body);

    const usuario = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (usuario) {
      return reply.status(400).send({
        message: "Usuário ja cadastrado!",
      });
    }

    if (!verificarSenha(password)) {
      return reply.status(400).send({
        message:
          "Senha inválida. Certifique-se de que ela tenha 8 caracteres, pelo menos uma letra maiúscula, um número e um caractere especial!",
      });
    }

    await prisma.user.create({
      data: {
        name: nome,
        email: email,
        password: password,
      },
    });

    return reply.status(200).send({
      message: "Usuário cadastrado com sucesso!",
    });
  });

  fastify.post("/users/infos", async (request, reply) => {
    const createUserBody = z.object({
      email: z.string(),
    });

    const { email } = createUserBody.parse(request.body);

    const infos = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (infos) {
      return reply.status(200).send(infos);
    } else {
      return reply.status(400).send({ message: "Usuário não encontrado!" });
    }
  });

  fastify.post("/users/login", async (request, reply) => {
    const createUserBody = z.object({
      email: z.string(),
      senha: z.string(),
    });

    const { email, senha } = createUserBody.parse(request.body);

    const usuario = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (usuario) {
      if (usuario.password != senha) {
        return reply.status(400).send({ message: "Senha inválida!" });
      } else {
        return reply.status(200).send(usuario);
      }
    } else {
      return reply.status(400).send({ message: "Este usuário não existe!" });
    }
  });
  fastify.post("/users/edit", async (request, reply) => {
    const createUserBody = z.object({
      email: z.string(),
      novoNome: z.string(),
    });

    const { email, novoNome } = createUserBody.parse(request.body);

    const usuario = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (novoNome === usuario?.name) {
      return reply
        .status(400)
        .send({ message: "O nome não pode ser igual ao ja cadastrado!" });
    }

    if (usuario) {
      await prisma.user.update({
        where: {
          id: usuario.id,
        },
        data: {
          name: novoNome,
        },
      });
      return reply.status(200).send({ message: "Nome alterado com sucesso" });
    } else {
      return reply.status(400).send({ message: "Este usuário não existe!" });
    }
  });
}

function verificarSenha(senha: string) {
  // Padrão que exige 8 caracteres, pelo menos uma letra maiúscula, um número e um caractere especial
  const padraoSenha =
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/;

  // Testa se a senha atende ao padrão
  if (padraoSenha.test(senha)) {
    return true;
  } else {
    return false;
  }
}
