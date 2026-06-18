--
-- PostgreSQL database dump
--

\restrict p1QS25NuhyNGL2ssjV95yBgba1XblbzEAnVKZ22rllIrb7CFk0orUsfrmjqh2j1

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

-- Started on 2026-06-18 09:25:45

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 25492)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 4979 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 25569)
-- Name: ActivityLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ActivityLog" (
    id text NOT NULL,
    action text NOT NULL,
    type text NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ActivityLog" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 25561)
-- Name: AiQueryHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AiQueryHistory" (
    id text NOT NULL,
    query text NOT NULL,
    sql text,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AiQueryHistory" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 25526)
-- Name: Allocation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Allocation" (
    id text NOT NULL,
    "assetId" text NOT NULL,
    "employeeId" text NOT NULL,
    "allocatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expectedReturnDate" timestamp(3) without time zone,
    "actualReturnDate" timestamp(3) without time zone,
    status text DEFAULT 'Active'::text NOT NULL,
    notes text
);


ALTER TABLE public."Allocation" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 25518)
-- Name: Asset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Asset" (
    id text NOT NULL,
    "assetId" text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    "departmentId" text NOT NULL,
    manufacturer text,
    model text,
    "serialNumber" text,
    "purchaseDate" timestamp(3) without time zone,
    "purchaseCost" integer,
    location text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    status text DEFAULT 'In Stock'::text NOT NULL
);


ALTER TABLE public."Asset" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 25543)
-- Name: DamageReport; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DamageReport" (
    id text NOT NULL,
    "assetId" text NOT NULL,
    "reportedById" text NOT NULL,
    "reportedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    severity text NOT NULL,
    description text NOT NULL,
    "imageUrl" text,
    status text DEFAULT 'Open'::text NOT NULL
);


ALTER TABLE public."DamageReport" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 25501)
-- Name: Department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Department" (
    id text NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Department" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 25509)
-- Name: Employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Employee" (
    id text NOT NULL,
    "employeeId" text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    email text NOT NULL,
    role text NOT NULL,
    "departmentId" text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    "userId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Employee" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 25552)
-- Name: Request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Request" (
    id text NOT NULL,
    type text NOT NULL,
    description text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "employeeId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Request" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 25535)
-- Name: ReturnEvent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ReturnEvent" (
    id text NOT NULL,
    "assetId" text NOT NULL,
    "employeeId" text NOT NULL,
    "returnedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    condition text NOT NULL,
    notes text
);


ALTER TABLE public."ReturnEvent" OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 25493)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 4973 (class 0 OID 25569)
-- Dependencies: 224
-- Data for Name: ActivityLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ActivityLog" (id, action, type, "timestamp") FROM stdin;
cmpaziw7900024193ym3k5e5b	Allocated AST-1051 to Rohan Joshi via AI	allocation	2026-05-18 09:11:38.373
\.


--
-- TOC entry 4972 (class 0 OID 25561)
-- Dependencies: 223
-- Data for Name: AiQueryHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AiQueryHistory" (id, query, sql, "timestamp") FROM stdin;
\.


