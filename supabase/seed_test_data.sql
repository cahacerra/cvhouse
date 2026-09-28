-- OPTIONAL — dados de teste
--
-- Este arquivo cria alguns presentes FICTÍCIOS apenas para você testar o
-- funcionamento do site (busca, filtros, reserva, destaque, etc.) antes de
-- cadastrar a lista de verdade.
--
-- Todos os itens abaixo têm is_test = true, o que faz o card mostrar um
-- selo "Presente de teste" na lista pública, e podem ser apagados a
-- qualquer momento pelo painel /admin/presentes — filtre por "Teste" e
-- exclua, ou rode `delete from gifts where is_test = true;` no SQL editor.
--
-- NÃO rode este arquivo em produção se já estiver com a lista real.

insert into gifts (
  name, description, category_id, price, store_name, product_url,
  image_url, quantity_total, quantity_reserved, featured, display_order,
  status, is_test
)
select
  v.name, v.description,
  (select id from categories where slug = v.category_slug),
  v.price, v.store_name, v.product_url, null,
  v.quantity_total, 0, v.featured, v.display_order, 'active', true
from (
  values
    ('Jogo de panelas antiaderente', 'Para os primeiros jantares em casa.', 'cozinha', 899.00, 'Loja Exemplo', 'https://www.exemplo.com/produto/jogo-de-panelas', 1, true, 1),
    ('Jogo de taças em cristal', 'Para celebrar muitos brindes.', 'mesa-posta', 289.90, 'Loja Exemplo', 'https://www.exemplo.com/produto/tacas-cristal', 6, false, 2),
    ('Liquidificador', 'Para os sucos e vitaminas do dia a dia.', 'eletrodomesticos', 399.00, 'Loja Exemplo', 'https://www.exemplo.com/produto/liquidificador', 1, true, 3),
    ('Jogo de toalhas de banho', 'Três unidades, para o banheiro novo.', 'banheiro', 180.00, 'Loja Exemplo', 'https://www.exemplo.com/produto/toalhas', 3, false, 4),
    ('Jogo de lençóis', 'Para as primeiras noites na casa nova.', 'quarto', 349.00, 'Loja Exemplo', 'https://www.exemplo.com/produto/lencois', 2, false, 5),
    ('Conjunto de velas aromáticas', 'Um detalhe delicado para a decoração.', 'decoracao', 129.00, 'Loja Exemplo', 'https://www.exemplo.com/produto/velas', 4, false, 6)
) as v(name, description, category_slug, price, store_name, product_url, quantity_total, featured, display_order)
where not exists (select 1 from gifts where name = v.name and is_test = true);
