USE politicaai;

DROP TABLE IF EXISTS reclamacaos, politicos, users, ;
CREATE TABLE users (
    id INT(6) AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_admin BOOLEAN NOT NULL DEFAULT false
);
CREATE TABLE politicos (
    id INT(6) AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(100) NOT NULL,
    partido VARCHAR(100) NOT NULL,
    user_id INT(6) NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE reclamacaos (
    id INT(6) AUTO_INCREMENT PRIMARY KEY, 
    titulo VARCHAR(100) NOT NULL,
    area VARCHAR(50)  NOT NULL,
    politico_id INT(6),
    user_id INT(6) NOT NULL,
    descricao VARCHAR(250) NOT NULL,
    thumblink VARCHAR(100) NOT NULL,
    datap DATETIME NOT NULL,
    texto TEXT NOT NULL,

    FOREIGN KEY (politico_id) REFERENCES politicos(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Essa senha criptografada corresponde ao valor "a"
INSERT INTO users (id, name, password, email, start_date, end_date, is_admin)
VALUES (null, 'Admin', '$2y$10$/vC1UKrEJQUZLN2iM3U9re/4DQP74sXCOVXlYXe/j9zuv1/MHD4o.', 'ldjmoreira@mail.com', '2000-1-1', null, 1);

INSERT INTO politicos (id, name, partido)
VALUES (null, 'ACM Neto','MDB');

INSERT INTO reclamacaos (id, titulo, area, politico_id, descricao, thumblink, datap,texto)
VALUES (null,'titulo1', 'rua', '1', 'rua suja', 'www.google.com','2020-02-04', 'alguem');



