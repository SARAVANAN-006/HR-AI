/**
 * KODEXIS Multi-Disciplinary Question Bank
 * Comprehensive repository of 20+ algorithmic & systems challenges across 10 core computer science topics.
 * Provides clean starter skeletons, solutions guarded behind MCQ challenges, and comprehensive test cases.
 */

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface McqChallenge {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuestionSolution {
  python: string;
  java: string;
  javascript: string;
  cpp?: string;
  c?: string;
  csharp?: string;
  go?: string;
}

export interface Question {
  id: number;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topic: string;
  expectedTimeComplexity: string;
  expectedSpaceComplexity: string;
  optimalSolutionConcept: string;
  javaTemplate: string;
  pythonTemplate: string;
  javascriptTemplate: string;
  cppTemplate: string;
  cTemplate?: string;
  csharpTemplate?: string;
  goTemplate?: string;
  solution?: QuestionSolution;
  mcqChallenge?: McqChallenge;
  testCases: TestCase[];
  isRapidSprint?: boolean;
}

export const QUESTION_BANK: Question[] = [
  // 1. Arrays / Hashing - Two Sum
  {
    id: 1,
    title: "Two Sum",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.
You may assume that each input would have exactly one solution, and you may not use the same element twice.

**Input Format:**
First line: Target sum integer \`target\`.
Second line: Comma-separated array of integers.

**Output Format:**
Comma-separated indices \`i,j\` in ascending order.

**Example 1:**
\`\`\`
Input:
9
2,7,11,15
Output:
0,1
\`\`\`

**Constraints:**
- $2 \\le \\text{nums.length} \\le 10^4$
- $-10^9 \\le \\text{nums}[i] \\le 10^9$`,
    difficulty: "EASY",
    topic: "Arrays / Hashing",
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(n)",
    optimalSolutionConcept: "Store complement (target - nums[i]) mapped to index in a Hash Map during single pass.",
    pythonTemplate: `import sys

def twoSum(nums, target):
    # TODO: Implement single-pass hash map solution
    pass

if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    if len(lines) >= 2:
        target = int(lines[0].strip())
        nums = [int(x) for x in lines[1].strip().split(',') if x.strip()]
        print(twoSum(nums, target) or "")`,
    javaTemplate: `import java.util.*;

public class Main {
    public static String twoSum(int[] nums, int target) {
        // TODO: Implement single-pass hash map solution
        return "";
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        int target = Integer.parseInt(sc.nextLine().trim());
        if (!sc.hasNextLine()) return;
        String[] parts = sc.nextLine().trim().split(",");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i].trim());
        System.out.println(twoSum(nums, target));
    }
}`,
    javascriptTemplate: `const fs = require('fs');

function twoSum(nums, target) {
    // TODO: Implement single-pass hash map solution
    return "";
}

const lines = fs.readFileSync(0, 'utf-8').trim().split('\n');
if (lines.length >= 2) {
    const target = parseInt(lines[0].trim());
    const nums = lines[1].trim().split(',').map(Number);
    console.log(twoSum(nums, target));
}`,
    cppTemplate: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <unordered_map>
using namespace std;

string twoSum(vector<int>& nums, int target) {
    // TODO: Implement single-pass hash map solution
    return "";
}

int main() {
    int target;
    if (!(cin >> target)) return 0;
    string line;
    if (!(cin >> line)) return 0;
    stringstream ss(line);
    string token;
    vector<int> nums;
    while (getline(ss, token, ',')) {
        if (!token.empty()) nums.push_back(stoi(token));
    }
    cout << twoSum(nums, target) << endl;
    return 0;
}`,
    solution: {
      python: `import sys

def twoSum(nums, target):
    # TODO: Implement single-pass hash map solution
    seen = {}
    for i, num in enumerate(nums):
        comp = target - num
        if comp in seen:
            return f"{seen[comp]},{i}"
        seen[num] = i
    return ""

if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    if len(lines) >= 2:
        target = int(lines[0].strip())
        nums = [int(x) for x in lines[1].strip().split(',') if x.strip()]
        print(twoSum(nums, target))`,
      java: `import java.util.*;

public class Main {
    public static String twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) {
                return map.get(comp) + "," + i;
            }
            map.put(nums[i], i);
        }
        return "";
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        int target = Integer.parseInt(sc.nextLine().trim());
        if (!sc.hasNextLine()) return;
        String[] parts = sc.nextLine().trim().split(",");
        int[] nums = Arrays.stream(parts).mapToInt(Integer::parseInt).toArray();
        System.out.println(twoSum(nums, target));
    }
}`,
      javascript: `const fs = require('fs');

function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (map.has(comp)) return \`\${map.get(comp)},\${i}\`;
        map.set(nums[i], i);
    }
    return "";
}

const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
if (input.length >= 2) {
    const target = parseInt(input[0].trim());
    const nums = input[1].trim().split(',').map(Number);
    console.log(twoSum(nums, target));
}`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <sstream>
using namespace std;

int main() {
    int target;
    if (!(cin >> target)) return 0;
    string line;
    cin >> line;
    stringstream ss(line);
    string token;
    vector<int> nums;
    while (getline(ss, token, ',')) nums.push_back(stoi(token));
    
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int comp = target - nums[i];
        if (seen.count(comp)) {
            cout << seen[comp] << "," << i << endl;
            return 0;
        }
        seen[nums[i]] = i;
    }
    return 0;
}`
    },
    mcqChallenge: {
      question: "What is the optimal average time and space complexity to solve the Two Sum problem using a Hash Map?",
      options: [
        "O(n) Time, O(n) Space",
        "O(n log n) Time, O(1) Space",
        "O(n^2) Time, O(1) Space",
        "O(1) Time, O(n) Space"
],
      correctIndex: 0,
      explanation: "A single-pass hash map allows looking up each element's complement (target - nums[i]) in O(1) average time, giving an overall O(n) time complexity and O(n) auxiliary space."
    },
    testCases: [
      { id: 1, input: "9\n2,7,11,15", expectedOutput: "0,1", isHidden: false },
      { id: 2, input: "6\n3,2,4", expectedOutput: "1,2", isHidden: false },
      { id: 3, input: "6\n3,3", expectedOutput: "0,1", isHidden: false },
      { id: 4, input: "10\n1,2,3,4,6", expectedOutput: "3,4", isHidden: true },
      { id: 5, input: "0\n-3,4,3,90", expectedOutput: "0,2", isHidden: true }
    ]
  },

  // 2. Arrays / Hashing - Longest Subarray With Target Sum
  {
    id: 2,
    title: "Longest Subarray With Target Sum",
    description: `Given an array of integers \`nums\` and an integer \`k\`, return the maximum length of a contiguous subarray that sums to \`k\`. If no such subarray exists, return \`0\`.

**Input Format:**
First line: Target sum integer \`k\`.
Second line: Comma-separated array of integers.

**Output Format:**
Single integer representing maximum contiguous subarray length.

**Example 1:**
\`\`\`
Input:
15
1,2,3,7,5
Output:
3
Explanation: The subarray [3, 7, 5] has sum 15 and length 3.
\`\`\``,
    difficulty: "MEDIUM",
    topic: "Arrays / Hashing",
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(n)",
    optimalSolutionConcept: "Track cumulative prefix sum in a Hash Map. Check if (sum - k) was observed previously.",
    pythonTemplate: `import sys

def longestSubarray(nums, k):
    # TODO: Implement prefix sums hash map
    pass

if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    if len(lines) >= 2:
        k = int(lines[0].strip())
        nums = [int(x) for x in lines[1].strip().split(',') if x.strip()]
        res = longestSubarray(nums, k)
        print(res if res is not None else 0)`,
    javaTemplate: `import java.util.*;

public class Main {
    public static int longestSubarray(int[] nums, int k) {
        // TODO: Implement prefix sums hash map
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        int k = Integer.parseInt(sc.nextLine().trim());
        if (!sc.hasNextLine()) return;
        String[] parts = sc.nextLine().trim().split(",");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i].trim());
        System.out.println(longestSubarray(nums, k));
    }
}`,
    javascriptTemplate: `const fs = require('fs');

function longestSubarray(nums, k) {
    // TODO: Implement prefix sums hash map
    return 0;
}

const lines = fs.readFileSync(0, 'utf-8').trim().split('\n');
if (lines.length >= 2) {
    const k = parseInt(lines[0].trim());
    const nums = lines[1].trim().split(',').map(Number);
    console.log(longestSubarray(nums, k));
}`,
    cppTemplate: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <unordered_map>
#include <algorithm>
using namespace std;

int longestSubarray(vector<int>& nums, int k) {
    // TODO: Implement prefix sums hash map
    return 0;
}

int main() {
    int k;
    if (!(cin >> k)) return 0;
    string line;
    if (!(cin >> line)) return 0;
    stringstream ss(line);
    string token;
    vector<int> nums;
    while (getline(ss, token, ',')) {
        if (!token.empty()) nums.push_back(stoi(token));
    }
    cout << longestSubarray(nums, k) << endl;
    return 0;
}`,
    solution: {
      python: `import sys

def longestSubarray(nums, k):
    # TODO: Implement prefix sums hash map
    prefix_map = {0: -1}
    curr_sum = 0
    max_len = 0
    for i, num in enumerate(nums):
        curr_sum += num
        if (curr_sum - k) in prefix_map:
            max_len = max(max_len, i - prefix_map[curr_sum - k])
        if curr_sum not in prefix_map:
            prefix_map[curr_sum] = i
    return max_len

if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    if len(lines) >= 2:
        k = int(lines[0].strip())
        nums = [int(x) for x in lines[1].strip().split(',') if x.strip()]
        print(longestSubarray(nums, k))`,
      java: `import java.util.*;

public class Main {
    public static int longestSubarray(int[] nums, int k) {
        Map<Integer, Integer> map = new HashMap<>();
        map.put(0, -1);
        int sum = 0, maxLen = 0;
        for (int i = 0; i < nums.length; i++) {
            sum += nums[i];
            if (map.containsKey(sum - k)) {
                maxLen = Math.max(maxLen, i - map.get(sum - k));
            }
            if (!map.containsKey(sum)) {
                map.put(sum, i);
            }
        }
        return maxLen;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        int k = Integer.parseInt(sc.nextLine().trim());
        if (!sc.hasNextLine()) return;
        String[] parts = sc.nextLine().trim().split(",");
        int[] nums = Arrays.stream(parts).mapToInt(Integer::parseInt).toArray();
        System.out.println(longestSubarray(nums, k));
    }
}`,
      javascript: `const fs = require('fs');

