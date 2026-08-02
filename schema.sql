-- ============================================================
-- ABC Consultant — Database Schema
-- Open this file in MySQL Workbench and run it (lightning bolt
-- icon) to create the database and table.
-- ============================================================

CREATE DATABASE IF NOT EXISTS abc_consultant
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE abc_consultant;

CREATE TABLE IF NOT EXISTS enquiries (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120)  NOT NULL,
  phone_number  VARCHAR(20)   NOT NULL,
  email_id      VARCHAR(150)  NOT NULL,
  message       VARCHAR(1000)         DEFAULT NULL,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Quick sanity check query (run after the app has saved an enquiry)
-- SELECT * FROM enquiries ORDER BY created_at DESC;
