package com.kodexis.core.controller;

import com.kodexis.core.model.InterviewQuestion;
import com.kodexis.core.model.TestCase;
import com.kodexis.core.repository.InterviewQuestionRepository;
import com.kodexis.core.repository.TestCaseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final InterviewQuestionRepository questionRepository;
    private final TestCaseRepository testCaseRepository;

    public AdminController(InterviewQuestionRepository questionRepository, TestCaseRepository testCaseRepository) {
        this.questionRepository = questionRepository;
        this.testCaseRepository = testCaseRepository;
    }

    @GetMapping("/questions")
    public ResponseEntity<List<InterviewQuestion>> getAllQuestions() {
        return ResponseEntity.ok(questionRepository.findAll());
    }

    @PostMapping("/questions")
    public ResponseEntity<InterviewQuestion> createQuestion(@RequestBody InterviewQuestion question) {
        // Link any test cases attached
        if (question.getTestCases() != null) {
            for (TestCase tc : question.getTestCases()) {
                tc.setQuestion(question);
            }
        }
        InterviewQuestion saved = questionRepository.save(question);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<?> updateQuestion(@PathVariable Long id, @RequestBody InterviewQuestion questionDetails) {
        Optional<InterviewQuestion> optQuestion = questionRepository.findById(id);
        if (optQuestion.isPresent()) {
            InterviewQuestion q = optQuestion.get();
            q.setTitle(questionDetails.getTitle());
            q.setDescription(questionDetails.getDescription());
            q.setDifficulty(questionDetails.getDifficulty());
            q.setTopic(questionDetails.getTopic());
            q.setExpectedTimeComplexity(questionDetails.getExpectedTimeComplexity());
            q.setExpectedSpaceComplexity(questionDetails.getExpectedSpaceComplexity());
            q.setOptimalSolutionConcept(questionDetails.getOptimalSolutionConcept());
            q.setJavaTemplate(questionDetails.getJavaTemplate());
            q.setPythonTemplate(questionDetails.getPythonTemplate());
            q.setJavascriptTemplate(questionDetails.getJavascriptTemplate());
            q.setCppTemplate(questionDetails.getCppTemplate());
            q.setCTemplate(questionDetails.getCTemplate());
            
            if (questionDetails.getTestCases() != null) {
                q.getTestCases().clear();
                for (TestCase tc : questionDetails.getTestCases()) {
                    q.addTestCase(tc);
                }
            }
            
            InterviewQuestion updated = questionRepository.save(q);
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Question not found"));
        }
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        Optional<InterviewQuestion> optQuestion = questionRepository.findById(id);
        if (optQuestion.isPresent()) {
            questionRepository.delete(optQuestion.get());
            return ResponseEntity.ok(Map.of("message", "Question deleted successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Question not found"));
        }
    }
}
