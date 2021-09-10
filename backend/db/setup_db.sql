DROP TABLE IF EXISTS booked_services;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS products_sold;
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS people;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS product_categories;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  USE_id SERIAL PRIMARY KEY, 
  USE_email VARCHAR(254) NOT NULL UNIQUE, 
  USE_password TEXT NOT NULL, 
  USE_created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  USE_updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE roles (
  ROL_id SERIAL PRIMARY KEY, 
  ROL_name VARCHAR(100) NOT NULL, 
  ROL_created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  ROL_updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_roles (
  URO_id SERIAL PRIMARY KEY,  
  URO_user_id INTEGER REFERENCES users(USE_id),
  URO_role_id INTEGER REFERENCES roles(ROL_id)
);

CREATE TABLE product_categories (
  PCA_id SERIAL PRIMARY KEY, 
  PCA_name VARCHAR(100) NOT NULL, 
  PCA_created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PCA_updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  PRO_id SERIAL PRIMARY KEY, 
  PRO_name VARCHAR(100) NOT NULL, 
  PRO_description TEXT,
  PRO_category INTEGER REFERENCES product_categories(PCA_id),
  PRO_price DECIMAL(10,2) NOT NULL, 
  PRO_duration SMALLINT,
  PRO_is_service BOOLEAN,
  PRO_is_for_women BOOLEAN,
  PRO_created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRO_updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE people (
  PEO_id SERIAL PRIMARY KEY, 
  PEO_name VARCHAR(25) NOT NULL, 
  PEO_surname_1 VARCHAR(25) NOT NULL, 
  PEO_surname_2 VARCHAR(25), 
  PEO_phone DECIMAL(20),
  PEO_birth_date DATE,
  PEO_gender CHAR,
  PEO_observations TEXT,
  PEO_user_id INTEGER REFERENCES users(USE_id),
  PEO_created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PEO_updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE sales (
  SAL_id BIGSERIAL PRIMARY KEY,  
  SAL_person_id INTEGER REFERENCES people(PEO_id),
  SAL_total_import DECIMAL(10,2) NOT NULL,
  SAL_observations TEXT,
  SAL_method_of_payment SMALLINT NOT NULL,      -- Podemos definir nuestras propias variables con los tipos y asignarles enteros (Efectivo=0, Tarjeta=1...)
  SAL_created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  SAL_updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE products_sold (
  PSO_id BIGSERIAL PRIMARY KEY,  
  PSO_sale_id INTEGER REFERENCES sales(SAL_id),
  PSO_product_id INTEGER REFERENCES products(PRO_id),
  PSO_total_import DECIMAL(10,2) NOT NULL, 
  PSO_quantity SMALLINT
);

CREATE TABLE reservations (
  RES_id BIGSERIAL PRIMARY KEY, 
  RES_person_id INTEGER REFERENCES people(PEO_id),
  RES_booked_employee_id INTEGER REFERENCES people(PEO_id),
  RES_created_by_id INTEGER REFERENCES people(PEO_id),
  RES_date_ini DATE,
  RES_date_end DATE,
  RES_missed_reservation BOOLEAN,
  RES_created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  RES_updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE booked_services (
  BSE_id BIGSERIAL PRIMARY KEY,  
  BSE_product_id INTEGER REFERENCES products(PRO_id),
  BSE_reservation_id INTEGER REFERENCES reservations(RES_id)
);

-- Trigger that updates the updated at field when a user is updated
CREATE OR REPLACE FUNCTION trigger_set_use_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.use_updated_at = NOW();
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
  NEW.rol_updated_at = NOW();
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
  NEW.pca_updated_at = NOW();
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
  NEW.pro_updated_at = NOW();
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
  NEW.peo_updated_at = NOW();
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
  NEW.sal_updated_at = NOW();
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
  NEW.res_updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_res_updated_at 
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_res_timestamp();