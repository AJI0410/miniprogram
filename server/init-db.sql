-- Sports Mini-program Database Initialization Script

USE sport_miniprogram;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  openid VARCHAR(100) UNIQUE,
  nickname VARCHAR(50),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(50),
  birth_date DATE,
  height DECIMAL(5,2),
  weight DECIMAL(5,2),
  bmi DECIMAL(4,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Health goals table
CREATE TABLE IF NOT EXISTS health_goals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  exercise_goal VARCHAR(100),
  daily_steps INT DEFAULT 10000,
  weekly_workouts INT DEFAULT 3,
  health_monitoring JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Music categories table
CREATE TABLE IF NOT EXISTS music_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  suitable_for VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Music table
CREATE TABLE IF NOT EXISTS music (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  artist VARCHAR(100),
  category_id INT,
  bpm INT,
  duration INT,
  file_url VARCHAR(500),
  suitable_for VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES music_categories(id)
);

-- Devices table
CREATE TABLE IF NOT EXISTS devices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  device_id VARCHAR(100) UNIQUE NOT NULL,
  device_name VARCHAR(100),
  device_type VARCHAR(50),
  status ENUM('available', 'bound', 'offline') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User devices table
CREATE TABLE IF NOT EXISTS user_devices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  device_id INT NOT NULL,
  bound_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_device (user_id, device_id)
);

-- Workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  device_id INT,
  start_time DATETIME,
  end_time DATETIME,
  duration INT,
  calories_burned INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (device_id) REFERENCES devices(id)
);

-- Exercise data table
CREATE TABLE IF NOT EXISTS exercise_data (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  device_id INT,
  workout_id INT,
  data_type ENUM('heart_rate', 'steps', 'distance', 'calories', 'speed') NOT NULL,
  value DECIMAL(10,2),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (device_id) REFERENCES devices(id),
  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);

-- Exercise trajectory table
CREATE TABLE IF NOT EXISTS exercise_trajectory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  workout_id INT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  altitude DECIMAL(8,2),
  speed DECIMAL(6,2),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO music_categories (name, description, suitable_for) VALUES
('Rehabilitation', 'Music for rehabilitation patients', 'rehabilitation'),
('Cardio', 'Music for cardio exercises', 'cardio'),
('Strength', 'Music for strength training', 'strength'),
('Relaxation', 'Music for relaxation', 'relaxation');

INSERT INTO music (title, artist, category_id, bpm, duration, suitable_for) VALUES
('Rehab Rhythm 1', 'Rehab Music', 1, 60, 180, 'rehabilitation'),
('Rehab Rhythm 2', 'Rehab Music', 1, 80, 240, 'rehabilitation'),
('Cardio Beat 1', 'Exercise Music', 2, 120, 300, 'cardio'),
('Strength Power 1', 'Motivation Music', 3, 140, 360, 'strength'),
('Relaxation 1', 'Calm Music', 4, 50, 300, 'relaxation');

INSERT INTO devices (device_id, device_name, device_type) VALUES
('DEVICE001', 'Smart Band A', 'fitness_tracker'),
('DEVICE002', 'Smart Band B', 'fitness_tracker'),
('DEVICE003', 'Heart Rate Monitor', 'heart_rate_monitor');

-- Insert test users
INSERT INTO users (username, password, nickname, avatar_url) VALUES
('test', '123456', 'Test User', ''),
('admin', 'admin123', 'Administrator', ''); 

USE sport_miniprogram;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  openid VARCHAR(100) UNIQUE,
  nickname VARCHAR(50),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(50),
  birth_date DATE,
  height DECIMAL(5,2),
  weight DECIMAL(5,2),
  bmi DECIMAL(4,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Health goals table
CREATE TABLE IF NOT EXISTS health_goals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  exercise_goal VARCHAR(100),
  daily_steps INT DEFAULT 10000,
  weekly_workouts INT DEFAULT 3,
  health_monitoring JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Music categories table
CREATE TABLE IF NOT EXISTS music_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  suitable_for VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Music table
CREATE TABLE IF NOT EXISTS music (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  artist VARCHAR(100),
  category_id INT,
  bpm INT,
  duration INT,
  file_url VARCHAR(500),
  suitable_for VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES music_categories(id)
);

-- Devices table
CREATE TABLE IF NOT EXISTS devices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  device_id VARCHAR(100) UNIQUE NOT NULL,
  device_name VARCHAR(100),
  device_type VARCHAR(50),
  status ENUM('available', 'bound', 'offline') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User devices table
CREATE TABLE IF NOT EXISTS user_devices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  device_id INT NOT NULL,
  bound_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_device (user_id, device_id)
);

-- Workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  device_id INT,
  start_time DATETIME,
  end_time DATETIME,
  duration INT,
  calories_burned INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (device_id) REFERENCES devices(id)
);

-- Exercise data table
CREATE TABLE IF NOT EXISTS exercise_data (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  device_id INT,
  workout_id INT,
  data_type ENUM('heart_rate', 'steps', 'distance', 'calories', 'speed') NOT NULL,
  value DECIMAL(10,2),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (device_id) REFERENCES devices(id),
  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);

-- Exercise trajectory table
CREATE TABLE IF NOT EXISTS exercise_trajectory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  workout_id INT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  altitude DECIMAL(8,2),
  speed DECIMAL(6,2),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO music_categories (name, description, suitable_for) VALUES
('Rehabilitation', 'Music for rehabilitation patients', 'rehabilitation'),
('Cardio', 'Music for cardio exercises', 'cardio'),
('Strength', 'Music for strength training', 'strength'),
('Relaxation', 'Music for relaxation', 'relaxation');

INSERT INTO music (title, artist, category_id, bpm, duration, suitable_for) VALUES
('Rehab Rhythm 1', 'Rehab Music', 1, 60, 180, 'rehabilitation'),
('Rehab Rhythm 2', 'Rehab Music', 1, 80, 240, 'rehabilitation'),
('Cardio Beat 1', 'Exercise Music', 2, 120, 300, 'cardio'),
('Strength Power 1', 'Motivation Music', 3, 140, 360, 'strength'),
('Relaxation 1', 'Calm Music', 4, 50, 300, 'relaxation');

INSERT INTO devices (device_id, device_name, device_type) VALUES
('DEVICE001', 'Smart Band A', 'fitness_tracker'),
('DEVICE002', 'Smart Band B', 'fitness_tracker'),
('DEVICE003', 'Heart Rate Monitor', 'heart_rate_monitor');

-- Insert test users
INSERT INTO users (username, password, nickname, avatar_url) VALUES
('test', '123456', 'Test User', ''),
('admin', 'admin123', 'Administrator', ''); 
 
 