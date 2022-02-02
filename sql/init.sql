CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS application_user(
  uuid uuid DEFAULT uuid_generate_v4(),
  username VARCHAR(50) NOT NULL,
  password VARCHAR(20) NOT NULL,
  PRIMARY KEY (uuid)
)




/* INSERTS */
INSERT INTO application_user (username, password) VALUES ('ichikawacraice', crypt('Cra15130', 'crc_crypto'));