function longestSubarray(nums, k) {
    const map = new Map();
    map.set(0, -1);
    let sum = 0, maxLen = 0;
    for (let i = 0; i < nums.length; i++) {
        sum += nums[i];
        if (map.has(sum - k)) {
            maxLen = Math.max(maxLen, i - map.get(sum - k));
        }
        if (!map.has(sum)) {
            map.set(sum, i);
        }
    }
    return maxLen;
}

const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
if (input.length >= 2) {
    const k = parseInt(input[0].trim());
    const nums = input[1].trim().split(',').map(Number);
    console.log(longestSubarray(nums, k));
}`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <sstream>
using namespace std;

int main() {
    int k; if (!(cin >> k)) return 0;
    string line; cin >> line;
    stringstream ss(line); string tok;
    vector<int> nums;
    while (getline(ss, tok, ',')) nums.push_back(stoi(tok));
    unordered_map<int, int> mp;
    mp[0] = -1;
    int sum = 0, maxLen = 0;
    for (int i = 0; i < nums.size(); i++) {
        sum += nums[i];
        if (mp.count(sum - k)) maxLen = max(maxLen, i - mp[sum - k]);
        if (!mp.count(sum)) mp[sum] = i;
    }
    cout << maxLen << endl;
    return 0;
}`
    },
    mcqChallenge: {
      question: "When solving 'Longest Subarray with Sum K' containing negative numbers, why can't a simple two-pointer sliding window be used?",
      options: [
        "Two pointers only work on sorted arrays or strictly monotonic prefix sums (non-negative numbers)",
        "Two pointers cannot handle integers greater than 10^5",
        "Hash maps are always faster than two pointers",
        "Sliding window has O(n^2) space complexity"
],
      correctIndex: 0,
      explanation: "When negative numbers exist, expanding the window does not monotonically increase the sum, and shrinking does not monotonically decrease it. Hence, prefix sums with a hash map must be used."
    },
    testCases: [
      { id: 1, input: "15\n1,2,3,7,5", expectedOutput: "3", isHidden: false },
      { id: 2, input: "3\n-1,2,3", expectedOutput: "1", isHidden: false },
      { id: 3, input: "0\n1,-1,5,-2,3", expectedOutput: "2", isHidden: false },
      { id: 4, input: "5\n5,1,2,3", expectedOutput: "1", isHidden: false },
      { id: 5, input: "5\n1,1,1,1,1", expectedOutput: "5", isHidden: true }
    ]
  },

  // 3. Stacks / Queues - Valid Parentheses
  {
    id: 3,
    title: "Valid Parentheses",
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.
An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

**Input Format:**
Single line containing string \`s\`.

**Output Format:**
\`true\` or \`false\`.

**Example:**
\`\`\`
Input:
()[]{}
Output:
true
\`\`\``,
    difficulty: "EASY",
    topic: "Stacks / Queues",
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(n)",
    optimalSolutionConcept: "Push open brackets to LIFO Stack, match and pop on closing brackets.",
    pythonTemplate: `import sys

def isValid(s):
    # TODO: Implement stack matching
    pass

if __name__ == '__main__':
    line = sys.stdin.read().strip()
    if line:
        print("true" if isValid(line) else "false")`,
    javaTemplate: `import java.util.*;

public class Main {
    public static boolean isValid(String s) {
        // TODO: Implement stack matching
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String s = sc.nextLine().trim();
        System.out.println(isValid(s) ? "true" : "false");
    }
}`,
    javascriptTemplate: `const fs = require('fs');

function isValid(s) {
    // TODO: Implement stack matching
    return false;
}

const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    console.log(isValid(input) ? "true" : "false");
}`,
    cppTemplate: `#include <iostream>
#include <string>
#include <stack>
using namespace std;

bool isValid(string s) {
    // TODO: Implement stack matching
    return false;
}

int main() {
    string s;
    if (cin >> s) {
        cout << (isValid(s) ? "true" : "false") << endl;
    }
    return 0;
}`,
    solution: {
      python: `import sys

def isValid(s):
    # TODO: Implement stack matching
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return "false"
        else:
            stack.append(char)
    return "true" if not stack else "false"

if __name__ == '__main__':
    s = sys.stdin.read().strip()
    print(isValid(s))`,
      java: `import java.util.*;

public class Main {
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        System.out.println(isValid(sc.nextLine().trim()) ? "true" : "false");
    }
}`,
      javascript: `const fs = require('fs');

function isValid(s) {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    for (const char of s) {
        if (map[char]) {
            if (stack.pop() !== map[char]) return "false";
        } else {
            stack.push(char);
        }
    }
    return stack.length === 0 ? "true" : "false";
}

const input = fs.readFileSync(0, 'utf-8').trim();
console.log(isValid(input));`,
      cpp: `#include <iostream>
#include <stack>
using namespace std;

int main() {
    string s; cin >> s;
    stack<char> st;
    for (char c : s) {
        if (c == '(') st.push(')');
        else if (c == '{') st.push('}');
        else if (c == '[') st.push(']');
        else {
            if (st.empty() || st.top() != c) { cout << "false" << endl; return 0; }
            st.pop();
        }
    }
    cout << (st.empty() ? "true" : "false") << endl;
    return 0;
}`
    },
    mcqChallenge: {
      question: "Which data structure follows the Last-In, First-Out (LIFO) property and is ideal for matching nested brackets?",
      options: [
        "Queue",
        "Stack",
        "Binary Heap",
        "Disjoint Set (Union-Find)"
],
      correctIndex: 1,
      explanation: "A Stack enforces LIFO order, ensuring that the most recently opened bracket is the first one closed and validated against its corresponding pair."
    },
    testCases: [
      { id: 1, input: "()[]{}", expectedOutput: "true", isHidden: false },
      { id: 2, input: "(]", expectedOutput: "false", isHidden: false },
      { id: 3, input: "([{}])", expectedOutput: "true", isHidden: false },
      { id: 4, input: "{[()]}", expectedOutput: "true", isHidden: true },
      { id: 5, input: "((((", expectedOutput: "false", isHidden: true }
    ]
  },

  // 4. Dynamic Programming - Best Time to Buy and Sell Stock
  {
    id: 4,
    title: "Best Time to Buy and Sell Stock",
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the $i^{\\text{th}}$ day.
You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.
Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.

**Input Format:**
Comma-separated array of integer prices.

**Output Format:**
Single integer representing max profit.

**Example 1:**
\`\`\`
Input:
7,1,5,3,6,4
Output:
5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.
\`\`\``,
    difficulty: "EASY",
    topic: "Dynamic Programming",
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
    optimalSolutionConcept: "Maintain running minPrice and update maxProfit in a single linear pass.",
    pythonTemplate: `import sys

def maxProfit(prices):
    # TODO: Implement single pass minPrice & maxProfit
    pass

if __name__ == '__main__':
    line = sys.stdin.read().strip()
    if line:
        prices = [int(x) for x in line.split(',') if x.strip()]
        res = maxProfit(prices)
        print(res if res is not None else 0)`,
    javaTemplate: `import java.util.*;

public class Main {
    public static int maxProfit(int[] prices) {
        // TODO: Implement single pass minPrice & maxProfit
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String[] parts = sc.nextLine().trim().split(",");
        int[] prices = new int[parts.length];
        for (int i = 0; i < parts.length; i++) prices[i] = Integer.parseInt(parts[i].trim());
        System.out.println(maxProfit(prices));
    }
}`,
    javascriptTemplate: `const fs = require('fs');

function maxProfit(prices) {
    // TODO: Implement single pass minPrice & maxProfit
    return 0;
}

const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const prices = input.split(',').map(Number);
    console.log(maxProfit(prices));
}`,
    cppTemplate: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
using namespace std;

int maxProfit(vector<int>& prices) {
    // TODO: Implement single pass minPrice & maxProfit
    return 0;
}

int main() {
    string line;
    if (cin >> line) {
        stringstream ss(line);
        string token;
        vector<int> prices;
        while (getline(ss, token, ',')) {
            if (!token.empty()) prices.push_back(stoi(token));
        }
        cout << maxProfit(prices) << endl;
    }
    return 0;
}`,
    solution: {
      python: `import sys

def maxProfit(prices):
    # TODO: Implement single pass minPrice & maxProfit
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    return max_profit

if __name__ == '__main__':
    line = sys.stdin.read().strip()
    if line:
        prices = [int(x) for x in line.split(',') if x.strip()]
        print(maxProfit(prices))`,
      java: `import java.util.*;

public class Main {
    public static int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int p : prices) {
            if (p < minPrice) minPrice = p;
            else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
        }
        return maxProfit;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String[] parts = sc.nextLine().trim().split(",");
        int[] prices = Arrays.stream(parts).mapToInt(Integer::parseInt).toArray();
        System.out.println(maxProfit(prices));
    }
}`,
      javascript: `const fs = require('fs');

function maxProfit(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    for (const p of prices) {
        if (p < minPrice) minPrice = p;
        else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
    }
    return maxProfit;
}

const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const prices = input.split(',').map(Number);
    console.log(maxProfit(prices));
}`,
      cpp: `#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

