package com.examreg.examreg.security.user;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.examreg.examreg.models.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AppUserDetails implements UserDetails {
  
  private Long id;
  private String email;
  private String password;
  private GrantedAuthority authority;

  public static AppUserDetails buildUserDetails(User user) {
    GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().toString());
    return new AppUserDetails(
      user.getId(),
      user.getEmail(),
      user.getPassword(),
      authority
    );
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(authority);
  }

  @Override
  public String getUsername() {
    return email;
  }

  @Override
  public String getPassword() {
    return password;
  }
}