--
-- TOC entry 4968 (class 0 OID 25526)
-- Dependencies: 219
-- Data for Name: Allocation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Allocation" (id, "assetId", "employeeId", "allocatedAt", "expectedReturnDate", "actualReturnDate", status, notes) FROM stdin;
cmpa2ndsp00cugona8vo1ymc6	cmpa2ndn00060gonagtvntivn	cmpa2ndix001lgonatx5vzgw9	2026-04-09 00:00:00	2026-11-19 00:00:00	\N	Active	Demo assignment
cmpa2ndsv00d2gonac4n7ht8x	cmpa2ndmk005ggonaeorh5jwv	cmpa2ndji0026gonadncegkgh	2026-04-04 00:00:00	2026-09-22 00:00:00	\N	Active	Demo assignment
cmpa2ndsx00d6gonax588ju7u	cmpa2ndp1008igonau59yp9r6	cmpa2ndk6002xgona4n875bud	2026-04-09 00:00:00	2026-10-24 00:00:00	\N	Active	Demo assignment
cmpa2ndsz00d8gona782c8q6q	cmpa2ndqy00awgona0gklxb2c	cmpa2ndlc0043gonay0m3rwx9	2026-04-15 00:00:00	2026-09-21 00:00:00	\N	Active	Demo assignment
cmpa2ndt100dagonai4s07fbm	cmpa2ndrc00begonadrvkkvcp	cmpa2ndko003fgona51y9c53k	2026-05-02 00:00:00	2026-11-16 00:00:00	\N	Active	Demo assignment
cmpa2ndt500dggona5osmsapf	cmpa2ndnf006igonacgqk94id	cmpa2ndjt002igonas737211c	2026-04-15 00:00:00	2026-11-26 00:00:00	\N	Active	Demo assignment
cmpa2ndt900dmgonah37fyr39	cmpa2ndm70052gona3p4qxep0	cmpa2ndko003fgona51y9c53k	2026-04-28 00:00:00	2026-10-07 00:00:00	\N	Active	Demo assignment
cmpa2ndth00dwgonarcnipsed	cmpa2ndri00bmgonafvyxj60e	cmpa2ndjb0020gona5rg0vf6t	2026-04-24 00:00:00	2026-08-28 00:00:00	\N	Active	Demo assignment
cmpa2ndtp00e8gonacgman6k0	cmpa2ndr100b0gonaznkg0v7t	cmpa2ndlm004cgona6da67ls6	2026-05-06 00:00:00	2026-11-23 00:00:00	\N	Active	Demo assignment
cmpa2ndtq00eagonajjjtk2om	cmpa2ndo8007igonajkh5f07d	cmpa2ndhi0009gonapnp8vlyl	2026-04-12 00:00:00	2026-09-14 00:00:00	\N	Active	Demo assignment
cmpa2ndtr00ecgonapauuygqm	cmpa2ndq700a0gonabvgijufv	cmpa2ndjt002igonas737211c	2026-04-20 00:00:00	2026-09-08 00:00:00	\N	Active	Demo assignment
cmpa2ndtt00eegonao09tdaoa	cmpa2ndnb006egonad2x99f8i	cmpa2ndig0013gonakwyt6tug	2026-03-30 00:00:00	2026-10-09 00:00:00	\N	Active	Demo assignment
cmpa2ndtu00eggona262wv25o	cmpa2ndm1004ugonadhs1uylu	cmpa2ndiu001igonaykwx2cux	2026-04-29 00:00:00	2026-11-08 00:00:00	\N	Active	Demo assignment
cmpa2ndty00emgonaq53a8ba5	cmpa2ndsc00ckgonakc6hb9yy	cmpa2ndjl0029gona699k6mm4	2026-04-25 00:00:00	2026-09-09 00:00:00	\N	Active	Demo assignment
cmpa2ndu900f0gonazblak74k	cmpa2ndq6009ygona6zadz64d	cmpa2ndid0010gona5igbkh55	2026-05-02 00:00:00	2026-10-14 00:00:00	\N	Active	Demo assignment
cmpa2nduc00f4gona3i40dcth	cmpa2ndq1009sgonag9he4pjc	cmpa2ndi2000ogonaczgn6lw4	2026-04-02 00:00:00	2026-10-21 00:00:00	\N	Active	Demo assignment
cmpa2ndug00fagona1eyidqml	cmpa2ndps009ggonaz5yo81qx	cmpa2ndji0026gonadncegkgh	2026-04-29 00:00:00	2026-10-17 00:00:00	\N	Active	Demo assignment
cmpa2ndun00fkgona6u8sb6gn	cmpa2ndpn009agonadvypsxg4	cmpa2ndjl0029gona699k6mm4	2026-04-18 00:00:00	2026-08-29 00:00:00	\N	Active	Demo assignment
cmpa2ndu400eugona3yjsozx5	cmpa2ndnj006ogonax8ajx2xw	cmpa2ndjz002ogona5k3q021o	2026-03-31 00:00:00	2026-03-31 12:00:00	2026-03-31 12:00:00	Returned	Demo assignment
cmpa2ndup00fmgona38tl844m	cmpa2nds300cagonamxizdt11	cmpa2ndho000cgonaeohxqkna	2026-05-04 00:00:00	2026-05-11 00:00:00	2026-05-11 00:00:00	Returned	Demo assignment
cmpa2nduf00f8gonarq5oarc9	cmpa2ndrn00bsgonalrmcowdh	cmpa2ndjz002ogona5k3q021o	2026-04-13 00:00:00	2026-05-15 00:00:00	2026-05-15 00:00:00	Returned	Demo assignment
cmpa2ndul00fggonaxundd7yn	cmpa2ndog007sgonaxcq1338q	cmpa2ndk6002xgona4n875bud	2026-04-01 00:00:00	2026-04-02 00:00:00	2026-04-02 00:00:00	Returned	Demo assignment
cmpa2ndum00figonaldlvppxj	cmpa2ndo3007agonaczgwcuvu	cmpa2ndkt003lgonar6ofa1iq	2026-05-13 00:00:00	2026-11-30 00:00:00	\N	Active	Demo assignment
cmpa2nduh00fcgonaiz038yif	cmpa2ndql00aggonaijf1avzg	cmpa2ndlc0043gonay0m3rwx9	2026-05-03 00:00:00	2026-05-12 00:00:00	2026-05-12 00:00:00	Returned	Demo assignment
cmpa2ndu700eygona3q0xvz9y	cmpa2ndq6009ygona6zadz64d	cmpa2ndjw002lgonalx8ldgrl	2026-04-10 00:00:00	2026-05-01 00:00:00	2026-05-01 00:00:00	Returned	Demo assignment
cmpa2ndtm00e4gonaei4pl7vr	cmpa2ndng006kgonalqmd8td2	cmpa2ndj3001rgonae6kb8pqr	2026-04-08 00:00:00	2026-05-11 00:00:00	2026-05-11 00:00:00	Returned	Demo assignment
cmpa2ndus00fqgonabtfn6jzx	cmpa2ndrl00bqgona93xojqzf	cmpa2ndia000xgona2s7sgn9j	2026-04-26 00:00:00	2026-05-13 00:00:00	2026-05-13 00:00:00	Returned	Demo assignment
cmpa2ndt200dcgona3hjd1eqn	cmpa2ndpp009cgonadkxbibhl	cmpa2ndki0039gonau2rm9t43	2026-03-27 00:00:00	2026-03-28 00:00:00	2026-03-28 00:00:00	Returned	Demo assignment
cmpa2nduj00fegonad137e3c4	cmpa2ndme005agonapz7ri9km	cmpa2ndj0001ogona4whqsycf	2026-04-21 00:00:00	2026-05-04 00:00:00	2026-05-04 00:00:00	Returned	Demo assignment
cmpa2ndt300degonaq3cpfhmd	cmpa2ndod007ogonakhj0q2q6	cmpa2ndii0016gonaib4zw8w3	2026-04-27 00:00:00	2026-05-13 00:00:00	2026-05-13 00:00:00	Returned	Demo assignment
cmpa2ndtf00dugonapu98kbtu	cmpa2ndrc00begonadrvkkvcp	cmpa2ndjl0029gona699k6mm4	2026-04-13 00:00:00	2026-05-01 00:00:00	2026-05-01 00:00:00	Returned	Demo assignment
cmpa2ndsj00cqgona3ap1xoax	cmpa2ndnz0076gonaa0l3t0i8	cmpa2ndjw002lgonalx8ldgrl	2026-04-15 13:00:00	2026-05-01 10:00:00	2026-05-01 10:00:00	Returned	Demo assignment
cmpa2ndt800dkgona1dvxlm6q	cmpa2ndlx004ogonaxz8eh6x4	cmpa2ndko003fgona51y9c53k	2026-04-09 00:00:00	2026-04-26 00:00:00	2026-04-26 00:00:00	Returned	Demo assignment
cmpa2ndtj00e0gona5dk07yhr	cmpa2ndoo0082gonaaqzibbu9	cmpa2ndjl0029gona699k6mm4	2026-03-31 00:00:00	2026-04-22 00:00:00	2026-04-22 00:00:00	Returned	Demo assignment
cmpa2ndtx00ekgonarjv750ly	cmpa2ndri00bmgonafvyxj60e	cmpa2ndil0019gonaqf6nn8b3	2026-04-14 00:00:00	2026-04-23 00:00:00	2026-04-23 00:00:00	Returned	Demo assignment
cmpa2ndu200eqgonatuasknlj	cmpa2ndrd00bggona883hpdtp	cmpa2ndkd0033gonaghp220pe	2026-04-26 00:00:00	2026-05-15 00:00:00	2026-05-15 00:00:00	Returned	Demo assignment
cmpa2ndsn00csgona2y39eo1l	cmpa2ndml005igonax5ykdlhd	cmpa2ndjb0020gona5rg0vf6t	2026-04-15 00:00:00	2026-04-22 00:00:00	2026-04-22 00:00:00	Returned	Demo assignment
cmpa2ndu300esgonaeu38c2w1	cmpa2ndo3007agonaczgwcuvu	cmpa2ndjn002cgonatxxlp2x5	2026-04-16 00:00:00	2026-05-13 00:00:00	2026-05-13 00:00:00	Returned	Demo assignment
cmpa2nduq00fogona8vugqq9c	cmpa2ndmf005cgonas8csvf2d	cmpa2ndho000cgonaeohxqkna	2026-05-14 00:00:00	2026-11-07 00:00:00	\N	Active	Demo assignment
cmpa2ndtl00e2gonauy9868tc	cmpa2ndpm0098gonaom3euqy1	cmpa2ndjz002ogona5k3q021o	2026-04-01 00:00:00	2026-04-11 00:00:00	2026-04-11 00:00:00	Returned	Demo assignment
cmpa2ndtc00dqgona1kj47yzg	cmpa2ndlx004ogonaxz8eh6x4	cmpa2ndjw002lgonalx8ldgrl	2026-03-27 00:00:00	2026-05-12 00:00:00	2026-05-12 00:00:00	Returned	Demo assignment
cmpa2ndud00f6gonafocb6fjf	cmpa2ndpn009agonadvypsxg4	cmpa2ndje0023gona93fgwtms	2026-04-10 00:00:00	2026-04-17 00:00:00	2026-04-17 00:00:00	Returned	Demo assignment
cmpa2ndt600digona58q6kowz	cmpa2ndmw005ugonayvnyboz9	cmpa2ndl6003xgonapyo7mo6g	2026-04-25 00:00:00	2026-05-03 00:00:00	2026-05-03 00:00:00	Returned	Demo assignment
cmpa2ndtw00eigonae0si911q	cmpa2ndp1008igonau59yp9r6	cmpa2ndii0016gonaib4zw8w3	2026-04-07 00:00:00	2026-04-08 00:00:00	2026-04-08 00:00:00	Returned	Demo assignment
cmpa2ndsw00d4gona5qjnogx0	cmpa2ndob007mgona53mh8nip	cmpa2ndkg0036gonab8l0zcg8	2026-05-05 00:00:00	2026-05-13 00:00:00	2026-05-13 00:00:00	Returned	Demo assignment
cmpa2ndu000eogonawlcrp5of	cmpa2ndlx004ogonaxz8eh6x4	cmpa2ndk1002rgonandw93b6m	2026-05-12 00:00:00	2026-05-20 00:00:00	2026-04-08 00:00:00	Returned	Demo assignment
cmpa2ndu600ewgonalep46ui0	cmpa2ndnr006ygonabnt1i1f3	cmpa2ndkw003ogonaiodzx0qq	2026-04-14 00:00:00	2026-05-11 00:00:00	2026-05-11 00:00:00	Returned	Demo assignment
cmpa2ndti00dygonavsy5wcrw	cmpa2ndmu005sgonaqwcajsd9	cmpa2ndjt002igonas737211c	2026-04-16 00:00:00	2026-05-03 00:00:00	2026-05-03 00:00:00	Returned	Demo assignment
cmpa2ndsq00cwgonar9wywhq4	cmpa2ndlx004ogonaxz8eh6x4	cmpa2ndki0039gonau2rm9t43	2026-05-12 00:00:00	2026-03-30 00:00:00	2026-03-30 00:00:00	Returned	Demo assignment
cmpa2ndv400g6gonawovqzgxi	cmpa2ndms005qgonakuukacjy	cmpa2ndkq003igonajbb2zvoc	2026-04-05 00:00:00	2026-11-17 00:00:00	\N	Active	Demo assignment
cmpa2ndv600g8gonaygd36uvt	cmpa2ndmb0056gonagek7d8n8	cmpa2ndid0010gona5igbkh55	2026-03-29 00:00:00	2026-11-29 00:00:00	\N	Active	Demo assignment
cmpa2ndv700gagona0sotzsd7	cmpa2ndlz004qgonarmtub7p8	cmpa2ndjn002cgonatxxlp2x5	2026-04-04 00:00:00	2026-08-26 00:00:00	\N	Active	Demo assignment
cmpa2ndv800gcgonafp25b331	cmpa2ndqu00asgona8lytevgm	cmpa2ndl90040gonahl0v72mu	2026-04-22 00:00:00	2026-10-22 00:00:00	\N	Active	Demo assignment
cmpa2ndvb00gggonaj6ksz1yd	cmpa2ndnm006sgonaj5801ayb	cmpa2ndix001lgonatx5vzgw9	2026-04-13 00:00:00	2026-09-24 00:00:00	\N	Active	Demo assignment
cmpa2ndvd00gigonaera6ratv	cmpa2ndog007sgonaxcq1338q	cmpa2ndk1002rgonandw93b6m	2026-04-03 00:00:00	2026-10-18 00:00:00	\N	Active	Demo assignment
cmpa2ndve00gkgonadkb9jg0n	cmpa2ndme005agonapz7ri9km	cmpa2ndl6003xgonapyo7mo6g	2026-05-05 00:00:00	2026-11-26 00:00:00	\N	Active	Demo assignment
cmpa2ndvn00gwgonaahmtsfmw	cmpa2ndmu005sgonaqwcajsd9	cmpa2ndid0010gona5igbkh55	2026-05-04 00:00:00	2026-09-12 00:00:00	\N	Active	Demo assignment
cmpa2ndvo00gygonarb6q1yns	cmpa2ndp2008kgonap2reszko	cmpa2ndl2003ugona3x3nbhuw	2026-04-08 00:00:00	2026-09-13 00:00:00	\N	Active	Demo assignment
cmpa2ndvq00h0gonau26h5mpu	cmpa2ndm0004sgona86dtiwsz	cmpa2ndk1002rgonandw93b6m	2026-04-11 00:00:00	2026-10-06 00:00:00	\N	Active	Demo assignment
cmpa2ndvt00h4gona2efmqqbv	cmpa2ndqr00aogonaln2qr3r5	cmpa2ndi5000rgonaisrscagb	2026-04-01 00:00:00	2026-11-02 00:00:00	\N	Active	Demo assignment
cmpa2ndto00e6gonainc4dare	cmpa2ndmz005ygonaw5qqpal8	cmpa2ndhi0009gonapnp8vlyl	2026-03-28 00:00:00	2026-04-10 00:00:00	2026-04-10 00:00:00	Returned	Demo assignment
cmpa2ndux00fwgona1ycgnz17	cmpa2ndnz0076gonaa0l3t0i8	cmpa2ndjq002fgona2g5bj8hd	2026-03-28 00:00:00	2026-04-15 12:00:00	2026-04-15 12:00:00	Returned	Demo assignment
cmpa2ngqx0001lethx2d1f3rv	cmpa2ndnz0076gonaa0l3t0i8	cmpa2ndk90030gonazcwqkft3	2026-05-01 11:00:00	2026-10-28 23:59:59.985	2026-05-17 17:51:24.306	Returned	AI automated validation test
cmpa2ndv900gegonawkhqennc	cmpa2ndov008agonaht3fq9l4	cmpa2ndjl0029gona699k6mm4	2026-04-24 00:00:00	2026-05-13 00:00:00	2026-05-13 00:00:00	Returned	Demo assignment
cmpatjfax0002ayraal4v24iu	cmpa2ndls004igona7gt7igwc	cmpa2ndho000cgonaeohxqkna	2026-05-18 06:24:05.433	2026-05-21 00:00:00	2026-05-18 06:24:56.171	Returned	
cmpa2ndvr00h2gona1s262rro	cmpa2ndmi005egonaaovy28cb	cmpa2ndje0023gona93fgwtms	2026-04-16 00:00:00	2026-05-13 00:00:00	2026-05-13 00:00:00	Returned	Demo assignment
cmpa2ndvh00gogonajgeohzxv	cmpa2ndqq00amgonayjtiorhd	cmpa2ndlf0046gonafryqn5wp	2026-05-01 00:00:00	2026-05-13 00:00:00	2026-05-13 00:00:00	Returned	Demo assignment
cmpa3j7g6000f7mzgyu6u7t4l	cmpa3j7fv00057mzg0bdc9hzz	cmpa3j7fp00017mzgdtgkrmjm	2026-05-07 18:16:05.119	2026-05-14 18:16:05.236	2026-05-14 23:46:05	Returned	Overdue allocation: Development project
cmpa2ndss00cygonafhezjame	cmpa2ndn60068gonakembqv4w	cmpa2ndj3001rgonae6kb8pqr	2026-04-20 00:00:00	2026-05-15 00:00:00	2026-05-15 00:00:00	Returned	Demo assignment
cmpa3j7g8000h7mzg183gszuw	cmpa3j7fy00077mzgekwvs35j	cmpa3j7ft00037mzgai5x77fs	2026-05-05 18:16:05.119	2026-05-12 18:16:05.239	2026-05-12 23:46:05	Returned	Overdue allocation: Premium monitor setup
cmpa2nduz00fygonamlnxusax	cmpa2ndr700b8gonamvzkd4a9	cmpa2ndjz002ogona5k3q021o	2026-05-02 00:00:00	2026-05-12 00:00:00	2026-05-12 00:00:00	Returned	Demo assignment
cmpa2ndte00dsgona72qdo872	cmpa2ndlz004qgonarmtub7p8	cmpa2ndlc0043gonay0m3rwx9	2026-05-01 00:00:00	2026-08-28 00:00:00	2026-05-13 00:00:00	Returned	Demo assignment
cmpa3j7g9000j7mzgwm24le5u	cmpa3j7fz00097mzg13q9ov31	cmpa3j7fp00017mzgdtgkrmjm	2026-05-12 18:16:05.119	2026-05-19 18:16:05.24	\N	Active	Due soon allocation: Android app testing
cmpa3j7gb000l7mzg124fm0pm	cmpa3j7g1000b7mzgiobbb734	cmpa3j7ft00037mzgai5x77fs	2026-05-13 18:16:05.119	2026-05-21 18:16:05.242	\N	Active	Due soon allocation: Design feedback work
cmpa3j7gd000n7mzg1asghr36	cmpa3j7g3000d7mzg3bvmfyjg	cmpa3j7fp00017mzgdtgkrmjm	2026-05-14 18:16:05.119	2026-05-22 18:16:05.244	\N	Active	Due soon allocation: Creative illustration drawings
cmpa2ndvf00gmgonaj5spu3nk	cmpa2ndof007qgonao9ph42e8	cmpa2ndkt003lgonar6ofa1iq	2026-05-04 00:00:00	2026-05-15 00:00:00	2026-05-15 00:00:00	Returned	Demo assignment
cmpa2ndut00fsgonaa0jufplq	cmpa2ndop0084gonarygvm7co	cmpa2ndk6002xgona4n875bud	2026-05-02 00:00:00	2026-05-12 00:00:00	2026-05-12 00:00:00	Returned	Demo assignment
cmpavvwpr000eayrakry5axa8	cmpa2ndls004igona7gt7igwc	cmpa2ndho000cgonaeohxqkna	2026-05-18 07:29:47.103	2026-05-21 00:00:00	2026-05-18 07:30:33.194	Returned	
cmpa2ndv200g2gonakcothox0	cmpa2ndm5004ygonavqk34id5	cmpa2ndkw003ogonaiodzx0qq	2026-04-14 00:00:00	2026-05-15 00:00:00	2026-05-15 00:00:00	Returned	Demo assignment
cmpa2ndvl00gugonaex2a1von	cmpa2ndm5004ygonavqk34id5	cmpa2ndjq002fgona2g5bj8hd	2026-05-15 00:00:00	2026-09-09 00:00:00	\N	Active	Demo assignment
cmpa2ndst00d0gona38t7u889	cmpa2ndm3004wgona8ka933fo	cmpa2ndi5000rgonaisrscagb	2026-04-28 00:00:00	2026-05-11 00:00:00	2026-05-11 00:00:00	Returned	Demo assignment
cmpa2ndtb00dogonah3plymak	cmpa2ndm60050gona5xjkl66y	cmpa2ndlm004cgona6da67ls6	2026-03-29 00:00:00	2026-05-13 00:00:00	2026-05-13 00:00:00	Returned	Demo assignment
cmpa2ndv300g4gonaopxdvngy	cmpa2ndmf005cgonas8csvf2d	cmpa2ndkw003ogonaiodzx0qq	2026-03-30 00:00:00	2026-05-14 00:00:00	2026-05-14 00:00:00	Returned	Demo assignment
cmpa2nduw00fugona206lekjt	cmpa2ndq900a2gonaah4jjffl	cmpa2ndjt002igonas737211c	2026-04-08 00:00:00	2026-04-14 00:00:00	2026-04-14 00:00:00	Returned	Demo assignment
cmpa2ndvk00gsgona3ji0djwl	cmpa2ndpt009igona0g61fjiu	cmpa2ndk90030gonazcwqkft3	2026-04-15 00:00:00	2026-05-14 00:00:00	2026-05-14 00:00:00	Returned	Demo assignment
cmpa2ndvi00gqgonao7yyz991	cmpa2ndse00cogona0qyisbsd	cmpa2ndjb0020gona5rg0vf6t	2026-04-29 00:00:00	2026-05-14 00:00:00	2026-05-14 00:00:00	Returned	Demo assignment
cmpaz6m2n0002hz97h0nfqggs	cmpa2ndlt004kgona1nh8iuta	cmpa2ndhr000fgonaeqe108p9	2026-05-18 09:02:05.374	2026-05-22 00:00:00	2026-05-18 09:03:11.215	Returned	
cmpa2ndv000g0gonac6vnnswh	cmpa2ndlz004qgonarmtub7p8	cmpa2ndjt002igonas737211c	2026-05-01 00:00:00	2026-05-11 00:00:00	2026-05-11 00:00:00	Returned	Demo assignment
cmpaziw6z00014193c965yf71	cmpa2ndnz0076gonaa0l3t0i8	cmpa2ndk90030gonazcwqkft3	2026-05-18 09:11:38.361	2026-06-01 09:11:38.361	\N	Active	AI Automated Allocation
\.


