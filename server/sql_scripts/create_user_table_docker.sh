mysql -e 'DROP DATABASE sekesidb;' -uroot -ppassword
mysql -e 'DROP DATABASE sekesitest;' -uroot -ppassword

mysql -e 'CREATE DATABASE sekesidb;' -uroot -ppassword
mysql -e 'CREATE DATABASE sekesitest;' -uroot -ppassword

mysql -uroot -ppassword sekesidb < /workspaces/Matcha-Sekesi/server/sql_scripts/define_db.sql
mysql -uroot -ppassword sekesitest < /workspaces/Matcha-Sekesi/server/sql_scripts/define_db.sql

mysql -e "CREATE USER 'sammy'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';" -uroot -ppassword
mysql -e "GRANT ALL PRIVILEGES on *.* TO 'sammy'@'localhost' WITH GRANT OPTION;"  -uroot -ppassword