int main() {
    string line; if (!(cin >> line)) return 0;
    stringstream ss(line); string tok; vector<int> prices;
    while (getline(ss, tok, ',')) prices.push_back(stoi(tok));
    int minP = 1e9, maxProf = 0;
    for (int p : prices) {
        minP = min(minP, p);
        maxProf = max(maxProf, p - minP);
    }
    cout << maxProf << endl;
    return 0;
}`
    },
    mcqChallenge: {
      question: "In the single-transaction Stock Buy/Sell problem, what variables are sufficient to maintain during a single forward pass?",
      options: [
        "Minimum price seen so far and maximum profit achievable",
        "Maximum price seen so far and average price",
        "Array of all future price differentials",
        "Priority queue of previous dips"
],
      correctIndex: 0,
      explanation: "At each step, candidate profit is price[i] - min_price. By tracking min_price and updating max_profit = max(max_profit, price[i] - min_price), we achieve O(n) time and O(1) space."
    },
    testCases: [
      { id: 1, input: "7,1,5,3,6,4", expectedOutput: "5", isHidden: false },
      { id: 2, input: "7,6,4,3,1", expectedOutput: "0", isHidden: false },
      { id: 3, input: "2,4,1", expectedOutput: "2", isHidden: false },
      { id: 4, input: "1,2,3,4,5", expectedOutput: "4", isHidden: true },
      { id: 5, input: "3,3,3,3", expectedOutput: "0", isHidden: true }
    ]
  },

  // 5. Strings - Valid Palindrome
  {
    id: 5,
    title: "Valid Palindrome",
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.
Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.

**Input Format:**
Single line string \`s\`.

**Output Format:**
\`true\` or \`false\`.

**Example:**
\`\`\`
Input:
A man, a plan, a canal: Panama
Output:
true
\`\`\``,
    difficulty: "EASY",
    topic: "Strings",
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
    optimalSolutionConcept: "Two pointers inward scan skipping non-alphanumeric characters.",
    pythonTemplate: `import sys

def isPalindrome(s):
    # TODO: Implement two pointer alphanumeric check
    pass

if __name__ == '__main__':
    line = sys.stdin.read().strip()
    print("true" if isPalindrome(line) else "false")`,
    javaTemplate: `import java.util.*;

public class Main {
    public static boolean isPalindrome(String s) {
        // TODO: Implement two pointer alphanumeric check
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String s = sc.nextLine();
        System.out.println(isPalindrome(s) ? "true" : "false");
    }
}`,
    javascriptTemplate: `const fs = require('fs');

function isPalindrome(s) {
    // TODO: Implement two pointer alphanumeric check
    return false;
}

const input = fs.readFileSync(0, 'utf-8').trim();
console.log(isPalindrome(input) ? "true" : "false");`,
    cppTemplate: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

bool isPalindrome(string s) {
    // TODO: Implement two pointer alphanumeric check
    return false;
}

int main() {
    string line;
    if (getline(cin, line)) {
        cout << (isPalindrome(line) ? "true" : "false") << endl;
    }
    return 0;
}`,
    solution: {
      python: `import sys

def isPalindrome(s):
    # TODO: Implement two pointer alphanumeric check
    filtered = [c.lower() for c in s if c.isalnum()]
    return "true" if filtered == filtered[::-1] else "false"

if __name__ == '__main__':
    s = sys.stdin.read().strip()
    print(isPalindrome(s))`,
      java: `import java.util.*;

public class Main {
    public static boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;
            l++; r--;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        System.out.println(isPalindrome(sc.nextLine()) ? "true" : "false");
    }
}`,
      javascript: `const fs = require('fs');

function isPalindrome(s) {
    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return clean === clean.split('').reverse().join('') ? "true" : "false";
}

const input = fs.readFileSync(0, 'utf-8').trim();
console.log(isPalindrome(input));`,
      cpp: `#include <iostream>
#include <cctype>
using namespace std;

int main() {
    string s; getline(cin, s);
    int l = 0, r = (int)s.size() - 1;
    while (l < r) {
        while (l < r && !isalnum(s[l])) l++;
        while (l < r && !isalnum(s[r])) r--;
        if (tolower(s[l]) != tolower(s[r])) { cout << "false" << endl; return 0; }
        l++; r--;
    }
    cout << "true" << endl;
    return 0;
}`
    },
    mcqChallenge: {
      question: "What is the most space-efficient way to verify if a string is a palindrome ignoring non-alphanumeric characters?",
      options: [
        "Create a reversed copy of the string in memory",
        "Two pointers moving inward from both ends, skipping non-alphanumeric characters in-place",
        "Recursive call stack slicing substrings",
        "Sorting the characters alphabetically"
],
      correctIndex: 1,
      explanation: "Two pointers inward use O(1) auxiliary memory because no new string or array is allocated, achieving optimal O(n) time and O(1) space."
    },
    testCases: [
      { id: 1, input: "A man, a plan, a canal: Panama", expectedOutput: "true", isHidden: false },
      { id: 2, input: "race a car", expectedOutput: "false", isHidden: false },
      { id: 3, input: " ", expectedOutput: "true", isHidden: false },
      { id: 4, input: "0P", expectedOutput: "false", isHidden: true },
      { id: 5, input: "Madam, I'm Adam", expectedOutput: "true", isHidden: true }
    ]
  },

  // 6. Dynamic Programming - Maximum Subarray (Kadane's Algorithm)
  {
    id: 6,
    title: "Maximum Subarray (Kadane",
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

**Input Format:**
Comma-separated array of integers.

**Output Format:**
Single integer denoting the max subarray sum.

**Example 1:**
\`\`\`
Input:
-2,1,-3,4,-1,2,1,-5,4
Output:
6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.
\`\`\``,
    difficulty: "MEDIUM",
    topic: "Dynamic Programming",
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
    optimalSolutionConcept: "Kadane",
    pythonTemplate: `import sys

def maxSubArray(nums):
    # TODO: Implement Kadane's algorithm
    pass

if __name__ == '__main__':
    line = sys.stdin.read().strip()
    if line:
        nums = [int(x) for x in line.split(',') if x.strip()]
        res = maxSubArray(nums)
        print(res if res is not None else 0)`,
    javaTemplate: `import java.util.*;

public class Main {
    public static int maxSubArray(int[] nums) {
        // TODO: Implement Kadane's algorithm
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String[] parts = sc.nextLine().trim().split(",");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i].trim());
        System.out.println(maxSubArray(nums));
    }
}`,
    javascriptTemplate: `const fs = require('fs');

function maxSubArray(nums) {
    // TODO: Implement Kadane's algorithm
    return 0;
}

const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const nums = input.split(',').map(Number);
    console.log(maxSubArray(nums));
} `,
    cppTemplate: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // TODO: Implement Kadane's algorithm
    return 0;
}

int main() {
    string line;
    if (cin >> line) {
        stringstream ss(line);
        string token;
        vector<int> nums;
        while (getline(ss, token, ',')) {
            if (!token.empty()) nums.push_back(stoi(token));
        }
        cout << maxSubArray(nums) << endl;
    }
    return 0;
}`,
    solution: {
      python: `import sys

def maxSubArray(nums):
    # TODO: Implement Kadane's algorithm
    max_so_far = nums[0]
    curr_max = nums[0]
    for x in nums[1:]:
        curr_max = max(x, curr_max + x)
        max_so_far = max(max_so_far, curr_max)
    return max_so_far

if __name__ == '__main__':
    line = sys.stdin.read().strip()
    if line:
        nums = [int(x) for x in line.split(',') if x.strip()]
        print(maxSubArray(nums))`,
      java: `import java.util.*;

public class Main {
    public static int maxSubArray(int[] nums) {
        int maxSoFar = nums[0], currMax = nums[0];
        for (int i = 1; i < nums.length; i++) {
            currMax = Math.max(nums[i], currMax + nums[i]);
            maxSoFar = Math.max(maxSoFar, currMax);
        }
        return maxSoFar;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        int[] nums = Arrays.stream(sc.nextLine().trim().split(",")).mapToInt(Integer::parseInt).toArray();
        System.out.println(maxSubArray(nums));
    }
}`,
      javascript: `const fs = require('fs');

function maxSubArray(nums) {
    let maxSoFar = nums[0];
    let currMax = nums[0];
    for (let i = 1; i < nums.length; i++) {
        currMax = Math.max(nums[i], currMax + nums[i]);
        maxSoFar = Math.max(maxSoFar, currMax);
    }
    return maxSoFar;
}

const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const nums = input.split(',').map(Number);
    console.log(maxSubArray(nums));
}`,
      cpp: `#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

int main() {
    string line; if (!(cin >> line)) return 0;
    stringstream ss(line); string tok; vector<int> nums;
    while (getline(ss, tok, ',')) nums.push_back(stoi(tok));
    int maxSoFar = nums[0], currMax = nums[0];
    for (size_t i = 1; i < nums.size(); i++) {
        currMax = max(nums[i], currMax + nums[i]);
        maxSoFar = max(maxSoFar, currMax);
    }
    cout << maxSoFar << endl;
    return 0;
}`
    },
    mcqChallenge: {
      question: "In Kadane's Algorithm, what is the core recurrence relation for updating current sum cur_sum with element nums[i]?",
      options: [
        "cur_sum = max(nums[i], cur_sum + nums[i])",
        "cur_sum = cur_sum + nums[i] if nums[i] > 0 else 0",
        "cur_sum = min(nums[i], cur_sum * nums[i])",
        "cur_sum = (cur_sum + nums[i]) / 2"
],
      correctIndex: 0,
      explanation: "At each index, we decide whether to add nums[i] to the existing subarray (cur_sum + nums[i]) or start a fresh subarray at nums[i] if the existing sum was negative."
    },
    testCases: [
      { id: 1, input: "-2,1,-3,4,-1,2,1,-5,4", expectedOutput: "6", isHidden: false },
      { id: 2, input: "1", expectedOutput: "1", isHidden: false },
      { id: 3, input: "5,4,-1,7,8", expectedOutput: "23", isHidden: false },
      { id: 4, input: "-1,-2,-3", expectedOutput: "-1", isHidden: true },
      { id: 5, input: "2,-1,2,3", expectedOutput: "6", isHidden: true }
    ]
  },

  // 7. Sorting / Searching - Search in Rotated Sorted Array
  {
    id: 7,
    title: "Search in Rotated Sorted Array",
    description: `Given a sorted array of distinct integers \`nums\` rotated at an unknown pivot index, and a \`target\` value, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.
You must write an algorithm with $O(\\log n)$ runtime complexity.

**Input Format:**
First line: Target integer \`target\`.
Second line: Comma-separated array of integers.

**Output Format:**
Integer index or \`-1\`.

**Example:**
\`\`\`
Input:
0
4,5,6,7,0,1,2
Output:
4
\`\`\``,
    difficulty: "MEDIUM",
    topic: "Sorting / Searching",
    expectedTimeComplexity: "O(log n)",
    expectedSpaceComplexity: "O(1)",
    optimalSolutionConcept: "Modified binary search: determine which half is sorted, then check if target falls inside that range.",
    pythonTemplate: `import sys

def search(nums, target):
    # TODO: Implement O(log n) modified binary search
    pass

if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    if len(lines) >= 2:
        target = int(lines[0].strip())
        nums = [int(x) for x in lines[1].strip().split(',') if x.strip()]
        res = search(nums, target)
        print(res if res is not None else -1)`,
    javaTemplate: `import java.util.*;

public class Main {
    public static int search(int[] nums, int target) {
        // TODO: Implement O(log n) modified binary search
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        int target = Integer.parseInt(sc.nextLine().trim());
        if (!sc.hasNextLine()) return;
        String[] parts = sc.nextLine().trim().split(",");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i].trim());
        System.out.println(search(nums, target));
    }
}`,
    javascriptTemplate: `const fs = require('fs');

function search(nums, target) {
    // TODO: Implement O(log n) modified binary search
    return -1;
}

const lines = fs.readFileSync(0, 'utf-8').trim().split('\n');
if (lines.length >= 2) {
    const target = parseInt(lines[0].trim());
    const nums = lines[1].trim().split(',').map(Number);
    console.log(search(nums, target));
}`,
    cppTemplate: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
