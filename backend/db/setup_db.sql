DROP TABLE IF EXISTS booked_services;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS sold_products;
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS people;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS product_categories;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY, 
  email VARCHAR(254) NOT NULL UNIQUE, 
  password TEXT NOT NULL, 
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY, 
  name VARCHAR(100) NOT NULL, 
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_roles (
  id SERIAL PRIMARY KEY,  
  user_id INTEGER NOT NULL, 
  role_id INTEGER NOT NULL, 

  CONSTRAINT fk_user_roles_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_user_roles_role
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
    ON DELETE CASCADE
);

CREATE TABLE product_categories (
  id SERIAL PRIMARY KEY, 
  name VARCHAR(100) NOT NULL, 
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY, 
  name VARCHAR(100) NOT NULL, 
  description TEXT,
  category INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL, 
  duration SMALLINT,
  is_service BOOLEAN,
  is_for_women BOOLEAN,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_products_category
    FOREIGN KEY (category)
    REFERENCES product_categories(id)
    ON DELETE RESTRICT
);

CREATE TABLE people (
  id SERIAL PRIMARY KEY, 
  name VARCHAR(25) NOT NULL, 
  surname_1 VARCHAR(25) NOT NULL, 
  surname_2 VARCHAR(25), 
  phone DECIMAL(20),
  birth_date DATE,
  gender CHAR,
  observations TEXT,
  user_id INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(), 

  CONSTRAINT fk_people_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE RESTRICT
);

CREATE TABLE sales (
  id BIGSERIAL PRIMARY KEY,  
  customer_id INTEGER NOT NULL, 
  employee_id INTEGER NOT NULL,
  total_import DECIMAL(10,2) NOT NULL,
  observations TEXT,
  method_of_payment SMALLINT NOT NULL,      -- Podemos definir nuestras propias variables con los tipos y asignarles enteros (Efectivo=0, Tarjeta=1...)
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_sales_customer
    FOREIGN KEY (customer_id)
    REFERENCES people(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_sales_employee
    FOREIGN KEY (employee_id)
    REFERENCES people(id)
    ON DELETE RESTRICT
);

CREATE TABLE sold_products (
  id BIGSERIAL PRIMARY KEY,  
  sale_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity SMALLINT,

  CONSTRAINT fk_sold_products_sale
    FOREIGN KEY (sale_id)
    REFERENCES sales(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_sold_products_product
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE RESTRICT
);

CREATE TABLE reservations (
  id BIGSERIAL PRIMARY KEY, 
  person_id INTEGER NOT NULL,
  booked_employee_id INTEGER NOT NULL,
  created_by_id INTEGER NOT NULL,
  date_ini timestamp,
  date_end timestamp,
  missed_reservation BOOLEAN,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_reservation_person
    FOREIGN KEY (person_id)
    REFERENCES people(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_reservation_booked_employee
    FOREIGN KEY (person_id)
    REFERENCES people(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_reservation_created_by
    FOREIGN KEY (person_id)
    REFERENCES people(id)
    ON DELETE RESTRICT
);

CREATE TABLE booked_services (
  id BIGSERIAL PRIMARY KEY,
  reservation_id INTEGER NOT NULL,  
  product_id INTEGER NOT NULL,

  CONSTRAINT fk_booked_services_product
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE RESTRICT,

  CONSTRAINT fk_booked_services_reservation
    FOREIGN KEY (reservation_id)
    REFERENCES reservations(id)
    ON DELETE CASCADE
);

-- Trigger that updates the updated at field when a user is updated
CREATE OR REPLACE FUNCTION trigger_set_use_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_use_updated_at 
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_use_timestamp();


-- Trigger that updates the updated at field when acrole is updated
CREATE OR REPLACE FUNCTION trigger_set_rol_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_rol_updated_at 
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_rol_timestamp();


-- Trigger that updates the updated at field when a product_category is updated
CREATE OR REPLACE FUNCTION trigger_set_pca_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_pca_updated_at 
  BEFORE UPDATE ON product_categories
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_pca_timestamp();


-- Trigger that updates the updated at field when a product is updated
CREATE OR REPLACE FUNCTION trigger_set_pro_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_pro_updated_at 
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_pro_timestamp();


-- Trigger that updates the updated at field when a person is updated
CREATE OR REPLACE FUNCTION trigger_set_peo_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_peo_updated_at 
  BEFORE UPDATE ON people
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_peo_timestamp();


-- Trigger that updates the updated at field when a sale is updated
CREATE OR REPLACE FUNCTION trigger_set_sal_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_sal_updated_at 
  BEFORE UPDATE ON sales
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_sal_timestamp();


-- Trigger that updates the updated at field when a reservation is updated
CREATE OR REPLACE FUNCTION trigger_set_res_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_res_updated_at 
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_res_timestamp();