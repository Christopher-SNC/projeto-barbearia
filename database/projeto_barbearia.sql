--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg120+1)
-- Dumped by pg_dump version 17.5 (Debian 17.5-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: agendamento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.agendamento (
    id_agendamento bigint NOT NULL,
    id_cliente bigint NOT NULL,
    id_barbearia bigint NOT NULL,
    id_barbeiro bigint NOT NULL,
    data_hora_inicio timestamp without time zone NOT NULL,
    status character varying(20) NOT NULL,
    valor_total numeric(10,2) NOT NULL,
    data_criacao timestamp without time zone NOT NULL,
    CONSTRAINT chk_agendamento_status CHECK (((status)::text = ANY ((ARRAY['CONFIRMADO'::character varying, 'CONCLUIDO'::character varying, 'CANCELADO'::character varying, 'NAO_COMPARECEU'::character varying])::text[]))),
    CONSTRAINT chk_agendamento_valor_total CHECK ((valor_total >= (0)::numeric))
);


--
-- Name: agendamento_id_agendamento_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.agendamento ALTER COLUMN id_agendamento ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.agendamento_id_agendamento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: avaliacao; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.avaliacao (
    id_avaliacao bigint NOT NULL,
    id_agendamento bigint NOT NULL,
    nota_barbearia integer NOT NULL,
    nota_barbeiro integer,
    comentario character varying(1000),
    data_avaliacao timestamp without time zone NOT NULL,
    CONSTRAINT chk_avaliacao_nota_barbearia CHECK (((nota_barbearia >= 1) AND (nota_barbearia <= 5))),
    CONSTRAINT chk_avaliacao_nota_barbeiro CHECK (((nota_barbeiro >= 1) AND (nota_barbeiro <= 5)))
);


--
-- Name: avaliacao_id_avaliacao_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.avaliacao ALTER COLUMN id_avaliacao ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.avaliacao_id_avaliacao_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: barbearia; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.barbearia (
    id_barbearia bigint NOT NULL,
    nome character varying(120) NOT NULL,
    cnpj character varying(14),
    descricao character varying(500),
    telefone character varying(20),
    ativa boolean DEFAULT false NOT NULL
);


--
-- Name: barbearia_id_barbearia_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.barbearia ALTER COLUMN id_barbearia ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.barbearia_id_barbearia_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: barbeiro; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.barbeiro (
    id_barbeiro bigint NOT NULL,
    id_usuario bigint NOT NULL,
    id_barbearia bigint NOT NULL,
    descricao character varying(500),
    ativo boolean DEFAULT true NOT NULL
);


--
-- Name: barbeiro_id_barbeiro_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.barbeiro ALTER COLUMN id_barbeiro ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.barbeiro_id_barbeiro_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: barbeiro_servico; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.barbeiro_servico (
    id_barbeiro_servico bigint NOT NULL,
    id_barbeiro bigint NOT NULL,
    id_servico bigint NOT NULL,
    ativo boolean DEFAULT true NOT NULL
);


--
-- Name: barbeiro_servico_id_barbeiro_servico_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.barbeiro_servico ALTER COLUMN id_barbeiro_servico ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.barbeiro_servico_id_barbeiro_servico_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: disponibilidade; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.disponibilidade (
    id_disponibilidade bigint NOT NULL,
    id_barbeiro bigint NOT NULL,
    dia_semana character varying(15) NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fim time without time zone NOT NULL,
    ativo boolean DEFAULT true NOT NULL
);


--
-- Name: disponibilidade_id_disponibilidade_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.disponibilidade ALTER COLUMN id_disponibilidade ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.disponibilidade_id_disponibilidade_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: endereco; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.endereco (
    id_endereco bigint NOT NULL,
    id_barbearia bigint NOT NULL,
    logradouro character varying(150) NOT NULL,
    numero character varying(20) NOT NULL,
    complemento character varying(100),
    bairro character varying(100) NOT NULL,
    cidade character varying(100) NOT NULL,
    estado character varying(2) NOT NULL,
    cep character varying(8) NOT NULL,
    latitude numeric(9,6),
    longitude numeric(9,6)
);


--
-- Name: endereco_id_endereco_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.endereco ALTER COLUMN id_endereco ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.endereco_id_endereco_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: favorito; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorito (
    id_favorito bigint NOT NULL,
    id_usuario bigint NOT NULL,
    id_barbearia bigint NOT NULL,
    data_adicao timestamp without time zone NOT NULL
);


--
-- Name: favorito_id_favorito_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.favorito ALTER COLUMN id_favorito ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.favorito_id_favorito_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: foto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.foto (
    id_foto bigint NOT NULL,
    id_barbearia bigint NOT NULL,
    url character varying(500) NOT NULL,
    legenda character varying(255),
    ordem integer NOT NULL,
    ativa boolean DEFAULT true NOT NULL
);


--
-- Name: foto_id_foto_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.foto ALTER COLUMN id_foto ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.foto_id_foto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: horario_funcionamento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.horario_funcionamento (
    id_horario bigint NOT NULL,
    id_barbearia bigint NOT NULL,
    dia_semana character varying(15) NOT NULL,
    hora_abertura time without time zone,
    hora_fechamento time without time zone,
    fechado boolean DEFAULT false NOT NULL
);


--
-- Name: horario_funcionamento_id_horario_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.horario_funcionamento ALTER COLUMN id_horario ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.horario_funcionamento_id_horario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: item_agendamento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.item_agendamento (
    id_item_agendamento bigint NOT NULL,
    id_agendamento bigint NOT NULL,
    id_servico bigint NOT NULL,
    preco_original numeric(10,2) NOT NULL,
    percentual_desconto numeric(5,2) NOT NULL,
    preco_final numeric(10,2) NOT NULL,
    duracao_minutos integer NOT NULL
);


--
-- Name: item_agendamento_id_item_agendamento_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.item_agendamento ALTER COLUMN id_item_agendamento ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.item_agendamento_id_item_agendamento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: promocao; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.promocao (
    id_promocao bigint NOT NULL,
    id_barbearia bigint NOT NULL,
    titulo character varying(120) NOT NULL,
    descricao character varying(500),
    percentual_desconto numeric(5,2) NOT NULL,
    data_inicio date NOT NULL,
    data_fim date NOT NULL,
    tipo character varying(20) NOT NULL,
    ativa boolean DEFAULT true NOT NULL,
    CONSTRAINT chk_promocao_datas CHECK ((data_fim >= data_inicio)),
    CONSTRAINT chk_promocao_desconto CHECK (((percentual_desconto > (0)::numeric) AND (percentual_desconto <= (100)::numeric))),
    CONSTRAINT chk_promocao_tipo CHECK (((tipo)::text = ANY ((ARRAY['SERVICO'::character varying, 'COMBO'::character varying])::text[])))
);


--
-- Name: promocao_id_promocao_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.promocao ALTER COLUMN id_promocao ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.promocao_id_promocao_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: promocao_servico; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.promocao_servico (
    id_promocao_servico bigint NOT NULL,
    id_promocao bigint NOT NULL,
    id_servico bigint NOT NULL
);


--
-- Name: promocao_servico_id_promocao_servico_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.promocao_servico ALTER COLUMN id_promocao_servico ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.promocao_servico_id_promocao_servico_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: proprietario_barbearia; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.proprietario_barbearia (
    id_proprietario_barbearia bigint NOT NULL,
    id_usuario bigint NOT NULL,
    id_barbearia bigint NOT NULL,
    data_vinculo date NOT NULL,
    ativo boolean DEFAULT true NOT NULL
);


--
-- Name: proprietario_barbearia_id_proprietario_barbearia_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.proprietario_barbearia ALTER COLUMN id_proprietario_barbearia ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.proprietario_barbearia_id_proprietario_barbearia_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: servico; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.servico (
    id_servico bigint NOT NULL,
    id_barbearia bigint NOT NULL,
    nome character varying(100) NOT NULL,
    descricao character varying(500),
    preco numeric(10,2) NOT NULL,
    duracao_minutos integer NOT NULL,
    ativo boolean DEFAULT true NOT NULL
);


--
-- Name: servico_id_servico_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.servico ALTER COLUMN id_servico ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.servico_id_servico_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario (
    id_usuario bigint NOT NULL,
    nome character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    senha_hash character varying(255) NOT NULL,
    telefone character varying(20),
    ativo boolean DEFAULT true NOT NULL
);


--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.usuario ALTER COLUMN id_usuario ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.usuario_id_usuario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: agendamento; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.agendamento (id_agendamento, id_cliente, id_barbearia, id_barbeiro, data_hora_inicio, status, valor_total, data_criacao) FROM stdin;
1	1	1	1	2026-09-14 10:00:00	CONCLUIDO	35.00	2026-09-11 23:23:07.10235
\.


--
-- Data for Name: avaliacao; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.avaliacao (id_avaliacao, id_agendamento, nota_barbearia, nota_barbeiro, comentario, data_avaliacao) FROM stdin;
1	1	5	4	Atendimento muito bom.	2026-09-12 00:18:29.544524
\.


--
-- Data for Name: barbearia; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.barbearia (id_barbearia, nome, cnpj, descricao, telefone, ativa) FROM stdin;
1	Barbearia Teste	12345678000199	Barbearia criada para testes do Projeto Barbearia	2733334444	t
\.


--
-- Data for Name: barbeiro; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.barbeiro (id_barbeiro, id_usuario, id_barbearia, descricao, ativo) FROM stdin;
1	3	1	Barbeiro criado para testes do Projeto Barbearia	t
\.


--
-- Data for Name: barbeiro_servico; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.barbeiro_servico (id_barbeiro_servico, id_barbeiro, id_servico, ativo) FROM stdin;
1	1	1	t
\.


--
-- Data for Name: disponibilidade; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.disponibilidade (id_disponibilidade, id_barbeiro, dia_semana, hora_inicio, hora_fim, ativo) FROM stdin;
1	1	SEGUNDA	09:00:00	17:00:00	t
\.


--
-- Data for Name: endereco; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.endereco (id_endereco, id_barbearia, logradouro, numero, complemento, bairro, cidade, estado, cep, latitude, longitude) FROM stdin;
1	1	Rua Exemplo	100	\N	Centro	Cidade Teste	ES	29000000	\N	\N
\.


--
-- Data for Name: favorito; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.favorito (id_favorito, id_usuario, id_barbearia, data_adicao) FROM stdin;
1	1	1	2026-09-12 12:48:22.025426
\.


--
-- Data for Name: foto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.foto (id_foto, id_barbearia, url, legenda, ordem, ativa) FROM stdin;
1	1	/imagens/barbearias/barbearia-teste/fachada.jpg	Fachada da Barbearia Teste	1	t
\.


--
-- Data for Name: horario_funcionamento; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.horario_funcionamento (id_horario, id_barbearia, dia_semana, hora_abertura, hora_fechamento, fechado) FROM stdin;
1	1	SEGUNDA	08:00:00	18:00:00	f
\.


--
-- Data for Name: item_agendamento; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.item_agendamento (id_item_agendamento, id_agendamento, id_servico, preco_original, percentual_desconto, preco_final, duracao_minutos) FROM stdin;
1	1	1	35.00	0.00	35.00	30
\.


--
-- Data for Name: promocao; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.promocao (id_promocao, id_barbearia, titulo, descricao, percentual_desconto, data_inicio, data_fim, tipo, ativa) FROM stdin;
1	1	Corte com 10% de desconto	Promoção de teste para o serviço de corte	10.00	2026-09-01	2026-09-30	SERVICO	t
\.


--
-- Data for Name: promocao_servico; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.promocao_servico (id_promocao_servico, id_promocao, id_servico) FROM stdin;
1	1	1
\.


--
-- Data for Name: proprietario_barbearia; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.proprietario_barbearia (id_proprietario_barbearia, id_usuario, id_barbearia, data_vinculo, ativo) FROM stdin;
1	2	1	2026-09-11	t
\.


--
-- Data for Name: servico; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.servico (id_servico, id_barbearia, nome, descricao, preco, duracao_minutos, ativo) FROM stdin;
1	1	Corte	Corte de cabelo masculino	35.00	30	t
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuario (id_usuario, nome, email, senha_hash, telefone, ativo) FROM stdin;
1	Cliente Teste	cliente.teste@email.com	hash_teste_123	27999999999	t
2	Proprietario Teste	proprietario.teste@email.com	hash_proprietario_123	27988888888	t
3	Barbeiro Teste	barbeiro.teste@email.com	hash_barbeiro_123	27977777777	t
\.


--
-- Name: agendamento_id_agendamento_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.agendamento_id_agendamento_seq', 1, true);


--
-- Name: avaliacao_id_avaliacao_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.avaliacao_id_avaliacao_seq', 2, true);


--
-- Name: barbearia_id_barbearia_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.barbearia_id_barbearia_seq', 1, true);


--
-- Name: barbeiro_id_barbeiro_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.barbeiro_id_barbeiro_seq', 1, true);


--
-- Name: barbeiro_servico_id_barbeiro_servico_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.barbeiro_servico_id_barbeiro_servico_seq', 2, true);


--
-- Name: disponibilidade_id_disponibilidade_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.disponibilidade_id_disponibilidade_seq', 1, true);


--
-- Name: endereco_id_endereco_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.endereco_id_endereco_seq', 1, true);


--
-- Name: favorito_id_favorito_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.favorito_id_favorito_seq', 1, true);


--
-- Name: foto_id_foto_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.foto_id_foto_seq', 1, true);


--
-- Name: horario_funcionamento_id_horario_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.horario_funcionamento_id_horario_seq', 1, true);


--
-- Name: item_agendamento_id_item_agendamento_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.item_agendamento_id_item_agendamento_seq', 1, true);


--
-- Name: promocao_id_promocao_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.promocao_id_promocao_seq', 1, true);


--
-- Name: promocao_servico_id_promocao_servico_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.promocao_servico_id_promocao_servico_seq', 1, true);


--
-- Name: proprietario_barbearia_id_proprietario_barbearia_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.proprietario_barbearia_id_proprietario_barbearia_seq', 1, true);


--
-- Name: servico_id_servico_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.servico_id_servico_seq', 1, true);


--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuario_id_usuario_seq', 4, true);


--
-- Name: agendamento agendamento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agendamento
    ADD CONSTRAINT agendamento_pkey PRIMARY KEY (id_agendamento);


--
-- Name: avaliacao avaliacao_id_agendamento_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.avaliacao
    ADD CONSTRAINT avaliacao_id_agendamento_key UNIQUE (id_agendamento);


--
-- Name: avaliacao avaliacao_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.avaliacao
    ADD CONSTRAINT avaliacao_pkey PRIMARY KEY (id_avaliacao);


--
-- Name: barbearia barbearia_cnpj_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barbearia
    ADD CONSTRAINT barbearia_cnpj_key UNIQUE (cnpj);


--
-- Name: barbearia barbearia_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barbearia
    ADD CONSTRAINT barbearia_pkey PRIMARY KEY (id_barbearia);


--
-- Name: barbeiro barbeiro_id_usuario_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barbeiro
    ADD CONSTRAINT barbeiro_id_usuario_key UNIQUE (id_usuario);


--
-- Name: barbeiro barbeiro_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barbeiro
    ADD CONSTRAINT barbeiro_pkey PRIMARY KEY (id_barbeiro);


--
-- Name: barbeiro_servico barbeiro_servico_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barbeiro_servico
    ADD CONSTRAINT barbeiro_servico_pkey PRIMARY KEY (id_barbeiro_servico);


--
-- Name: disponibilidade disponibilidade_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.disponibilidade
    ADD CONSTRAINT disponibilidade_pkey PRIMARY KEY (id_disponibilidade);


--
-- Name: endereco endereco_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.endereco
    ADD CONSTRAINT endereco_pkey PRIMARY KEY (id_endereco);


--
-- Name: favorito favorito_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorito
    ADD CONSTRAINT favorito_pkey PRIMARY KEY (id_favorito);


--
-- Name: foto foto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.foto
    ADD CONSTRAINT foto_pkey PRIMARY KEY (id_foto);


--
-- Name: horario_funcionamento horario_funcionamento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.horario_funcionamento
    ADD CONSTRAINT horario_funcionamento_pkey PRIMARY KEY (id_horario);


--
-- Name: item_agendamento item_agendamento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.item_agendamento
    ADD CONSTRAINT item_agendamento_pkey PRIMARY KEY (id_item_agendamento);


--
-- Name: promocao promocao_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promocao
    ADD CONSTRAINT promocao_pkey PRIMARY KEY (id_promocao);


--
-- Name: promocao_servico promocao_servico_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promocao_servico
    ADD CONSTRAINT promocao_servico_pkey PRIMARY KEY (id_promocao_servico);


--
-- Name: proprietario_barbearia proprietario_barbearia_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proprietario_barbearia
    ADD CONSTRAINT proprietario_barbearia_pkey PRIMARY KEY (id_proprietario_barbearia);


--
-- Name: servico servico_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servico
    ADD CONSTRAINT servico_pkey PRIMARY KEY (id_servico);


--
-- Name: barbeiro_servico uq_barbeiro_servico; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barbeiro_servico
    ADD CONSTRAINT uq_barbeiro_servico UNIQUE (id_barbeiro, id_servico);


--
-- Name: promocao_servico uq_promocao_servico; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promocao_servico
    ADD CONSTRAINT uq_promocao_servico UNIQUE (id_promocao, id_servico);


--
-- Name: proprietario_barbearia uq_proprietario_barbearia; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proprietario_barbearia
    ADD CONSTRAINT uq_proprietario_barbearia UNIQUE (id_usuario, id_barbearia);


--
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- Name: agendamento fk_agendamento_barbearia; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agendamento
    ADD CONSTRAINT fk_agendamento_barbearia FOREIGN KEY (id_barbearia) REFERENCES public.barbearia(id_barbearia);


--
-- Name: agendamento fk_agendamento_barbeiro; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agendamento
    ADD CONSTRAINT fk_agendamento_barbeiro FOREIGN KEY (id_barbeiro) REFERENCES public.barbeiro(id_barbeiro);


--
-- Name: agendamento fk_agendamento_cliente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agendamento
    ADD CONSTRAINT fk_agendamento_cliente FOREIGN KEY (id_cliente) REFERENCES public.usuario(id_usuario);


--
-- Name: avaliacao fk_avaliacao_agendamento; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.avaliacao
    ADD CONSTRAINT fk_avaliacao_agendamento FOREIGN KEY (id_agendamento) REFERENCES public.agendamento(id_agendamento);


--
-- Name: barbeiro fk_barbeiro_barbearia; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barbeiro
    ADD CONSTRAINT fk_barbeiro_barbearia FOREIGN KEY (id_barbearia) REFERENCES public.barbearia(id_barbearia);


--
-- Name: barbeiro_servico fk_barbeiro_servico_barbeiro; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barbeiro_servico
    ADD CONSTRAINT fk_barbeiro_servico_barbeiro FOREIGN KEY (id_barbeiro) REFERENCES public.barbeiro(id_barbeiro);


--
-- Name: barbeiro_servico fk_barbeiro_servico_servico; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barbeiro_servico
    ADD CONSTRAINT fk_barbeiro_servico_servico FOREIGN KEY (id_servico) REFERENCES public.servico(id_servico);


--
-- Name: barbeiro fk_barbeiro_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barbeiro
    ADD CONSTRAINT fk_barbeiro_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- Name: disponibilidade fk_disponibilidade_barbeiro; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.disponibilidade
    ADD CONSTRAINT fk_disponibilidade_barbeiro FOREIGN KEY (id_barbeiro) REFERENCES public.barbeiro(id_barbeiro);


--
-- Name: endereco fk_endereco_barbearia; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.endereco
    ADD CONSTRAINT fk_endereco_barbearia FOREIGN KEY (id_barbearia) REFERENCES public.barbearia(id_barbearia);


--
-- Name: favorito fk_favorito_barbearia; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorito
    ADD CONSTRAINT fk_favorito_barbearia FOREIGN KEY (id_barbearia) REFERENCES public.barbearia(id_barbearia);


--
-- Name: favorito fk_favorito_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorito
    ADD CONSTRAINT fk_favorito_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- Name: foto fk_foto_barbearia; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.foto
    ADD CONSTRAINT fk_foto_barbearia FOREIGN KEY (id_barbearia) REFERENCES public.barbearia(id_barbearia);


--
-- Name: horario_funcionamento fk_horario_barbearia; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.horario_funcionamento
    ADD CONSTRAINT fk_horario_barbearia FOREIGN KEY (id_barbearia) REFERENCES public.barbearia(id_barbearia);


--
-- Name: item_agendamento fk_item_agendamento_agendamento; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.item_agendamento
    ADD CONSTRAINT fk_item_agendamento_agendamento FOREIGN KEY (id_agendamento) REFERENCES public.agendamento(id_agendamento);


--
-- Name: item_agendamento fk_item_agendamento_servico; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.item_agendamento
    ADD CONSTRAINT fk_item_agendamento_servico FOREIGN KEY (id_servico) REFERENCES public.servico(id_servico);


--
-- Name: promocao fk_promocao_barbearia; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promocao
    ADD CONSTRAINT fk_promocao_barbearia FOREIGN KEY (id_barbearia) REFERENCES public.barbearia(id_barbearia);


--
-- Name: promocao_servico fk_promocao_servico_promocao; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promocao_servico
    ADD CONSTRAINT fk_promocao_servico_promocao FOREIGN KEY (id_promocao) REFERENCES public.promocao(id_promocao);


--
-- Name: promocao_servico fk_promocao_servico_servico; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promocao_servico
    ADD CONSTRAINT fk_promocao_servico_servico FOREIGN KEY (id_servico) REFERENCES public.servico(id_servico);


--
-- Name: proprietario_barbearia fk_proprietario_barbearia; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proprietario_barbearia
    ADD CONSTRAINT fk_proprietario_barbearia FOREIGN KEY (id_barbearia) REFERENCES public.barbearia(id_barbearia);


--
-- Name: proprietario_barbearia fk_proprietario_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proprietario_barbearia
    ADD CONSTRAINT fk_proprietario_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- Name: servico fk_servico_barbearia; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servico
    ADD CONSTRAINT fk_servico_barbearia FOREIGN KEY (id_barbearia) REFERENCES public.barbearia(id_barbearia);


--
-- PostgreSQL database dump complete
--