--
-- TOC entry 4967 (class 0 OID 25518)
-- Dependencies: 218
-- Data for Name: Asset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Asset" (id, "assetId", name, category, "departmentId", manufacturer, model, "serialNumber", "purchaseDate", "purchaseCost", location, "createdAt", "updatedAt", status) FROM stdin;
cmpa2ndlt004kgona1nh8iuta	AST-1004	iPhone 14	Phone	cmpa2ndhc0006gonajyctjxmc	iPhone	v2.0	SN1004	2025-09-29 00:00:00	69999	Reception	2026-05-17 17:51:20.226	2026-05-18 09:03:11.276	Damaged
cmpa2ndlz004qgonarmtub7p8	AST-1007	Logitech Mouse	Accessory	cmpa2ndh60001gonazdq83mno	Logitech	v2.0	SN1007	2025-12-04 00:00:00	1490	Reception	2026-05-17 17:51:20.231	2026-05-17 18:19:20.293	Allocated
cmpa2ndm1004ugonadhs1uylu	AST-1009	Logitech Mouse	Accessory	cmpa2ndh90003gonagzy5mk2f	Logitech	v2.0	SN1009	2025-06-22 00:00:00	1490	Server Room	2026-05-17 17:51:20.233	2026-05-17 18:19:20.297	Allocated
cmpa2ndm5004ygonavqk34id5	AST-1011	HP Monitor	Monitor	cmpa2ndhc0006gonajyctjxmc	HP	v2.0	SN1011	2025-10-24 00:00:00	16500	Reception	2026-05-17 17:51:20.237	2026-05-17 18:19:20.3	Allocated
cmpa2ndm3004wgona8ka933fo	AST-1010	Dell XPS	Laptop	cmpa2ndhb0005gona0jao37us	Dell	v2.0	SN1010	2025-09-01 00:00:00	105000	Server Room	2026-05-17 17:51:20.235	2026-05-17 18:04:06.77	In Stock
cmpa2ndm70052gona3p4qxep0	AST-1013	iPhone 14	Phone	cmpa2ndh90003gonagzy5mk2f	iPhone	v2.0	SN1013	2025-11-05 00:00:00	72000	Main Office	2026-05-17 17:51:20.24	2026-05-17 18:19:20.303	Damaged
cmpa2ndm60050gona5xjkl66y	AST-1012	HP Monitor	Monitor	cmpa2ndh70002gonabiinestw	HP	v2.0	SN1012	2025-09-11 00:00:00	19000	Storage Room	2026-05-17 17:51:20.238	2026-05-17 18:04:06.773	In Stock
cmpa2ndmb0056gonagek7d8n8	AST-1015	iPhone 14	Phone	cmpa2ndfw0000gonamgv7v03p	iPhone	v2.0	SN1015	2025-03-21 00:00:00	72000	Sales Room	2026-05-17 17:51:20.243	2026-05-17 18:19:20.307	Allocated
cmpa2ndm90054gonapb3xm5ys	AST-1014	Dell XPS	Laptop	cmpa2ndhc0006gonajyctjxmc	Dell	v2.0	SN1014	2025-04-25 00:00:00	115000	Storage Room	2026-05-17 17:51:20.241	2026-05-17 18:04:06.776	In Stock
cmpa2ndme005agonapz7ri9km	AST-1017	HP Monitor	Monitor	cmpa2ndha0004gona0ssfvjig	HP	v2.0	SN1017	2025-03-25 00:00:00	19500	Main Office	2026-05-17 17:51:20.246	2026-05-17 18:19:20.311	Allocated
cmpa2ndmc0058gonaicjoqwet	AST-1016	HP Monitor	Monitor	cmpa2ndh90003gonagzy5mk2f	HP	v2.0	SN1016	2025-01-24 00:00:00	24000	Reception	2026-05-17 17:51:20.245	2026-05-17 18:04:06.779	In Stock
cmpa2ndmf005cgonas8csvf2d	AST-1018	iPhone 14	Phone	cmpa2ndhc0006gonajyctjxmc	iPhone	v2.0	SN1018	2025-04-28 00:00:00	72999	Sales Room	2026-05-17 17:51:20.247	2026-05-17 18:19:20.314	Allocated
cmpa2ndmz005ygonaw5qqpal8	AST-1029	Logitech Mouse	Accessory	cmpa2ndh60001gonazdq83mno	Logitech	v2.0	SN1029	2025-06-29 00:00:00	1490	Storage Room	2026-05-17 17:51:20.267	2026-05-17 18:31:10.394	In Stock
cmpa2ndmi005egonaaovy28cb	AST-1019	HP Monitor	Monitor	cmpa2ndhb0005gona0jao37us	HP	v2.0	SN1019	2025-12-12 00:00:00	22000	Main Office	2026-05-17 17:51:20.25	2026-05-17 18:04:06.783	In Stock
cmpa2ndms005qgonakuukacjy	AST-1025	Logitech Mouse	Accessory	cmpa2ndh60001gonazdq83mno	Logitech	v2.0	SN1025	2025-12-09 00:00:00	1490	Server Room	2026-05-17 17:51:20.26	2026-05-17 18:19:20.323	Allocated
cmpa2ndmu005sgonaqwcajsd9	AST-1026	HP Monitor	Monitor	cmpa2ndh90003gonagzy5mk2f	HP	v2.0	SN1026	2025-01-24 00:00:00	19500	Server Room	2026-05-17 17:51:20.262	2026-05-17 18:19:20.326	Allocated
cmpa2ndmn005kgonafw5kx1hb	AST-1022	Logitech Mouse	Accessory	cmpa2ndfw0000gonamgv7v03p	Logitech	v2.0	SN1022	2025-10-31 00:00:00	1799	Storage Room	2026-05-17 17:51:20.255	2026-05-17 18:04:06.787	In Stock
cmpa2ndmp005mgonavrcny98q	AST-1023	HP Monitor	Monitor	cmpa2ndha0004gona0ssfvjig	HP	v2.0	SN1023	2025-05-12 00:00:00	17999	Server Room	2026-05-17 17:51:20.257	2026-05-17 18:04:06.789	In Stock
cmpa2ndmq005ogona42gt4cy9	AST-1024	Logitech Mouse	Accessory	cmpa2ndhb0005gona0jao37us	Logitech	v2.0	SN1024	2025-09-21 00:00:00	1199	Main Office	2026-05-17 17:51:20.259	2026-05-17 18:04:06.79	In Stock
cmpa2ndls004igona7gt7igwc	AST-1003	HP Monitor	Monitor	cmpa2ndh90003gonagzy5mk2f	HP	v2.0	SN1003	2025-12-23 00:00:00	21000	Server Room	2026-05-17 17:51:20.224	2026-05-18 07:30:33.224	Damaged
cmpa2ndmx005wgonae2rbp2gc	AST-1028	iPhone 14	Phone	cmpa2ndfw0000gonamgv7v03p	iPhone	v2.0	SN1028	2025-03-18 00:00:00	72000	Main Office	2026-05-17 17:51:20.266	2026-05-17 18:19:20.331	Damaged
cmpa2ndml005igonax5ykdlhd	AST-1021	HP Monitor	Monitor	cmpa2ndhb0005gona0jao37us	HP	v2.0	SN1021	2025-11-04 00:00:00	19500	Sales Room	2026-05-17 17:51:20.254	2026-05-17 18:31:10.425	In Stock
cmpa2ndn00060gonagtvntivn	AST-1030	Dell XPS	Laptop	cmpa2ndh60001gonazdq83mno	Dell	v2.0	SN1030	2026-01-19 00:00:00	98000	Main Office	2026-05-17 17:51:20.268	2026-05-17 18:19:20.337	Allocated
cmpa2ndnb006egonad2x99f8i	AST-1037	Logitech Mouse	Accessory	cmpa2ndha0004gona0ssfvjig	Logitech	v2.0	SN1037	2025-03-10 00:00:00	1490	Main Office	2026-05-17 17:51:20.28	2026-05-17 18:19:20.34	Allocated
cmpa2ndnf006igonacgqk94id	AST-1039	iPhone 14	Phone	cmpa2ndhb0005gona0jao37us	iPhone	v2.0	SN1039	2025-02-21 00:00:00	72000	Main Office	2026-05-17 17:51:20.283	2026-05-17 18:19:20.342	Allocated
cmpa2ndn20062gonavy523mzv	AST-1031	Logitech Mouse	Accessory	cmpa2ndh70002gonabiinestw	Logitech	v2.0	SN1031	2025-07-02 00:00:00	1099	Main Office	2026-05-17 17:51:20.27	2026-05-17 18:04:06.799	In Stock
cmpa2ndn30064gonajvp61mzu	AST-1032	HP Monitor	Monitor	cmpa2ndh90003gonagzy5mk2f	HP	v2.0	SN1032	2025-11-25 00:00:00	14500	Storage Room	2026-05-17 17:51:20.272	2026-05-17 18:04:06.8	In Stock
cmpa2ndn50066gonawbbibd5h	AST-1033	Dell XPS	Laptop	cmpa2ndh90003gonagzy5mk2f	Dell	v2.0	SN1033	2025-12-10 00:00:00	89999	IT Department	2026-05-17 17:51:20.273	2026-05-17 18:04:06.802	In Stock
cmpa2ndn60068gonakembqv4w	AST-1034	HP Monitor	Monitor	cmpa2ndfw0000gonamgv7v03p	HP	v2.0	SN1034	2025-12-19 00:00:00	18500	IT Department	2026-05-17 17:51:20.275	2026-05-17 18:04:06.803	In Stock
cmpa2ndn8006agonano9047vf	AST-1035	Dell XPS	Laptop	cmpa2ndh60001gonazdq83mno	Dell	v2.0	SN1035	2025-07-24 00:00:00	108000	Main Office	2026-05-17 17:51:20.276	2026-05-17 18:04:06.805	In Stock
cmpa2ndna006cgonaac8772uv	AST-1036	iPhone 14	Phone	cmpa2ndfw0000gonamgv7v03p	iPhone	v2.0	SN1036	2025-03-27 00:00:00	79999	Server Room	2026-05-17 17:51:20.278	2026-05-17 18:04:06.806	In Stock
cmpa2ndlx004ogonaxz8eh6x4	AST-1006	iPhone 14	Phone	cmpa2ndh70002gonabiinestw	iPhone	v2.0	SN1006	2025-07-25 00:00:00	74999	Reception	2026-05-17 17:51:20.229	2026-05-17 18:31:10.462	In Stock
cmpa2ndnd006ggonagh8plhqn	AST-1038	Logitech Mouse	Accessory	cmpa2ndfw0000gonamgv7v03p	Logitech	v2.0	SN1038	2026-01-19 00:00:00	2199	Main Office	2026-05-17 17:51:20.281	2026-05-17 18:04:06.808	In Stock
cmpa2ndnm006sgonaj5801ayb	AST-1044	Logitech Mouse	Accessory	cmpa2ndh90003gonagzy5mk2f	Logitech	v2.0	SN1044	2025-07-18 00:00:00	1490	Main Office	2026-05-17 17:51:20.291	2026-05-17 18:19:20.347	Allocated
cmpa2ndng006kgonalqmd8td2	AST-1040	Dell XPS	Laptop	cmpa2ndh90003gonagzy5mk2f	Dell	v2.0	SN1040	2025-03-18 00:00:00	98500	Main Office	2026-05-17 17:51:20.285	2026-05-17 18:04:06.811	In Stock
cmpa2ndni006mgonashnpwnly	AST-1041	HP Monitor	Monitor	cmpa2ndh90003gonagzy5mk2f	HP	v2.0	SN1041	2025-02-05 00:00:00	20999	Storage Room	2026-05-17 17:51:20.286	2026-05-17 18:04:06.812	In Stock
cmpa2ndnj006ogonax8ajx2xw	AST-1042	iPhone 14	Phone	cmpa2ndhc0006gonajyctjxmc	iPhone	v2.0	SN1042	2025-12-29 00:00:00	72000	Main Office	2026-05-17 17:51:20.287	2026-05-17 18:31:10.445	In Stock
cmpa2ndnl006qgonaqk6dkwn7	AST-1043	Dell XPS	Laptop	cmpa2ndha0004gona0ssfvjig	Dell	v2.0	SN1043	2025-01-28 00:00:00	95500	Reception	2026-05-17 17:51:20.289	2026-05-17 18:04:06.814	In Stock
cmpa2ndmw005ugonayvnyboz9	AST-1027	HP Monitor	Monitor	cmpa2ndha0004gona0ssfvjig	HP	v2.0	SN1027	2025-05-05 00:00:00	19500	Server Room	2026-05-17 17:51:20.264	2026-05-17 18:31:10.467	In Stock
cmpa2ndno006ugonarxfmdibq	AST-1045	Logitech Mouse	Accessory	cmpa2ndhc0006gonajyctjxmc	Logitech	v2.0	SN1045	2026-01-02 00:00:00	999	Server Room	2026-05-17 17:51:20.292	2026-05-17 18:04:06.816	In Stock
cmpa2ndnp006wgonaimzeylr9	AST-1046	Dell XPS	Laptop	cmpa2ndh90003gonagzy5mk2f	Dell	v2.0	SN1046	2025-07-31 00:00:00	84999	Sales Room	2026-05-17 17:51:20.294	2026-05-17 18:04:06.817	In Stock
cmpa2ndnr006ygonabnt1i1f3	AST-1047	Dell XPS	Laptop	cmpa2ndhb0005gona0jao37us	Dell	v2.0	SN1047	2025-06-17 00:00:00	109999	Sales Room	2026-05-17 17:51:20.295	2026-05-17 18:04:06.819	In Stock
cmpa2ndlq004ggonaxc9zzqq0	AST-1002	Logitech Mouse	Accessory	cmpa2ndha0004gona0ssfvjig	Logitech	v2.0	SN1002	2025-12-30 00:00:00	1299	IT Department	2026-05-17 17:51:20.223	2026-05-17 18:04:06.714	In Stock
cmpa2ndo10078gonafgqk8q8f	AST-1052	Dell XPS	Laptop	cmpa2ndhc0006gonajyctjxmc	Dell	v2.0	SN1052	2025-07-22 00:00:00	118000	Storage Room	2026-05-17 17:51:20.305	2026-05-17 18:04:06.823	In Stock
cmpa2ndo8007igonajkh5f07d	AST-1057	Logitech Mouse	Accessory	cmpa2ndh70002gonabiinestw	Logitech	v2.0	SN1057	2025-05-17 00:00:00	1490	Reception	2026-05-17 17:51:20.313	2026-05-17 18:19:20.356	Allocated
cmpa2ndo4007cgona9qg7cm7f	AST-1054	Dell XPS	Laptop	cmpa2ndh90003gonagzy5mk2f	Dell	v2.0	SN1054	2025-07-11 00:00:00	112000	IT Department	2026-05-17 17:51:20.308	2026-05-17 18:04:06.826	In Stock
cmpa2ndo5007egona5ouu6e6t	AST-1055	iPhone 14	Phone	cmpa2ndh60001gonazdq83mno	iPhone	v2.0	SN1055	2025-09-03 00:00:00	73500	Main Office	2026-05-17 17:51:20.31	2026-05-17 18:04:06.827	In Stock
cmpa2ndo7007ggonajaolaj2k	AST-1056	Logitech Mouse	Accessory	cmpa2ndha0004gona0ssfvjig	Logitech	v2.0	SN1056	2025-02-23 00:00:00	1399	Reception	2026-05-17 17:51:20.311	2026-05-17 18:04:06.829	In Stock
cmpa2ndof007qgonao9ph42e8	AST-1061	HP Monitor	Monitor	cmpa2ndhb0005gona0jao37us	HP	v2.0	SN1061	2025-07-24 00:00:00	19500	Server Room	2026-05-17 17:51:20.319	2026-05-17 18:24:35.962	In Stock
cmpa2ndpp009cgonadkxbibhl	AST-1090	iPhone 14	Phone	cmpa2ndh60001gonazdq83mno	iPhone	v2.0	SN1090	2025-10-27 00:00:00	72000	Sales Room	2026-05-17 17:51:20.365	2026-05-17 18:31:10.456	In Stock
cmpa2ndob007mgona53mh8nip	AST-1059	HP Monitor	Monitor	cmpa2ndha0004gona0ssfvjig	HP	v2.0	SN1059	2025-02-18 00:00:00	19500	Main Office	2026-05-17 17:51:20.316	2026-05-17 18:04:06.832	In Stock
cmpa2ndod007ogonakhj0q2q6	AST-1060	iPhone 14	Phone	cmpa2ndhb0005gona0jao37us	iPhone	v2.0	SN1060	2025-11-01 00:00:00	74000	Storage Room	2026-05-17 17:51:20.317	2026-05-17 18:04:06.834	In Stock
cmpa2ndog007sgonaxcq1338q	AST-1062	HP Monitor	Monitor	cmpa2ndhc0006gonajyctjxmc	HP	v2.0	SN1062	2025-04-29 00:00:00	19500	Reception	2026-05-17 17:51:20.321	2026-05-17 18:19:20.364	Allocated
cmpa2ndpm0098gonaom3euqy1	AST-1088	iPhone 14	Phone	cmpa2ndfw0000gonamgv7v03p	iPhone	v2.0	SN1088	2025-06-17 00:00:00	72000	Storage Room	2026-05-17 17:51:20.362	2026-05-17 18:31:10.451	In Stock
cmpa2ndoi007ugona6uygvnzn	AST-1063	Dell XPS	Laptop	cmpa2ndhb0005gona0jao37us	Dell	v2.0	SN1063	2025-06-10 00:00:00	116000	Main Office	2026-05-17 17:51:20.322	2026-05-17 18:04:06.838	In Stock
cmpa2ndoj007wgona9z8gw9po	AST-1064	iPhone 14	Phone	cmpa2ndh90003gonagzy5mk2f	iPhone	v2.0	SN1064	2026-02-05 00:00:00	68500	Sales Room	2026-05-17 17:51:20.324	2026-05-17 18:04:06.839	In Stock
cmpa2ndol007ygona9ijvtc4t	AST-1065	iPhone 14	Phone	cmpa2ndh90003gonagzy5mk2f	iPhone	v2.0	SN1065	2025-05-02 00:00:00	71000	Reception	2026-05-17 17:51:20.325	2026-05-17 18:04:06.84	In Stock
cmpa2ndon0080gonacsj4aji9	AST-1066	HP Monitor	Monitor	cmpa2ndh60001gonazdq83mno	HP	v2.0	SN1066	2025-11-24 00:00:00	17500	Main Office	2026-05-17 17:51:20.327	2026-05-17 18:04:06.842	In Stock
cmpa2ndp1008igonau59yp9r6	AST-1075	Logitech Mouse	Accessory	cmpa2ndha0004gona0ssfvjig	Logitech	v2.0	SN1075	2025-06-15 00:00:00	1490	Server Room	2026-05-17 17:51:20.341	2026-05-17 18:19:20.37	Allocated
cmpa2ndop0084gonarygvm7co	AST-1068	iPhone 14	Phone	cmpa2ndfw0000gonamgv7v03p	iPhone	v2.0	SN1068	2026-01-01 00:00:00	76999	Sales Room	2026-05-17 17:51:20.33	2026-05-17 18:04:06.844	In Stock
cmpa2ndor0086gonaogr7xd14	AST-1069	Dell XPS	Laptop	cmpa2ndhc0006gonajyctjxmc	Dell	v2.0	SN1069	2026-01-20 00:00:00	91000	Sales Room	2026-05-17 17:51:20.331	2026-05-17 18:04:06.846	In Stock
cmpa2ndot0088gonarf1yi7fp	AST-1070	Logitech Mouse	Accessory	cmpa2ndh70002gonabiinestw	Logitech	v2.0	SN1070	2025-12-01 00:00:00	1099	Storage Room	2026-05-17 17:51:20.333	2026-05-17 18:04:06.847	In Stock
cmpa2ndov008agonaht3fq9l4	AST-1071	HP Monitor	Monitor	cmpa2ndha0004gona0ssfvjig	HP	v2.0	SN1071	2025-03-21 00:00:00	23000	Server Room	2026-05-17 17:51:20.335	2026-05-17 18:04:06.848	In Stock
cmpa2ndow008cgonaxjizrisz	AST-1072	HP Monitor	Monitor	cmpa2ndh60001gonazdq83mno	HP	v2.0	SN1072	2025-06-03 00:00:00	15500	IT Department	2026-05-17 17:51:20.336	2026-05-17 18:04:06.85	In Stock
cmpa2ndox008egona57r91lvp	AST-1073	Logitech Mouse	Accessory	cmpa2ndh70002gonabiinestw	Logitech	v2.0	SN1073	2025-04-10 00:00:00	1899	Storage Room	2026-05-17 17:51:20.338	2026-05-17 18:04:06.851	In Stock
cmpa2ndoz008ggonaowemgsyr	AST-1074	HP Monitor	Monitor	cmpa2ndha0004gona0ssfvjig	HP	v2.0	SN1074	2025-01-13 00:00:00	26000	Reception	2026-05-17 17:51:20.34	2026-05-17 18:04:06.852	In Stock
cmpa2ndp2008kgonap2reszko	AST-1076	iPhone 14	Phone	cmpa2ndha0004gona0ssfvjig	iPhone	v2.0	SN1076	2025-01-21 00:00:00	72000	Reception	2026-05-17 17:51:20.343	2026-05-17 18:19:20.372	Allocated
cmpa2ndoo0082gonaaqzibbu9	AST-1067	HP Monitor	Monitor	cmpa2ndh70002gonabiinestw	HP	v2.0	SN1067	2025-09-20 00:00:00	19500	Sales Room	2026-05-17 17:51:20.328	2026-05-17 18:31:10.432	In Stock
cmpa2ndp4008mgonan8kwkyon	AST-1077	Logitech Mouse	Accessory	cmpa2ndh90003gonagzy5mk2f	Logitech	v2.0	SN1077	2025-08-05 00:00:00	1499	IT Department	2026-05-17 17:51:20.344	2026-05-17 18:04:06.856	In Stock
cmpa2ndp6008ogonan8e6h79l	AST-1078	Dell XPS	Laptop	cmpa2ndh60001gonazdq83mno	Dell	v2.0	SN1078	2025-10-01 00:00:00	88500	Storage Room	2026-05-17 17:51:20.346	2026-05-17 18:04:06.858	In Stock
cmpa2ndp7008qgonafpzuogp5	AST-1079	Logitech Mouse	Accessory	cmpa2ndh70002gonabiinestw	Logitech	v2.0	SN1079	2025-09-01 00:00:00	2299	Storage Room	2026-05-17 17:51:20.348	2026-05-17 18:04:06.859	In Stock
cmpa2ndp9008sgona9xjm8164	AST-1080	HP Monitor	Monitor	cmpa2ndhb0005gona0jao37us	HP	v2.0	SN1080	2025-07-28 00:00:00	21500	Storage Room	2026-05-17 17:51:20.349	2026-05-17 18:04:06.86	In Stock
cmpa2ndnz0076gonaa0l3t0i8	AST-1051	Dell XPS	Laptop	cmpa2ndfw0000gonamgv7v03p	Dell	v2.0	SN1051	2025-06-22 00:00:00	98000	Server Room	2026-05-17 17:51:20.303	2026-05-18 09:11:38.368	Allocated
cmpa2ndpc008wgonab5ae489m	AST-1082	Dell XPS	Laptop	cmpa2ndh60001gonazdq83mno	Dell	v2.0	SN1082	2025-12-02 00:00:00	104000	Server Room	2026-05-17 17:51:20.352	2026-05-17 18:04:06.863	In Stock
cmpa2ndpe008ygonabrltc3a8	AST-1083	Dell XPS	Laptop	cmpa2ndhb0005gona0jao37us	Dell	v2.0	SN1083	2026-01-27 00:00:00	120000	Sales Room	2026-05-17 17:51:20.354	2026-05-17 18:04:06.865	In Stock
cmpa2ndpf0090gonagfjvallm	AST-1084	iPhone 14	Phone	cmpa2ndhc0006gonajyctjxmc	iPhone	v2.0	SN1084	2025-05-26 00:00:00	69500	Sales Room	2026-05-17 17:51:20.355	2026-05-17 18:04:06.866	In Stock
cmpa2ndph0092gona5yoioeq3	AST-1085	HP Monitor	Monitor	cmpa2ndh90003gonagzy5mk2f	HP	v2.0	SN1085	2025-02-02 00:00:00	18999	Reception	2026-05-17 17:51:20.357	2026-05-17 18:04:06.867	In Stock
cmpa2ndpi0094gona3fimar46	AST-1086	HP Monitor	Monitor	cmpa2ndhb0005gona0jao37us	HP	v2.0	SN1086	2025-01-14 00:00:00	16999	Main Office	2026-05-17 17:51:20.359	2026-05-17 18:04:06.869	In Stock
cmpa2ndpk0096gonab1831h2y	AST-1087	Dell XPS	Laptop	cmpa2ndhb0005gona0jao37us	Dell	v2.0	SN1087	2025-01-16 00:00:00	93500	Storage Room	2026-05-17 17:51:20.361	2026-05-17 18:04:06.871	In Stock
cmpa2ndpn009agonadvypsxg4	AST-1089	iPhone 14	Phone	cmpa2ndh90003gonagzy5mk2f	iPhone	v2.0	SN1089	2025-09-13 00:00:00	72000	Main Office	2026-05-17 17:51:20.364	2026-05-17 18:19:20.381	Allocated
cmpa2ndps009ggonaz5yo81qx	AST-1092	Dell XPS	Laptop	cmpa2ndha0004gona0ssfvjig	Dell	v2.0	SN1092	2025-03-12 00:00:00	98000	Server Room	2026-05-17 17:51:20.368	2026-05-17 18:19:20.386	Allocated
cmpa2ndpq009egonakuurwry7	AST-1091	HP Monitor	Monitor	cmpa2ndh90003gonagzy5mk2f	HP	v2.0	SN1091	2025-03-22 00:00:00	16500	Server Room	2026-05-17 17:51:20.367	2026-05-17 18:04:06.877	In Stock
cmpa2ndoa007kgonaaxl9bf2c	AST-1058	Dell XPS	Laptop	cmpa2ndha0004gona0ssfvjig	Dell	v2.0	SN1058	2025-03-17 00:00:00	98000	Storage Room	2026-05-17 17:51:20.314	2026-05-17 18:24:35.959	In Stock
cmpa2ndpt009igona0g61fjiu	AST-1093	HP Monitor	Monitor	cmpa2ndhb0005gona0jao37us	HP	v2.0	SN1093	2025-02-01 00:00:00	20000	Storage Room	2026-05-17 17:51:20.37	2026-05-17 18:04:06.88	In Stock
cmpa2ndpv009kgonaxsqnadjw	AST-1094	Dell XPS	Laptop	cmpa2ndh60001gonazdq83mno	Dell	v2.0	SN1094	2025-03-28 00:00:00	97999	Sales Room	2026-05-17 17:51:20.371	2026-05-17 18:04:06.882	In Stock
cmpa2ndpw009mgona7qcfusc6	AST-1095	HP Monitor	Monitor	cmpa2ndhc0006gonajyctjxmc	HP	v2.0	SN1095	2025-03-11 00:00:00	24500	Storage Room	2026-05-17 17:51:20.373	2026-05-17 18:04:06.883	In Stock
cmpa2ndq0009qgona3sk5le68	AST-1097	iPhone 14	Phone	cmpa2ndha0004gona0ssfvjig	iPhone	v2.0	SN1097	2025-12-25 00:00:00	65999	Server Room	2026-05-17 17:51:20.376	2026-05-17 18:04:06.885	In Stock
cmpa2ndq5009wgonazm4rrnwr	AST-1100	Dell XPS	Laptop	cmpa2ndhb0005gona0jao37us	Dell	v2.0	SN1100	2025-02-17 00:00:00	94000	Server Room	2026-05-17 17:51:20.381	2026-05-17 18:04:06.887	In Stock
cmpa2ndq700a0gonabvgijufv	AST-1102	HP Monitor	Monitor	cmpa2ndha0004gona0ssfvjig	HP	v2.0	SN1102	2025-03-02 00:00:00	19500	Storage Room	2026-05-17 17:51:20.384	2026-05-17 18:19:20.392	Allocated
cmpa2ndqu00asgona8lytevgm	AST-1116	HP Monitor	Monitor	cmpa2ndha0004gona0ssfvjig	HP	v2.0	SN1116	2025-02-09 00:00:00	19500	Main Office	2026-05-17 17:51:20.407	2026-05-17 18:19:20.401	Allocated
cmpa2ndqb00a4gonaohbnwgo1	AST-1104	Dell XPS	Laptop	cmpa2ndh90003gonagzy5mk2f	Dell	v2.0	SN1104	2025-08-20 00:00:00	107000	Server Room	2026-05-17 17:51:20.387	2026-05-17 18:04:06.893	In Stock
cmpa2ndqd00a6gonaq9i0etjd	AST-1105	HP Monitor	Monitor	cmpa2ndh60001gonazdq83mno	HP	v2.0	SN1105	2025-09-15 00:00:00	27000	Sales Room	2026-05-17 17:51:20.389	2026-05-17 18:04:06.895	In Stock
cmpa2ndqg00aagona8ah4jvxa	AST-1107	iPhone 14	Phone	cmpa2ndh90003gonagzy5mk2f	iPhone	v2.0	SN1107	2025-10-24 00:00:00	68999	Sales Room	2026-05-17 17:51:20.392	2026-05-17 18:04:06.897	In Stock
cmpa2ndqh00acgonayznjr3ld	AST-1108	Dell XPS	Laptop	cmpa2ndhb0005gona0jao37us	Dell	v2.0	SN1108	2025-09-01 00:00:00	101000	Reception	2026-05-17 17:51:20.394	2026-05-17 18:04:06.898	In Stock
cmpa2ndqj00aegonamg24r9ev	AST-1109	iPhone 14	Phone	cmpa2ndfw0000gonamgv7v03p	iPhone	v2.0	SN1109	2025-03-20 00:00:00	75500	Storage Room	2026-05-17 17:51:20.396	2026-05-17 18:04:06.9	In Stock
cmpa2ndql00aggonaijf1avzg	AST-1110	iPhone 14	Phone	cmpa2ndhc0006gonajyctjxmc	iPhone	v2.0	SN1110	2025-10-30 00:00:00	66500	Reception	2026-05-17 17:51:20.397	2026-05-17 18:04:06.901	In Stock
cmpa2ndqo00akgonagitgli3b	AST-1112	iPhone 14	Phone	cmpa2ndh70002gonabiinestw	iPhone	v2.0	SN1112	2025-10-17 00:00:00	67500	Sales Room	2026-05-17 17:51:20.4	2026-05-17 18:04:06.904	In Stock
cmpa2ndqq00amgonayjtiorhd	AST-1113	Logitech Mouse	Accessory	cmpa2ndh60001gonazdq83mno	Logitech	v2.0	SN1113	2025-07-19 00:00:00	1399	Sales Room	2026-05-17 17:51:20.402	2026-05-17 18:04:06.905	In Stock
cmpa2ndqy00awgona0gklxb2c	AST-1118	HP Monitor	Monitor	cmpa2ndhb0005gona0jao37us	HP	v2.0	SN1118	2025-02-01 00:00:00	19500	Server Room	2026-05-17 17:51:20.41	2026-05-17 18:19:20.405	Allocated
cmpa2ndqt00aqgonaz0blumad	AST-1115	Logitech Mouse	Accessory	cmpa2ndhb0005gona0jao37us	Logitech	v2.0	SN1115	2026-01-29 00:00:00	1999	Storage Room	2026-05-17 17:51:20.405	2026-05-17 18:04:06.908	In Stock
cmpa2ndr100b0gonaznkg0v7t	AST-1120	Logitech Mouse	Accessory	cmpa2ndfw0000gonamgv7v03p	Logitech	v2.0	SN1120	2025-10-13 00:00:00	1490	Server Room	2026-05-17 17:51:20.413	2026-05-17 18:19:20.408	Allocated
cmpa2ndqw00augonax6w70q0r	AST-1117	Dell XPS	Laptop	cmpa2ndfw0000gonamgv7v03p	Dell	v2.0	SN1117	2025-11-16 00:00:00	113000	Server Room	2026-05-17 17:51:20.408	2026-05-17 18:04:06.911	In Stock
cmpa2ndrc00begonadrvkkvcp	AST-1127	Logitech Mouse	Accessory	cmpa2ndfw0000gonamgv7v03p	Logitech	v2.0	SN1127	2025-06-08 00:00:00	1490	Reception	2026-05-17 17:51:20.424	2026-05-17 18:19:20.411	Allocated
cmpa2ndqz00aygonawesvcc7j	AST-1119	Dell XPS	Laptop	cmpa2ndh60001gonazdq83mno	Dell	v2.0	SN1119	2025-06-03 00:00:00	99999	IT Department	2026-05-17 17:51:20.411	2026-05-17 18:04:06.914	In Stock
cmpa2ndri00bmgonafvyxj60e	AST-1131	HP Monitor	Monitor	cmpa2ndhb0005gona0jao37us	HP	v2.0	SN1131	2025-01-02 00:00:00	19500	Sales Room	2026-05-17 17:51:20.431	2026-05-17 18:19:20.414	Allocated
cmpa2ndr200b2gona60tyz5cw	AST-1121	Logitech Mouse	Accessory	cmpa2ndh70002gonabiinestw	Logitech	v2.0	SN1121	2025-03-28 00:00:00	1599	Sales Room	2026-05-17 17:51:20.414	2026-05-17 18:04:06.917	In Stock
cmpa2ndr400b4gonavyb1oxmm	AST-1122	Logitech Mouse	Accessory	cmpa2ndh90003gonagzy5mk2f	Logitech	v2.0	SN1122	2025-04-21 00:00:00	2199	Sales Room	2026-05-17 17:51:20.416	2026-05-17 18:04:06.918	In Stock
cmpa2ndr600b6gonan80346xz	AST-1123	HP Monitor	Monitor	cmpa2ndhb0005gona0jao37us	HP	v2.0	SN1123	2025-06-12 00:00:00	14999	IT Department	2026-05-17 17:51:20.418	2026-05-17 18:04:06.92	In Stock
cmpa2ndr700b8gonamvzkd4a9	AST-1124	HP Monitor	Monitor	cmpa2ndha0004gona0ssfvjig	HP	v2.0	SN1124	2025-02-03 00:00:00	22999	Server Room	2026-05-17 17:51:20.419	2026-05-17 18:04:06.922	In Stock
cmpa2ndr800bagonaph4okr8k	AST-1125	iPhone 14	Phone	cmpa2ndha0004gona0ssfvjig	iPhone	v2.0	SN1125	2025-01-02 00:00:00	74500	Server Room	2026-05-17 17:51:20.421	2026-05-17 18:04:06.923	In Stock
cmpa2ndra00bcgona1135wkt7	AST-1126	HP Monitor	Monitor	cmpa2ndhc0006gonajyctjxmc	HP	v2.0	SN1126	2025-02-21 00:00:00	25000	Server Room	2026-05-17 17:51:20.423	2026-05-17 18:04:06.925	In Stock
cmpa2ndq900a2gonaah4jjffl	AST-1103	HP Monitor	Monitor	cmpa2ndhc0006gonajyctjxmc	HP	v2.0	SN1103	2025-03-22 00:00:00	19500	Reception	2026-05-17 17:51:20.385	2026-05-17 18:31:10.439	In Stock
cmpa2ndrd00bggona883hpdtp	AST-1128	Dell XPS	Laptop	cmpa2ndh90003gonagzy5mk2f	Dell	v2.0	SN1128	2025-04-13 00:00:00	110000	IT Department	2026-05-17 17:51:20.426	2026-05-17 18:04:06.928	In Stock
cmpa2ndrf00bigonaq6ay0rb4	AST-1129	Logitech Mouse	Accessory	cmpa2ndfw0000gonamgv7v03p	Logitech	v2.0	SN1129	2026-01-31 00:00:00	999	Storage Room	2026-05-17 17:51:20.427	2026-05-17 18:04:06.929	In Stock
cmpa2ndrg00bkgonaw3j209d5	AST-1130	HP Monitor	Monitor	cmpa2ndha0004gona0ssfvjig	HP	v2.0	SN1130	2025-03-08 00:00:00	21999	Sales Room	2026-05-17 17:51:20.428	2026-05-17 18:04:06.932	In Stock
cmpa2ndrl00bqgona93xojqzf	AST-1133	Dell XPS	Laptop	cmpa2ndfw0000gonamgv7v03p	Dell	v2.0	SN1133	2025-02-09 00:00:00	98000	Storage Room	2026-05-17 17:51:20.434	2026-05-17 18:24:35.97	In Stock
cmpa2ndrk00bogonals31y5kk	AST-1132	Logitech Mouse	Accessory	cmpa2ndhb0005gona0jao37us	Logitech	v2.0	SN1132	2025-01-04 00:00:00	1499	Reception	2026-05-17 17:51:20.432	2026-05-17 18:04:06.934	In Stock
cmpa2ndrn00bsgonalrmcowdh	AST-1134	iPhone 14	Phone	cmpa2ndha0004gona0ssfvjig	iPhone	v2.0	SN1134	2025-09-27 00:00:00	78500	Reception	2026-05-17 17:51:20.435	2026-05-17 18:04:06.937	In Stock
cmpa2ndrp00bugonav229xl0a	AST-1135	Logitech Mouse	Accessory	cmpa2ndhb0005gona0jao37us	Logitech	v2.0	SN1135	2025-07-12 00:00:00	899	Sales Room	2026-05-17 17:51:20.437	2026-05-17 18:04:06.939	In Stock
cmpa2ndrq00bwgonax8fbq8at	AST-1136	iPhone 14	Phone	cmpa2ndh60001gonazdq83mno	iPhone	v2.0	SN1136	2025-12-05 00:00:00	70999	IT Department	2026-05-17 17:51:20.439	2026-05-17 18:04:06.94	In Stock
cmpa2ndrs00bygonak757kzyw	AST-1137	Logitech Mouse	Accessory	cmpa2ndh90003gonagzy5mk2f	Logitech	v2.0	SN1137	2025-04-24 00:00:00	1299	Storage Room	2026-05-17 17:51:20.44	2026-05-17 18:04:06.942	In Stock
cmpa2ndrt00c0gona9v6ttzac	AST-1138	Dell XPS	Laptop	cmpa2ndh90003gonagzy5mk2f	Dell	v2.0	SN1138	2025-10-07 00:00:00	106500	Storage Room	2026-05-17 17:51:20.442	2026-05-17 18:04:06.944	In Stock
cmpa2ndrv00c2gona1s5hyr9c	AST-1139	Logitech Mouse	Accessory	cmpa2ndh60001gonazdq83mno	Logitech	v2.0	SN1139	2025-10-03 00:00:00	2299	IT Department	2026-05-17 17:51:20.444	2026-05-17 18:04:06.945	In Stock
cmpa2ndry00c4gonaypx51gn1	AST-1140	HP Monitor	Monitor	cmpa2ndhc0006gonajyctjxmc	HP	v2.0	SN1140	2025-05-14 00:00:00	27500	IT Department	2026-05-17 17:51:20.446	2026-05-17 18:04:06.947	In Stock
cmpa2nds000c6gonadvkmhfqq	AST-1141	Logitech Mouse	Accessory	cmpa2ndh60001gonazdq83mno	Logitech	v2.0	SN1141	2025-05-21 00:00:00	899	Storage Room	2026-05-17 17:51:20.448	2026-05-17 18:04:06.949	In Stock
cmpa2nds200c8gonajnmfxaq3	AST-1142	Dell XPS	Laptop	cmpa2ndha0004gona0ssfvjig	Dell	v2.0	SN1142	2025-08-28 00:00:00	114000	Server Room	2026-05-17 17:51:20.45	2026-05-17 18:04:06.95	In Stock
cmpa2nds300cagonamxizdt11	AST-1143	HP Monitor	Monitor	cmpa2ndh90003gonagzy5mk2f	HP	v2.0	SN1143	2025-02-16 00:00:00	17999	Main Office	2026-05-17 17:51:20.452	2026-05-17 18:04:06.952	In Stock
cmpa2nds500ccgonayidadnk2	AST-1144	HP Monitor	Monitor	cmpa2ndhc0006gonajyctjxmc	HP	v2.0	SN1144	2025-12-23 00:00:00	18000	IT Department	2026-05-17 17:51:20.453	2026-05-17 18:04:06.953	In Stock
cmpa2nds600cegona8bboq122	AST-1145	Logitech Mouse	Accessory	cmpa2ndhb0005gona0jao37us	Logitech	v2.0	SN1145	2025-01-31 00:00:00	1299	Server Room	2026-05-17 17:51:20.455	2026-05-17 18:04:06.955	In Stock
cmpa2ndq6009ygona6zadz64d	AST-1101	Dell XPS	Laptop	cmpa2ndh60001gonazdq83mno	Dell	v2.0	SN1101	2025-08-25 00:00:00	98000	Main Office	2026-05-17 17:51:20.382	2026-05-17 18:19:20.388	Allocated
cmpa2ndq3009ugona844vr2fb	AST-1099	HP Monitor	Monitor	cmpa2ndh60001gonazdq83mno	HP	v2.0	SN1099	2025-09-09 00:00:00	15999	Server Room	2026-05-17 17:51:20.379	2026-05-17 18:04:06.886	In Stock
cmpa2ndsc00ckgonakc6hb9yy	AST-1148	HP Monitor	Monitor	cmpa2ndha0004gona0ssfvjig	HP	v2.0	SN1148	2025-01-10 00:00:00	19500	Main Office	2026-05-17 17:51:20.46	2026-05-17 18:19:20.425	Allocated
cmpa2ndpa008ugonaf1hr7ng0	AST-1081	Dell XPS	Laptop	cmpa2ndh90003gonagzy5mk2f	Dell	v2.0	SN1081	2025-08-09 00:00:00	98000	Server Room	2026-05-17 17:51:20.351	2026-05-17 18:24:35.965	In Stock
cmpa2ndns0070gona0m11ocay	AST-1048	Logitech Mouse	Accessory	cmpa2ndfw0000gonamgv7v03p	Logitech	v2.0	SN1048	2025-04-19 00:00:00	1490	Storage Room	2026-05-17 17:51:20.297	2026-05-17 18:24:35.972	In Stock
cmpa2ndm0004sgona86dtiwsz	AST-1008	Logitech Mouse	Accessory	cmpa2ndhb0005gona0jao37us	Logitech	v2.0	SN1008	2026-01-14 00:00:00	1490	Main Office	2026-05-17 17:51:20.232	2026-05-17 18:24:35.974	Allocated
cmpa3j7fv00057mzg0bdc9hzz	AST-1151	MacBook Pro M3	Laptop	cmpa3hw4q00005vqp0nx16n25	\N	\N	SN1151	\N	120000	Mumbai HQ	2026-05-17 18:16:05.227	2026-05-17 18:56:12.564	In Stock
cmpa2ndlv004mgonakjq9vbmt	AST-1005	Logitech Mouse	Accessory	cmpa2ndha0004gona0ssfvjig	Logitech	v2.0	SN1005	2025-09-24 00:00:00	1499	Storage Room	2026-05-17 17:51:20.228	2026-05-17 18:04:06.762	In Stock
cmpa2ndqm00aigona2gjkd4g7	AST-1111	Logitech Mouse	Accessory	cmpa2ndh90003gonagzy5mk2f	Logitech	v2.0	SN1111	2025-04-03 00:00:00	2499	Storage Room	2026-05-17 17:51:20.399	2026-05-17 18:04:06.902	In Stock
cmpa2ndln004egonae7o4sx1o	AST-1001	Dell XPS	Laptop	cmpa2ndh60001gonazdq83mno	Dell	v2.0	SN1001	2025-03-12 00:00:00	92000	Reception	2026-05-17 17:51:20.22	2026-05-17 18:04:06.956	In Stock
cmpa3j7fy00077mzgekwvs35j	AST-1152	Samsung Odyssey G9	Monitor	cmpa3hw4q00005vqp0nx16n25	\N	\N	SN1152	\N	65000	Mumbai HQ	2026-05-17 18:16:05.23	2026-05-17 18:56:12.574	In Stock
cmpa2ndnu0072gonavbyfuhs9	AST-1049	iPhone 14	Phone	cmpa2ndha0004gona0ssfvjig	iPhone	v2.0	SN1049	2026-01-25 00:00:00	67999	Sales Room	2026-05-17 17:51:20.298	2026-05-17 18:04:06.958	In Stock
cmpa2ndnx0074gonatb4x2msp	AST-1050	Logitech Mouse	Accessory	cmpa2ndha0004gona0ssfvjig	Logitech	v2.0	SN1050	2025-04-07 00:00:00	899	IT Department	2026-05-17 17:51:20.301	2026-05-17 18:04:06.96	In Stock
cmpa2ndpy009ogonal5t8ymyz	AST-1096	HP Monitor	Monitor	cmpa2ndha0004gona0ssfvjig	HP	v2.0	SN1096	2026-02-05 00:00:00	19999	IT Department	2026-05-17 17:51:20.375	2026-05-17 18:04:06.961	In Stock
cmpa2ndqe00a8gona0r5awii5	AST-1106	Logitech Mouse	Accessory	cmpa2ndh70002gonabiinestw	Logitech	v2.0	SN1106	2025-01-08 00:00:00	799	Storage Room	2026-05-17 17:51:20.391	2026-05-17 18:04:06.964	In Stock
cmpa2nds800cggona7ng6nm8a	AST-1146	HP Monitor	Monitor	cmpa2ndfw0000gonamgv7v03p	HP	v2.0	SN1146	2025-09-23 00:00:00	24999	Server Room	2026-05-17 17:51:20.456	2026-05-17 18:04:06.966	In Stock
cmpa2ndsa00cigonaw3eex6ds	AST-1147	iPhone 14	Phone	cmpa2ndfw0000gonamgv7v03p	iPhone	v2.0	SN1147	2025-04-20 00:00:00	71500	Main Office	2026-05-17 17:51:20.458	2026-05-17 18:04:06.967	In Stock
cmpa2ndsd00cmgonalvmbq05g	AST-1149	Dell XPS	Laptop	cmpa2ndha0004gona0ssfvjig	Dell	v2.0	SN1149	2025-10-17 00:00:00	90000	Storage Room	2026-05-17 17:51:20.461	2026-05-17 18:04:06.971	In Stock
cmpa2ndse00cogona0qyisbsd	AST-1150	iPhone 14	Phone	cmpa2ndhc0006gonajyctjxmc	iPhone	v2.0	SN1150	2026-01-08 00:00:00	72000	IT Department	2026-05-17 17:51:20.463	2026-05-17 18:04:06.972	In Stock
cmpa3j7fz00097mzg13q9ov31	AST-1153	Google Pixel 8 Pro	Phone	cmpa3hw4q00005vqp0nx16n25	\N	\N	SN1153	\N	85000	Mumbai HQ	2026-05-17 18:16:05.232	2026-05-17 18:16:05.232	Allocated
cmpa3j7g1000b7mzgiobbb734	AST-1154	Lenovo ThinkPad X1 Carbon	Laptop	cmpa3hw4q00005vqp0nx16n25	\N	\N	SN1154	\N	120000	Mumbai HQ	2026-05-17 18:16:05.234	2026-05-17 18:16:05.234	Allocated
cmpa3j7g3000d7mzg3bvmfyjg	AST-1155	iPad Pro M2	Accessory	cmpa3hw4q00005vqp0nx16n25	\N	\N	SN1155	\N	45000	Mumbai HQ	2026-05-17 18:16:05.236	2026-05-17 18:16:05.236	Allocated
cmpa2ndmk005ggonaeorh5jwv	AST-1020	Logitech Mouse	Accessory	cmpa2ndh70002gonabiinestw	Logitech	v2.0	SN1020	2025-11-10 00:00:00	1490	Server Room	2026-05-17 17:51:20.252	2026-05-17 18:19:20.317	Allocated
cmpa2ndo3007agonaczgwcuvu	AST-1053	Dell XPS	Laptop	cmpa2ndh60001gonazdq83mno	Dell	v2.0	SN1053	2025-01-28 00:00:00	102000	IT Department	2026-05-17 17:51:20.307	2026-05-17 18:19:20.353	Allocated
cmpa2ndqr00aogonaln2qr3r5	AST-1114	Logitech Mouse	Accessory	cmpa2ndha0004gona0ssfvjig	Logitech	v2.0	SN1114	2026-01-02 00:00:00	1490	Storage Room	2026-05-17 17:51:20.404	2026-05-17 18:19:20.398	Allocated
cmpa2ndq1009sgonag9he4pjc	AST-1098	Logitech Mouse	Accessory	cmpa2ndh60001gonazdq83mno	Logitech	v2.0	SN1098	2025-03-23 00:00:00	1490	Server Room	2026-05-17 17:51:20.378	2026-05-17 18:19:20.423	Allocated
\.


