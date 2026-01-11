
CREATE TABLE artist (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	nick VARCHAR(25) NOT NULL,
	email VARCHAR(50) UNIQUE NOT NULL,
	contact_email VARCHAR (50) UNIQUE NOT NULL,
	telephone VARCHAR (30) UNIQUE,
	password VARCHAR(255) NOT NULL,
	sfw_status BOOLEAN NOT NULL,
	comm_status BOOLEAN NOT NULL,
	account_status BOOLEAN NOT NULL,
	register DATE NOT NULL,
	account_type VARCHAR(50) NOT NULL,
	styles VARCHAR(255) NOT NULL,
	reputation INTEGER NOT NULL
);

CREATE TABLE client (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	nick VARCHAR(25) NOT NULL,
	email VARCHAR(50) UNIQUE NOT NULL,
	contact_email VARCHAR (50) UNIQUE NOT NULL,
	telephone VARCHAR (30) UNIQUE,
	password VARCHAR(255) NOT NULL,
	sfw_status BOOLEAN NOT NULL,
	account_type VARCHAR(50) NOT NULL,
	account_status BOOLEAN NOT NULL,
	register DATE NOT NULL,
	reputation INTEGER NOT NULL
);

CREATE TABLE openWork (
	id SERIAL PRIMARY KEY,
	artist_id INTEGER NOT NULL,
	client_id INTEGER NOT NULL,
	status VARCHAR(50) NOT NULL,
	title VARCHAR(50) NOT NULL,
	content VARCHAR(255) NOT NULL,
	creation_date DATE NOT NULL,
	sfw_status BOOLEAN NOT NULL
);

CREATE TABLE portfolio (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	artist_id INTEGER NOT NULL,
	location VARCHAR(255) NOT NULL,
	blurred_location VARCHAR(255) NOT NULL,
	styles VARCHAR(255) NOT NULL,
	sfw_status BOOLEAN NOT NULL,
	upload_date DATE NOT NULL
);

CREATE TABLE workCard (
	id SERIAL PRIMARY KEY,
	artist_id INTEGER NOT NULL,
	client_id INTEGER NOT NULL,
	openwork_id INTEGER NOT NULL,
	status VARCHAR(50) NOT NULL,
	commentary VARCHAR(255) NOT NULL,
	creation_date DATE NOT NULL,
	last_modification_date DATE NOT NULL,
	artist_rated BOOLEAN,
	client_rated BOOLEAN
);

CREATE TABLE messages (
	id SERIAL PRIMARY KEY,
	artist_id INTEGER NOT NULL,
	client_id INTEGER NOT NULL,
	subject VARCHAR(50) NOT NULL,
	content VARCHAR(255) NOT NULL
);

CREATE TABLE client_blocked_artist (
    client_id INTEGER NOT NULL,
    artist_id INTEGER NOT NULL,
    PRIMARY KEY (client_id, artist_id)
);

CREATE TABLE artist_blocked_client (
    artist_id INTEGER NOT NULL,
    client_id INTEGER NOT NULL,
    PRIMARY KEY (artist_id, client_id)
);

CREATE TABLE rejected_work (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    artist_id INTEGER NOT NULL,
    openWork_id INTEGER NOT NULL,
    rejection_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artist(id) ON DELETE CASCADE,
    FOREIGN KEY (openwork_id) REFERENCES openWork(id) ON DELETE CASCADE
);


ALTER TABLE openWork
ADD CONSTRAINT fk_openWork_artist FOREIGN KEY (artist_id) REFERENCES artist(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_openWork_client FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE CASCADE;

ALTER TABLE portfolio
ADD CONSTRAINT fk_portfolio_artist FOREIGN KEY (artist_id) REFERENCES artist(id) ON DELETE CASCADE;

ALTER TABLE workCard
ADD CONSTRAINT fk_workCard_artist FOREIGN KEY (artist_id) REFERENCES artist(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_workCard_client FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_workCard_openwork FOREIGN KEY (openwork_id) REFERENCES openWork(id) ON DELETE CASCADE;

ALTER TABLE messages
ADD CONSTRAINT fk_messages_artist FOREIGN KEY (artist_id) REFERENCES artist(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_messages_client FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE CASCADE;

ALTER TABLE client_blocked_artist
ADD CONSTRAINT fk_client_blocked_artist_client FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_client_blocked_artist_artist FOREIGN KEY (artist_id) REFERENCES artist(id) ON DELETE CASCADE;

ALTER TABLE artist_blocked_client
ADD CONSTRAINT fk_artist_blocked_client_artist FOREIGN KEY (artist_id) REFERENCES artist(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_artist_blocked_client_client FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE CASCADE;