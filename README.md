# Catarina & Vitor — Chá de Panela

Site do chá de panela de Catarina & Vitor: uma home editorial que conta a
história do casal, e uma lista de presentes com reserva em tempo real que
impede duas pessoas de escolherem o mesmo item.

- **Frontend:** Next.js 16 (App Router, TypeScript, Server Components +
  Server Actions), Tailwind CSS v4, `motion` para as transições sutis.
- **Backend:** Supabase (Postgres + Auth + Storage). Toda a lógica de
  reserva vive em funções SQL transacionais — não em código do servidor —
  para garantir que a "baixa" de um presente seja atômica mesmo com dois
  convidados clicando ao mesmo tempo.
- **Hospedagem prevista:** Vercel (frontend) + Supabase (banco, auth,
  imagens).

Este README cobre tudo que você precisa para rodar o projeto, configurar o
banco, criar o primeiro administrador, cadastrar presentes e publicar o
site. Não é preciso saber programar para usar o painel do dia a dia
(`/admin`) — este documento é só para a configuração inicial.

## Sumário

1. [Configurar o banco de dados (Supabase)](#1-configurar-o-banco-de-dados-supabase)
2. [Rodar o projeto localmente](#2-rodar-o-projeto-localmente)
3. [Criar o primeiro administrador](#3-criar-o-primeiro-administrador)
4. [Usar o painel administrativo](#4-usar-o-painel-administrativo)
5. [Cadastrar presentes](#5-cadastrar-presentes)
6. [Adicionar e trocar fotos](#6-adicionar-e-trocar-fotos)
7. [Alterar informações do evento (data, hora, endereço)](#7-alterar-informações-do-evento)
8. [Como funciona a reserva (e por que não duplica)](#8-como-funciona-a-reserva)
9. [Alterar a identidade visual](#9-alterar-a-identidade-visual)
10. [Publicar o site (Vercel)](#10-publicar-o-site-vercel)
11. [Estrutura do projeto](#11-estrutura-do-projeto)
12. [Dados de teste](#12-dados-de-teste)

---

## 1. Configurar o banco de dados (Supabase)

1. Crie uma conta e um projeto em [supabase.com](https://supabase.com).
2. No painel do projeto, vá em **SQL Editor** → **New query**.
3. Copie todo o conteúdo de [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
   e execute. Esse arquivo cria:
   - as tabelas (`gifts`, `categories`, `reservations`, `event_settings`,
     `site_photos`, `admins`);
   - as políticas de segurança (Row Level Security) que impedem um
     convidado de ler dados de outros convidados ou de alterar qualquer
     coisa administrativa;
   - as funções `reserve_gift`, `admin_cancel_reservation` e
     `admin_reset_gift_availability`, que fazem a reserva de forma segura
     (veja a seção 8);
   - os buckets de imagem (`gift-images`, `site-photos`) com políticas de
     leitura pública e escrita restrita a administradores;
   - categorias iniciais (Cozinha, Mesa posta, Eletrodomésticos, etc. —
     edite ou apague à vontade em `/admin/categorias`).

   O arquivo é seguro para rodar mais de uma vez (não duplica dados nem
   quebra se algo já existir).

4. Em **Project Settings → API**, copie a **Project URL** e a chave
   **anon public** — você vai usar as duas no passo seguinte.

## 2. Rodar o projeto localmente

```bash
npm install
cp .env.example .env.local
```

Edite `.env.local` com os valores do seu projeto Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

Depois:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Sem essas variáveis
configuradas, o site continua abrindo normalmente (nenhuma página quebra),
mas mostra os estados vazios — "estamos preparando a nossa lista", "em
breve contaremos a data" — porque não há conexão real com o banco.

## 3. Criar o primeiro administrador

O painel (`/admin`) usa autenticação por e-mail e senha do Supabase Auth,
mas só quem também estiver na tabela `admins` consegue entrar.

1. No painel do Supabase, vá em **Authentication → Users → Add user** e
   crie um usuário com seu e-mail e uma senha.
2. Copie o **UID** desse usuário (aparece na lista de usuários).
3. No **SQL Editor**, rode:

   ```sql
   insert into admins (user_id) values ('cole-o-uid-aqui');
   ```

4. Acesse `/admin/login` no site e entre com esse e-mail e senha.

Para adicionar outro administrador no futuro, repita os passos acima com
o novo usuário.

## 4. Usar o painel administrativo

Depois de logado, `/admin` traz:

- **Dashboard** — total de presentes, quantos ainda estão disponíveis,
  quantos já foram escolhidos, quantos convidados já confirmaram, e a
  atividade recente.
- **Presentes** — cadastrar, editar, excluir, marcar como destaque,
  mudar categoria/preço/loja/link/quantidade, liberar um presente que foi
  reservado por engano.
- **Categorias** — criar, renomear, reordenar e excluir categorias (elas
  viram os filtros da lista pública).
- **Reservas** — quem confirmou cada presente, a mensagem que deixou,
  cancelar uma reserva manualmente, exportar tudo em CSV.
- **Configurações** — nomes do casal, texto de abertura, data, horário,
  local, endereço, link do Google Maps, Instagram, mensagem final, e as
  fotos editoriais do site.

## 5. Cadastrar presentes

Em `/admin/presentes/novo`, preencha:

| Campo | Observação |
|---|---|
| Nome / Descrição | aparecem no card e na página do presente |
| Categoria | opcional, mas ajuda os convidados a filtrar |
| Preço | em reais |
| Loja / Link do produto | o convidado é levado para esse link para comprar — a compra **não** acontece dentro do site |
| Quantidade disponível | use mais de 1 para itens como "jogo de toalhas" — o sistema abate uma unidade por reserva confirmada |
| Destaque | mostra o presente numa seção especial no topo da lista |
| Ordem de exibição | número menor aparece primeiro |
| Status | "Inativo" esconde o presente da lista pública sem apagá-lo |
| Foto | envie um arquivo (vai para o Supabase Storage) ou cole uma URL de imagem já publicada |

Não é preciso mexer em código para adicionar, editar ou remover
presentes — tudo é feito pelo painel.

## 6. Adicionar e trocar fotos

Em **Configurações → Fotos do site**, cada espaço editorial do site (foto
de abertura, foto da seção "Onde a nossa história mora", fotos do casal,
detalhes da casa, foto de encerramento) tem seu próprio campo de upload.
Até essas fotos serem enviadas, o site mostra um espaço reservado
elegante (com uma legenda discreta, visível só para quem está de olho no
design) em vez de inventar uma imagem — assim o layout sempre fica
composto, mesmo antes de todas as fotos estarem prontas.

## 7. Alterar informações do evento

Em **Configurações → Evento e identidade**: nomes do casal, data,
horário, nome do local, endereço e link do Google Maps.

- Enquanto a **data** não for preenchida, a seção do Chá de Panela mostra
  uma mensagem de "em breve" — nunca uma data inventada.
- O bloco **"Como chegar"** só aparece quando endereço **e** link do
  Google Maps estiverem preenchidos.
- Assim que você salva, as mudanças aparecem no site imediatamente.

## 8. Como funciona a reserva

Este é o requisito mais importante do projeto: **dois convidados nunca
podem reservar a última unidade do mesmo presente.**

Isso é resolvido inteiramente no banco de dados, na função
[`reserve_gift`](supabase/migrations/0001_init.sql) (Postgres/PL-pgSQL),
não em JavaScript:

```sql
select * into v_gift from gifts where id = p_gift_id and status = 'active' for update;
-- ...verifica se ainda há unidades disponíveis...
update gifts set quantity_reserved = quantity_reserved + v_quantity ...;
insert into reservations (...);
```

O `for update` trava a linha do presente durante a transação. Se dois
convidados clicarem "Confirmar meu presente" no mesmo instante, o segundo
fica esperando o primeiro terminar — e só então lê a quantidade já
atualizada, decidindo se ainda sobra unidade. Não existe uma janela onde
os dois "vejam" o mesmo estoque disponível ao mesmo tempo. Isso foi
testado diretamente no Postgres: 10 requisições simultâneas para um
presente com 1 unidade resultam em exatamente 1 sucesso; 10 requisições
simultâneas para um presente com 3 unidades resultam em exatamente 3
sucessos — nunca mais que isso.

Outros pontos importantes:

- **Clicar no link da loja não reserva nada.** A reserva só acontece
  quando o convidado preenche o nome e clica em "Confirmar meu presente".
- Nomes, mensagens e quem escolheu cada presente **nunca** aparecem
  publicamente — só em `/admin/reservas`.
- Cancelar uma reserva pelo painel (`admin_cancel_reservation`) devolve a
  unidade automaticamente para a lista.

## 9. Alterar a identidade visual

A paleta e as fontes ficam centralizadas em dois arquivos:

- [`src/app/globals.css`](src/app/globals.css) — cores (`--color-*`,
  seção `@theme inline`). Ex.: para mudar o dourado de destaque, troque
  `--color-accent`.
- [`src/app/layout.tsx`](src/app/layout.tsx) — fontes (`Playfair
  Display` para títulos, `Inter` para texto). Troque por qualquer outra
  fonte do Google Fonts trocando os imports de `next/font/google`.

Os textos fixos (abertura, "Onde a nossa história mora", mensagem final)
estão em `src/components/home/*.tsx` — o texto de "Onde a nossa história
mora" é exatamente o combinado e não deve ser alterado sem revisão.

## 10. Publicar o site (Vercel)

1. Suba este repositório para o GitHub (ou GitLab/Bitbucket).
2. Em [vercel.com](https://vercel.com), importe o repositório.
3. Configure as variáveis de ambiente do projeto na Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy. A Vercel builda automaticamente a cada push.

Não é necessário nenhum backend adicional — o Next.js roda inteiramente
na Vercel e fala diretamente com o Supabase.

## 11. Estrutura do projeto

```
src/app/(site)/            home + /presentes (site público)
src/app/admin/login/       login do painel
src/app/admin/(dashboard)/ painel protegido (dashboard, presentes, categorias, reservas, configurações)
src/components/home/       seções da página inicial
src/components/gifts/      grid de presentes, card, modal de reserva
src/components/admin/      formulários e tabelas do painel
src/lib/supabase/          clientes Supabase (browser, server, middleware)
src/lib/data/              leituras públicas e administrativas do banco
supabase/migrations/       schema completo, RLS e funções SQL
supabase/seed_test_data.sql  presentes fictícios para testar (ver seção 12)
```

O acesso ao banco nunca usa uma chave "service role" — tanto o site
público quanto o painel administrativo usam a chave `anon`, e quem
decide o que cada um pode ler ou escrever é a Row Level Security do
Postgres. Isso significa que, mesmo que alguém inspecione o código do
navegador, não há como um convidado ler mensagens de outros convidados
ou editar presentes.

## 12. Dados de teste

Depois de rodar a migração, você pode opcionalmente rodar
[`supabase/seed_test_data.sql`](supabase/seed_test_data.sql) no SQL
Editor para ter alguns presentes fictícios (marcados com um selo
"Presente de teste" na lista pública) e testar filtros, busca, destaque e
o fluxo de reserva de ponta a ponta antes de cadastrar a lista real.

Para remover todos de uma vez:

```sql
delete from gifts where is_test = true;
```

Ou exclua um por um pelo painel em `/admin/presentes`.
