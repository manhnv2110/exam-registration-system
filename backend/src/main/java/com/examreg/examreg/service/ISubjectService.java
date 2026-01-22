package com.examreg.examreg.service;

import java.util.List;

import com.examreg.examreg.dto.request.SubjectRequest;
import com.examreg.examreg.dto.response.SubjectResponse;
import com.examreg.examreg.models.Subject;

public interface ISubjectService {

  public Subject getSubjectById(Long subjectId);

  public Subject getSubjectBySubjectCode(String subjectCode);

  public SubjectResponse createSubject(SubjectRequest subject);

  public SubjectResponse updateSubject(Long id, SubjectRequest request);

  public void deleteSubject(Long id);

  public List<SubjectResponse> getAllSubjects();
  
}