--
-- TOC entry 4970 (class 0 OID 25543)
-- Dependencies: 221
-- Data for Name: DamageReport; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DamageReport" (id, "assetId", "reportedById", "reportedAt", severity, description, "imageUrl", status) FROM stdin;
cmpa2ne0b00iygonae6ddvo3u	cmpa2ndml005igonax5ykdlhd	cmpa2ndjz002ogona5k3q021o	2026-05-06 00:00:00	Low	Minor scratch	\N	Resolved
cmpa2ne0900iwgona8r9nlaq3	cmpa2ndoa007kgonaaxl9bf2c	cmpa2ndlj0049gonabj88zmla	2026-05-07 00:00:00	Low	Minor scratch	\N	Resolved
cmpa2ne0l00jagonarku3pzdd	cmpa2ndm0004sgona86dtiwsz	cmpa2ndhr000fgonaeqe108p9	2026-05-11 00:00:00	Low	Minor scratch	\N	Resolved
cmpa2ne0h00j6gona4lzsb4f3	cmpa2ndpa008ugonaf1hr7ng0	cmpa2ndil0019gonaqf6nn8b3	2026-05-12 00:00:00	Low	Minor scratch	\N	Resolved
cmpa2ne0j00j8gonaibtciich	cmpa2ndof007qgonao9ph42e8	cmpa2ndid0010gona5igbkh55	2026-05-12 00:00:00	Low	Minor scratch	\N	Resolved
cmpa2ne0m00jcgona8h2p162e	cmpa2ndpm0098gonaom3euqy1	cmpa2ndi8000ugonagkakhzta	2026-05-12 00:00:00	Low	Minor scratch	\N	Resolved
cmpa2ne0600iugonavdkdp8tr	cmpa2ndrl00bqgona93xojqzf	cmpa2ndjl0029gona699k6mm4	2026-05-13 00:00:00	Low	Minor scratch	\N	Resolved
cmpa2ne0d00j0gonak0ty6950	cmpa2ndns0070gona0m11ocay	cmpa2ndi8000ugonagkakhzta	2026-05-13 00:00:00	Low	Minor scratch	\N	Resolved
cmpa2ne0g00j4gonageidx2v4	cmpa2ndmx005wgonae2rbp2gc	cmpa2ndjn002cgonatxxlp2x5	2026-05-15 00:00:00	Low	Minor scratch	\N	Open
cmpa2ne0e00j2gonar9y12gxq	cmpa2ndm70052gona3p4qxep0	cmpa2ndhi0009gonapnp8vlyl	2026-05-15 00:00:00	Low	Minor scratch	\N	Open
cmpavwwat000kayra009e1hni	cmpa2ndls004igona7gt7igwc	cmpa2ndho000cgonaeohxqkna	2026-05-18 07:30:33.221	High	hbsdkjbcasjbjcs dsniochslc l	photo-1779089433216-96814642.jpeg	Open
cmpaz80x30008hz971kmsyz1b	cmpa2ndlt004kgona1nh8iuta	cmpa2ndhr000fgonaeqe108p9	2026-05-18 09:03:11.271	High	sceern is broken	photo-1779094991243-301343290.png	Open
\.


