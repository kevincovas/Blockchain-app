INSERT INTO roles (ROL_name) VALUES
('admin'),
('hairdresser'),
('customer');

INSERT INTO users (USE_email, USE_password) VALUES
    ('aitor.java@gmail.com', 'aitor1234'),
    ('mricomorillo@gmail.com', 'maria1234'),
    ('comabasosa.g.a@gmail.com', 'andrea1234'),
	('kevin.covas.91@gmail.com', 'kevin1234'),
	('Llongueras@gmail.com', ''),
	('Cerdán@gmail.com', ''),
	('Lorente1@gmail.com', ''),
	('Bejarano@gmail.com', ''),
	('Test 1@gmail.com', ''),
	('Test 2@gmail.com', '');

INSERT INTO people (PEO_name, PEO_surname_1 , PEO_user_id) VALUES
    ('Aitor', 'Garzón' , 1),
    ('Maria', 'Rico' , 2),
    ('Andrea', 'Comabasosa' , 3),
    ('Kevin', 'Covas' , 4),
	('Luis', 'Llongueras' , 5),
	('Alberto', 'Cerdán' , 6),
	('David', 'Lorente' , 7),
	('Jesús', 'Bejarano' , 8),
	('Customer 1' , 'Test 1' , 9),
	('Customer 2' , 'Test 2' , 10);  
	
INSERT INTO user_roles ( URO_user_id , URO_role_id ) VALUES
( 1 , 1 ),
( 2 , 1 ),
( 3 , 1 ),
( 4 , 1 ),
( 5 , 2 ),
( 6 , 2 ),
( 7 , 2 ),
( 8 , 2 ),
( 9 , 3 ),
( 10 , 3);

INSERT INTO products (PRO_name , PRO_Description , PRO_price ,  PRO_duration ,   PRO_is_service ,  PRO_is_for_women) VALUES
('Corte' , 'Te cortamos el pelo bien' ,  10 , 30 , true , false ),
('Tinte' , 'Te damos tinte a lo CR7 ', 5 , 60 , true , false );