using namespace std;

int search(vector<int>& nums, int target) {
    // TODO: Implement O(log n) modified binary search
    return -1;
}

int main() {
    int target;
    if (!(cin >> target)) return 0;
    string line;
    if (!(cin >> line)) return 0;
    stringstream ss(line);
    string token;
    vector<int> nums;
    while (getline(ss, token, ',')) {
        if (!token.empty()) nums.push_back(stoi(token));
    }
    cout << search(nums, target) << endl;
    return 0;
}`,
    solution: {
      python: `import sys

def search(nums, target):
    # TODO: Implement O(log n) modified binary search
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = (l + r) // 2
        if nums[mid] == target:
            return mid
        if nums[l] <= nums[mid]:
            if nums[l] <= target < nums[mid]:
                r = mid - 1
            else:
                l = mid + 1
        else:
            if nums[mid] < target <= nums[r]:
                l = mid + 1
            else:
                r = mid - 1
    return -1

if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    if len(lines) >= 2:
        target = int(lines[0].strip())
        nums = [int(x) for x in lines[1].strip().split(',') if x.strip()]
        print(search(nums, target))`,
      java: `import java.util.*;

public class Main {
    public static int search(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) return mid;
            if (nums[l] <= nums[mid]) {
                if (nums[l] <= target && target < nums[mid]) r = mid - 1;
                else l = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[r]) l = mid + 1;
                else r = mid - 1;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        int target = Integer.parseInt(sc.nextLine().trim());
        if (!sc.hasNextLine()) return;
        int[] nums = Arrays.stream(sc.nextLine().trim().split(",")).mapToInt(Integer::parseInt).toArray();
        System.out.println(search(nums, target));
    }
}`,
      javascript: `const fs = require('fs');

function search(nums, target) {
    let l = 0, r = nums.length - 1;
    while (l <= r) {
        const mid = Math.floor((l + r) / 2);
        if (nums[mid] === target) return mid;
        if (nums[l] <= nums[mid]) {
            if (nums[l] <= target && target < nums[mid]) r = mid - 1;
            else l = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[r]) l = mid + 1;
            else r = mid - 1;
        }
    }
    return -1;
}

const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
if (input.length >= 2) {
    const target = parseInt(input[0].trim());
    const nums = input[1].trim().split(',').map(Number);
    console.log(search(nums, target));
}`,
      cpp: `#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

int main() {
    int target; if (!(cin >> target)) return 0;
    string line; cin >> line;
    stringstream ss(line); string tok; vector<int> nums;
    while (getline(ss, tok, ',')) nums.push_back(stoi(tok));
    int l = 0, r = (int)nums.size() - 1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (nums[mid] == target) { cout << mid << endl; return 0; }
        if (nums[l] <= nums[mid]) {
            if (nums[l] <= target && target < nums[mid]) r = mid - 1;
            else l = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[r]) l = mid + 1;
            else r = mid - 1;
        }
    }
    cout << -1 << endl;
    return 0;
}`
    },
    mcqChallenge: {
      question: "In a rotated sorted array without duplicates, what property guarantees that binary search can still run in O(log n) time?",
      options: [
        "At least one half of the array (left or right of mid) is always normally sorted",
        "The middle element is always the pivot point",
        "Both halves are always reverse-sorted",
        "The array can be rotated back to sorted in O(1) time"
],
      correctIndex: 0,
      explanation: "Because the array was originally sorted and rotated once, dividing at mid always leaves at least one contiguous half strictly sorted (nums[l] <= nums[mid] or nums[mid] <= nums[r])."
    },
    testCases: [
      { id: 1, input: "0\n4,5,6,7,0,1,2", expectedOutput: "4", isHidden: false },
      { id: 2, input: "3\n4,5,6,7,0,1,2", expectedOutput: "-1", isHidden: false },
      { id: 3, input: "1\n1", expectedOutput: "0", isHidden: false },
      { id: 4, input: "2\n1,3", expectedOutput: "-1", isHidden: true },
      { id: 5, input: "5\n6,7,1,2,3,4,5", expectedOutput: "6", isHidden: true }
    ]
  },

  // 8. Trees - Invert Binary Tree
  {
    id: 8,
    title: "Invert Binary Tree",
    description: `Given the root of a binary tree represented as a level-order serialized array, invert the tree (swap left and right child nodes recursively), and return its level-order array.

**Input Format:**
Comma-separated level-order tree elements.

**Output Format:**
Comma-separated inverted level-order tree elements.