--
-- TOC entry 4965 (class 0 OID 25501)
-- Dependencies: 216
-- Data for Name: Department; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Department" (id, name, code, "createdAt") FROM stdin;
cmpa2ndfw0000gonamgv7v03p	Marketing	MARKETING	2026-05-17 17:51:20.012
cmpa2ndh60001gonazdq83mno	IT Support	IT_SUPPORT	2026-05-17 17:51:20.058
cmpa2ndh70002gonabiinestw	Sales	SALES	2026-05-17 17:51:20.06
cmpa2ndh90003gonagzy5mk2f	Operations	OPERATIONS	2026-05-17 17:51:20.061
cmpa2ndha0004gona0ssfvjig	HR	HR	2026-05-17 17:51:20.063
cmpa2ndhb0005gona0jao37us	Engineering	ENGINEERING	2026-05-17 17:51:20.064
cmpa2ndhc0006gonajyctjxmc	Finance	FINANCE	2026-05-17 17:51:20.065
cmpa3hw4q00005vqp0nx16n25	IT Support Operations	IT-OPS	2026-05-17 18:15:03.914
\.


--
-- TOC entry 4966 (class 0 OID 25509)
-- Dependencies: 217
-- Data for Name: Employee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Employee" (id, "employeeId", "firstName", "lastName", email, role, "departmentId", status, "userId", "createdAt") FROM stdin;
cmpa2ndhi0009gonapnp8vlyl	EMP001	Neha	Joshi	neha.joshi1@corp.in	user	cmpa2ndfw0000gonamgv7v03p	active	cmpa2ndhe0007gona4hl9bfej	2025-10-15 00:00:00
cmpa2ndho000cgonaeohxqkna	EMP002	Neha	Iyer	neha.iyer2@corp.in	it_support	cmpa2ndh60001gonazdq83mno	active	cmpa2ndhm000agonarw17oaer	2026-02-16 00:00:00
cmpa2ndhr000fgonaeqe108p9	EMP003	Aarav	Gupta	aarav.gupta3@corp.in	user	cmpa2ndh70002gonabiinestw	active	cmpa2ndhq000dgonae23pxcsm	2025-09-24 00:00:00
cmpa2ndhv000igonayyo489i9	EMP004	Aarav	Patel	aarav.patel4@corp.in	admin	cmpa2ndh90003gonagzy5mk2f	active	cmpa2ndht000ggona0ce63oe1	2026-01-16 00:00:00
cmpa2ndhy000lgonajgja4s1u	EMP005	Diya	Joshi	diya.joshi5@corp.in	it_support	cmpa2ndh70002gonabiinestw	active	cmpa2ndhx000jgona9t6fn9yp	2025-08-14 00:00:00
cmpa2ndi2000ogonaczgn6lw4	EMP006	Vihaan	Sharma	vihaan.sharma6@corp.in	admin	cmpa2ndha0004gona0ssfvjig	active	cmpa2ndi0000mgonapioomycf	2026-03-22 00:00:00
cmpa2ndi5000rgonaisrscagb	EMP007	Priya	Reddy	priya.reddy7@corp.in	admin	cmpa2ndhb0005gona0jao37us	active	cmpa2ndi3000pgonarxwk3tpm	2025-10-11 00:00:00
cmpa2ndi8000ugonagkakhzta	EMP008	Aarav	Singh	aarav.singh8@corp.in	it_support	cmpa2ndha0004gona0ssfvjig	active	cmpa2ndi6000sgonaghq1u2re	2025-07-06 00:00:00
cmpa2ndia000xgona2s7sgn9j	EMP009	Sanjay	Sharma	sanjay.sharma9@corp.in	user	cmpa2ndh70002gonabiinestw	active	cmpa2ndi9000vgona3ms9wdbq	2025-11-21 00:00:00
cmpa2ndid0010gona5igbkh55	EMP010	Sanjay	Iyer	sanjay.iyer10@corp.in	admin	cmpa2ndh70002gonabiinestw	active	cmpa2ndib000ygona2t9u4u5f	2025-07-19 00:00:00
cmpa2ndig0013gonakwyt6tug	EMP011	Diya	Gupta	diya.gupta11@corp.in	user	cmpa2ndhc0006gonajyctjxmc	active	cmpa2ndie0011gonayfok8kkt	2025-09-27 00:00:00
cmpa2ndii0016gonaib4zw8w3	EMP012	Aarav	Patel	aarav.patel12@corp.in	user	cmpa2ndh60001gonazdq83mno	active	cmpa2ndih0014gonaj3zy2rip	2025-08-05 00:00:00
cmpa2ndil0019gonaqf6nn8b3	EMP013	Arjun	Iyer	arjun.iyer13@corp.in	user	cmpa2ndfw0000gonamgv7v03p	active	cmpa2ndik0017gonaase0o0ej	2025-06-10 00:00:00
cmpa2ndio001cgonat4tte6ro	EMP014	Neha	Iyer	neha.iyer14@corp.in	admin	cmpa2ndha0004gona0ssfvjig	active	cmpa2ndin001agonaiq0fm2dj	2025-08-08 00:00:00
cmpa2ndir001fgonar032vpit	EMP015	Rohan	Patel	rohan.patel15@corp.in	user	cmpa2ndh60001gonazdq83mno	active	cmpa2ndiq001dgonavj7k3qxc	2025-07-07 00:00:00
cmpa2ndiu001igonaykwx2cux	EMP016	Vihaan	Sharma	vihaan.sharma16@corp.in	it_support	cmpa2ndh90003gonagzy5mk2f	active	cmpa2ndit001ggonawnutudtv	2025-11-25 00:00:00
cmpa2ndix001lgonatx5vzgw9	EMP017	Rohan	Kumar	rohan.kumar17@corp.in	it_support	cmpa2ndfw0000gonamgv7v03p	active	cmpa2ndiv001jgonazn0m1usf	2025-09-20 00:00:00
cmpa2ndj0001ogona4whqsycf	EMP018	Diya	Sharma	diya.sharma18@corp.in	it_support	cmpa2ndhb0005gona0jao37us	active	cmpa2ndiy001mgonaf706yfl0	2026-03-11 00:00:00
cmpa2ndj3001rgonae6kb8pqr	EMP019	Diya	Kumar	diya.kumar19@corp.in	user	cmpa2ndhb0005gona0jao37us	active	cmpa2ndj1001pgonavngjspjg	2025-12-27 00:00:00
cmpa2ndj5001ugonapfgwv0ag	EMP020	Ananya	Reddy	ananya.reddy20@corp.in	user	cmpa2ndh60001gonazdq83mno	active	cmpa2ndj4001sgonawrb8z1h5	2025-09-22 00:00:00
cmpa2ndj8001xgonagylxxjgp	EMP021	Sanjay	Reddy	sanjay.reddy21@corp.in	it_support	cmpa2ndh60001gonazdq83mno	active	cmpa2ndj7001vgonaeajjxob7	2025-09-30 00:00:00
cmpa2ndjb0020gona5rg0vf6t	EMP022	Diya	Iyer	diya.iyer22@corp.in	admin	cmpa2ndhc0006gonajyctjxmc	active	cmpa2ndja001ygonayy22nkof	2025-05-17 00:00:00
cmpa2ndje0023gona93fgwtms	EMP023	Vihaan	Iyer	vihaan.iyer23@corp.in	user	cmpa2ndh90003gonagzy5mk2f	active	cmpa2ndjc0021gona3dnylvhn	2025-06-16 00:00:00
cmpa2ndji0026gonadncegkgh	EMP024	Neha	Gupta	neha.gupta24@corp.in	it_support	cmpa2ndhc0006gonajyctjxmc	active	cmpa2ndjg0024gonawhricbn8	2025-06-15 00:00:00
cmpa2ndjl0029gona699k6mm4	EMP025	Priya	Khan	priya.khan25@corp.in	user	cmpa2ndh70002gonabiinestw	active	cmpa2ndjj0027gonauhvskcc9	2025-06-24 00:00:00
cmpa2ndjn002cgonatxxlp2x5	EMP026	Diya	Singh	diya.singh26@corp.in	admin	cmpa2ndhc0006gonajyctjxmc	active	cmpa2ndjm002agonagve7u0i7	2026-03-12 00:00:00
cmpa2ndjq002fgona2g5bj8hd	EMP027	Neha	Patel	neha.patel27@corp.in	it_support	cmpa2ndhc0006gonajyctjxmc	active	cmpa2ndjp002dgonacage45hk	2025-10-22 00:00:00
cmpa2ndjt002igonas737211c	EMP028	Arjun	Khan	arjun.khan28@corp.in	admin	cmpa2ndhc0006gonajyctjxmc	active	cmpa2ndjs002ggonarosehtvd	2025-06-26 00:00:00
cmpa2ndjw002lgonalx8ldgrl	EMP029	Diya	Reddy	diya.reddy29@corp.in	user	cmpa2ndhb0005gona0jao37us	active	cmpa2ndju002jgona3ezjbvld	2025-05-16 00:00:00
cmpa2ndjz002ogona5k3q021o	EMP030	Vihaan	Singh	vihaan.singh30@corp.in	user	cmpa2ndh90003gonagzy5mk2f	active	cmpa2ndjx002mgona79auwu8e	2025-07-13 00:00:00
cmpa2ndk1002rgonandw93b6m	EMP031	Arjun	Khan	arjun.khan31@corp.in	admin	cmpa2ndh70002gonabiinestw	active	cmpa2ndk0002pgonarnj3x85x	2026-01-13 00:00:00
cmpa2ndk3002ugona6jh7iipt	EMP032	Neha	Joshi	neha.joshi32@corp.in	it_support	cmpa2ndh90003gonagzy5mk2f	active	cmpa2ndk2002sgonacsuu825n	2026-03-15 00:00:00
cmpa2ndk6002xgona4n875bud	EMP033	Diya	Reddy	diya.reddy33@corp.in	admin	cmpa2ndh90003gonagzy5mk2f	active	cmpa2ndk5002vgonabgrlhn7p	2025-12-01 00:00:00
cmpa2ndk90030gonazcwqkft3	EMP034	Rohan	Joshi	rohan.joshi34@corp.in	admin	cmpa2ndh90003gonagzy5mk2f	active	cmpa2ndk8002ygona7sawdj2r	2025-11-02 00:00:00
cmpa2ndkd0033gonaghp220pe	EMP035	Priya	Joshi	priya.joshi35@corp.in	user	cmpa2ndha0004gona0ssfvjig	active	cmpa2ndkb0031gonalbgnch6h	2026-03-30 00:00:00
cmpa2ndkg0036gonab8l0zcg8	EMP036	Diya	Mehta	diya.mehta36@corp.in	admin	cmpa2ndhc0006gonajyctjxmc	active	cmpa2ndke0034gonaxxwi8bf2	2025-12-13 00:00:00
cmpa2ndki0039gonau2rm9t43	EMP037	Vihaan	Kumar	vihaan.kumar37@corp.in	user	cmpa2ndhb0005gona0jao37us	active	cmpa2ndkh0037gona6c6gbhz9	2025-10-10 00:00:00
cmpa2ndkl003cgonal16kizwn	EMP038	Diya	Sharma	diya.sharma38@corp.in	user	cmpa2ndfw0000gonamgv7v03p	active	cmpa2ndkk003agona159b9sl9	2025-08-18 00:00:00
cmpa2ndko003fgona51y9c53k	EMP039	Amit	Kumar	amit.kumar39@corp.in	it_support	cmpa2ndhc0006gonajyctjxmc	active	cmpa2ndkn003dgona0zuwlvee	2025-08-22 00:00:00
cmpa2ndkq003igonajbb2zvoc	EMP040	Sanjay	Khan	sanjay.khan40@corp.in	it_support	cmpa2ndhb0005gona0jao37us	active	cmpa2ndkp003ggonavhynm5cr	2025-08-05 00:00:00
cmpa2ndkt003lgonar6ofa1iq	EMP041	Priya	Patel	priya.patel41@corp.in	admin	cmpa2ndhb0005gona0jao37us	active	cmpa2ndks003jgonajb78dhst	2026-02-07 00:00:00
cmpa2ndkw003ogonaiodzx0qq	EMP042	Aarav	Iyer	aarav.iyer42@corp.in	admin	cmpa2ndh60001gonazdq83mno	active	cmpa2ndkv003mgonae9t79jmo	2026-02-03 00:00:00
cmpa2ndkz003rgona9dallzf4	EMP043	Sanjay	Singh	sanjay.singh43@corp.in	admin	cmpa2ndha0004gona0ssfvjig	active	cmpa2ndky003pgonauatdlphp	2025-06-15 00:00:00
cmpa2ndl2003ugona3x3nbhuw	EMP044	Amit	Mehta	amit.mehta44@corp.in	it_support	cmpa2ndh70002gonabiinestw	active	cmpa2ndl1003sgonaj8kexvdp	2026-04-10 00:00:00
cmpa2ndl6003xgonapyo7mo6g	EMP045	Rohan	Singh	rohan.singh45@corp.in	admin	cmpa2ndh70002gonabiinestw	active	cmpa2ndl4003vgonahkbirkja	2026-03-29 00:00:00
cmpa2ndl90040gonahl0v72mu	EMP046	Neha	Mehta	neha.mehta46@corp.in	it_support	cmpa2ndh90003gonagzy5mk2f	active	cmpa2ndl7003ygona5wb1g93s	2026-03-07 00:00:00
cmpa2ndlc0043gonay0m3rwx9	EMP047	Neha	Iyer	neha.iyer47@corp.in	admin	cmpa2ndhc0006gonajyctjxmc	active	cmpa2ndla0041gona4r53clm5	2026-03-25 00:00:00
cmpa2ndlf0046gonafryqn5wp	EMP048	Arjun	Joshi	arjun.joshi48@corp.in	user	cmpa2ndhb0005gona0jao37us	active	cmpa2ndld0044gona865err65	2026-03-30 00:00:00
cmpa2ndlj0049gonabj88zmla	EMP049	Sanjay	Khan	sanjay.khan49@corp.in	user	cmpa2ndfw0000gonamgv7v03p	active	cmpa2ndlh0047gona7kgkh1r6	2026-01-03 00:00:00
cmpa2ndlm004cgona6da67ls6	EMP050	Arjun	Gupta	arjun.gupta50@corp.in	user	cmpa2ndh70002gonabiinestw	active	cmpa2ndlk004agonaxgbrx2w9	2025-06-24 00:00:00
cmpa3j7fp00017mzgdtgkrmjm	EMP051	Aditya	Sharma	aditya.sharma@enterprise.com	Software Engineer	cmpa3hw4q00005vqp0nx16n25	active	\N	2026-05-17 18:16:05.221
cmpa3j7ft00037mzgai5x77fs	EMP052	Karan	Malhotra	karan.malhotra@enterprise.com	UX Designer	cmpa3hw4q00005vqp0nx16n25	active	\N	2026-05-17 18:16:05.225
\.


