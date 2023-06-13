--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: quotes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quotes (
    id integer NOT NULL,
    quote character varying(100) NOT NULL,
    author character varying(50) NOT NULL
);


ALTER TABLE public.quotes OWNER TO postgres;

--
-- Name: Quotes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Quotes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Quotes_id_seq" OWNER TO postgres;

--
-- Name: Quotes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Quotes_id_seq" OWNED BY public.quotes.id;


--
-- Name: access_tokens; Type: TABLE; Schema: public; Owner: me
--

CREATE TABLE public.access_tokens (
    id integer NOT NULL,
    access_token text,
    user_id integer
);


ALTER TABLE public.access_tokens OWNER TO me;

--
-- Name: access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: me
--

CREATE SEQUENCE public.access_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.access_tokens_id_seq OWNER TO me;

--
-- Name: access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: me
--

ALTER SEQUENCE public.access_tokens_id_seq OWNED BY public.access_tokens.id;


--
-- Name: gratitude_items; Type: TABLE; Schema: public; Owner: me
--

CREATE TABLE public.gratitude_items (
    google_id character varying(50),
    date date,
    gratitude_item character varying(1000),
    id uuid NOT NULL
);


ALTER TABLE public.gratitude_items OWNER TO me;

--
-- Name: users; Type: TABLE; Schema: public; Owner: me
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(30),
    last_name character varying(30),
    email character varying(30),
    google_id character varying(30)
);


ALTER TABLE public.users OWNER TO me;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: me
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO me;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: me
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: access_tokens id; Type: DEFAULT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.access_tokens ALTER COLUMN id SET DEFAULT nextval('public.access_tokens_id_seq'::regclass);


