# sudo mysql -e 'DROP DATABASE sekesidb;' -uroot -ppassword
# sudo mysql -e 'DROP DATABASE sekesitest;' -uroot -ppassword

sudo mysql -e 'CREATE DATABASE sekesidb;' -uroot -ppassword
sudo mysql -e 'CREATE DATABASE sekesitest;' -uroot -ppassword

sudo mysql -uroot -ppassword sekesidb < SQL_Server/sql_scripts/define_db.sql
sudo mysql -uroot -ppassword sekesitest < SQL_Server/sql_scripts/define_db.sql

sudo mysql -e "CREATE USER 'sammy'@'localhost' IDENTIFIED BY 'password';" -uroot -ppassword
sudo mysql -e "GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'sammy'@'localhost' WITH GRANT OPTION;"  -uroot -ppassword