--
-- TOC entry 4971 (class 0 OID 25552)
-- Dependencies: 222
-- Data for Name: Request; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Request" (id, type, description, status, "employeeId", "createdAt", "updatedAt") FROM stdin;
REQ-1001	Apple iPad Pro	Required for client design presentations & creative mockup sketching.	pending	cmpa2ndi2000ogonaczgn6lw4	2026-05-18 09:30:00	2026-05-18 08:18:03.445
REQ-1002	Dell UltraSharp 27" Monitor	Dual-screen setup upgrade for professional IDE developer efficiency.	approved	cmpa2ndhi0009gonapnp8vlyl	2026-05-16 11:15:00	2026-05-18 08:18:03.457
REQ-1003	Logitech MX Master 3S Mouse	Ergonomic precision mouse requested for heavy UI layout design tasks.	approved	cmpa2ndhr000fgonaeqe108p9	2026-05-17 14:40:00	2026-05-18 08:18:03.459
REQ-1004	Keychron Q1 Mechanical Keyboard	Standard office peripheral replacement request (Exceeds standard IT procurement budget allowance).	rejected	cmpa2ndia000xgona2s7sgn9j	2026-05-15 16:20:00	2026-05-18 08:18:03.46
\.


--
-- TOC entry 4969 (class 0 OID 25535)
-- Dependencies: 220
-- Data for Name: ReturnEvent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ReturnEvent" (id, "assetId", "employeeId", "returnedAt", condition, notes) FROM stdin;
cmpa2ndw100h6gonayucgzzxc	cmpa2ndm60050gona5xjkl66y	cmpa2ndlm004cgona6da67ls6	2026-05-13 00:00:00	Excellent	Returned early
cmpa2ndw800h8gonajuw1nf9w	cmpa2ndng006kgonalqmd8td2	cmpa2ndj3001rgonae6kb8pqr	2026-05-11 00:00:00	Excellent	Returned early
cmpa2ndwj00hcgonawxuj84g1	cmpa2ndm5004ygonavqk34id5	cmpa2ndkw003ogonaiodzx0qq	2026-05-15 00:00:00	Excellent	Returned early
cmpa2ndwo00hegonass1ifisf	cmpa2ndrn00bsgonalrmcowdh	cmpa2ndjz002ogona5k3q021o	2026-05-15 00:00:00	Excellent	Returned early
cmpa2ndwt00hggonaep18ul5v	cmpa2ndpt009igona0g61fjiu	cmpa2ndk90030gonazcwqkft3	2026-05-14 00:00:00	Excellent	Returned early
cmpa2ndx000higona5wgt3i61	cmpa2ndrl00bqgona93xojqzf	cmpa2ndia000xgona2s7sgn9j	2026-05-13 00:00:00	Excellent	Returned early
cmpa2ndx500hkgonajgelmttc	cmpa2ndod007ogonakhj0q2q6	cmpa2ndii0016gonaib4zw8w3	2026-05-13 00:00:00	Excellent	Returned early
cmpa2ndx900hmgonaftjkfe09	cmpa2ndo3007agonaczgwcuvu	cmpa2ndjn002cgonatxxlp2x5	2026-05-13 00:00:00	Excellent	Returned early
cmpa2ndxe00hogonar36fkddn	cmpa2ndql00aggonaijf1avzg	cmpa2ndlc0043gonay0m3rwx9	2026-05-12 00:00:00	Excellent	Returned early
cmpa2ndxn00hsgonauqrn29on	cmpa2ndov008agonaht3fq9l4	cmpa2ndjl0029gona699k6mm4	2026-05-13 00:00:00	Excellent	Returned early
cmpa2ndxs00hugonans7wkdvb	cmpa2ndof007qgonao9ph42e8	cmpa2ndkt003lgonar6ofa1iq	2026-05-15 00:00:00	Excellent	Returned early
cmpa2ndy100hygonaoyjjp6qz	cmpa2ndqq00amgonayjtiorhd	cmpa2ndlf0046gonafryqn5wp	2026-05-13 00:00:00	Excellent	Returned early
cmpa2ndy600i0gona9dgvg170	cmpa2nds300cagonamxizdt11	cmpa2ndho000cgonaeohxqkna	2026-05-11 00:00:00	Excellent	Returned early
cmpa2ndyb00i2gona7gvxss3d	cmpa2ndlx004ogonaxz8eh6x4	cmpa2ndjw002lgonalx8ldgrl	2026-05-12 00:00:00	Excellent	Returned early
cmpa2ndyf00i4gonax16winxq	cmpa2ndn60068gonakembqv4w	cmpa2ndj3001rgonae6kb8pqr	2026-05-15 00:00:00	Excellent	Returned early
cmpa2ndyk00i6gonax8hbkj3i	cmpa2ndrd00bggona883hpdtp	cmpa2ndkd0033gonaghp220pe	2026-05-15 00:00:00	Excellent	Returned early
cmpa2ndyp00i8gona6ckewwqd	cmpa2ndnr006ygonabnt1i1f3	cmpa2ndkw003ogonaiodzx0qq	2026-05-11 00:00:00	Excellent	Returned early
cmpa2ndyu00iagonapfekirir	cmpa2ndse00cogona0qyisbsd	cmpa2ndjb0020gona5rg0vf6t	2026-05-14 00:00:00	Excellent	Returned early
cmpa2ndyz00icgonaslnzrwd8	cmpa2ndlz004qgonarmtub7p8	cmpa2ndjt002igonas737211c	2026-05-11 00:00:00	Excellent	Returned early
cmpa2ndz900iggonaaqf9ifue	cmpa2ndm3004wgona8ka933fo	cmpa2ndi5000rgonaisrscagb	2026-05-11 00:00:00	Excellent	Returned early
cmpa2ndzd00iigonar03xec8z	cmpa2ndr700b8gonamvzkd4a9	cmpa2ndjz002ogona5k3q021o	2026-05-12 00:00:00	Excellent	Returned early
cmpa2ndzj00ikgonay62jgxq8	cmpa2ndmf005cgonas8csvf2d	cmpa2ndkw003ogonaiodzx0qq	2026-05-14 00:00:00	Excellent	Returned early
cmpa2ndzo00imgona3dhlfoig	cmpa2ndmi005egonaaovy28cb	cmpa2ndje0023gona93fgwtms	2026-05-13 00:00:00	Excellent	Returned early
cmpa2ndzt00iogonaoykj413b	cmpa2ndop0084gonarygvm7co	cmpa2ndk6002xgona4n875bud	2026-05-12 00:00:00	Excellent	Returned early
cmpa2ndzy00iqgonasla00c2f	cmpa2ndob007mgona53mh8nip	cmpa2ndkg0036gonab8l0zcg8	2026-05-13 00:00:00	Excellent	Returned early
cmpa2ngr60003lethwrnj9xdo	cmpa2ndnz0076gonaa0l3t0i8	cmpa2ndk90030gonazcwqkft3	2026-05-17 17:51:24.307	Good	Test AI Return
cmpa3wkge000113dxdx8ji77y	cmpa2ndlx004ogonaxz8eh6x4	cmpa2ndki0039gonau2rm9t43	2026-03-30 00:00:00	Excellent	System auto-return resolved double-allocation overlap.
cmpa3wkhm000313dxkzlpglpp	cmpa2ndlx004ogonaxz8eh6x4	cmpa2ndk1002rgonandw93b6m	2026-04-08 00:00:00	Excellent	System auto-return resolved double-allocation overlap.
cmpa3wkhs000513dxivqk662m	cmpa2ndp1008igonau59yp9r6	cmpa2ndii0016gonaib4zw8w3	2026-04-08 00:00:00	Excellent	System auto-return resolved double-allocation overlap.
cmpa3wkhw000713dxqoycgy5t	cmpa2ndrc00begonadrvkkvcp	cmpa2ndjl0029gona699k6mm4	2026-05-01 00:00:00	Excellent	System auto-return resolved double-allocation overlap.
cmpa3wki0000913dx1dhslfdv	cmpa2ndri00bmgonafvyxj60e	cmpa2ndil0019gonaqf6nn8b3	2026-04-23 00:00:00	Excellent	System auto-return resolved double-allocation overlap.
cmpa3wki5000b13dxhtn6qvbq	cmpa2ndmu005sgonaqwcajsd9	cmpa2ndjt002igonas737211c	2026-05-03 00:00:00	Excellent	System auto-return resolved double-allocation overlap.
cmpa3wki8000d13dxle07fhhn	cmpa2ndq6009ygona6zadz64d	cmpa2ndjw002lgonalx8ldgrl	2026-05-01 00:00:00	Excellent	System auto-return resolved double-allocation overlap.
cmpa3wkib000f13dx6qdxgbet	cmpa2ndpn009agonadvypsxg4	cmpa2ndje0023gona93fgwtms	2026-04-17 00:00:00	Excellent	System auto-return resolved double-allocation overlap.
cmpa3wkie000h13dx0dafx6t9	cmpa2ndme005agonapz7ri9km	cmpa2ndj0001ogona4whqsycf	2026-05-04 00:00:00	Excellent	System auto-return resolved double-allocation overlap.
cmpa3wkih000j13dxtj39md17	cmpa2ndog007sgonaxcq1338q	cmpa2ndk6002xgona4n875bud	2026-04-02 00:00:00	Excellent	System auto-return resolved double-allocation overlap.
cmpa42lv400014ja7oqsgx67s	cmpa2ndmz005ygonaw5qqpal8	cmpa2ndhi0009gonapnp8vlyl	2026-04-10 00:00:00	Good	Returned in good condition during upgrade.
cmpa42lw500034ja714io3ivi	cmpa2ndml005igonax5ykdlhd	cmpa2ndjb0020gona5rg0vf6t	2026-04-22 00:00:00	Good	Returned in good condition during upgrade.
cmpa42lwc00054ja7fb6owtsr	cmpa2ndoo0082gonaaqzibbu9	cmpa2ndjl0029gona699k6mm4	2026-04-22 00:00:00	Good	Returned in good condition during upgrade.
cmpa42lwj00074ja7srvemjb6	cmpa2ndq900a2gonaah4jjffl	cmpa2ndjt002igonas737211c	2026-04-14 00:00:00	Good	Returned in good condition during upgrade.
cmpa42lwq00094ja721bp0bvp	cmpa2ndnj006ogonax8ajx2xw	cmpa2ndjz002ogona5k3q021o	2026-03-31 12:00:00	Good	Returned in good condition during upgrade.
cmpa42lww000b4ja7tr6923rs	cmpa2ndpm0098gonaom3euqy1	cmpa2ndjz002ogona5k3q021o	2026-04-11 00:00:00	Good	Returned in good condition during upgrade.
cmpa42lx2000d4ja72l9dz49e	cmpa2ndpp009cgonadkxbibhl	cmpa2ndki0039gonau2rm9t43	2026-03-28 00:00:00	Good	Returned in good condition during upgrade.
cmpa42lx7000f4ja7axp3bu4g	cmpa2ndlx004ogonaxz8eh6x4	cmpa2ndko003fgona51y9c53k	2026-04-26 00:00:00	Good	Returned in good condition during upgrade.
cmpa42lxc000h4ja774ippkls	cmpa2ndmw005ugonayvnyboz9	cmpa2ndl6003xgonapyo7mo6g	2026-05-03 00:00:00	Good	Returned in good condition during upgrade.
cmpa4ysy000011trw211khzno	cmpa3j7fv00057mzg0bdc9hzz	cmpa3j7fp00017mzgdtgkrmjm	2026-05-14 23:46:05	Good	Returned late
cmpa4ysyi00031trwki664l8q	cmpa3j7fy00077mzgekwvs35j	cmpa3j7ft00037mzgai5x77fs	2026-05-12 23:46:05	Good	Returned late
cmpa2ndxj00hqgonah5izaho3	cmpa2ndnz0076gonaa0l3t0i8	cmpa2ndjq002fgona2g5bj8hd	2026-04-15 12:00:00	Excellent	Returned early
cmpaqzaad0001149ln771ysbf	cmpa2ndnz0076gonaa0l3t0i8	cmpa2ndjw002lgonalx8ldgrl	2026-05-01 10:00:00	Excellent	Standard return
cmpatkig80005ayras74z9td3	cmpa2ndls004igona7gt7igwc	cmpa2ndho000cgonaeohxqkna	2026-05-18 06:24:56.168	Good	
cmpavwwa0000hayra4c4gsh9w	cmpa2ndls004igona7gt7igwc	cmpa2ndho000cgonaeohxqkna	2026-05-18 07:30:33.192	Damaged	
cmpaz80ve0005hz97kn10o3s5	cmpa2ndlt004kgona1nh8iuta	cmpa2ndhr000fgonaeqe108p9	2026-05-18 09:03:11.211	Damaged	
\.


