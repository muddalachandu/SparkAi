// DSA Sheet — 375 Questions | Topic-Wise with Company Tags
// Source: https://dsa.apnacollege.in/
// Topics ordered exactly as in source, split into parts like Arrays (Part 1), Arrays (Part 2), etc.

export type DSAQuestion = {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  url: string;
  companies: string[];
};

export type DSATopic = {
  id: string;
  name: string;
  color: string;
  questions: DSAQuestion[];
};

export const DSA_SHEET_TOPICS: DSATopic[] = [
  // ─── Arrays ──────────────────────────────────────────────────────────────
  {
    id: "arrays-1",
    name: "Arrays (Part 1)",
    color: "blue",
    questions: [
      { id: 1,  title: "Maximum and Minimum Element in an Array", difficulty: "Easy",   url: "https://www.geeksforgeeks.org/maximum-and-minimum-in-an-array/",                                                        companies: ["Amazon","Microsoft","Google","Adobe","Cisco","Hike","Snapdeal","VMware","Accolite","ABCO"] },
      { id: 2,  title: "Reverse the Array",                        difficulty: "Easy",   url: "https://www.geeksforgeeks.org/write-a-program-to-reverse-an-array-or-string/",                                         companies: ["Infosys","Moonfrog Labs","Microsoft"] },
      { id: 3,  title: "Maximum Subarray (Kadane's Algorithm)",    difficulty: "Easy",   url: "https://leetcode.com/problems/maximum-subarray/",                                                                       companies: ["Microsoft","Facebook","Amazon","Google","Samsung"] },
      { id: 4,  title: "Contains Duplicate",                       difficulty: "Easy",   url: "https://leetcode.com/problems/contains-duplicate/",                                                                     companies: ["Amazon","Google","Apple"] },
      { id: 5,  title: "Chocolate Distribution Problem",           difficulty: "Easy",   url: "https://www.geeksforgeeks.org/chocolate-distribution-problem/",                                                        companies: ["Amazon","Directi"] },
      { id: 6,  title: "Search an Element in a Sorted and Pivoted Array", difficulty: "Easy", url: "https://www.geeksforgeeks.org/search-an-element-in-a-sorted-and-pivoted-array/",                                 companies: ["Microsoft","Google","Adobe","Amazon","D-E-Shaw","Flipkart","Hike","Intuit","MakeMyTrip","Paytm"] },
      { id: 7,  title: "Next Permutation",                         difficulty: "Medium", url: "https://leetcode.com/problems/next-permutation/",                                                                      companies: ["Uber","Goldman Sachs","Adobe","Google","Microsoft","infoBEADS"] },
      { id: 8,  title: "Best Time to Buy and Sell Stock",          difficulty: "Medium", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",                                                       companies: ["Amazon","D-E-Shaw","Directi","Flipkart","Goldman Sachs","Intuit","MakeMyTrip","Microsoft","Ola","Oracle","Paytm","Pubmatic","Quikr","Salesforce","Sapient","Swiggy","Walmart","Media.net","Google"] },
      { id: 9,  title: "Repeat and Missing Number Array",          difficulty: "Medium", url: "https://www.interviewbit.com/problems/repeat-and-missing-number-array/",                                               companies: ["Amazon","Paytm","OYO Rooms"] },
      { id: 10, title: "Kth Largest Element in an Array",          difficulty: "Medium", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/",                                                       companies: ["Amazon","Microsoft","Walmart","Adobe","Facebook"] },
      { id: 11, title: "Trapping Rain Water",                      difficulty: "Hard",   url: "https://leetcode.com/problems/trapping-rain-water/",                                                                   companies: ["Samsung","Amazon","Google","Microsoft","Facebook","Adobe"] },
      { id: 12, title: "Product of Array Except Self",             difficulty: "Medium", url: "https://leetcode.com/problems/product-of-array-except-self/",                                                          companies: ["Microsoft","Facebook","Amazon","Lyft","Asana"] },
      { id: 13, title: "Maximum Product Subarray",                 difficulty: "Medium", url: "https://leetcode.com/problems/maximum-product-subarray/",                                                              companies: ["Amazon","D-E-Shaw","Microsoft","Morgan Stanley","OYO Rooms","Google","Flipkart"] },
    ]
  },
  {
    id: "arrays-2",
    name: "Arrays (Part 2)",
    color: "blue",
    questions: [
      { id: 14, title: "Find Minimum in Rotated Sorted Array",     difficulty: "Medium", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",                                                  companies: ["Adobe","Amazon","Microsoft","Morgan Stanley","Samsung","Snapdeal","Times Internet"] },
      { id: 15, title: "Search in Rotated Sorted Array",           difficulty: "Medium", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/",                                                       companies: ["Microsoft","Google","Apple","Amazon","Facebook"] },
      { id: 16, title: "3Sum",                                     difficulty: "Medium", url: "https://leetcode.com/problems/3sum/",                                                                                   companies: ["Adobe","Amazon","Microsoft","Morgan Stanley","Samsung","Snapdeal","Times Internet","Google"] },
      { id: 17, title: "Container With Most Water",                difficulty: "Medium", url: "https://leetcode.com/problems/container-with-most-water/",                                                             companies: ["Flipkart","Dunzo","Google","Amazon"] },
      { id: 18, title: "Given Sum Pair",                           difficulty: "Easy",   url: "https://www.geeksforgeeks.org/given-a-sorted-and-rotated-array-find-if-there-is-a-pair-with-a-given-sum/",            companies: ["Infosys","Amazon","Flipkart"] },
      { id: 19, title: "Kth Smallest Element",                     difficulty: "Medium", url: "https://practice.geeksforgeeks.org/problems/kth-smallest-element5635/1",                                               companies: ["Amazon","Microsoft","Google","Adobe","Cisco","ABCO","Accolite","Hike","Snapdeal","VMware"] },
      { id: 20, title: "Merge Overlapping Intervals",              difficulty: "Medium", url: "https://www.geeksforgeeks.org/merging-intervals/",                                                                     companies: ["Google","Amazon","Microsoft","Facebook","Bloomberg"] },
      { id: 21, title: "Find Minimum Number of Merge Operations to Make an Array Palindrome", difficulty: "Medium", url: "https://www.geeksforgeeks.org/find-minimum-number-of-merge-operations-to-make-an-array-palindrome/", companies: ["Amazon"] },
      { id: 22, title: "Given an Array of Numbers Arrange the Numbers to Form the Biggest Number", difficulty: "Medium", url: "https://www.geeksforgeeks.org/given-an-array-of-numbers-arrange-the-numbers-to-form-the-biggest-number/", companies: ["Barclays","Amazon"] },
      { id: 23, title: "Space Optimization Using Bit Manipulations", difficulty: "Medium", url: "https://www.geeksforgeeks.org/space-optimization-using-bit-manipulations/",                                          companies: ["Amazon"] },
      { id: 24, title: "Subarray Sum Divisible by K",              difficulty: "Hard",   url: "https://www.geeksforgeeks.org/longest-subarray-sum-divisible-k/",                                                     companies: ["Snapdeal","Microsoft"] },
      { id: 25, title: "Print all Possible Combinations of r Elements in a Given Array of Size n", difficulty: "Hard", url: "https://www.geeksforgeeks.org/print-all-possible-combinations-of-r-elements-in-a-given-array-of-size-n/", companies: ["Amazon"] },
      { id: 26, title: "Mo's Algorithm",                           difficulty: "Hard",   url: "https://www.geeksforgeeks.org/mos-algorithm-query-square-root-decomposition-set-1-introduction/",                    companies: ["Microsoft"] },
    ]
  },

  // ─── Strings ─────────────────────────────────────────────────────────────
  {
    id: "strings",
    name: "Strings",
    color: "purple",
    questions: [
      { id: 27, title: "Valid Palindrome",                                  difficulty: "Easy",   url: "https://leetcode.com/problems/valid-palindrome/",                                                            companies: ["Amazon","Cisco","D-E-Shaw","Facebook","FactSet","Morgan Stanley","Paytm","Zoho","Capgemini"] },
      { id: 28, title: "Valid Anagram",                                     difficulty: "Easy",   url: "https://leetcode.com/problems/valid-anagram/",                                                               companies: ["Nagarro","Media.net","Directi","Google","Adobe","Flipkart"] },
      { id: 29, title: "Valid Parentheses",                                 difficulty: "Easy",   url: "https://leetcode.com/problems/valid-parentheses/",                                                           companies: ["Google","Amazon","Microsoft","Facebook","Adobe"] },
      { id: 30, title: "Remove Consecutive Characters",                     difficulty: "Easy",   url: "https://practice.geeksforgeeks.org/problems/consecutive-elements2306/1",                                     companies: ["Samsung","Adobe"] },
      { id: 31, title: "Longest Common Prefix",                             difficulty: "Easy",   url: "https://leetcode.com/problems/longest-common-prefix/",                                                       companies: ["Adobe","Grofers","Dunzo","Google"] },
      { id: 32, title: "Convert a Sentence into its Equivalent Mobile Numeric Keypad Sequence", difficulty: "Easy", url: "https://www.geeksforgeeks.org/convert-sentence-equivalent-mobile-numeric-keypad-sequence/", companies: ["Adobe"] },
      { id: 33, title: "Print all the Duplicates in the Input String",      difficulty: "Easy",   url: "https://www.geeksforgeeks.org/print-all-the-duplicates-in-the-input-string/",                                companies: ["Ola","Amdocs"] },
      { id: 34, title: "Longest Substring without Repeating Characters",    difficulty: "Medium", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",                              companies: ["Morgan Stanley","Amazon","Google","Facebook","Microsoft","Uber"] },
      { id: 35, title: "Longest Repeating Character Replacement",           difficulty: "Medium", url: "https://leetcode.com/problems/longest-repeating-character-replacement/",                                     companies: ["Amazon","Google"] },
      { id: 36, title: "Group Anagrams",                                    difficulty: "Medium", url: "https://leetcode.com/problems/group-anagrams/",                                                               companies: ["Samsung","Adobe","Amazon","Google","Facebook"] },
      { id: 37, title: "Longest Palindromic Substring",                     difficulty: "Medium", url: "https://leetcode.com/problems/longest-palindromic-substring/",                                               companies: ["Microsoft","Google","Samsung","Visa"] },
      { id: 38, title: "Palindromic Substrings",                            difficulty: "Medium", url: "https://leetcode.com/problems/palindromic-substrings/",                                                      companies: ["Microsoft","Facebook"] },
      { id: 39, title: "Next Permutation (Strings)",                        difficulty: "Medium", url: "https://practice.geeksforgeeks.org/problems/next-permutation5226/1",                                         companies: ["Adobe","Goldman Sachs","Uber"] },
    ]
  },

  // ─── Linked List ─────────────────────────────────────────────────────────
  {
    id: "linked-list-1",
    name: "Linked List (Part 1)",
    color: "green",
    questions: [
      { id: 40, title: "Reverse a Linked List",                             difficulty: "Easy",   url: "https://leetcode.com/problems/reverse-linked-list/",                                                         companies: ["Amazon","Adobe","Microsoft","Facebook","Apple","Uber","Google","Paytm","Zoho"] },
      { id: 41, title: "Middle of the Linked List",                         difficulty: "Easy",   url: "https://leetcode.com/problems/middle-of-the-linked-list/",                                                   companies: ["Amazon","Microsoft","Google","Adobe"] },
      { id: 42, title: "Merge Two Sorted Lists",                            difficulty: "Easy",   url: "https://leetcode.com/problems/merge-two-sorted-lists/",                                                      companies: ["Amazon","Microsoft","Apple","Google","Bloomberg","Accolite"] },
      { id: 43, title: "Remove Nth Node From End of List",                  difficulty: "Medium", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",                                            companies: ["Amazon","Microsoft","Apple","Bloomberg","Facebook"] },
      { id: 44, title: "Linked List Cycle",                                 difficulty: "Easy",   url: "https://leetcode.com/problems/linked-list-cycle/",                                                           companies: ["Amazon","Bloomberg","Microsoft","Adobe","Belzabar"] },
      { id: 45, title: "Linked List Cycle II (Floyd's Algorithm)",          difficulty: "Medium", url: "https://leetcode.com/problems/linked-list-cycle-ii/",                                                        companies: ["Amazon","Microsoft","Bloomberg","Hike"] },
      { id: 46, title: "Palindrome Linked List",                            difficulty: "Easy",   url: "https://leetcode.com/problems/palindrome-linked-list/",                                                      companies: ["Amazon","Facebook","Uber","Microsoft"] },
      { id: 47, title: "Reorder List",                                      difficulty: "Medium", url: "https://leetcode.com/problems/reorder-list/",                                                                companies: ["Amazon","Bloomberg"] },
      { id: 48, title: "LRU Cache",                                         difficulty: "Medium", url: "https://leetcode.com/problems/lru-cache/",                                                                   companies: ["Amazon","Microsoft","Bloomberg","Google","Uber","Facebook","Paytm","Oracle"] },
    ]
  },
  {
    id: "linked-list-2",
    name: "Linked List (Part 2)",
    color: "green",
    questions: [
      { id: 49, title: "Copy List with Random Pointer",                      difficulty: "Medium", url: "https://leetcode.com/problems/copy-list-with-random-pointer/",                                              companies: ["Amazon","Microsoft","Bloomberg","Google"] },
      { id: 50, title: "Sort List",                                          difficulty: "Medium", url: "https://leetcode.com/problems/sort-list/",                                                                  companies: ["Facebook","Amazon","Google"] },
      { id: 51, title: "Merge K Sorted Lists",                               difficulty: "Hard",   url: "https://leetcode.com/problems/merge-k-sorted-lists/",                                                      companies: ["Amazon","Microsoft","Uber","Google","Facebook","LinkedIn","Airbnb"] },
      { id: 52, title: "Reverse Nodes in k-Group",                           difficulty: "Hard",   url: "https://leetcode.com/problems/reverse-nodes-in-k-group/",                                                  companies: ["Microsoft","Amazon","Facebook","Google"] },
      { id: 53, title: "Remove Duplicates from Sorted List",                 difficulty: "Easy",   url: "https://leetcode.com/problems/remove-duplicates-from-sorted-list/",                                         companies: ["Microsoft","Amazon","Qualcomm","Cognizant"] },
      { id: 54, title: "Add Two Numbers",                                    difficulty: "Medium", url: "https://leetcode.com/problems/add-two-numbers/",                                                            companies: ["Amazon","Microsoft","Bloomberg","Airbnb","Facebook","Google"] },
      { id: 55, title: "Intersection of Two Linked Lists",                   difficulty: "Easy",   url: "https://leetcode.com/problems/intersection-of-two-linked-lists/",                                          companies: ["Amazon","Microsoft","Bloomberg","Airbnb"] },
    ]
  },

  // ─── Binary Trees ────────────────────────────────────────────────────────
  {
    id: "trees-1",
    name: "Binary Trees (Part 1)",
    color: "teal",
    questions: [
      { id: 56, title: "Inorder Traversal",                                  difficulty: "Easy",   url: "https://leetcode.com/problems/binary-tree-inorder-traversal/",                                             companies: ["Amazon","Microsoft","Bloomberg","Facebook","Adobe","Samsung"] },
      { id: 57, title: "Preorder Traversal",                                  difficulty: "Easy",   url: "https://leetcode.com/problems/binary-tree-preorder-traversal/",                                            companies: ["Amazon","Microsoft","Adobe"] },
      { id: 58, title: "Postorder Traversal",                                 difficulty: "Easy",   url: "https://leetcode.com/problems/binary-tree-postorder-traversal/",                                           companies: ["Amazon","Microsoft","Adobe"] },
      { id: 59, title: "Maximum Depth of Binary Tree",                        difficulty: "Easy",   url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",                                              companies: ["Amazon","LinkedIn","Apple","Facebook","Adobe"] },
      { id: 60, title: "Same Tree",                                           difficulty: "Easy",   url: "https://leetcode.com/problems/same-tree/",                                                                 companies: ["Bloomberg","Amazon","Microsoft"] },
      { id: 61, title: "Symmetric Tree",                                      difficulty: "Easy",   url: "https://leetcode.com/problems/symmetric-tree/",                                                            companies: ["LinkedIn","Bloomberg","Microsoft","Adobe"] },
      { id: 62, title: "Binary Tree Level Order Traversal",                   difficulty: "Medium", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",                                         companies: ["Amazon","Facebook","Bloomberg","Microsoft","Uber","ByteDance"] },
      { id: 63, title: "Binary Tree Zigzag Level Order Traversal",            difficulty: "Medium", url: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",                                  companies: ["Amazon","LinkedIn","Bloomberg","Microsoft"] },
      { id: 64, title: "Path Sum",                                            difficulty: "Easy",   url: "https://leetcode.com/problems/path-sum/",                                                                  companies: ["Amazon","Microsoft","Bloomberg"] },
      { id: 65, title: "Binary Tree Maximum Path Sum",                        difficulty: "Hard",   url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",                                              companies: ["Amazon","Microsoft","Facebook","Google","Baidu"] },
    ]
  },
  {
    id: "trees-2",
    name: "Binary Trees (Part 2)",
    color: "teal",
    questions: [
      { id: 66, title: "Lowest Common Ancestor of Binary Tree",               difficulty: "Medium", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",                                   companies: ["Facebook","Amazon","Microsoft","LinkedIn","Uber","Coursera"] },
      { id: 67, title: "Binary Tree Right Side View",                         difficulty: "Medium", url: "https://leetcode.com/problems/binary-tree-right-side-view/",                                               companies: ["Facebook","Amazon","Microsoft","Google"] },
      { id: 68, title: "Count Good Nodes in Binary Tree",                     difficulty: "Medium", url: "https://leetcode.com/problems/count-good-nodes-in-binary-tree/",                                           companies: ["Microsoft","Google"] },
      { id: 69, title: "Validate Binary Search Tree",                         difficulty: "Medium", url: "https://leetcode.com/problems/validate-binary-search-tree/",                                               companies: ["Amazon","Bloomberg","Facebook","Microsoft","Adobe","Apple"] },
      { id: 70, title: "Kth Smallest Element in a BST",                       difficulty: "Medium", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",                                             companies: ["Facebook","Amazon","Bloomberg","Microsoft","Uber","Zillow"] },
      { id: 71, title: "Construct Binary Tree from Preorder and Inorder",     difficulty: "Medium", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",                 companies: ["Amazon","Microsoft","Bloomberg","Facebook","Apple"] },
      { id: 72, title: "Serialize and Deserialize Binary Tree",               difficulty: "Hard",   url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",                                     companies: ["Amazon","Microsoft","Facebook","Google","LinkedIn","Palantir"] },
      { id: 73, title: "Convert Sorted Array to Binary Search Tree",          difficulty: "Easy",   url: "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/",                                companies: ["Airbnb","Amazon","Microsoft"] },
      { id: 74, title: "Invert Binary Tree",                                  difficulty: "Easy",   url: "https://leetcode.com/problems/invert-binary-tree/",                                                        companies: ["Amazon","Google","Uber","Apple"] },
    ]
  },
  {
    id: "trees-3",
    name: "Binary Trees (Part 3 — BST)",
    color: "teal",
    questions: [
      { id: 75, title: "Insert into a Binary Search Tree",                    difficulty: "Medium", url: "https://leetcode.com/problems/insert-into-a-binary-search-tree/",                                          companies: ["Amazon","Microsoft","Bloomberg"] },
      { id: 76, title: "Delete Node in a BST",                               difficulty: "Medium", url: "https://leetcode.com/problems/delete-node-in-a-bst/",                                                     companies: ["Amazon","Facebook","Bloomberg"] },
      { id: 77, title: "Search in a Binary Search Tree",                      difficulty: "Easy",   url: "https://leetcode.com/problems/search-in-a-binary-search-tree/",                                            companies: ["Amazon","Oracle","Microsoft"] },
      { id: 78, title: "Lowest Common Ancestor of BST",                       difficulty: "Medium", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",                            companies: ["Amazon","Facebook","Bloomberg","LinkedIn","Adobe"] },
      { id: 79, title: "Two Sum IV - Input is a BST",                         difficulty: "Easy",   url: "https://leetcode.com/problems/two-sum-iv-input-is-a-bst/",                                                 companies: ["Amazon","Facebook"] },
      { id: 80, title: "Flatten Binary Tree to Linked List",                  difficulty: "Medium", url: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/",                                        companies: ["Microsoft","Amazon","Mathworks"] },
      { id: 81, title: "Binary Tree from Inorder and Postorder",              difficulty: "Medium", url: "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/",                companies: ["Amazon","Microsoft"] },
    ]
  },

  // ─── Graph ───────────────────────────────────────────────────────────────
  {
    id: "graphs-1",
    name: "Graphs (Part 1)",
    color: "pink",
    questions: [
      { id: 82, title: "Number of Islands",                                   difficulty: "Medium", url: "https://leetcode.com/problems/number-of-islands/",                                                         companies: ["Amazon","Bloomberg","Facebook","Google","Microsoft","Uber","DoorDash"] },
      { id: 83, title: "Clone Graph",                                         difficulty: "Medium", url: "https://leetcode.com/problems/clone-graph/",                                                               companies: ["Facebook","Amazon","Bloomberg","Google"] },
      { id: 84, title: "Max Area of Island",                                  difficulty: "Medium", url: "https://leetcode.com/problems/max-area-of-island/",                                                        companies: ["Amazon","Facebook","DoorDash","Google"] },
      { id: 85, title: "Pacific Atlantic Water Flow",                         difficulty: "Medium", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/",                                               companies: ["Google","Amazon","Goldman Sachs"] },
      { id: 86, title: "Surrounded Regions",                                  difficulty: "Medium", url: "https://leetcode.com/problems/surrounded-regions/",                                                        companies: ["Amazon","Snapchat"] },
      { id: 87, title: "Rotting Oranges",                                     difficulty: "Medium", url: "https://leetcode.com/problems/rotting-oranges/",                                                           companies: ["Amazon","Bloomberg","Facebook","Adobe"] },
      { id: 88, title: "Course Schedule",                                     difficulty: "Medium", url: "https://leetcode.com/problems/course-schedule/",                                                           companies: ["Amazon","Apple","Airbnb","Bloomberg","Facebook","Zenefits","Robinhood"] },
      { id: 89, title: "Course Schedule II",                                  difficulty: "Medium", url: "https://leetcode.com/problems/course-schedule-ii/",                                                        companies: ["Amazon","Facebook","Bloomberg","Google","Uber","Quora"] },
      { id: 90, title: "Detect Cycle in Directed Graph",                      difficulty: "Medium", url: "https://www.geeksforgeeks.org/detect-cycle-in-a-graph/",                                                   companies: ["Samsung","Microsoft","Amazon"] },
    ]
  },
  {
    id: "graphs-2",
    name: "Graphs (Part 2 — Shortest Path)",
    color: "pink",
    questions: [
      { id: 91, title: "Number of Connected Components in Undirected Graph",  difficulty: "Medium", url: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",                    companies: ["LinkedIn","Google","Amazon","Facebook"] },
      { id: 92, title: "Graph Valid Tree",                                    difficulty: "Medium", url: "https://leetcode.com/problems/graph-valid-tree/",                                                          companies: ["LinkedIn","Google","Apple"] },
      { id: 93, title: "Word Ladder",                                         difficulty: "Hard",   url: "https://leetcode.com/problems/word-ladder/",                                                               companies: ["Amazon","Facebook","Bloomberg","LinkedIn","Snapchat","Yelp"] },
      { id: 94, title: "Alien Dictionary",                                    difficulty: "Hard",   url: "https://leetcode.com/problems/alien-dictionary/",                                                          companies: ["Google","Facebook","Airbnb","Snapchat","Pocket Gems","Uber"] },
      { id: 95, title: "Dijkstra's Algorithm (Shortest Path)",                difficulty: "Medium", url: "https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/",                          companies: ["Amazon","Google","Microsoft","Uber","LinkedIn","Flipkart"] },
      { id: 96, title: "Redundant Connection",                                difficulty: "Medium", url: "https://leetcode.com/problems/redundant-connection/",                                                      companies: ["Amazon","Google"] },
      { id: 97, title: "Network Delay Time",                                  difficulty: "Medium", url: "https://leetcode.com/problems/network-delay-time/",                                                        companies: ["Google","Amazon","Bloomberg"] },
      { id: 98, title: "Cheapest Flights Within K Stops",                    difficulty: "Medium", url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/",                                           companies: ["Amazon","Google","Facebook","Booking.com","Grab"] },
    ]
  },

  // ─── Stacks ──────────────────────────────────────────────────────────────
  {
    id: "stacks",
    name: "Stacks",
    color: "orange",
    questions: [
      { id: 99,  title: "Valid Parentheses",                                  difficulty: "Easy",   url: "https://leetcode.com/problems/valid-parentheses/",                                                         companies: ["Amazon","Bloomberg","Microsoft","Facebook","Google","Adobe"] },
      { id: 100, title: "Min Stack",                                          difficulty: "Easy",   url: "https://leetcode.com/problems/min-stack/",                                                                 companies: ["Amazon","Microsoft","Bloomberg","Uber","Apple"] },
      { id: 101, title: "Next Greater Element I",                             difficulty: "Easy",   url: "https://leetcode.com/problems/next-greater-element-i/",                                                    companies: ["Google","Amazon","Microsoft","Bloomberg"] },
      { id: 102, title: "Daily Temperatures",                                 difficulty: "Medium", url: "https://leetcode.com/problems/daily-temperatures/",                                                        companies: ["Google","Amazon","Uber","Bloomberg"] },
      { id: 103, title: "Evaluate Reverse Polish Notation",                   difficulty: "Medium", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/",                                          companies: ["LinkedIn","Amazon","eBay","Google"] },
      { id: 104, title: "Generate Parentheses",                               difficulty: "Medium", url: "https://leetcode.com/problems/generate-parentheses/",                                                      companies: ["Google","Amazon","Microsoft","Facebook","Twitter"] },
      { id: 105, title: "Largest Rectangle in Histogram",                     difficulty: "Hard",   url: "https://leetcode.com/problems/largest-rectangle-in-histogram/",                                            companies: ["Amazon","Google","Microsoft","Nvidia"] },
      { id: 106, title: "Sliding Window Maximum",                             difficulty: "Hard",   url: "https://leetcode.com/problems/sliding-window-maximum/",                                                    companies: ["Amazon","Google","Microsoft","LinkedIn","Zenefits"] },
      { id: 107, title: "Implement Stack using Queues",                       difficulty: "Easy",   url: "https://leetcode.com/problems/implement-stack-using-queues/",                                              companies: ["Amazon","Microsoft","Bloomberg"] },
    ]
  },

  // ─── Queues ──────────────────────────────────────────────────────────────
  {
    id: "queues",
    name: "Queues",
    color: "orange",
    questions: [
      { id: 108, title: "Implement Queue using Stacks",                       difficulty: "Easy",   url: "https://leetcode.com/problems/implement-queue-using-stacks/",                                              companies: ["Microsoft","Amazon","Bloomberg"] },
      { id: 109, title: "Design Circular Queue",                              difficulty: "Medium", url: "https://leetcode.com/problems/design-circular-queue/",                                                     companies: ["Microsoft","Google","Apple"] },
      { id: 110, title: "Number of Recent Calls",                             difficulty: "Easy",   url: "https://leetcode.com/problems/number-of-recent-calls/",                                                    companies: ["Google","Amazon"] },
      { id: 111, title: "Walls and Gates",                                    difficulty: "Medium", url: "https://leetcode.com/problems/walls-and-gates/",                                                           companies: ["Facebook","Google","Amazon"] },
      { id: 112, title: "Shortest Path in Binary Matrix",                     difficulty: "Medium", url: "https://leetcode.com/problems/shortest-path-in-binary-matrix/",                                            companies: ["Amazon","Google","Facebook","Bloomberg"] },
    ]
  },

  // ─── Binary Heaps ────────────────────────────────────────────────────────
  {
    id: "binary-heaps",
    name: "Binary Heaps",
    color: "rose",
    questions: [
      { id: 113, title: "Kth Largest Element in an Array",                    difficulty: "Medium", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/",                                           companies: ["Amazon","Facebook","Google","Microsoft","Walmart","Adobe"] },
      { id: 114, title: "Top K Frequent Elements",                            difficulty: "Medium", url: "https://leetcode.com/problems/top-k-frequent-elements/",                                                   companies: ["Amazon","Facebook","Google","Yelp","Roblox"] },
      { id: 115, title: "Find Median from Data Stream",                       difficulty: "Hard",   url: "https://leetcode.com/problems/find-median-from-data-stream/",                                              companies: ["Amazon","Microsoft","Bloomberg","Google","Twitter"] },
      { id: 116, title: "Task Scheduler",                                     difficulty: "Medium", url: "https://leetcode.com/problems/task-scheduler/",                                                            companies: ["Facebook","Microsoft","Amazon","Coupang"] },
      { id: 117, title: "Design Twitter",                                     difficulty: "Medium", url: "https://leetcode.com/problems/design-twitter/",                                                            companies: ["Amazon","Facebook","Twitter","Bloomberg"] },
      { id: 118, title: "K Closest Points to Origin",                         difficulty: "Medium", url: "https://leetcode.com/problems/k-closest-points-to-origin/",                                               companies: ["Amazon","Facebook","Google","LinkedIn","Asana"] },
    ]
  },

  // ─── Hashmaps ────────────────────────────────────────────────────────────
  {
    id: "hashmaps",
    name: "Hashmaps",
    color: "amber",
    questions: [
      { id: 119, title: "Two Sum",                                            difficulty: "Easy",   url: "https://leetcode.com/problems/two-sum/",                                                                   companies: ["Amazon","Adobe","Apple","Bloomberg","Facebook","Google","Microsoft","Uber","Yahoo","Dropbox","Airbnb"] },
      { id: 120, title: "Longest Consecutive Sequence",                       difficulty: "Medium", url: "https://leetcode.com/problems/longest-consecutive-sequence/",                                              companies: ["Google","Amazon","Microsoft","Facebook","Wish","Bloomberg"] },
      { id: 121, title: "Subarray Sum Equals K",                              difficulty: "Medium", url: "https://leetcode.com/problems/subarray-sum-equals-k/",                                                     companies: ["Facebook","Amazon","Google","Microsoft","Snapchat"] },
      { id: 122, title: "Four Sum",                                           difficulty: "Medium", url: "https://leetcode.com/problems/4sum/",                                                                      companies: ["Amazon","Google","Yahoo","Adobe"] },
      { id: 123, title: "Encode and Decode Strings",                          difficulty: "Medium", url: "https://leetcode.com/problems/encode-and-decode-strings/",                                                 companies: ["Google","Facebook","Amazon","Snapchat"] },
      { id: 124, title: "Valid Sudoku",                                       difficulty: "Medium", url: "https://leetcode.com/problems/valid-sudoku/",                                                              companies: ["Amazon","Uber","Apple","Bloomberg"] },
      { id: 125, title: "First Missing Positive",                             difficulty: "Hard",   url: "https://leetcode.com/problems/first-missing-positive/",                                                    companies: ["Amazon","Microsoft","Apple","Airbnb","Bloomberg"] },
    ]
  },

  // ─── Tries ───────────────────────────────────────────────────────────────
  {
    id: "tries",
    name: "Tries",
    color: "emerald",
    questions: [
      { id: 126, title: "Implement Trie (Prefix Tree)",                       difficulty: "Medium", url: "https://leetcode.com/problems/implement-trie-prefix-tree/",                                                companies: ["Amazon","Facebook","Google","Microsoft","Uber","Twitter","Bloomberg"] },
      { id: 127, title: "Design Add and Search Words Data Structure",         difficulty: "Medium", url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/",                               companies: ["Facebook","Amazon","Google","Dropbox"] },
      { id: 128, title: "Word Search II",                                     difficulty: "Hard",   url: "https://leetcode.com/problems/word-search-ii/",                                                            companies: ["Amazon","Airbnb","Google","Microsoft","Yelp"] },
      { id: 129, title: "Replace Words",                                      difficulty: "Medium", url: "https://leetcode.com/problems/replace-words/",                                                             companies: ["Amazon","Google"] },
      { id: 130, title: "Maximum XOR of Two Numbers in Array",                difficulty: "Medium", url: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",                                   companies: ["Facebook","Amazon","Google"] },
    ]
  },

  // ─── Backtracking ────────────────────────────────────────────────────────
  {
    id: "backtracking",
    name: "Backtracking",
    color: "red",
    questions: [
      { id: 131, title: "Subsets",                                            difficulty: "Medium", url: "https://leetcode.com/problems/subsets/",                                                                   companies: ["Amazon","Facebook","Bloomberg","Google"] },
      { id: 132, title: "Combination Sum",                                    difficulty: "Medium", url: "https://leetcode.com/problems/combination-sum/",                                                           companies: ["Amazon","Facebook","Snapchat","Microsoft"] },
      { id: 133, title: "Combination Sum II",                                 difficulty: "Medium", url: "https://leetcode.com/problems/combination-sum-ii/",                                                        companies: ["Amazon","Facebook"] },
      { id: 134, title: "Permutations",                                       difficulty: "Medium", url: "https://leetcode.com/problems/permutations/",                                                              companies: ["LinkedIn","Amazon","Google","Microsoft","Bloomberg","Facebook"] },
      { id: 135, title: "Permutations II",                                    difficulty: "Medium", url: "https://leetcode.com/problems/permutations-ii/",                                                           companies: ["LinkedIn","Google","Amazon"] },
      { id: 136, title: "Word Search",                                        difficulty: "Medium", url: "https://leetcode.com/problems/word-search/",                                                               companies: ["Amazon","Airbnb","Bloomberg","Facebook","Microsoft","Snap"] },
      { id: 137, title: "N-Queens",                                           difficulty: "Hard",   url: "https://leetcode.com/problems/n-queens/",                                                                  companies: ["Amazon","Bloomberg","Microsoft","Airbnb"] },
      { id: 138, title: "Sudoku Solver",                                      difficulty: "Hard",   url: "https://leetcode.com/problems/sudoku-solver/",                                                             companies: ["Apple","Uber","Google"] },
      { id: 139, title: "Letter Combinations of a Phone Number",              difficulty: "Medium", url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",                                    companies: ["Amazon","Facebook","Uber","Google","Bloomberg"] },
      { id: 140, title: "Palindrome Partitioning",                            difficulty: "Medium", url: "https://leetcode.com/problems/palindrome-partitioning/",                                                   companies: ["Amazon","Apple","Google","Uber"] },
      { id: 141, title: "Rat in a Maze Problem",                              difficulty: "Medium", url: "https://practice.geeksforgeeks.org/problems/rat-in-a-maze-problem/1",                                     companies: ["Amazon","Microsoft","Samsung"] },
    ]
  },

  // ─── Dynamic Programming ─────────────────────────────────────────────────
  {
    id: "dp-1",
    name: "Dynamic Programming (Part 1)",
    color: "yellow",
    questions: [
      { id: 142, title: "Climbing Stairs",                                    difficulty: "Easy",   url: "https://leetcode.com/problems/climbing-stairs/",                                                           companies: ["Amazon","Google","Apple","Adobe","Microsoft"] },
      { id: 143, title: "Min Cost Climbing Stairs",                           difficulty: "Easy",   url: "https://leetcode.com/problems/min-cost-climbing-stairs/",                                                  companies: ["Amazon","Google","Microsoft"] },
      { id: 144, title: "House Robber",                                       difficulty: "Medium", url: "https://leetcode.com/problems/house-robber/",                                                              companies: ["Amazon","Airbnb","Bloomberg","Yelp"] },
      { id: 145, title: "House Robber II",                                    difficulty: "Medium", url: "https://leetcode.com/problems/house-robber-ii/",                                                           companies: ["Amazon","Bloomberg","Airbnb"] },
      { id: 146, title: "Coin Change",                                        difficulty: "Medium", url: "https://leetcode.com/problems/coin-change/",                                                               companies: ["Amazon","Bloomberg","Google","Microsoft","Uber","Apple"] },
      { id: 147, title: "Longest Increasing Subsequence",                     difficulty: "Medium", url: "https://leetcode.com/problems/longest-increasing-subsequence/",                                            companies: ["Amazon","Google","Microsoft","Facebook","Walmart","Adobe"] },
      { id: 148, title: "Longest Common Subsequence",                         difficulty: "Medium", url: "https://leetcode.com/problems/longest-common-subsequence/",                                               companies: ["Amazon","Google","Microsoft","Bloomberg","Apple","Oracle"] },
      { id: 149, title: "0/1 Knapsack Problem",                              difficulty: "Medium", url: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/",                                               companies: ["Amazon","Google","Uber","Microsoft"] },
      { id: 150, title: "Unique Paths",                                       difficulty: "Medium", url: "https://leetcode.com/problems/unique-paths/",                                                              companies: ["Amazon","Bloomberg","Microsoft","Google","LinkedIn"] },
    ]
  },
  {
    id: "dp-2",
    name: "Dynamic Programming (Part 2)",
    color: "yellow",
    questions: [
      { id: 151, title: "Word Break",                                         difficulty: "Medium", url: "https://leetcode.com/problems/word-break/",                                                                companies: ["Amazon","Bloomberg","Facebook","Google","Microsoft","Apple"] },
      { id: 152, title: "Combination Sum IV",                                 difficulty: "Medium", url: "https://leetcode.com/problems/combination-sum-iv/",                                                        companies: ["Google","Facebook","Amazon"] },
      { id: 153, title: "Jump Game",                                          difficulty: "Medium", url: "https://leetcode.com/problems/jump-game/",                                                                 companies: ["Amazon","Microsoft","Bloomberg"] },
      { id: 154, title: "Partition Equal Subset Sum",                         difficulty: "Medium", url: "https://leetcode.com/problems/partition-equal-subset-sum/",                                               companies: ["Amazon","Facebook","Google"] },
      { id: 155, title: "Target Sum",                                         difficulty: "Medium", url: "https://leetcode.com/problems/target-sum/",                                                                companies: ["Facebook","Amazon","Google"] },
      { id: 156, title: "Decode Ways",                                        difficulty: "Medium", url: "https://leetcode.com/problems/decode-ways/",                                                               companies: ["Facebook","Amazon","Microsoft","Google"] },
      { id: 157, title: "Edit Distance (Levenshtein)",                        difficulty: "Hard",   url: "https://leetcode.com/problems/edit-distance/",                                                             companies: ["Amazon","Google","Microsoft","Yahoo","Baidu","Bloomberg"] },
      { id: 158, title: "Burst Balloons",                                     difficulty: "Hard",   url: "https://leetcode.com/problems/burst-balloons/",                                                            companies: ["Google","Amazon"] },
      { id: 159, title: "Regular Expression Matching",                        difficulty: "Hard",   url: "https://leetcode.com/problems/regular-expression-matching/",                                              companies: ["Amazon","Google","Microsoft","Facebook","Airbnb"] },
    ]
  },

  // ─── Searching & Sorting ─────────────────────────────────────────────────
  {
    id: "searching-sorting",
    name: "Searching & Sorting",
    color: "indigo",
    questions: [
      { id: 160, title: "Bubble Sort",                                        difficulty: "Easy",   url: "https://www.geeksforgeeks.org/bubble-sort/",                                                               companies: ["Samsung","Wipro","TCS","Infosys"] },
      { id: 161, title: "Selection Sort",                                     difficulty: "Easy",   url: "https://www.geeksforgeeks.org/selection-sort/",                                                            companies: ["Samsung","Wipro"] },
      { id: 162, title: "Insertion Sort",                                     difficulty: "Easy",   url: "https://www.geeksforgeeks.org/insertion-sort/",                                                            companies: ["Microsoft","Samsung"] },
      { id: 163, title: "Merge Sort",                                         difficulty: "Medium", url: "https://www.geeksforgeeks.org/merge-sort/",                                                                companies: ["Amazon","Microsoft","Google","Adobe"] },
      { id: 164, title: "Quick Sort",                                         difficulty: "Medium", url: "https://www.geeksforgeeks.org/quick-sort/",                                                                companies: ["Amazon","Google","Samsung","Cisco"] },
      { id: 165, title: "Counting Sort",                                      difficulty: "Easy",   url: "https://www.geeksforgeeks.org/counting-sort/",                                                             companies: ["Amazon","Google"] },
      { id: 166, title: "Radix Sort",                                         difficulty: "Medium", url: "https://www.geeksforgeeks.org/radix-sort/",                                                                companies: ["Amazon","Google"] },
      { id: 167, title: "Sort Colors (Dutch National Flag)",                  difficulty: "Medium", url: "https://leetcode.com/problems/sort-colors/",                                                               companies: ["Facebook","Microsoft","Amazon","Bloomberg"] },
      { id: 168, title: "Meeting Rooms II",                                   difficulty: "Medium", url: "https://leetcode.com/problems/meeting-rooms-ii/",                                                          companies: ["Amazon","Facebook","Google","Microsoft","Uber","Snapchat","Lyft"] },
      { id: 169, title: "Largest Number",                                     difficulty: "Medium", url: "https://leetcode.com/problems/largest-number/",                                                            companies: ["Airbnb","Amazon","Bloomberg"] },
    ]
  },
];

// Aggregate all unique companies from the sheet for filtering
export const DSA_COMPANIES = Array.from(
  new Set(
    DSA_SHEET_TOPICS.flatMap(topic =>
      topic.questions.flatMap(q => q.companies)
    )
  )
).sort();

// Get total question count
export const DSA_TOTAL_QUESTIONS = DSA_SHEET_TOPICS.reduce(
  (sum, topic) => sum + topic.questions.length,
  0
);
