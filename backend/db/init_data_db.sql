INSERT INTO users (email, password) VALUES
    ('aitor.admin@gmail.com', '$2a$10$Zt1J7BIh56T0xXJjwnR8cu7ydHRJH6y6/eoX0mBqde/jmtA0fFXrq'),
    ('mricomorillo@gmail.com', '$2a$10$RjALUii9I3Jx0mKTgsYhvOmx0/Z9QutVL0SXoRRiI0GUGHfLwHB62'),
    ('comabasosa.g.a@gmail.com', '$2a$10$VoI2krFcxskf1u.dMHShxeaZTsmqnmeu86gLBCffOcq2IaBTYQ0aC'),
	('kevin.covas.91@gmail.com', '$2a$10$/E24.bQ3keXWp2wDAUDfGu8zx3OMIRusEc1XsrXqaEV3ezsDfLZyK'),
	('Llongueras@gmail.com', '$2a$10$ZU0aDOMLyB.P4k2JawcO9ejHC4Ikz7S06lCz61okcpA6FvcL8f89O'),
	('Cerdán@gmail.com', '$2a$10$8Yzla/tY9K.FOOnuqLSnaeXSdrTn1m9vxGuIgfx5nESWyDkc4rLOW'),
	('Lorente1@gmail.com', '$2a$10$aSKXaosbpQz54vukNiZmyOPdubEe39cC/R6S7r.q2L81Ud4ORWwOy'),
	('Bejarano@gmail.com', '$2a$10$f2/JnpF0nvS8HXGWwRqyJuuUDdhekJTBfJzyNRZuXV0UWHsKCH9HK'),
	('Test_1@gmail.com', '$2a$10$Haxuey8W/m96O/rU337FQuM4sJRZQHjZqIdGdMy/UOtnKd6IYYXA2'),
	('Test_2@gmail.com', '$2a$10$py4i4fKr5chWYneADBkyX.EEIKTNW5FLf9XJ5nrWCGiFwIe2aDgx.'),
	('aitor.java@gmail.com', '$2a$10$Zt1J7BIh56T0xXJjwnR8cu7ydHRJH6y6/eoX0mBqde/jmtA0fFXrq');

INSERT INTO people (name, surname_1 , user_id, role) VALUES
    ('Aitor', 'Garzón' , 1, 'admin'),
    ('Maria', 'Rico' , 2, 'admin'),
    ('Andrea', 'Comabasosa' , 3,  'admin'),
    ('Kevin', 'Covas' , 4,  'admin'),
	('Luis', 'Llongueras' , 5,  'hairdresser'),
	('Alberto', 'Cerdán' , 6, 'hairdresser'),
	('David', 'Lorente' ,7 , 'hairdresser'),
	('Jesús', 'Bejarano' ,8 , 'hairdresser');

INSERT INTO people (name, surname_1, birth_date, gender, user_id, role) VALUES
	('Pau' , 'Borrós' , '1995-07-20', 'M', 9, 'customer'),
	('Judit' , 'Comabasosa', '1991-02-21', 'W', 10, 'customer'),
    ('Aitor' , 'Garzón' , '1988-09-18', 'M' , 11 , 'customer');


INSERT INTO product_categories (name) VALUES
('Cortar'),
('Teñir');

INSERT INTO products (name , Description , price ,  duration ,   is_service ,  is_for_women, category) VALUES
('Corte' , 'Te cortamos el pelo bien' ,  10 , 30 , true , false, 1),
('Tinte' , 'Te damos tinte a lo CR7 ', 5 , 60 , true , false, 2);