**Example 1:**
\`\`\`
Input:
4,2,7,1,3,6,9
Output:
4,7,2,9,6,3,1
\`\`\``,
    difficulty: "EASY",
    topic: "Trees",
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(h)",
    optimalSolutionConcept: "DFS recursion: Swap left and right subtrees at each node.",
    pythonTemplate: `import sys

def invertTreeArray(arr):
    # TODO: Invert binary tree in level order representation
    pass

if __name__ == '__main__':
    line = sys.stdin.read().strip()
    if line:
        arr = [int(x) for x in line.split(',') if x.strip()]
        print(invertTreeArray(arr) or "")`,
    javaTemplate: `import java.util.*;

public class Main {
    public static String invertTreeArray(String[] parts) {
        // TODO: Invert binary tree in level order representation
        return "";
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String[] parts = sc.nextLine().trim().split(",");
        System.out.println(invertTreeArray(parts));
    }
}`,
    javascriptTemplate: `const fs = require('fs');

function invertTreeArray(parts) {
    // TODO: Invert binary tree in level order representation
    return "";
}

const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const parts = input.split(',');
    console.log(invertTreeArray(parts));
}`,
    cppTemplate: `#include <iostream>
#include <vector>
#include <sstream>
#include <algorithm>
using namespace std;

string invertTreeArray(vector<string>& v) {
    // TODO: Invert binary tree in level order representation
    return "";
}

int main() {
    string line;
    if (!(cin >> line)) return 0;
    stringstream ss(line);
    string tok;
    vector<string> v;
    while (getline(ss, tok, ',')) v.push_back(tok);
    cout << invertTreeArray(v) << endl;
    return 0;
}`,
    solution: {
      python: `import sys

def invertTreeArray(arr):
    if not arr: return ""
    n = len(arr)
    result = list(arr)
    level = 0
    start = 0
    while start < n:
        count = 1 << level
        end = min(n, start + count)
        result[start:end] = reversed(result[start:end])
        start = end
        level += 1
    return ",".join(map(str, result))

if __name__ == '__main__':
    line = sys.stdin.read().strip()
    if line:
        arr = [int(x) for x in line.split(',') if x.strip()]
        print(invertTreeArray(arr))`,
      java: `import java.util.*;

public class Main {
    public static String invertTreeArray(String[] parts) {
        int n = parts.length;
        String[] res = new String[n];
        int level = 0, start = 0;
        while (start < n) {
            int count = 1 << level;
            int end = Math.min(n, start + count);
            for (int i = 0; i < (end - start); i++) {
                res[start + i] = parts[end - 1 - i];
            }
            start = end;
            level++;
        }
        return String.join(",", res);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String[] parts = sc.nextLine().trim().split(",");
        System.out.println(invertTreeArray(parts));
    }
}`,
      javascript: `const fs = require('fs');

function invertTreeArray(parts) {
    const n = parts.length;
    let res = [];
    let level = 0, start = 0;
    while (start < n) {
        const count = 1 << level;
        const end = Math.min(n, start + count);
        res.push(...parts.slice(start, end).reverse());
        start = end;
        level++;
    }
    return res.join(',');
}

const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const parts = input.split(',');
    console.log(invertTreeArray(parts));
}`,
      cpp: `#include <iostream>
#include <vector>
#include <sstream>
#include <algorithm>
using namespace std;

string invertTreeArray(vector<string>& v) {
    int n = v.size(), start = 0, level = 0;
    vector<string> res;
    while (start < n) {
        int count = 1 << level;
        int end = min(n, start + count);
        vector<string> sub(v.begin() + start, v.begin() + end);
        reverse(sub.begin(), sub.end());
        res.insert(res.end(), sub.begin(), sub.end());
        start = end; level++;
    }
    string out = "";
    for (size_t i = 0; i < res.size(); i++) {
        out += res[i] + (i + 1 == res.size() ? "" : ",");
    }
    return out;
}

int main() {
    string line; if (!(cin >> line)) return 0;
    stringstream ss(line); string tok; vector<string> v;
    while (getline(ss, tok, ',')) v.push_back(tok);
    cout << invertTreeArray(v) << endl;
    return 0;
}`
    },
    mcqChallenge: {
      question: "What is the maximum recursion depth (call stack space complexity) when inverting an unbalanced, skewed binary tree with N nodes?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N^2)"
],
      correctIndex: 2,
      explanation: "In the worst case (a degenerate skewed tree like a linked list), the tree height is equal to N, meaning recursion uses O(N) stack frames. For a balanced tree, it is O(log N)."
    },
    testCases: [
      { id: 1, input: "4,2,7,1,3,6,9", expectedOutput: "4,7,2,9,6,3,1", isHidden: false },
      { id: 2, input: "2,1,3", expectedOutput: "2,3,1", isHidden: false },
      { id: 3, input: "1", expectedOutput: "1", isHidden: false },
      { id: 4, input: "5,3,8", expectedOutput: "5,8,3", isHidden: true }
    ]
  },

  // 9. LinkedLists - Reverse Linked List
  {
    id: 9,
    title: "Reverse Linked List",
    description: `Given the head of a singly linked list represented as comma-separated nodes, reverse the list, and return the reversed list.

**Input Format:**
Comma-separated values of the linked list.

**Output Format:**
Comma-separated reversed values.

**Example 1:**
\`\`\`
Input:
1,2,3,4,5
Output:
5,4,3,2,1
\`\`\``,
    difficulty: "EASY",
    topic: "LinkedLists",
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
    optimalSolutionConcept: "Iterative pointer reversal: prev, curr, nextNode pointers moving sequentially forward.",
    pythonTemplate: `import sys

def reverseList(arr):
    # TODO: Implement in-place reversal logic
    pass

if __name__ == '__main__':
    line = sys.stdin.read().strip()
    if line:
        arr = [int(x) for x in line.split(',') if x.strip()]
        print(reverseList(arr) or "")`,
    javaTemplate: `import java.util.*;

public class Main {
    public static String reverseList(String[] parts) {
        // TODO: Implement in-place reversal logic
        return "";
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String[] parts = sc.nextLine().trim().split(",");
        System.out.println(reverseList(parts));
    }
}`,
    javascriptTemplate: `const fs = require('fs');

function reverseList(parts) {
    // TODO: Implement in-place reversal logic
    return "";
}

const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    console.log(reverseList(input.split(',')));
}`,
    cppTemplate: `#include <iostream>
#include <vector>
#include <sstream>
#include <algorithm>
using namespace std;

string reverseList(vector<string>& v) {
    // TODO: Implement in-place reversal logic
    return "";
}

int main() {
    string line;
    if (!(cin >> line)) return 0;
    stringstream ss(line);
    string tok;
    vector<string> v;
    while (getline(ss, tok, ',')) v.push_back(tok);
    cout << reverseList(v) << endl;
    return 0;
}`,
    solution: {
      python: `import sys

def reverseList(arr):
    return ",".join(map(str, reversed(arr)))

if __name__ == '__main__':
    line = sys.stdin.read().strip()
    if line:
        arr = [int(x) for x in line.split(',') if x.strip()]
        print(reverseList(arr))`,
      java: `import java.util.*;

public class Main {
    public static String reverseList(String[] parts) {
        Collections.reverse(Arrays.asList(parts));
        return String.join(",", parts);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String[] parts = sc.nextLine().trim().split(",");
        System.out.println(reverseList(parts));
    }
}`,
      javascript: `const fs = require('fs');

function reverseList(parts) {
    return parts.reverse().join(',');
}

const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    console.log(reverseList(input.split(',')));
}`,
      cpp: `#include <iostream>
#include <vector>
#include <sstream>
#include <algorithm>
using namespace std;

string reverseList(vector<string>& v) {
    reverse(v.begin(), v.end());
    string out = "";
    for (size_t i = 0; i < v.size(); i++) out += v[i] + (i + 1 == v.size() ? "" : ",");
    return out;
}

int main() {
    string line; if (!(cin >> line)) return 0;
    stringstream ss(line); string tok; vector<string> v;
    while (getline(ss, tok, ',')) v.push_back(tok);
    cout << reverseList(v) << endl;
    return 0;
}`
    },
    mcqChallenge: {
      question: "How many auxiliary pointer variables are required to reverse a singly linked list iteratively in-place?",
      options: [
        "3 pointers (prev, curr, next) with O(1) extra space",
        "An auxiliary array of size N",
        "A double stack with O(N) space",
        "0 pointers"
],
      correctIndex: 0,
      explanation: "By keeping track of prev, curr, and temporary next = curr.next, we can reverse curr.next = prev and advance the pointers in O(n) time and O(1) extra space."
    },
    testCases: [
      { id: 1, input: "1,2,3,4,5", expectedOutput: "5,4,3,2,1", isHidden: false },
      { id: 2, input: "1,2", expectedOutput: "2,1", isHidden: false },
      { id: 3, input: "1", expectedOutput: "1", isHidden: false },
      { id: 4, input: "10,20,30,40", expectedOutput: "40,30,20,10", isHidden: true }
    ]
  },

  // 10. Graphs - Number of Islands
  {
    id: 10,
    title: "Number of Islands",
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.
An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

**Input Format:**
First line: Integer rows \`m\`.
Subsequent \`m\` lines: Comma-separated \`0\` or \`1\` values.

**Output Format:**
Single integer count of islands.

**Example 1:**
\`\`\`
Input:
4
1,1,1,1,0
1,1,0,1,0
1,1,0,0,0
0,0,0,0,0
Output:
1
\`\`\``,
    difficulty: "MEDIUM",
    topic: "Graphs",
    expectedTimeComplexity: "O(m * n)",
    expectedSpaceComplexity: "O(m * n)",
    optimalSolutionConcept: "Breadth-First Search (BFS) or Depth-First Search (DFS) grid flood fill sinking visited lands to ",
    pythonTemplate: `import sys

def numIslands(grid):
    # TODO: Implement DFS or BFS flood fill
    pass

if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    grid = [[c for c in line.strip().split(',') if c] for line in lines if line.strip()]
    res = numIslands(grid)
    print(res if res is not None else 0)`,
    javaTemplate: `import java.util.*;

public class Main {
    public static int numIslands(char[][] grid) {
        // TODO: Implement DFS or BFS flood fill
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<String> lines = new ArrayList<>();
        while (sc.hasNextLine()) {
            String l = sc.nextLine().trim();
            if (!l.isEmpty()) lines.add(l);
        }
        if (lines.isEmpty()) {
            System.out.println(0);
            return;
        }
        int rows = lines.size();
        int cols = lines.get(0).split(",").length;
        char[][] grid = new char[rows][cols];
        for (int i = 0; i < rows; i++) {
            String[] p = lines.get(i).split(",");
            for (int j = 0; j < cols && j < p.length; j++) {
                grid[i][j] = p[j].trim().charAt(0);
            }
        }
        System.out.println(numIslands(grid));
    }
}`,
    javascriptTemplate: `const fs = require('fs');

function numIslands(grid) {
    // TODO: Implement DFS or BFS flood fill
    return 0;
}

const lines = fs.readFileSync(0, 'utf-8').trim().split('\n').map(l => l.trim()).filter(Boolean);
if (lines.length > 0) {
    const grid = lines.map(line => line.split(','));
    console.log(numIslands(grid));
} else {
    console.log(0);
}`,
    cppTemplate: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
using namespace std;

int numIslands(vector<vector<char>>& grid) {
    // TODO: Implement DFS or BFS flood fill
    return 0;
}

int main() {
    string line;
    vector<vector<char>> grid;
    while (getline(cin, line)) {
        if (line.empty()) continue;
        stringstream ss(line);
        string tok;
        vector<char> row;
        while (getline(ss, tok, ',')) {
            if (!tok.empty()) row.push_back(tok[0]);
        }
        if (!row.empty()) grid.push_back(row);
    }
    cout << numIslands(grid) << endl;
    return 0;
}`,
    solution: {
      python: `import sys

def numIslands(grid):
    # TODO: Implement DFS or BFS flood fill
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    count = 0
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'
        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count

if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    if lines:
        m = int(lines[0].strip())
        grid = [line.strip().split(',') for line in lines[1:m+1] if line.strip()]
        print(numIslands(grid))`,
      java: `import java.util.*;

public class Main {
    public static int numIslands(char[][] grid) {
        int count = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == '1') {
                    count++;
                    dfs(grid, i, j);
                }
            }
        }
        return count;
    }

    private static void dfs(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c); dfs(grid, r - 1, c);
        dfs(grid, r, c + 1); dfs(grid, r, c - 1);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        int m = Integer.parseInt(sc.nextLine().trim());
        List<char[]> list = new ArrayList<>();
        for (int i = 0; i < m && sc.hasNextLine(); i++) {
            String[] parts = sc.nextLine().trim().split(",");
            char[] row = new char[parts.length];
            for (int j = 0; j < parts.length; j++) row[j] = parts[j].charAt(0);
            list.add(row);
        }
        System.out.println(numIslands(list.toArray(new char[0][0])));
    }
}`,
      javascript: `const fs = require('fs');

function numIslands(grid) {
    let count = 0;
    const rows = grid.length, cols = grid[0].length;
    function dfs(r, c) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') return;
        grid[r][c] = '0';
        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1);
    }
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '1') {
                count++;
                dfs(r, c);
            }
        }
    }
    return count;
}

const lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');
if (lines.length >= 2) {
    const m = parseInt(lines[0].trim());
    const grid = lines.slice(1, m + 1).map(l => l.trim().split(','));
    console.log(numIslands(grid));
}`,
      cpp: `#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

void dfs(vector<vector<char>>& grid, int r, int c) {
    if (r < 0 || r >= grid.size() || c < 0 || c >= grid[0].size() || grid[r][c] != '1') return;
    grid[r][c] = '0';
    dfs(grid, r+1, c); dfs(grid, r-1, c); dfs(grid, r, c+1); dfs(grid, r, c-1);
}

