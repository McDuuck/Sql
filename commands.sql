CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0,
    year integer NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username text NOT NULL,
    name text NOT NULL
);

CREATE TABLE skim (
    id SERIAL PRIMARY KEY,
    blog_id integer NOT NULL,
    user_id integer NOT NULL,
    status text NOT NULL DEFAULT 'unread'
);

INSERT INTO blogs (author, url, title) VALUES ('Testi', 'Google.com', 'Book');

SELECT * FROM blogs;