--
-- TOC entry 4964 (class 0 OID 25493)
-- Dependencies: 215
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, password, role, "createdAt") FROM stdin;
cmpa2ndhe0007gona4hl9bfej	neha.joshi1@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	user	2026-05-17 17:51:20.066
cmpa2ndhm000agonarw17oaer	neha.iyer2@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	it_support	2026-05-17 17:51:20.075
cmpa2ndhq000dgonae23pxcsm	aarav.gupta3@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	user	2026-05-17 17:51:20.078
cmpa2ndht000ggona0ce63oe1	aarav.patel4@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	admin	2026-05-17 17:51:20.081
cmpa2ndhx000jgona9t6fn9yp	diya.joshi5@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	it_support	2026-05-17 17:51:20.085
cmpa2ndi0000mgonapioomycf	vihaan.sharma6@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	admin	2026-05-17 17:51:20.088
cmpa2ndi3000pgonarxwk3tpm	priya.reddy7@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	admin	2026-05-17 17:51:20.092
cmpa2ndi6000sgonaghq1u2re	aarav.singh8@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	it_support	2026-05-17 17:51:20.094
cmpa2ndi9000vgona3ms9wdbq	sanjay.sharma9@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	user	2026-05-17 17:51:20.098
cmpa2ndib000ygona2t9u4u5f	sanjay.iyer10@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	admin	2026-05-17 17:51:20.1
cmpa2ndie0011gonayfok8kkt	diya.gupta11@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	user	2026-05-17 17:51:20.103
cmpa2ndih0014gonaj3zy2rip	aarav.patel12@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	user	2026-05-17 17:51:20.105
cmpa2ndik0017gonaase0o0ej	arjun.iyer13@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	user	2026-05-17 17:51:20.108
cmpa2ndin001agonaiq0fm2dj	neha.iyer14@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	admin	2026-05-17 17:51:20.111
cmpa2ndiq001dgonavj7k3qxc	rohan.patel15@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	user	2026-05-17 17:51:20.114
cmpa2ndit001ggonawnutudtv	vihaan.sharma16@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	it_support	2026-05-17 17:51:20.117
cmpa2ndiv001jgonazn0m1usf	rohan.kumar17@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	it_support	2026-05-17 17:51:20.12
cmpa2ndiy001mgonaf706yfl0	diya.sharma18@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	it_support	2026-05-17 17:51:20.123
cmpa2ndj1001pgonavngjspjg	diya.kumar19@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	user	2026-05-17 17:51:20.126
cmpa2ndj4001sgonawrb8z1h5	ananya.reddy20@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	user	2026-05-17 17:51:20.128
cmpa2ndj7001vgonaeajjxob7	sanjay.reddy21@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	it_support	2026-05-17 17:51:20.131
cmpa2ndja001ygonayy22nkof	diya.iyer22@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	admin	2026-05-17 17:51:20.134
cmpa2ndjc0021gona3dnylvhn	vihaan.iyer23@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	user	2026-05-17 17:51:20.137
cmpa2ndjg0024gonawhricbn8	neha.gupta24@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	it_support	2026-05-17 17:51:20.14
cmpa2ndjj0027gonauhvskcc9	priya.khan25@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	user	2026-05-17 17:51:20.143
cmpa2ndjm002agonagve7u0i7	diya.singh26@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	admin	2026-05-17 17:51:20.147
cmpa2ndjp002dgonacage45hk	neha.patel27@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	it_support	2026-05-17 17:51:20.149
cmpa2ndjs002ggonarosehtvd	arjun.khan28@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	admin	2026-05-17 17:51:20.152
cmpa2ndju002jgona3ezjbvld	diya.reddy29@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	user	2026-05-17 17:51:20.155
cmpa2ndjx002mgona79auwu8e	vihaan.singh30@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	user	2026-05-17 17:51:20.158
cmpa2ndk0002pgonarnj3x85x	arjun.khan31@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	admin	2026-05-17 17:51:20.16
cmpa2ndk2002sgonacsuu825n	neha.joshi32@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	it_support	2026-05-17 17:51:20.163
cmpa2ndk5002vgonabgrlhn7p	diya.reddy33@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	admin	2026-05-17 17:51:20.165
cmpa2ndk8002ygona7sawdj2r	rohan.joshi34@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	admin	2026-05-17 17:51:20.168
cmpa2ndkb0031gonalbgnch6h	priya.joshi35@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	user	2026-05-17 17:51:20.171
cmpa2ndke0034gonaxxwi8bf2	diya.mehta36@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	admin	2026-05-17 17:51:20.175
cmpa2ndkh0037gona6c6gbhz9	vihaan.kumar37@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	user	2026-05-17 17:51:20.177
cmpa2ndkk003agona159b9sl9	diya.sharma38@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	user	2026-05-17 17:51:20.181
cmpa2ndkn003dgona0zuwlvee	amit.kumar39@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	it_support	2026-05-17 17:51:20.183
cmpa2ndkp003ggonavhynm5cr	sanjay.khan40@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	it_support	2026-05-17 17:51:20.185
cmpa2ndks003jgonajb78dhst	priya.patel41@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	admin	2026-05-17 17:51:20.188
cmpa2ndkv003mgonae9t79jmo	aarav.iyer42@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	admin	2026-05-17 17:51:20.191
cmpa2ndky003pgonauatdlphp	sanjay.singh43@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	admin	2026-05-17 17:51:20.194
cmpa2ndl1003sgonaj8kexvdp	amit.mehta44@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	it_support	2026-05-17 17:51:20.197
cmpa2ndl4003vgonahkbirkja	rohan.singh45@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	admin	2026-05-17 17:51:20.2
cmpa2ndl7003ygona5wb1g93s	neha.mehta46@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	it_support	2026-05-17 17:51:20.204
cmpa2ndla0041gona4r53clm5	neha.iyer47@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	admin	2026-05-17 17:51:20.206
cmpa2ndld0044gona865err65	arjun.joshi48@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	user	2026-05-17 17:51:20.21
cmpa2ndlh0047gona7kgkh1r6	sanjay.khan49@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	user	2026-05-17 17:51:20.214
cmpa2ndlk004agonaxgbrx2w9	arjun.gupta50@corp.in	$2a$10$7NAsxrNBAkSXxlFdvGIbhO4ALwlSHuG2RazoUNzY2VxvFRgaOFJh2	user	2026-05-17 17:51:20.217
\.