int main() {
    int m; if (!(cin >> m)) return 0;
    vector<vector<char>> grid;
    for (int i = 0; i < m; i++) {
        string line; cin >> line;
        stringstream ss(line); string tok; vector<char> row;
        while (getline(ss, tok, ',')) row.push_back(tok[0]);
        grid.push_back(row);
    }
    int count = 0;
    for (int i = 0; i < grid.size(); i++) {
        for (int j = 0; j < grid[0].size(); j++) {
            if (grid[i][j] == '1') { count++; dfs(grid, i, j); }
        }
    }
    cout << count << endl;
    return 0;
}`
    },
    mcqChallenge: {
      question: "When using Breadth-First Search (BFS) or Depth-First Search (DFS) to count connected components on an M x N grid, what is the optimal time complexity?",
      options: [
        "O(M * N) because each cell is visited a constant number of times",
        "O((M * N)^2) due to repeated graph traversals",
        "O(M + N)",
        "O(M * log N)"
],
      correctIndex: 0,
      explanation: "Each land cell '1' is visited and marked as visited at most once, resulting in strictly O(M * N) linear time."
    },
    testCases: [
      { id: 1, input: "4\n1,1,1,1,0\n1,1,0,1,0\n1,1,0,0,0\n0,0,0,0,0", expectedOutput: "1", isHidden: false },
      { id: 2, input: "4\n1,1,0,0,0\n1,1,0,0,0\n0,0,1,0,0\n0,0,0,1,1", expectedOutput: "3", isHidden: false },
      { id: 3, input: "1\n1", expectedOutput: "1", isHidden: false },
      { id: 4, input: "1\n0", expectedOutput: "0", isHidden: true }
    ]
  },

  // 11. System Design - LRU Cache Design
  {
    id: 11,
    title: "LRU Cache (Least Recently Used)",
    description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.
Given a sequence of commands, execute them and print the results:
- \`PUT key value\`
- \`GET key\` -> prints value or \`-1\` if not found.

**Input Format:**
First line: Integer capacity \`cap\`.
Second line: Integer number of operations \`k\`.
Subsequent lines: Commands formatted as \`GET key\` or \`PUT key value\`.

**Output Format:**
Comma-separated output of \`GET\` calls.

**Example:**
\`\`\`
Input:
2
4
PUT 1 1
PUT 2 2
GET 1
GET 2
Output:
1,2
\`\`\``,
    difficulty: "HARD",
    topic: "System Design",
    expectedTimeComplexity: "O(1) for GET and PUT",
    expectedSpaceComplexity: "O(capacity)",
    optimalSolutionConcept: "Combine Hash Map with Doubly Linked List for $O(1)$ node lookup and removal.",
    pythonTemplate: `import sys

class LRUCache:
    def __init__(self, capacity: int):
        # TODO: Initialize LRU Cache with capacity
        self.cap = capacity

    def get(self, key: int) -> int:
        # TODO: Return value if exists, else -1
        return -1

    def put(self, key: int, value: int) -> None:
        # TODO: Update or insert key-value pair. Evict LRU if capacity exceeded.
        pass

if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    if len(lines) >= 2:
        cap = int(lines[0].strip())
        ops = int(lines[1].strip())
        lru = LRUCache(cap)
        res = []
        for i in range(2, 2 + ops):
            if i < len(lines):
                parts = lines[i].strip().split()
                if parts[0] == 'PUT':
                    lru.put(int(parts[1]), int(parts[2]))
                elif parts[0] == 'GET':
                    res.append(str(lru.get(int(parts[1]))))
        print(','.join(res))`,
    javaTemplate: `import java.util.*;

public class Main {
    static class LRUCache {
        private int cap;
        public LRUCache(int capacity) {
            // TODO: Initialize LRU Cache
            this.cap = capacity;
        }
        public int get(int key) {
            // TODO: Return value if exists, else -1
            return -1;
        }
        public void put(int key, int value) {
            // TODO: Update or insert key-value pair. Evict LRU if capacity exceeded.
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        int cap = Integer.parseInt(sc.nextLine().trim());
        if (!sc.hasNextLine()) return;
        int ops = Integer.parseInt(sc.nextLine().trim());
        LRUCache cache = new LRUCache(cap);
        List<String> res = new ArrayList<>();
        for (int i = 0; i < ops && sc.hasNextLine(); i++) {
            String[] p = sc.nextLine().trim().split("\s+");
            if (p[0].equals("PUT")) cache.put(Integer.parseInt(p[1]), Integer.parseInt(p[2]));
            else if (p[0].equals("GET")) res.add(String.valueOf(cache.get(Integer.parseInt(p[1]))));
        }
        System.out.println(String.join(",", res));
    }
}`,
    javascriptTemplate: `const fs = require('fs');

class LRUCache {
    constructor(cap) {
        // TODO: Initialize LRU Cache
        this.cap = cap;
    }
    get(key) {
        // TODO: Return value if exists, else -1
        return -1;
    }
    put(key, val) {
        // TODO: Update or insert key-value pair. Evict LRU if capacity exceeded.
    }
}

const lines = fs.readFileSync(0, 'utf-8').trim().split('\n');
if (lines.length >= 2) {
    const cap = parseInt(lines[0].trim());
    const ops = parseInt(lines[1].trim());
    const lru = new LRUCache(cap);
    const res = [];
    for (let i = 2; i < 2 + ops; i++) {
        if (i < lines.length) {
            const parts = lines[i].trim().split(/\s+/);
            if (parts[0] === 'PUT') lru.put(Number(parts[1]), Number(parts[2]));
            else if (parts[0] === 'GET') res.push(lru.get(Number(parts[1])));
        }
    }
    console.log(res.join(','));
}`,
    cppTemplate: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

class LRUCache {
    int cap;
public:
    LRUCache(int capacity) : cap(capacity) {
        // TODO: Initialize LRU Cache
    }
    int get(int key) {
        // TODO: Return value if exists, else -1
        return -1;
    }
    void put(int key, int value) {
        // TODO: Update or insert key-value pair. Evict LRU if capacity exceeded.
    }
};

int main() {
    int cap, ops;
    if (!(cin >> cap >> ops)) return 0;
    LRUCache lru(cap);
    vector<int> res;
    for (int i = 0; i < ops; i++) {
        string cmd; cin >> cmd;
        if (cmd == "PUT") { int k, v; cin >> k >> v; lru.put(k, v); }
        else if (cmd == "GET") { int k; cin >> k; res.push_back(lru.get(k)); }
    }
    for (int i = 0; i < res.size(); i++) cout << res[i] << (i + 1 == res.size() ? "" : ",");
    cout << endl;
    return 0;
}`,
    solution: {
      python: `import sys

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}
        # Utilizing Python's dict insertion ordering as an LRU queue
    
    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        val = self.cache.pop(key)
        self.cache[key] = val
        return val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.pop(key)
        elif len(self.cache) >= self.cap:
            oldest = next(iter(self.cache))
            del self.cache[oldest]
        self.cache[key] = value

if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    if len(lines) >= 2:
        cap = int(lines[0].strip())
        ops_count = int(lines[1].strip())
        lru = LRUCache(cap)
        results = []
        for line in lines[2:2+ops_count]:
            parts = line.strip().split()
            if not parts: continue
            if parts[0] == 'PUT':
                lru.put(int(parts[1]), int(parts[2]))
            elif parts[0] == 'GET':
                results.append(str(lru.get(int(parts[1]))))
        print(",".join(results))`,
      java: `import java.util.*;

public class Main {
    static class LRUCache extends LinkedHashMap<Integer, Integer> {
        private int cap;
        public LRUCache(int capacity) {
            super(capacity, 0.75f, true);
            this.cap = capacity;
        }
        public int get(int key) {
            return super.getOrDefault(key, -1);
        }
        public void put(int key, int value) {
            super.put(key, value);
        }
        @Override
        protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
            return size() > cap;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        int cap = Integer.parseInt(sc.nextLine().trim());
        int ops = Integer.parseInt(sc.nextLine().trim());
        LRUCache cache = new LRUCache(cap);
        List<String> res = new ArrayList<>();
        for (int i = 0; i < ops && sc.hasNextLine(); i++) {
            String[] p = sc.nextLine().trim().split("\\s+");
            if (p[0].equals("PUT")) cache.put(Integer.parseInt(p[1]), Integer.parseInt(p[2]));
            else if (p[0].equals("GET")) res.add(String.valueOf(cache.get(Integer.parseInt(p[1]))));
        }
        System.out.println(String.join(",", res));
    }
}`,
      javascript: `const fs = require('fs');

class LRUCache {
    constructor(cap) {
        this.cap = cap;
        this.cache = new Map();
    }
    get(key) {
        if (!this.cache.has(key)) return -1;
        const val = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, val);
        return val;
    }
    put(key, val) {
        if (this.cache.has(key)) this.cache.delete(key);
        else if (this.cache.size >= this.cap) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, val);
    }
}

const lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');
if (lines.length >= 2) {
    const cap = parseInt(lines[0].trim());
    const ops = parseInt(lines[1].trim());
    const lru = new LRUCache(cap);
    const res = [];
    for (let i = 2; i < 2 + ops; i++) {
        const parts = lines[i].trim().split(/\\s+/);
        if (parts[0] === 'PUT') lru.put(Number(parts[1]), Number(parts[2]));
        else if (parts[0] === 'GET') res.push(lru.get(Number(parts[1])));
    }
    console.log(res.join(','));
}`,
      cpp: `#include <iostream>
#include <list>
#include <unordered_map>
#include <vector>
using namespace std;

class LRUCache {
    int cap;
    list<pair<int, int>> dll;
    unordered_map<int, list<pair<int, int>>::iterator> mp;
public:
    LRUCache(int capacity) : cap(capacity) {}
    int get(int key) {
        if (!mp.count(key)) return -1;
        dll.splice(dll.begin(), dll, mp[key]);
        return mp[key]->second;
    }
    void put(int key, int value) {
        if (mp.count(key)) {
            dll.splice(dll.begin(), dll, mp[key]);
            mp[key]->second = value;
            return;
        }
        if (dll.size() == cap) {
            mp.erase(dll.back().first);
            dll.pop_back();
        }
        dll.push_front({key, value});
        mp[key] = dll.begin();
    }
};

