package com.examreg.examreg.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examreg.examreg.models.RegistrationSession;

public interface RegistrationSessionRepository extends JpaRepository<RegistrationSession, Long> {

}
