/**
 * KODEXIS Multi-Disciplinary Question Bank
 * Comprehensive repository of 20+ algorithmic & systems challenges across 10 core computer science topics.
 * Provides rich starter templates, complexity constraints, and comprehensive test cases.
 */

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
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
  testCases: TestCase[];
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
    javaTemplate: `import java.util.*;

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
    javascriptTemplate: `const fs = require('fs');

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
    cppTemplate: `#include <iostream>
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
}`,
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
    javaTemplate: `import java.util.*;

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
    javascriptTemplate: `const fs = require('fs');

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
    cppTemplate: `#include <iostream>
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
}`,
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
    javaTemplate: `import java.util.*;

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
    javascriptTemplate: `const fs = require('fs');

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
    cppTemplate: `#include <iostream>
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
}`,
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
    javaTemplate: `import java.util.*;

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
    javascriptTemplate: `const fs = require('fs');

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
    cppTemplate: `#include <iostream>
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
}`,
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
    filtered = [c.lower() for c in s if c.isalnum()]
    return "true" if filtered == filtered[::-1] else "false"

if __name__ == '__main__':
    s = sys.stdin.read().strip()
    print(isPalindrome(s))`,
    javaTemplate: `import java.util.*;

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
    javascriptTemplate: `const fs = require('fs');

function isPalindrome(s) {
    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return clean === clean.split('').reverse().join('') ? "true" : "false";
}

const input = fs.readFileSync(0, 'utf-8').trim();
console.log(isPalindrome(input));`,
    cppTemplate: `#include <iostream>
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
}`,
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
    title: "Maximum Subarray (Kadane's Algorithm)",
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
    optimalSolutionConcept: "Kadane's Algorithm: Maintain running max ending at i, resetting to nums[i] if negative.",
    pythonTemplate: `import sys

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
    javaTemplate: `import java.util.*;

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
    javascriptTemplate: `const fs = require('fs');

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
    cppTemplate: `#include <iostream>
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
}`,
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
    javaTemplate: `import java.util.*;

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
    javascriptTemplate: `const fs = require('fs');

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
    cppTemplate: `#include <iostream>
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
}`,
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
    javaTemplate: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String[] parts = sc.nextLine().trim().split(",");
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
        System.out.println(String.join(",", res));
    }
}`,
    javascriptTemplate: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const parts = input.split(',');
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
    console.log(res.join(','));
}`,
    cppTemplate: `#include <iostream>
#include <vector>
#include <sstream>
#include <algorithm>
using namespace std;

int main() {
    string line; if (!(cin >> line)) return 0;
    stringstream ss(line); string tok; vector<string> v;
    while (getline(ss, tok, ',')) v.push_back(tok);
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
    for (int i = 0; i < res.size(); i++) {
        cout << res[i] << (i + 1 == res.size() ? "" : ",");
    }
    cout << endl;
    return 0;
}`,
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
    return ",".join(map(str, reversed(arr)))

if __name__ == '__main__':
    line = sys.stdin.read().strip()
    if line:
        arr = [int(x) for x in line.split(',') if x.strip()]
        print(reverseList(arr))`,
    javaTemplate: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String[] parts = sc.nextLine().trim().split(",");
        Collections.reverse(Arrays.asList(parts));
        System.out.println(String.join(",", parts));
    }
}`,
    javascriptTemplate: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    console.log(input.split(',').reverse().join(','));
}`,
    cppTemplate: `#include <iostream>
#include <vector>
#include <sstream>
#include <algorithm>
using namespace std;

int main() {
    string line; if (!(cin >> line)) return 0;
    stringstream ss(line); string tok; vector<string> v;
    while (getline(ss, tok, ',')) v.push_back(tok);
    reverse(v.begin(), v.end());
    for (size_t i = 0; i < v.size(); i++) cout << v[i] << (i + 1 == v.size() ? "" : ",");
    cout << endl;
    return 0;
}`,
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
    optimalSolutionConcept: "Breadth-First Search (BFS) or Depth-First Search (DFS) grid flood fill sinking visited lands to '0'.",
    pythonTemplate: `import sys

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
    javaTemplate: `import java.util.*;

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
    javascriptTemplate: `const fs = require('fs');

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
    cppTemplate: `#include <iostream>
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
}`,
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
        self.cap = capacity
        self.cache = {}
    
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
    javaTemplate: `import java.util.*;

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
    javascriptTemplate: `const fs = require('fs');

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
    cppTemplate: `#include <iostream>
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
}`,
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
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b

if __name__ == '__main__':
    line = sys.stdin.read().strip()
    if line:
        print(climbStairs(int(line)))`,
    javaTemplate: `import java.util.*;

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
    javascriptTemplate: `const fs = require('fs');
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
    cppTemplate: `#include <iostream>
using namespace std;

int main() {
    int n; if (!(cin >> n)) return 0;
    if (n <= 2) { cout << n << endl; return 0; }
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) { int c = a + b; a = b; b = c; }
    cout << b << endl;
    return 0;
}`,
    testCases: [
      { id: 1, input: "2", expectedOutput: "2", isHidden: false },
      { id: 2, input: "3", expectedOutput: "3", isHidden: false },
      { id: 3, input: "4", expectedOutput: "5", isHidden: false },
      { id: 4, input: "5", expectedOutput: "8", isHidden: true },
      { id: 5, input: "10", expectedOutput: "89", isHidden: true }
    ]
  }
];

/**
 * Retrieve a random question, optionally filtering by difficulty and/or topic.
 */
export function getRandomQuestion(difficulty?: string, topic?: string): Question {
  let filtered = [...QUESTION_BANK];
  
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