--
-- TOC entry 4810 (class 2606 OID 25576)
-- Name: ActivityLog ActivityLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityLog"
    ADD CONSTRAINT "ActivityLog_pkey" PRIMARY KEY (id);


--
-- TOC entry 4808 (class 2606 OID 25568)
-- Name: AiQueryHistory AiQueryHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AiQueryHistory"
    ADD CONSTRAINT "AiQueryHistory_pkey" PRIMARY KEY (id);


--
-- TOC entry 4800 (class 2606 OID 25534)
-- Name: Allocation Allocation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Allocation"
    ADD CONSTRAINT "Allocation_pkey" PRIMARY KEY (id);


--
-- TOC entry 4798 (class 2606 OID 25525)
-- Name: Asset Asset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Asset"
    ADD CONSTRAINT "Asset_pkey" PRIMARY KEY (id);


--
-- TOC entry 4804 (class 2606 OID 25551)
-- Name: DamageReport DamageReport_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DamageReport"
    ADD CONSTRAINT "DamageReport_pkey" PRIMARY KEY (id);


--
-- TOC entry 4790 (class 2606 OID 25508)
-- Name: Department Department_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Department"
    ADD CONSTRAINT "Department_pkey" PRIMARY KEY (id);


--
-- TOC entry 4794 (class 2606 OID 25517)
-- Name: Employee Employee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_pkey" PRIMARY KEY (id);


--
-- TOC entry 4806 (class 2606 OID 25560)
-- Name: Request Request_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Request"
    ADD CONSTRAINT "Request_pkey" PRIMARY KEY (id);


--
-- TOC entry 4802 (class 2606 OID 25542)
-- Name: ReturnEvent ReturnEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReturnEvent"
    ADD CONSTRAINT "ReturnEvent_pkey" PRIMARY KEY (id);


--
-- TOC entry 4787 (class 2606 OID 25500)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 4796 (class 1259 OID 25582)
-- Name: Asset_assetId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Asset_assetId_key" ON public."Asset" USING btree ("assetId");


--
-- TOC entry 4788 (class 1259 OID 25578)
-- Name: Department_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Department_code_key" ON public."Department" USING btree (code);


--
-- TOC entry 4791 (class 1259 OID 25580)
-- Name: Employee_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Employee_email_key" ON public."Employee" USING btree (email);


--
-- TOC entry 4792 (class 1259 OID 25579)
-- Name: Employee_employeeId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Employee_employeeId_key" ON public."Employee" USING btree ("employeeId");


--
-- TOC entry 4795 (class 1259 OID 25581)
-- Name: Employee_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Employee_userId_key" ON public."Employee" USING btree ("userId");


--
-- TOC entry 4785 (class 1259 OID 25577)
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- TOC entry 4814 (class 2606 OID 25599)
-- Name: Allocation Allocation_assetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Allocation"
    ADD CONSTRAINT "Allocation_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES public."Asset"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4815 (class 2606 OID 25604)
-- Name: Allocation Allocation_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Allocation"
    ADD CONSTRAINT "Allocation_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4813 (class 2606 OID 25594)
-- Name: Asset Asset_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Asset"
    ADD CONSTRAINT "Asset_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public."Department"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4818 (class 2606 OID 25619)
-- Name: DamageReport DamageReport_assetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DamageReport"
    ADD CONSTRAINT "DamageReport_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES public."Asset"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4819 (class 2606 OID 25624)
-- Name: DamageReport DamageReport_reportedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DamageReport"
    ADD CONSTRAINT "DamageReport_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4811 (class 2606 OID 25584)
-- Name: Employee Employee_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public."Department"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4812 (class 2606 OID 25589)
-- Name: Employee Employee_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4820 (class 2606 OID 25629)
-- Name: Request Request_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Request"
    ADD CONSTRAINT "Request_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4816 (class 2606 OID 25609)
-- Name: ReturnEvent ReturnEvent_assetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReturnEvent"
    ADD CONSTRAINT "ReturnEvent_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES public."Asset"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4817 (class 2606 OID 25614)
-- Name: ReturnEvent ReturnEvent_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReturnEvent"
    ADD CONSTRAINT "ReturnEvent_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2026-06-18 09:25:46

--
-- PostgreSQL database dump complete
--

\unrestrict p1QS25NuhyNGL2ssjV95yBgba1XblbzEAnVKZ22rllIrb7CFk0orUsfrmjqh2j1

