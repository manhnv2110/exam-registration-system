package com.examreg.examreg.models;

import java.util.List;

import com.examreg.examreg.enums.Role;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
public class Admin extends User {

  public Admin() {
    this.setRole(Role.ADMIN);
  }

  @OneToMany(mappedBy = "admin")
  private List<ImportLog> importLogs;

  @OneToMany(mappedBy = "admin")
  private List<Notification> notifications;
}
