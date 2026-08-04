-- DDL para o banco de dados Filmes Stream

-- 1. Tabela de Usuários
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para otimizar login por email
CREATE INDEX idx_users_email ON Users(email);

-- 2. Tabela Principal de Conteúdo
CREATE TABLE Content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(512),
    video_url VARCHAR(512), -- NULL se for série (terá vídeos nos episódios)
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('movie', 'series', 'cartoon', 'anime')),
    release_year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para busca rápida
CREATE INDEX idx_content_type ON Content(content_type);
CREATE INDEX idx_content_title ON Content(title);

-- 3. Tabela de Gêneros
CREATE TABLE Genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- 4. Tabela de Relacionamento N:N (Conteúdo <-> Gênero)
CREATE TABLE Content_Genres (
    content_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (content_id, genre_id),
    CONSTRAINT fk_content FOREIGN KEY (content_id) REFERENCES Content(id) ON DELETE CASCADE,
    CONSTRAINT fk_genre FOREIGN KEY (genre_id) REFERENCES Genres(id) ON DELETE CASCADE
);

-- 5. Metadados para Séries (Séries, Desenhos, Animes)
CREATE TABLE Series_Metadata (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content_id INT UNIQUE NOT NULL,
    total_seasons INT DEFAULT 1,
    CONSTRAINT fk_series_content FOREIGN KEY (content_id) REFERENCES Content(id) ON DELETE CASCADE
);

-- 6. Tabela de Episódios
CREATE TABLE Episodes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    series_id INT NOT NULL,
    season_number INT NOT NULL,
    episode_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(512) NOT NULL,
    thumbnail_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_episode_series FOREIGN KEY (series_id) REFERENCES Series_Metadata(id) ON DELETE CASCADE,
    UNIQUE (series_id, season_number, episode_number) -- Evita duplicidade de episódio na mesma temporada
);

CREATE INDEX idx_episodes_order ON Episodes(series_id, season_number, episode_number);
