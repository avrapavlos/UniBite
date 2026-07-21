use unibite;
DROP USER 'user'@'localhost';
CREATE USER 'user'@'localhost'
IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON unibite.* TO 'user'@'localhost';

FLUSH PRIVILEGES;