CREATE TABLE artist (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	nick VARCHAR(25) NOT NULL,
	email VARCHAR(50) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	sfw_status BOOLEAN NOT NULL,
	comm_status BOOLEAN NOT NULL,
	acount_status BOOLEAN NOT NULL,
	styles VARCHAR(255) NOT NULL,
	reputation INTEGER NOT NULL
)

CREATE TABLE client (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	nick VARCHAR(25) NOT NULL,
	email VARCHAR(50) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	sfw_status BOOLEAN NOT NULL,
	acount_status BOOLEAN NOT NULL,
	reputation INTEGER NOT NULL
)

CREATE TABLE portfolio (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	artist_id INTEGER REFERENCES artist(id) ON DELETE CASCADE,
    location VARCHAR(255) NOT NULL,
	styles VARCHAR(255) NOT NULL,
	sfw_status BOOLEAN NOT NULL
)

CREATE TABLE workCard (
	id SERIAL PRIMARY KEY,
	artist_id INTEGER REFERENCES portfolio(id) ON DELETE CASCADE,
	client_id INTEGER REFERENCES client(id) ON DELETE CASCADE,
	status VARCHAR(50) NOT NULL,
	commentary VARCHAR(255) NOT NULL
)

CREATE TABLE openWork (
	id SERIAL PRIMARY KEY,
	artist_id INTEGER REFERENCES portfolio(id) ON DELETE CASCADE,
	client_id INTEGER REFERENCES client(id) ON DELETE CASCADE,
	tittle VARCHAR(50) NOT NULL,
	content VARCHAR(255) NOT NULL,
	sfw_status BOOLEAN NOT NULL
)

CREATE TABLE messages (
	id SERIAL PRIMARY KEY,
	artist_id INTEGER REFERENCES portfolio(id) ON DELETE CASCADE,
	client_id INTEGER REFERENCES client(id) ON DELETE CASCADE,
	subject VARCHAR(50) NOT NULL,
	content VARCHAR(255) NOT NULL
)