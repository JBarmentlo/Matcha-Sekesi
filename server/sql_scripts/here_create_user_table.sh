sudo mysql -e 'DROP DATABASE sekesidb;' -uroot -ppassword
sudo mysql -e 'DROP DATABASE sekesitest;' -uroot -ppassword

sudo mysql -e 'CREATE DATABASE sekesidb;' -uroot -ppassword
sudo mysql -e 'CREATE DATABASE sekesitest;' -uroot -ppassword

sudo mysql -uroot -ppassword sekesidb < define_db.sql
sudo mysql -uroot -ppassword sekesitest < define_db.sql

sudo mysql -e "CREATE USER 'sammy'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';" -uroot -ppassword
sudo mysql -e "GRANT ALL PRIVILEGES on *.* TO 'sammy'@'localhost' WITH GRANT OPTION;"  -uroot -ppassword
