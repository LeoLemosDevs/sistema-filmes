-- Popula a tabela de gêneros inicialmente
INSERT INTO Genres (name) VALUES 
('Ação'),
('Comédia'),
('Drama'),
('Terror'),
('Ficção Científica'),
('Romance'),
('Documentário'),
('Fantasia'),
('Suspense'),
('Aventura')
ON CONFLICT (name) DO NOTHING;