int main() {
    int cap, ops;
    if (!(cin >> cap >> ops)) return 0;
    LRUCache lru(cap);
    vector<int> res;
    for (int i = 0; i < ops; i++) {
        string cmd; cin >> cmd;
        if (cmd == "PUT") { int k, v; cin >> k >> v; lru.put(k, v); }
        else if (cmd == "GET") { int k; cin >> k; res.push_back(lru.get(k)); }
    }
    for (int i = 0; i < res.size(); i++) cout << res[i] << (i + 1 == res.size() ? "" : ",");
    cout << endl;
    return 0;
}`
    },
    mcqChallenge: {
      question: "Which combination of data structures allows both get and put operations in an LRU Cache to execute in O(1) time?",
      options: [
        "Hash Map + Doubly Linked List",
        "Binary Search Tree + Array",
        "Priority Queue + Singly Linked List",
        "Stack + Queue"
],
      correctIndex: 0,
      explanation: "The Hash Map provides O(1) key-to-node lookup, and the Doubly Linked List allows O(1) node removal and insertion at the head/tail to track recency."
    },
    testCases: [
      { id: 1, input: "2\n4\nPUT 1 1\nPUT 2 2\nGET 1\nGET 2", expectedOutput: "1,2", isHidden: false },
      { id: 2, input: "2\n6\nPUT 1 1\nPUT 2 2\nGET 1\nPUT 3 3\nGET 2\nGET 3", expectedOutput: "1,-1,3", isHidden: false },
      { id: 3, input: "1\n3\nPUT 2 1\nGET 2\nGET 3", expectedOutput: "1,-1", isHidden: true }
    ]
  },

  // 12. Recursion - Climbing Stairs
  {
    id: 12,
    title: "Climbing Stairs",
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.
Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

**Input Format:**
Single integer \`n\`.

**Output Format:**
Single integer count of distinct ways.

**Example 1:**
\`\`\`
Input:
3
Output:
3
Explanation: There are three ways: (1+1+1), (1+2), (2+1).
\`\`\``,
    difficulty: "EASY",
    topic: "Recursion",
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
    optimalSolutionConcept: "Fibonacci recurrence relation: ways(n) = ways(n-1) + ways(n-2) with O(1) state variables.",
    pythonTemplate: `import sys

def climbStairs(n):
    # TODO: Implement Fibonacci DP / recurrence
    pass

if __name__ == '__main__':
    line = sys.stdin.read().strip()
    if line:
        n = int(line)
        res = climbStairs(n)
        print(res if res is not None else 0)`,
    javaTemplate: `import java.util.*;

public class Main {
    public static int climbStairs(int n) {
        // TODO: Implement Fibonacci DP / recurrence
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        int n = Integer.parseInt(sc.nextLine().trim());
        System.out.println(climbStairs(n));
    }
}`,
    javascriptTemplate: `const fs = require('fs');

function climbStairs(n) {
    // TODO: Implement Fibonacci DP / recurrence
    return 0;
}

const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    console.log(climbStairs(parseInt(input)));
}`,
    cppTemplate: `#include <iostream>
using namespace std;

int climbStairs(int n) {
    // TODO: Implement Fibonacci DP / recurrence
    return 0;
}

int main() {
    int n;
    if (cin >> n) {
        cout << climbStairs(n) << endl;
    }
    return 0;
}`,
    solution: {
      python: `import sys

def climbStairs(n):
    # TODO: Implement Fibonacci DP / recurrence
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b

if __name__ == '__main__':
    line = sys.stdin.read().strip()
    if line:
        print(climbStairs(int(line)))`,
      java: `import java.util.*;

public class Main {
    public static int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b; a = b; b = c;
        }
        return b;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) System.out.println(climbStairs(sc.nextInt()));
    }
}`,
      javascript: `const fs = require('fs');
const n = parseInt(fs.readFileSync(0, 'utf-8').trim());
if (!isNaN(n)) {
    if (n <= 2) console.log(n);
    else {
        let a = 1, b = 2;
        for (let i = 3; i <= n; i++) {
            const c = a + b; a = b; b = c;
        }
        console.log(b);
    }
}`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n; if (!(cin >> n)) return 0;
    if (n <= 2) { cout << n << endl; return 0; }
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) { int c = a + b; a = b; b = c; }
    cout << b << endl;
    return 0;
}`
    },
    mcqChallenge: {
      question: "The Climbing Stairs problem (taking 1 or 2 steps) is mathematically equivalent to which well-known mathematical sequence?",
      options: [
        "Fibonacci sequence: f(n) = f(n-1) + f(n-2)",
        "Catalan numbers: C(n) = (2n)! / ((n+1)! * n!)",
        "Harmonic progression",
        "Pascal's Triangle row sums"
],
      correctIndex: 0,
      explanation: "To reach step n, you can come from step n-1 (1 step) or step n-2 (2 steps). Thus, ways(n) = ways(n-1) + ways(n-2), exactly matching the Fibonacci recurrence."
    },
    testCases: [
      { id: 1, input: "2", expectedOutput: "2", isHidden: false },
      { id: 2, input: "3", expectedOutput: "3", isHidden: false },
      { id: 3, input: "4", expectedOutput: "5", isHidden: false },
      { id: 4, input: "5", expectedOutput: "8", isHidden: true },
      { id: 5, input: "10", expectedOutput: "89", isHidden: true }
    ]
  },
  // ----------------------------------------------------
  // 2-MIN RAPID SPRINT MICRO-CHALLENGES (EASY 5-LINES)
  // ----------------------------------------------------
  {
    id: 201,
    title: "Reverse String (Rapid Sprint)",
    description: "Write a function that reverses an input string s.\n\n**Input Format:**\nFirst line: The string s.\n\n**Output Format:**\nThe reversed string.\n\n**Example 1:**\nInput: hello\nOutput: olleh",
    difficulty: "EASY",
    topic: "Strings",
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1) / O(n)",
    optimalSolutionConcept: "Reverse string using slicing in Python or two pointers / StringBuilder.",
    isRapidSprint: true,
    pythonTemplate: `import sys

def reverseString(s):
    # 5-line rapid code:
    return s[::-1]

if __name__ == '__main__':
    input_str = sys.stdin.read().strip()
    print(reverseString(input_str))`,
    javaTemplate: `import java.util.*;

public class Main {
    public static String reverseString(String s) {
        // 5-line rapid code:
        return new StringBuilder(s).reverse().toString();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLine()) {
            System.out.println(reverseString(sc.nextLine().trim()));
        }
    }
}`,
    javascriptTemplate: `const fs = require('fs');

function reverseString(s) {
    // 5-line rapid code:
    return s.split('').reverse().join('');
}

const input = fs.readFileSync(0, 'utf-8').trim();
console.log(reverseString(input));`,
    cppTemplate: `#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    string s;
    if (getline(cin, s)) {
        reverse(s.begin(), s.end());
        cout << s << endl;
    }
    return 0;
}`,
    solution: {
      python: "def reverseString(s):\n    return s[::-1]",
      java: "public class Main {\n    public static String reverseString(String s) {\n        return new StringBuilder(s).reverse().toString();\n    }\n}",
      javascript: "function reverseString(s) {\n    return s.split('').reverse().join('');\n}"
    },
    mcqChallenge: {
      question: "What is the optimal time complexity to reverse an array or string in-place?",
      options: ["O(N) with O(1) auxiliary space", "O(N log N)", "O(N^2)", "O(log N)"],
      correctIndex: 0,
      explanation: "Swapping elements from two ends moving inward processes N/2 pairs, achieving linear O(N) time with O(1) space."
    },
    testCases: [
      { id: 1, input: "hello", expectedOutput: "olleh", isHidden: false },
      { id: 2, input: "kodexis", expectedOutput: "sixedok", isHidden: false },
      { id: 3, input: "algorithm", expectedOutput: "mhtirogla", isHidden: true }
    ]
  },
  {
    id: 202,
    title: "Check Palindrome (Rapid Sprint)",
    description: "Given a string s, return true if it reads the same backward as forward, otherwise return false.\n\n**Input Format:**\nFirst line: The string s.\n\n**Output Format:**\ntrue or false.\n\n**Example 1:**\nInput: racecar\nOutput: true",
    difficulty: "EASY",
    topic: "Strings",
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
    optimalSolutionConcept: "Compare string to its reverse or use two pointers from both ends.",
    isRapidSprint: true,
    pythonTemplate: `import sys

def isPalindrome(s):
    # 5-line rapid code:
    clean = s.lower().strip()
    return "true" if clean == clean[::-1] else "false"

if __name__ == '__main__':
    print(isPalindrome(sys.stdin.read().strip()))`,
    javaTemplate: `import java.util.*;

public class Main {
    public static boolean isPalindrome(String s) {
        String clean = s.trim().toLowerCase();
        int l = 0, r = clean.length() - 1;
        while (l < r) {
            if (clean.charAt(l++) != clean.charAt(r--)) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLine()) {
            System.out.println(isPalindrome(sc.nextLine().trim()));
        }
    }
}`,
    javascriptTemplate: `const fs = require('fs');

function isPalindrome(s) {
    const clean = s.trim().toLowerCase();
    return clean === clean.split('').reverse().join('');
}