--
-- Name: quotes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotes ALTER COLUMN id SET DEFAULT nextval('public."Quotes_id_seq"'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: access_tokens; Type: TABLE DATA; Schema: public; Owner: me
--

COPY public.access_tokens (id, access_token, user_id) FROM stdin;
\.


--
-- Data for Name: gratitude_items; Type: TABLE DATA; Schema: public; Owner: me
--

COPY public.gratitude_items (google_id, date, gratitude_item, id) FROM stdin;
106828491733285721468	2023-05-16	hey!!!!	115e5648-c393-44f1-9ea3-93d1a846a928
106828491733285721468	2023-05-17	Hi!	065aed8c-4477-4841-be02-c3cf48baee6c
106828491733285721468	2023-05-18	checking...	757ffc7b-d905-4fc0-b338-b317868aa960
106828491733285721468	2023-05-18	Testing again	b94f2b21-f59d-4a80-a35f-a66a3447c385
106828491733285721468	2023-05-18	OK yay it&#x27;s working again	3a6b8331-94b9-4f1d-95de-0c3bad50126b
106828491733285721468	2023-05-18	Heyooo	4a967a8b-d62a-46b3-bd10-0acffcf4a18c
106828491733285721468	2023-05-10	Save it!	20b1bbcf-664a-4f5b-bd69-aafbdae0da7f
106828491733285721468	2023-05-10	please work!	de9a94e0-0fda-4ce6-94d1-6de6c25382c0
106828491733285721468	2023-05-10	So close!	ea6b875e-4715-45e0-a6d0-1ced0434b725
106828491733285721468	2023-05-10	SOmething goes here...	dd44b263-9a7c-4ad6-b6a4-e730ce56a14b
106828491733285721468	2023-05-10	Elijah!	14853778-556a-4984-a412-1cfdba0ab152
106828491733285721468	2023-05-10	My kids	9d22980c-42c9-4822-b799-280c0a910046
106828491733285721468	2023-05-10	dinner	0dfb51ab-b905-4a1b-8828-df9d07aa8313
106828491733285721468	2023-05-10	I am grateful that this freaking app works!!!!!!	de5c722f-f739-4924-ae91-0fda76195550
106828491733285721468	2023-05-10	I am grateful for beautiful weather, amazing friends, and sunshine.	a5506741-bb6f-406c-af7e-0928778c1da7
106828491733285721468	2023-05-10	I am grateful for my brain, and the times it decides to fire brain cells.	112b813a-ccc7-4547-af6b-34134c0b0f6d
106828491733285721468	2023-05-10	I am grateful I am learning how to code.	becafb73-4aa8-4ac4-a73e-40bbd6955c03
106828491733285721468	2023-05-10	I am grateful this is working?	c24382e7-4f11-412c-a76e-11758e70726f
106828491733285721468	2023-05-10	I am grateful for amazing friends.	c44d5928-b38c-4bfb-b442-5d86311acf86
116898312873763646614	2023-05-10	I am grateful for birds.	aa1abf75-61a0-4628-bfa7-6d2322e78f01
106828491733285721468	2023-05-11	cvgcfxxfcvcbb vb	5699a31d-f863-4d2c-b222-aa1c52b78580
106828491733285721468	2023-05-11	sk	b6be121b-a23b-4ddd-98a0-1cb8351a9582
106828491733285721468	2023-05-11	Hey there. Are you working? Or did Amanda break you?	d72bfe91-c496-4254-ac4f-d13a7e0ffdf8
106828491733285721468	2023-05-11	I am grateful for the sound of my kids playing happily together.	3a79c270-6e16-4471-baa4-b3682a16507a
106828491733285721468	2023-05-11	I am grateful for water.	48585358-d278-48ed-9e8a-ad77788ea228
106828491733285721468	2023-05-11	I am grateful for......the rain.	c13e5694-b4a8-4037-8743-e38876ce31b3
106828491733285721468	2023-05-12	I am grateful!	7f53b43d-069a-4109-9514-4fb5d760073b
106828491733285721468	2023-05-12	Bugs.	ab22a093-2272-4cfc-92b4-e34901eb8709
106828491733285721468	2023-05-12	I am grateful for smoothies.	c97b2286-9329-442b-a02b-984124a9f87f
106828491733285721468	2023-05-12	Sand	bbd72586-68f5-4cd5-9ce5-1d362de353ac
106828491733285721468	2023-05-12	khakfdj	dc7044e4-8cf8-4ff8-af17-c32d3eba4cc7
106828491733285721468	2023-05-12	heyo	329e9d47-dc8f-4f51-a679-c70923df538d
106828491733285721468	2023-05-12	Hey there.	7ee4637c-dab7-48b7-aebd-3f6d5c3c6405
106828491733285721468	2023-05-12	I am grateful for my people.	88f6eaf2-ae2b-4a53-b0de-b7b0b729104b
106828491733285721468	2023-05-12	yyyyy	4609306f-ad6a-4ed5-94e6-cb6eeb8060d7
106828491733285721468	2023-05-12	dsjfkldsfjkd	facdd868-9691-463a-a141-c0c888956d77
106828491733285721468	2023-05-12	Heyo!	cdb0fa0e-e5b1-4665-b160-997b1d6ede08
106828491733285721468	2023-05-13	waking up in the morning	db4deaf7-bbd0-42ee-b171-78610f63f7e6
106828491733285721468	2023-05-13	I AM GRATEFUL FOR A WORKING APP!!!!	fa008cc1-38dd-48e4-a23e-b18ab2338aed
116898312873763646614	2023-05-13	This shouldn&#x27;t create a new user.	67876c6a-b4b3-428b-a461-63a7c27ed684
106828491733285721468	2023-05-15	hi	c1f0ad17-0cad-430e-ba9c-813a501b2c4f
106828491733285721468	2023-05-15	hi	31a3fc53-bc24-4b0e-9c5d-d2dc2b2e3a75
106828491733285721468	2023-05-15	hi	01cb9dea-7bd7-4254-949e-fb42db81197a
106828491733285721468	2023-05-15	hello there	43619b3f-832b-4ab3-82ae-ae04ce293ead
106828491733285721468	2023-05-15	hey	0e8352d7-7062-44a1-859d-6fa25145d2f6
106828491733285721468	2023-05-15	ugh man	09907421-1bef-4a2c-937f-447d1793f881
106828491733285721468	2023-05-15	are you there?	333377bc-6142-45c2-8524-155a6c027634
106828491733285721468	2023-05-15	balls	f7495f3d-e374-4e3d-9d10-08daae6a3516
106828491733285721468	2023-05-16	Checking...	08b5188c-55ee-41c7-9fb8-02d52e39120c
106828491733285721468	2023-05-16	I am grateful for kid snuggles.	368aea3e-41a6-47d7-970a-c8c74ade9aac
106828491733285721468	2023-05-16	I am grateful for poop.	98f3237a-5376-4fc9-9cd1-549106042627
106828491733285721468	2023-05-16	Julian is grateful for tomatoes.	231147ca-0647-452a-a893-c62f856c1c7e
106828491733285721468	2023-05-16	Elijah is grateful for video games.	e64b94de-92ff-4b29-bb5c-d795781610e5
106828491733285721468	2023-05-18	Hi	90b72aa9-f2d3-4ccd-9dd1-98c8a60212d3
106828491733285721468	2023-05-18	I guess session persistence isn&#x27;t quite so...persistent.	f011683b-bbdb-4228-93d3-aec0891f1405
106828491733285721468	2023-05-19	A cool show.	8ccc6faa-9d53-431b-a7c6-8da802864306
106828491733285721468	2023-05-19	I hope this still works	390b8d4e-cc61-4ce1-a779-ca58759b5feb
106828491733285721468	2023-05-19	Trying again!	05849e5e-f961-42a3-965b-5eb4f678ce71
106828491733285721468	2023-05-19	YAY!!	d1ec9f9c-6fe7-424b-a9b1-f8dac099c5e9
108717582378713701045	2023-05-19	Fun show and day with friends 	0152c9dd-b154-4edb-a8f8-abbc95d1cabf
116898312873763646614	2023-05-20	thrgssssssssssssss	2f09f19f-260e-4945-af8f-7720f5284fb8
116898312873763646614	2023-05-20	poppy corn	f808ad14-4c0c-48c1-ac2a-501cdcd33e94
106828491733285721468	2023-05-22	Yooooo	cd06f6c4-e8cd-4680-a111-630b2ad94dc5
106828491733285721468	2023-05-22	Yooooo	878424ad-85e3-4566-8661-3a395e0a771d
106828491733285721468	2023-05-22	Yooooo	34b4a8f0-224a-4b1f-bc3b-97e642cf8c5d
106828491733285721468	2023-05-22	Yooooo	b85c7d26-9390-4513-9185-b4f0fa38ec9d
106828491733285721468	2023-05-22	Yooooo	4900972d-0400-49ea-a015-19a8dc717667
106828491733285721468	2023-05-22	Yooooo	3deab645-3a08-41d5-8312-9c89b8aae6f4
106828491733285721468	2023-05-22	Why aren&#x27;t you going away?	2378637a-765b-47d5-a78c-fd811d56a214
106828491733285721468	2023-05-22	Hopefully a working app	10ecb39e-9542-4a2a-bee9-ef627aaa9a6e
106828491733285721468	2023-05-22	Testing	7b4961c8-fe2b-46c5-8081-c895f16220ec
106828491733285721468	2023-05-24	Testing!	70037bf8-f00a-411e-a161-31e34703e72b
106828491733285721468	2023-05-24	Testing again.	d0db850e-27a8-429a-ba6c-b37db6184722
106828491733285721468	2023-05-24	hey	c0b5f66f-a2c2-4446-a562-305a82653a2a
106828491733285721468	2023-05-24	Let us see if this works.	93115035-14d5-47e6-888e-129444f80ef3
106828491733285721468	2023-05-24	hmmm	3c181f73-e21c-4f43-8fc8-34fc270827ee
106828491733285721468	2023-05-24	heyo	d77272ca-c965-4328-b73c-d99b9bb22f19
106828491733285721468	2023-05-24	testing testing	75a920f0-6908-4dd3-a4eb-e0eab2255c12
106828491733285721468	2023-05-24	Isabel!	15ddd390-6301-4eb1-b1a1-f23432acd1e7
106828491733285721468	2023-05-24	this should not work	1db35db1-eb3c-47dc-ae06-94db2f12bb5b
106828491733285721468	2023-05-24	Friends	b419052f-e4e9-420a-b8c9-6cf9d9417d6e
106828491733285721468	2023-05-24	Testing yet again	bf02b78b-d893-4287-85bb-976f04fa461c
106828491733285721468	2023-05-24	birds	48b4f3f5-6830-4ab6-b447-915728d0bd59
106828491733285721468	2023-05-24	hi	ac8690a0-31b8-4931-8001-a6e3a77ef59e
106828491733285721468	2023-05-24	dslkfjd	98ed0283-fbc8-47bc-abf5-722cc16fa4ce
106828491733285721468	2023-05-24	heyo	5a60a752-11a7-44f6-b25b-70551b3d18ee
106828491733285721468	2023-05-27	I am grateful for good friends and beautiful weather.	41d613d6-fbca-4407-8eef-2e6aea56dcb7
106828491733285721468	2023-05-27	i AM GRATEFUL FOR CAPS LOCK.	6a747407-ecc7-4dc0-88b2-11defee2a82b
106828491733285721468	2023-05-27	I am grateful for my cat Pearl.	e7a43449-2764-47d3-9f3d-90e519de41c3
106828491733285721468	2023-05-28	I am grateful for time with the people I love.	88026962-bcda-41e0-a483-9f20f41e1d94
113685679545767792007	2023-05-28	I am grateful for my smart girlfriend and her cool ass app.	5d900b49-98a9-40f4-8011-cbe9254adc35
106828491733285721468	2023-05-28	jdkjd	0166adb4-5529-4954-b127-4cb8d62485a8
106828491733285721468	2023-05-28	hi	1d6e690a-2512-4043-b52b-dc5477a2e775
106828491733285721468	2023-05-28	hey	5700b9ba-2380-4a46-a5a0-1cfbfa0b0b36
106828491733285721468	2023-05-28	ugh!!!!	b41dde9a-1d7d-4d2a-a0b3-dca2586f0ec9
106828491733285721468	2023-06-05	blah	2ce99cee-78df-4dcd-8ecb-efaa902f2bda
106828491733285721468	2023-06-05	Hey so I am testing this. I need to write something long, so that I can see if the css is working the way I intended it too. 	5a5037b2-8223-49de-925a-ac580d12c619
106828491733285721468	2023-06-05	Yay that workeD!	effee81e-7929-4263-b56d-7ce49066e422
106828491733285721468	2023-06-05	tftttvgcf	8643b946-e2e6-4970-8cff-e046ff8cce15
106828491733285721468	2023-06-05	dandy	e3cedc97-a7ac-45d1-94fa-ebecbcb4424c
106828491733285721468	2023-06-05	dddddddddaaaaaaaaaaaaannnnnnnnnnnnnnddddddddddddyyyyyyy	302f5881-6ab7-42ce-b626-e348d5ff07d6
106828491733285721468	2023-06-05	ddffffflkllllluuuuuuiiiiiiiiygbnmk,!	c0a7db9c-c5ae-46c4-9544-c83f0191878b
106828491733285721468	2023-06-05	ttttt   ghgg jjjhh                                                                                  hgh                b	77a4bafe-bbcd-418a-9274-d493f226cf96
106828491733285721468	2023-06-05	baejwmf	1123a636-1595-4fdc-bab4-0c7f4ecd41f6
106828491733285721468	2023-06-07	a	ae761758-617a-425c-83a3-e276c1b88de9
106828491733285721468	2023-06-07	should  be expired.	ee3799c7-363d-4b1d-a83a-505947a58eb4
106828491733285721468	2023-06-07	test	3f15d81f-55df-4567-a140-078f5320469c
106828491733285721468	2023-06-07	hkjhkj	32e70cd4-8a06-415f-97af-5781bcd297a4
106828491733285721468	2023-06-07	a	5a125e6d-f43f-4929-bb4e-c81046241b37
106828491733285721468	2023-06-09	heyo!!	7e579e3b-38d5-43c3-8d2a-aaf3871d164a
106828491733285721468	2023-06-09	dfd	d3ac0233-56d8-4c8d-b344-2f1a85f82612
106828491733285721468	2023-06-09	dfdf	8c3152db-690d-4daa-8f1f-c46071165f1b
106828491733285721468	2023-06-09	hey there	964c8c0a-8252-4a6c-95a8-b46e8cea3478
106828491733285721468	2023-06-09	hey?	6a6b4f2a-2694-4336-a4e1-cea1c2d609a7
106828491733285721468	2023-06-09	let&#x27;s just see	702f2645-d04a-46bb-92ed-def759edee0b
106828491733285721468	2023-06-09	it&#x27;s been 15 min or so? Maybe 10	5ef7ca8f-ceb7-4425-9c76-9af62db09338
106828491733285721468	2023-06-09	ok probably more than 10 min now	2913b05e-94e2-411a-99f2-7bd08e65ada6
106828491733285721468	2023-06-09	ok DEF more than 10 min now	dd7202e3-5624-42c5-a5f4-58c58ff2b16d
106828491733285721468	2023-06-09	testing still	608ad72d-46f5-4551-9cc9-2e861007e973
106828491733285721468	2023-06-09	hmmm	c227eb3a-3b93-4e29-a20e-24df166223e7
106828491733285721468	2023-06-09	hmmmmm	56eb63af-07de-47b6-b848-8354193e4852
106828491733285721468	2023-06-09	have we managed to maintain session persistence?	6544f5b5-2ea4-4099-994c-527c769883a0
106828491733285721468	2023-06-09	still working?	f61cae14-7338-41a3-ba5a-af318bb9a8cf
106828491733285721468	2023-06-09	lets see if this works?	92cfc32b-efa3-4aa8-b4d7-5d9c37c0e581
116898312873763646614	2023-06-09	hi	3baff218-1fa9-414a-b562-5b607552035e
116898312873763646614	2023-06-09	hey	1b050ba5-34f4-49d2-89ca-d11729679a38
116898312873763646614	2023-06-09	this should work	c8eff723-444f-49e6-8bd5-b327522b382d
116898312873763646614	2023-06-09	this shouldn&#x27;t	827531e1-d592-4cee-aab2-2f3f5449ca8f
116898312873763646614	2023-06-09	DAMNIT	d2c37d2d-311d-4088-87cf-ac35d362b874
116898312873763646614	2023-06-09	What the hell is going on with this&#x2F;????	0e5bee97-8503-48b0-ac25-820862daae2c
116898312873763646614	2023-06-09	this really should not work.	180cf9e0-b431-48c2-81c2-2e7780f02765
106828491733285721468	2023-06-09	I should not see this.	22bee2f5-7dd2-4ea7-93c0-9c3f62c6adbd
106828491733285721468	2023-06-09	ok this one should work	9620d92e-3b62-4917-97ab-f61b48a443c9
106828491733285721468	2023-06-09	this one should not work	66d7ca1a-e266-4a76-bd28-313519a90b6b
106828491733285721468	2023-06-09	THIS ONE WORKS YO	18720f35-8f6c-4f12-b854-74ad7bd189cc
106828491733285721468	2023-06-09	it really ought to be logging me out by now	059f2219-14af-4d64-8608-e438873d0edc
106828491733285721468	2023-06-09	does this still work?	3c9f7592-780b-4788-88f5-aff51ccffc07
106828491733285721468	2023-06-09	huh	7cdb02c8-6af5-4b94-8eef-e9b3331cce90
106828491733285721468	2023-06-09	kdjfkd	ce6171b3-2e86-459a-9659-90f3c1b8d5fa
106828491733285721468	2023-06-09	ok let&#x27;s see here	741853e9-9b24-4960-b792-c13bad7d5a51
106828491733285721468	2023-06-09	THIS SHOULD NOT WORK	4872dad0-7e8e-4304-b0ab-16b4115648ad
106828491733285721468	2023-06-09	ughhhhhhhhhhhhhhh	237602ff-92e9-4321-b381-91b89025b9f8
106828491733285721468	2023-06-09	BLAH	a17f9586-a5fd-48b7-8a42-4d95a9567149
106828491733285721468	2023-06-09	will this work? it should not	299f1c97-328c-46cb-8ba5-55cf9f2155b4
106828491733285721468	2023-06-10	hi	5c922905-e783-4a43-b052-29e50fae3b8a
106828491733285721468	2023-06-10	testing	bc256c45-c704-44d4-8b41-742183a38fe4
106828491733285721468	2023-06-10	is this still working?	0b565569-e630-4f0e-ade2-c6ad84674fe5
106828491733285721468	2023-06-10	heyo	b27d6dd8-2def-4280-bc4a-24d204bbc918
106828491733285721468	2023-06-10	tractor coloring pages	60deceed-d88d-4b16-80aa-fdd8e01b5f8a
106828491733285721468	2023-06-12	I am grateful for the beautiful humans in my life.	6c936ae1-0e93-4560-8f7a-90b4ffe1b7a8
106828491733285721468	2023-06-12	dfdffef	54eb9092-389d-45e5-a5db-b1e4b5b3b5e6
106828491733285721468	2023-06-12	Testing testing	7664662e-6792-4966-baae-574a5235302f
106828491733285721468	2023-06-12	we are getting somewhere??	3f3b8fec-0e12-461d-b0a5-c92a80d53bde
106828491733285721468	2023-06-12	Hey there! Checking if the refresh will do this. Also need to check about length of gratitude item...what will it do if the gratitude item is super long? Who knows? Well, I guess we will pretty soon. La la la la la la la la la la la Isabel made me a doll la la la la la popcorn is good so are chips I need to make dinner soon. What should I make? Blah blah blah I guess this is probably long enough.	c1b86aeb-a82c-474f-8d89-cac264d1ef4e
106828491733285721468	2023-06-12	Testing again	ec14b7dd-17f7-4feb-ba32-1b2da86f4f2d
106828491733285721468	2023-06-12	hey there	fbfdfed9-1a3c-45dc-82dc-72510994b36c
\.


--
-- Data for Name: quotes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quotes (id, quote, author) FROM stdin;
1	There’s nothing nicer than unexpected appreciation. If you’re grateful, get a pen.	Helen Ellis
2	What an astonishment to breathe on this breathing planet. What a blessing to be Earth loving Earth.	John Green
3	Gratitude is the closest thing to beauty manifested in an emotion.	Mindy Kaling
4	Always remember people who have helped you along the way, and don't forget to lift someone up.	Roy T. Bennett
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: me
--

COPY public.users (id, first_name, last_name, email, google_id) FROM stdin;
23	Amanda	Forrester	weexistforlove@gmail.com	116898312873763646614
24	Bo	Forrester	bmf.6500@gmail.com	117233482251871324757
42	Amanda	Forrester	amanda.forrester1@gmail.com	106828491733285721468
43	Cassondra	Reed Hammond	creed.hammond@gmail.com	108717582378713701045
44	Everlasting	Ananda	everlastingananda@gmail.com	113685679545767792007
\.


--
-- Name: Quotes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Quotes_id_seq"', 4, true);


--
-- Name: access_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: me
--

SELECT pg_catalog.setval('public.access_tokens_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: me
--

SELECT pg_catalog.setval('public.users_id_seq', 44, true);


--
-- Name: quotes Quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT "Quotes_pkey" PRIMARY KEY (id);


--
-- Name: access_tokens access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.access_tokens
    ADD CONSTRAINT access_tokens_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: TABLE quotes; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.quotes TO me;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO me;


--
-- PostgreSQL database dump complete
--

