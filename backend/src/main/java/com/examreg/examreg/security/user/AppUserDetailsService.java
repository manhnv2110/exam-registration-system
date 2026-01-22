package com.examreg.examreg.security.user;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.examreg.examreg.models.Admin;
import com.examreg.examreg.models.Student;
import com.examreg.examreg.repository.AdminRepository;
import com.examreg.examreg.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

  private final StudentRepository studentRepository;
  private final AdminRepository adminRepository;

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    Optional<Student> student = studentRepository.findByEmail(email);
    if (student.isPresent()) {
      return AppUserDetails.buildUserDetails(student.get());
    }

    Optional<Admin> admin = adminRepository.findByEmail(email);
    if (admin.isPresent()) {
      return AppUserDetails.buildUserDetails(admin.get());
    }

    throw new UsernameNotFoundException("User not found with email: " + email);
  }
  
}
