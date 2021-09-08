INSERT INTO roles (ROL_name) VALUES
('admin'),
('hairdresser'),
('customer');

INSERT INTO people (PEO_name, PEO_surname_1) VALUES
    ('Aitor', 'Garzón'),
    ('Maria', 'Rico'),
    ('Andrea', 'Comabasosa'),
    ('Kevin', 'Covas'),
	('Luis', 'Llongueras'),
	('Alberto', 'Cerdán'),
	('David', 'Lorente'),
	('Jesús', 'Bejarano'),
	('Customer 1' , 'Test 1'),
	('Customer 2' , 'Test 2');  
	

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
