package com.kodexis.core.db;

import com.kodexis.core.model.*;
import com.kodexis.core.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CandidateProfileRepository profileRepository;
    private final InterviewQuestionRepository questionRepository;
    private final InterviewSessionRepository sessionRepository;
    private final SubmissionRepository submissionRepository;
    private final AssessmentRepository assessmentRepository;
    private final InterviewMessageRepository messageRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           CandidateProfileRepository profileRepository,
                           InterviewQuestionRepository questionRepository,
                           InterviewSessionRepository sessionRepository,
                           SubmissionRepository submissionRepository,
                           AssessmentRepository assessmentRepository,
                           InterviewMessageRepository messageRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.questionRepository = questionRepository;
        this.sessionRepository = sessionRepository;
        this.submissionRepository = submissionRepository;
        this.assessmentRepository = assessmentRepository;
        this.messageRepository = messageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.existsByUsername("vicky")) {
            return; // Already initialized
        }

        System.out.println("[KODEXIS] Initializing database seed records...");

        // 1. Create Users
        User vicky = new User("vicky", passwordEncoder.encode("password"), Enums.Role.ROLE_CANDIDATE);
        userRepository.save(vicky);

        User admin = new User("admin", passwordEncoder.encode("admin123"), Enums.Role.ROLE_ADMIN);
        userRepository.save(admin);

        // 2. Create Candidate Profile
        CandidateProfile vickyProfile = new CandidateProfile(vicky, "Vigneshwaran S P");
        vickyProfile.setTargetRole("Software Engineer");
        vickyProfile.setTargetCompanies("NVIDIA, Google, Meta");
        vickyProfile.setExperienceLevel(Enums.Difficulty.MEDIUM);
        vickyProfile.setPreferredLanguage(Enums.Language.PYTHON);
        vickyProfile.setReadinessScore(82);

        // Seed skill vectors
        vickyProfile.setArraysProficiency(Enums.SkillLevel.EXPERT);
        vickyProfile.setStringsProficiency(Enums.SkillLevel.STRONG);
        vickyProfile.setHashingProficiency(Enums.SkillLevel.EXPERT);
        vickyProfile.setLinkedListsProficiency(Enums.SkillLevel.INTERMEDIATE);
        vickyProfile.setStacksQueuesProficiency(Enums.SkillLevel.STRONG);
        vickyProfile.setTreesProficiency(Enums.SkillLevel.DEVELOPING);
        vickyProfile.setGraphsProficiency(Enums.SkillLevel.WEAK);
        vickyProfile.setRecursionProficiency(Enums.SkillLevel.INTERMEDIATE);
        vickyProfile.setDynamicProgrammingProficiency(Enums.SkillLevel.DEVELOPING);
        vickyProfile.setGreedyProficiency(Enums.SkillLevel.INTERMEDIATE);
        vickyProfile.setSortingSearchingProficiency(Enums.SkillLevel.STRONG);
        vickyProfile.setSystemDesignProficiency(Enums.SkillLevel.STRONG);
        profileRepository.save(vickyProfile);

        // 3. Create Questions & Test Cases
        // Question 1: Two Sum
        InterviewQuestion q1 = new InterviewQuestion(
                "Two Sum",
                "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\n" +
                        "You may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n" +
                        "**Input Format:**\n" +
                        "First line contains the target integer.\n" +
                        "Second line contains comma-separated array values.\n\n" +
                        "**Output Format:**\n" +
                        "Indices of the two numbers separated by a comma (e.g. `0,1`).",
                Enums.Difficulty.EASY,
                "Arrays / Hashing"
        );
        q1.setExpectedTimeComplexity("O(n)");
        q1.setExpectedSpaceComplexity("O(n)");
        q1.setOptimalSolutionConcept("Utilize a HashMap to store values and their indices. For each element, look up the target complement (`target - nums[i]`). If it exists, return indices.");

        q1.setJavaTemplate("import java.util.*;\n\npublic class Main {\n    public static int[] twoSum(int[] nums, int target) {\n        // Write your O(n) solution here\n        return new int[0];\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int target = Integer.parseInt(sc.nextLine().trim());\n        String[] parts = sc.nextLine().trim().split(\",\");\n        int[] nums = Arrays.stream(parts).mapToInt(Integer::parseInt).toArray();\n        int[] res = twoSum(nums, target);\n        if (res.length == 2) {\n            System.out.println(res[0] + \",\" + res[1]);\n        }\n    }\n}");
        q1.setPythonTemplate("import sys\n\ndef twoSum(nums, target):\n    # Write your O(n) solution here\n    return []\n\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    if len(lines) >= 2:\n        target = int(lines[0].strip())\n        nums = [int(x) for x in lines[1].strip().split(',') if x.strip()]\n        res = twoSum(nums, target)\n        if len(res) == 2:\n            print(f\"{res[0]},{res[1]}\")");
        q1.setJavascriptTemplate("const fs = require('fs');\n\nfunction twoSum(nums, target) {\n    // Write your O(n) solution here\n    return [];\n}\n\nfunction main() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');\n    if (lines.length >= 2) {\n        const target = parseInt(lines[0].trim(), 10);\n        const nums = lines[1].trim().split(',').map(Number);\n        const res = twoSum(nums, target);\n        if (res.length === 2) {\n            console.log(res[0] + ',' + res[1]);\n        }\n    }\n}\nmain();");
        q1.setCppTemplate("#include <iostream>\n#include <vector>\n#include <sstream>\n#include <unordered_map>\n\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write code\n    return {};\n}\n\nint main() {\n    int target;\n    cin >> target;\n    string s;\n    cin >> s;\n    stringstream ss(s);\n    vector<int> nums;\n    while (ss.good()) {\n        string substr;\n        getline(ss, substr, ',');\n        if(!substr.empty()) nums.push_back(stoi(substr));\n    }\n    vector<int> res = twoSum(nums, target);\n    if(res.size() == 2) cout << res[0] << \",\" << res[1] << endl;\n    return 0;\n}");
        q1.setCTemplate("#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n// Write standard solution\nint main() {\n    int target;\n    if(scanf(\"%d\", &target) != 1) return 0;\n    char s[1000];\n    if(scanf(\"%s\", s) != 1) return 0;\n    // Implement parsing & double loop\n    printf(\"0,1\\n\");\n    return 0;\n}");
        q1.setCsharpTemplate("using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\npublic class Main {\n    public static int[] TwoSum(int[] nums, int target) {\n        // Write your O(n) solution here\n        return new int[0];\n    }\n\n    public static void Main(string[] args) {\n        string line1 = Console.ReadLine();\n        if (line1 == null) return;\n        int target = int.Parse(line1.Trim());\n        string line2 = Console.ReadLine();\n        if (line2 == null) return;\n        int[] nums = line2.Trim().Split(\",\").Select(int.Parse).ToArray();\n        int[] res = TwoSum(nums, target);\n        if (res.Length == 2) {\n            Console.WriteLine(res[0] + \",\" + res[1]);\n        }\n    }\n}");
        q1.setGoTemplate("package main\n\nimport (\n\t\"bufio\"\n\t\"fmt\"\n\t\"os\"\n\t\"strconv\"\n\t\"strings\"\n)\n\nfunc twoSum(nums []int, target int) []int {\n\t// Write your O(n) solution here\n\treturn []int{}\n}\n\nfunc main() {\n\tscanner := bufio.NewScanner(os.Stdin)\n\tif scanner.Scan() {\n\t\ttarget, _ := strconv.Atoi(strings.TrimSpace(scanner.Text()))\n\t\tif scanner.Scan() {\n\t\t\tparts := strings.Split(strings.TrimSpace(scanner.Text()), \",\")\n\t\t\tvar nums []int\n\t\t\tfor _, p := range parts {\n\t\t\t\tval, _ := strconv.Atoi(strings.TrimSpace(p))\n\t\t\t\tnums = append(nums, val)\n\t\t\t}\n\t\t\tres := twoSum(nums, target)\n\t\t\tif len(res) == 2 {\n\t\t\t\tfmt.Printf(\"%d,%d\\n\", res[0], res[1])\n\t\t\t}\n\t\t}\n\t}\n}");

        q1.addTestCase(new TestCase("9\n2,7,11,15", "0,1", false));
        q1.addTestCase(new TestCase("6\n3,2,4", "1,2", false));
        q1.addTestCase(new TestCase("6\n3,3", "0,1", true));
        questionRepository.save(q1);

        // Question 2: Longest Subarray With Target Sum
        InterviewQuestion q2 = new InterviewQuestion(
                "Longest Subarray With Target Sum",
                "Given an array of integers `nums` and an integer `k`, find the length of the longest contiguous subarray that sums to `k`.\n\n" +
                        "If no such subarray exists, return `0`.\n\n" +
                        "**Input Format:**\n" +
                        "First line contains target sum `k`.\n" +
                        "Second line contains comma-separated integer values.\n\n" +
                        "**Output Format:**\n" +
                        "Single integer representing the longest subarray length.",
                Enums.Difficulty.MEDIUM,
                "Arrays / Hashing"
        );
        q2.setExpectedTimeComplexity("O(n)");
        q2.setExpectedSpaceComplexity("O(n)");
        q2.setOptimalSolutionConcept("Accumulate running sum (`prefixSum`). Store the first index of each cumulative sum in a hash map. At each index, search if `prefixSum - k` was seen before. If yes, compute current subarray length.");

        q2.setJavaTemplate("import java.util.*;\n\npublic class Main {\n    public static int longestSubarray(int[] nums, int k) {\n        // Write O(n) code\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int k = Integer.parseInt(sc.nextLine().trim());\n        String[] parts = sc.nextLine().trim().split(\",\");\n        int[] nums = Arrays.stream(parts).mapToInt(Integer::parseInt).toArray();\n        System.out.println(longestSubarray(nums, k));\n    }\n}");
        q2.setPythonTemplate("import sys\n\ndef longestSubarray(nums, k):\n    # Write your O(n) solution here\n    return 0\n\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    if len(lines) >= 2:\n        k = int(lines[0].strip())\n        nums = [int(x) for x in lines[1].strip().split(',') if x.strip()]\n        print(longestSubarray(nums, k))");
        q2.setJavascriptTemplate("const fs = require('fs');\n\nfunction longestSubarray(nums, k) {\n    // Write your O(n) solution here\n    return 0;\n}\n\nfunction main() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');\n    if (lines.length >= 2) {\n        const k = parseInt(lines[0].trim(), 10);\n        const nums = lines[1].trim().split(',').map(Number);\n        console.log(longestSubarray(nums, k));\n    }\n}\nmain();");
        q2.setCppTemplate("int main(){return 0;}");
        q2.setCTemplate("int main(){return 0;}");
        q2.setCsharpTemplate("using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\npublic class Main {\n    public static int LongestSubarray(int[] nums, int k) {\n        // Write your O(n) solution here\n        return 0;\n    }\n\n    public static void Main(string[] args) {\n        string line1 = Console.ReadLine();\n        if (line1 == null) return;\n        int k = int.Parse(line1.Trim());\n        string line2 = Console.ReadLine();\n        if (line2 == null) return;\n        int[] nums = line2.Trim().Split(\",\").Select(int.Parse).ToArray();\n        Console.WriteLine(LongestSubarray(nums, k));\n    }\n}");
        q2.setGoTemplate("package main\n\nimport (\n\t\"bufio\"\n\t\"fmt\"\n\t\"os\"\n\t\"strconv\"\n\t\"strings\"\n)\n\nfunc longestSubarray(nums []int, k int) int {\n\t// Write your O(n) solution here\n\treturn 0\n}\n\nfunc main() {\n\tscanner := bufio.NewScanner(os.Stdin)\n\tif scanner.Scan() {\n\t\tk, _ := strconv.Atoi(strings.TrimSpace(scanner.Text()))\n\t\tif scanner.Scan() {\n\t\t\tparts := strings.Split(strings.TrimSpace(scanner.Text()), \",\")\n\t\t\tvar nums []int\n\t\t\tfor _, p := range parts {\n\t\t\t\tval, _ := strconv.Atoi(strings.TrimSpace(p))\n\t\t\t\tnums = append(nums, val)\n\t\t\t}\n\t\t\tfmt.Println(longestSubarray(nums, k))\n\t\t}\n\t}\n}");

        q2.addTestCase(new TestCase("15\n1,2,3,7,5", "4", false));
        q2.addTestCase(new TestCase("3\n-1,2,3", "2", false));
        q2.addTestCase(new TestCase("0\n1,-1,5,-2,3", "2", true));
        questionRepository.save(q2);

        // Question 3: Valid Parentheses
        InterviewQuestion q3 = new InterviewQuestion(
                "Valid Parentheses",
                "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\n" +
                        "**Input Format:**\n" +
                        "Single string of brackets.\n\n" +
                        "**Output Format:**\n" +
                        "`true` or `false`.",
                Enums.Difficulty.EASY,
                "Stacks / Queues"
        );
        q3.setExpectedTimeComplexity("O(n)");
        q3.setExpectedSpaceComplexity("O(n)");
        q3.setOptimalSolutionConcept("Push opening brackets onto a stack. When a closing bracket is encountered, verify if the top of the stack matches its corresponding pair. If mismatch or empty stack, return false.");
        q3.setPythonTemplate("import sys\n\ndef isValid(s: str) -> bool:\n    # Write your O(n) solution here\n    return False\n\nif __name__ == '__main__':\n    s = sys.stdin.read().strip()\n    print(str(isValid(s)).lower())");
        q3.setJavascriptTemplate("const fs = require('fs');\nfunction isValid(s) {\n    // Write your O(n) solution here\n    return false;\n}\nconsole.log(isValid(fs.readFileSync(0, 'utf-8').trim()));");
        q3.setJavaTemplate("import java.util.*;\npublic class Main {\n    public static boolean isValid(String s) {\n        // Write your O(n) solution here\n        return false;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextLine()) System.out.println(isValid(sc.nextLine().trim()));\n    }\n}");
        q3.setCppTemplate("int main(){return 0;}");
        q3.setCTemplate("int main(){return 0;}");
        q3.setCsharpTemplate("using System;\nusing System.Collections.Generic;\n\npublic class Main {\n    public static bool IsValid(string s) {\n        // Write your O(n) solution here\n        return false;\n    }\n\n    public static void Main(string[] args) {\n        string s = Console.ReadLine()?.Trim() ?? \"\";\n        Console.WriteLine(IsValid(s).ToString().ToLower());\n    }\n}");
        q3.setGoTemplate("package main\n\nimport (\n\t\"bufio\"\n\t\"fmt\"\n\t\"os\"\n\t\"strings\"\n)\n\nfunc isValid(s string) bool {\n\t// Write your O(n) solution here\n\treturn false\n}\n\nfunc main() {\n\tscanner := bufio.NewScanner(os.Stdin)\n\tif scanner.Scan() {\n\t\ts := strings.TrimSpace(scanner.Text())\n\t\tfmt.Println(isValid(s))\n\t}\n}");

        q3.addTestCase(new TestCase("()[]{}", "true", false));
        q3.addTestCase(new TestCase("(]", "false", false));
        q3.addTestCase(new TestCase("([)]", "false", true));
        questionRepository.save(q3);

        // 4. Seed 2 Mock Interview Histories (telemetry, submissions, assessments) to populate Vigneshwaran's Dashboard
        seedMockHistory(vicky, q1, q3);

        System.out.println("[KODEXIS] Database successfully seeded.");
    }

    private void seedMockHistory(User user, InterviewQuestion q1, InterviewQuestion q3) {
        // Mock Session 1 (Two Sum - Passed with 88 score)
        InterviewSession s1 = new InterviewSession(user, q1, Enums.Difficulty.EASY, Enums.Language.PYTHON, 30, "Coding + Explanation");
        s1.setState(Enums.SessionState.REPORT);
        s1.setStartedAt(LocalDateTime.now().minusDays(3));
        s1.setCompletedAt(LocalDateTime.now().minusDays(3).plusMinutes(25));
        s1.setLastSubmittedCode("def twoSum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i\n    return []");
        s1.setTelemetryLog("[{\"time\":\"2026-08-06 10:00:00\",\"event\":\"Session initiated\"},{\"time\":\"2026-08-06 10:03:00\",\"event\":\"Explained sliding window approach\"},{\"time\":\"2026-08-06 10:07:00\",\"event\":\"AI Interviewer recommended Hashing\"},{\"time\":\"2026-08-06 10:08:00\",\"event\":\"State transitioned to CODING\"},{\"time\":\"2026-08-06 10:18:00\",\"event\":\"Run draft tests passed\"},{\"time\":\"2026-08-06 10:25:00\",\"event\":\"Final submit run completed\"}]");
        sessionRepository.save(s1);

        Submission sub1 = new Submission(s1, s1.getLastSubmittedCode(), Enums.Language.PYTHON, 3, 3, Enums.ExecutionResultStatus.SUCCESS);
        sub1.setExecutionTimeMs(45L);
        submissionRepository.save(sub1);

        Assessment a1 = new Assessment(s1);
        a1.setOverallScore(88);
        a1.setCorrectnessScore(100);
        a1.setProblemSolvingScore(90);
        a1.setEfficiencyScore(90);
        a1.setCodeQualityScore(85);
        a1.setDebuggingScore(80);
        a1.setEdgeCasesScore(85);
        a1.setCommunicationScore(80);
        a1.setDetectedTimeComplexity("O(n)");
        a1.setDetectedSpaceComplexity("O(n)");
        a1.setAutopsySummary("Excellent performance. Selected optimal Hash Map mapping strategy on first code attempt. Successfully maintained O(n) efficiency.");
        a1.setWhatWentWell("Fast conceptual logic mapping. Standard naming styles. Optimal space-time trade-off.");
        a1.setAreasToImprove("Avoid writing redundant declaration brackets. Proactively mention key constraints on empty input lists.");
        a1.setInterviewerFeedback("Very strong. The candidate immediately understood the O(n) optimization path and bypassed the nested loop route.");
        a1.setSuggestedPractice("Sliding Window, Sorting, Arrays");
        assessmentRepository.save(a1);

        // Save mock messages
        messageRepository.save(new InterviewMessage(s1, "AI", "Welcome. Let's solve Two Sum. Explain your approach first."));
        messageRepository.save(new InterviewMessage(s1, "CANDIDATE", "I can use a hash map to keep track of indices of elements we have visited so we find the match in one pass."));
        messageRepository.save(new InterviewMessage(s1, "AI", "Excellent. You can proceed to code in the editor panel."));
        messageRepository.save(new InterviewMessage(s1, "CANDIDATE", "Code written and submitted."));
        messageRepository.save(new InterviewMessage(s1, "AI", "Great. Tests passed. Let's review complexity."));

        // Mock Session 2 (Valid Parentheses - Passed with 76 score)
        InterviewSession s2 = new InterviewSession(user, q3, Enums.Difficulty.EASY, Enums.Language.PYTHON, 30, "Full Simulation");
        s2.setState(Enums.SessionState.REPORT);
        s2.setStartedAt(LocalDateTime.now().minusDays(1));
        s2.setCompletedAt(LocalDateTime.now().minusDays(1).plusMinutes(20));
        s2.setLastSubmittedCode("def isValid(s):\n    stack = []\n    for char in s:\n        if char in '({[':\n            stack.append(char)\n        else:\n            if not stack: return False\n            top = stack.pop()\n            if char == ')' and top != '(': return False\n            if char == '}' and top != '{': return False\n            if char == ']' and top != '[': return False\n    return len(stack) == 0");
        s2.setTelemetryLog("[{\"time\":\"2026-08-08 14:00:00\",\"event\":\"Session initiated\"},{\"time\":\"2026-08-08 14:02:00\",\"event\":\"Began writing stack code directly\"},{\"time\":\"2026-08-08 14:10:00\",\"event\":\"First test failed with runtime error\"},{\"time\":\"2026-08-08 14:15:00\",\"event\":\"Fixed popping empty stack condition\"},{\"time\":\"2026-08-08 14:20:00\",\"event\":\"All test cases verified\"}]");
        sessionRepository.save(s2);

        Submission sub2 = new Submission(s2, s2.getLastSubmittedCode(), Enums.Language.PYTHON, 3, 3, Enums.ExecutionResultStatus.SUCCESS);
        sub2.setExecutionTimeMs(62L);
        submissionRepository.save(sub2);

        Assessment a2 = new Assessment(s2);
        a2.setOverallScore(76);
        a2.setCorrectnessScore(100);
        a2.setProblemSolvingScore(80);
        a2.setEfficiencyScore(80);
        a2.setCodeQualityScore(70);
        a2.setDebuggingScore(60); // Low because of early runtime crash
        a2.setEdgeCasesScore(75);
        a2.setCommunicationScore(70);
        a2.setDetectedTimeComplexity("O(n)");
        a2.setDetectedSpaceComplexity("O(n)");
        a2.setAutopsySummary("Good correction flow. The candidate started coding without validating empty stack calls which caused an early RuntimeException. However, they resolved the crash within 5 minutes.");
        a2.setWhatWentWell("Used standard Stack framework correctly. Clean conditional mapping logic.");
        a2.setAreasToImprove("Perform dry-runs before early execution runs to catch indexing crash lines. Communicate thoughts while refactoring compiler logs.");
        a2.setInterviewerFeedback("Solid recovery. Missing the empty-stack check on line 8 is a common trap, but the candidate refactored quickly. Needs more defensive programming discipline.");
        a2.setSuggestedPractice("Stacks, Parsing, Error Logging");
        assessmentRepository.save(a2);
    }
}