const input = fs.readFileSync(0, 'utf-8').trim();
console.log(isPalindrome(input) ? "true" : "false");`,
    cppTemplate: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    if (cin >> s) {
        int l = 0, r = s.length() - 1;
        bool ok = true;
        while (l < r) {
            if (s[l++] != s[r--]) { ok = false; break; }
        }
        cout << (ok ? "true" : "false") << endl;
    }
    return 0;
}`,
    solution: {
      python: "def isPalindrome(s):\n    return s == s[::-1]",
      java: "public class Main {\n    public static boolean isPalindrome(String s) {\n        return s.equals(new StringBuilder(s).reverse().toString());\n    }\n}",
      javascript: "function isPalindrome(s) {\n    return s === s.split('').reverse().join('');\n}"
    },
    mcqChallenge: {
      question: "Which data structure can be used to check if a word is a palindrome by comparing pops to sequential reads?",
      options: ["Stack (LIFO)", "Queue (FIFO)", "Max Heap", "Binary Search Tree"],
      correctIndex: 0,
      explanation: "A Stack naturally reverses characters when popped, matching the palindrome check."
    },
    testCases: [
      { id: 1, input: "racecar", expectedOutput: "true", isHidden: false },
      { id: 2, input: "kodex", expectedOutput: "false", isHidden: false },
      { id: 3, input: "level", expectedOutput: "true", isHidden: true }
    ]
  },
  {
    id: 203,
    title: "Find Maximum Element (Rapid Sprint)",
    description: "Given a comma-separated list of integers, find and return the maximum value.\n\n**Input Format:**\nFirst line: Comma-separated integers.\n\n**Output Format:**\nThe maximum integer value.\n\n**Example 1:**\nInput: 3,11,7,2,99,14\nOutput: 99",
    difficulty: "EASY",
    topic: "Arrays / Hashing",
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
    optimalSolutionConcept: "Iterate through elements maintaining a running max variable.",
    isRapidSprint: true,
    pythonTemplate: `import sys

def findMax(nums):
    # 5-line rapid code:
    return max(nums)

if __name__ == '__main__':
    raw = sys.stdin.read().strip()
    if raw:
        nums = [int(x) for x in raw.split(',') if x.strip()]
        print(findMax(nums))`,
    javaTemplate: `import java.util.*;

public class Main {
    public static int findMax(int[] nums) {
        int max = nums[0];
        for (int n : nums) if (n > max) max = n;
        return max;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLine()) {
            String[] parts = sc.nextLine().trim().split(",");
            int[] nums = new int[parts.length];
            for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i].trim());
            System.out.println(findMax(nums));
        }
    }
}`,
    javascriptTemplate: `const fs = require('fs');

function findMax(nums) {
    return Math.max(...nums);
}

const raw = fs.readFileSync(0, 'utf-8').trim();
if (raw) {
    const nums = raw.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    console.log(findMax(nums));
}`,
    cppTemplate: `#include <iostream>
#include <sstream>
#include <algorithm>
using namespace std;

int main() {
    string line;
    if (getline(cin, line)) {
        stringstream ss(line);
        string token;
        int maxVal = -1e9;
        while (getline(ss, token, ',')) {
            int val = stoi(token);
            if (val > maxVal) maxVal = val;
        }
        cout << maxVal << endl;
    }
    return 0;
}`,
    solution: {
      python: "def findMax(nums):\n    return max(nums)",
      java: "public class Main {\n    public static int findMax(int[] nums) {\n        int m = nums[0]; for (int n : nums) if (n > m) m = n; return m;\n    }\n}",
      javascript: "function findMax(nums) {\n    return Math.max(...nums);\n}"
    },
    mcqChallenge: {
      question: "Can an unsorted array of length N be searched for its maximum element in faster than O(N) time?",
      options: [
        "No, any comparison algorithm must inspect all N elements at least once.",
        "Yes, binary search can find it in O(log N).",
        "Yes, using a hash map in O(1).",
        "Yes, using interpolation search in O(log log N)."
      ],
      correctIndex: 0,
      explanation: "Without prior ordering or structure, the maximum could reside at any uninspected position, necessitating at least N-1 comparisons (O(N) lower bound)."
    },
    testCases: [
      { id: 1, input: "3,11,7,2,99,14", expectedOutput: "99", isHidden: false },
      { id: 2, input: "-10,-5,-20,-1", expectedOutput: "-1", isHidden: false },
      { id: 3, input: "42", expectedOutput: "42", isHidden: true }
    ]
  },
  {
    id: 204,
    title: "Array Sum (Rapid Sprint)",
    description: "Given a comma-separated list of integers, compute the total sum of all elements.\n\n**Input Format:**\nFirst line: Comma-separated integers.\n\n**Output Format:**\nInteger total sum.\n\n**Example 1:**\nInput: 1,2,3,4,5\nOutput: 15",
    difficulty: "EASY",
    topic: "Arrays / Hashing",
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
    optimalSolutionConcept: "Single pass accumulation of array elements.",
    isRapidSprint: true,
    pythonTemplate: `import sys

def arraySum(nums):
    # 5-line rapid code:
    return sum(nums)

if __name__ == '__main__':
    raw = sys.stdin.read().strip()
    if raw:
        nums = [int(x) for x in raw.split(',') if x.strip()]
        print(arraySum(nums))`,
    javaTemplate: `import java.util.*;

public class Main {
    public static int arraySum(int[] nums) {
        int sum = 0;
        for (int n : nums) sum += n;
        return sum;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLine()) {
            String[] parts = sc.nextLine().trim().split(",");
            int[] nums = new int[parts.length];
            for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i].trim());
            System.out.println(arraySum(nums));
        }
    }
}`,
    javascriptTemplate: `const fs = require('fs');

function arraySum(nums) {
    return nums.reduce((a, b) => a + b, 0);
}

const raw = fs.readFileSync(0, 'utf-8').trim();
if (raw) {
    const nums = raw.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    console.log(arraySum(nums));
}`,
    cppTemplate: `#include <iostream>
#include <sstream>
using namespace std;

int main() {
    string line;
    if (getline(cin, line)) {
        stringstream ss(line);
        string token;
        int sum = 0;
        while (getline(ss, token, ',')) {
            sum += stoi(token);
        }
        cout << sum << endl;
    }
    return 0;
}`,
    solution: {
      python: "def arraySum(nums):\n    return sum(nums)",
      java: "public class Main {\n    public static int arraySum(int[] nums) {\n        int s = 0; for (int n : nums) s += n; return s;\n    }\n}",
      javascript: "function arraySum(nums) {\n    return nums.reduce((a, b) => a + b, 0);\n}"
    },
    mcqChallenge: {
      question: "What potential issue must be accounted for when computing the sum of an array of 32-bit integers in C++ or Java?",
      options: [
        "Integer 32-bit arithmetic overflow requiring a 64-bit long accumulator",
        "Stack buffer overflow during loop iteration",
        "Memory fragmentation",
        "Cache thrashing"
      ],
      correctIndex: 0,
      explanation: "Summing many large 32-bit integers can exceed 2^31 - 1, causing overflow wrap-around unless stored in a 64-bit type (long in Java / long long in C++)."
    },
    testCases: [
      { id: 1, input: "1,2,3,4,5", expectedOutput: "15", isHidden: false },
      { id: 2, input: "10,-10,20,-20", expectedOutput: "0", isHidden: false },
      { id: 3, input: "100,200,300", expectedOutput: "600", isHidden: true }
    ]
  },
  {
    id: 205,
    title: "Count Vowels (Rapid Sprint)",
    description: "Given a string s, count and return the number of vowels ('a', 'e', 'i', 'o', 'u') in the string, case-insensitive.\n\n**Input Format:**\nFirst line: The string s.\n\n**Output Format:**\nInteger vowel count.\n\n**Example 1:**\nInput: kodexis\nOutput: 3",
    difficulty: "EASY",
    topic: "Strings",
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
    optimalSolutionConcept: "Iterate through characters and match against vowel set.",
    isRapidSprint: true,
    pythonTemplate: `import sys

def countVowels(s):
    # 5-line rapid code:
    vowels = set("aeiouAEIOU")
    return sum(1 for c in s if c in vowels)

if __name__ == '__main__':
    print(countVowels(sys.stdin.read().strip()))`,
    javaTemplate: `import java.util.*;

public class Main {
    public static int countVowels(String s) {
        int count = 0;
        String v = "aeiouAEIOU";
        for (char c : s.toCharArray()) if (v.indexOf(c) != -1) count++;
        return count;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLine()) {
            System.out.println(countVowels(sc.nextLine().trim()));
        }
    }
}`,
    javascriptTemplate: `const fs = require('fs');

function countVowels(s) {
    const matches = s.match(/[aeiou]/gi);
    return matches ? matches.length : 0;
}

const input = fs.readFileSync(0, 'utf-8').trim();
console.log(countVowels(input));`,
    cppTemplate: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    if (cin >> s) {
        int c = 0;
        for (char ch : s) {
            char lower = tolower(ch);
            if (lower == 'a' || lower == 'e' || lower == 'i' || lower == 'o' || lower == 'u') c++;
        }
        cout << c << endl;
    }
    return 0;
}`,
    solution: {
      python: "def countVowels(s):\n    return sum(1 for c in s.lower() if c in 'aeiou')",
      java: "public class Main {\n    public static int countVowels(String s) {\n        int c = 0; for (char ch : s.toLowerCase().toCharArray()) if (\"aeiou\".indexOf(ch) != -1) c++; return c;\n    }\n}",
      javascript: "function countVowels(s) {\n    return (s.match(/[aeiou]/gi) || []).length;\n}"
    },
    mcqChallenge: {
      question: "What is the membership check lookup time for a Hash Set containing vowels {'a','e','i','o','u'}?",
      options: ["O(1) average time", "O(N)", "O(log N)", "O(N^2)"],
      correctIndex: 0,
      explanation: "A Hash Set evaluates the hash code of the character to perform constant O(1) membership verification."
    },
    testCases: [
      { id: 1, input: "kodexis", expectedOutput: "3", isHidden: false },
      { id: 2, input: "xyz", expectedOutput: "0", isHidden: false },
      { id: 3, input: "education", expectedOutput: "5", isHidden: true }
    ]
  }
];

/**
 * Retrieve a random question, optionally filtering by difficulty and/or topic.
 */
export function getRandomQuestion(difficulty?: string, topic?: string, isSprint?: boolean): Question {
  if (isSprint) {
    // SPRINT MODE: strictly return dedicated rapid sprint micro-challenges (5-line problems)
    const sprintList = QUESTION_BANK.filter(q => q.isRapidSprint);
    if (sprintList.length > 0) {
      return sprintList[Math.floor(Math.random() * sprintList.length)];
    }
  }
  // STANDARD INTERVIEW: strictly filter OUT rapid sprint questions (Two Sum, Valid Parentheses, etc. only)
  let filtered = QUESTION_BANK.filter(q => !q.isRapidSprint);
  
  if (difficulty && difficulty !== 'ALL') {
    const diffUpper = difficulty.toUpperCase();
    const matching = filtered.filter(q => q.difficulty === diffUpper);
    if (matching.length > 0) filtered = matching;
  }

  if (topic && topic !== 'ALL') {
    const topicLower = topic.toLowerCase();
    const matching = filtered.filter(q => q.topic.toLowerCase().includes(topicLower));
    if (matching.length > 0) filtered = matching;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex] || QUESTION_BANK[0];
}

/**
 * Get question by unique ID
 */
export function getQuestionById(id: number | string): Question | undefined {
  const numId = Number(id);
  return QUESTION_BANK.find(q => q.id === numId);
}

/**
 * Get all available questions
 */
export function getAllQuestions(): Question[] {
  return [...QUESTION_BANK];
}

/**
 * Retrieve dedicated 5-line rapid sprint questions for 2-minute fast coding
 */
export function getRapidSprintQuestions(): Question[] {
  return QUESTION_BANK.filter(q => q.isRapidSprint);
}
