heroku run psql -h <host-of-postgres-addon> -p 5432 -U <username> <dbname> -a <app-name>
CREATE TABLE blogs ( id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes INTEGER DEFAULT 0 );
\d
INSERT INTO blogs (author, url, title) VALUES ('John Doe', 'http://example.com', 'Example Blog');
INSERT INTO blogs (url, title, likes) VALUES ('http://example.com/2', 'Example Blog 2', 2);
SELECT * FROM blogs;
exit