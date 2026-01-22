package com.examreg.examreg.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examreg.examreg.models.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {
  Optional<Admin> findByEmail(String email);
}
