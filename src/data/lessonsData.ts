import { Lesson } from '../types';

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'lesson-ds-linked-lists',
    topicId: 'data-structures',
    title: 'Mastering Linked Lists: Nodes, Pointers & Memory Layout',
    malayalamTitle: 'ലിങ്ക്ഡ് ലിസ്റ്റുകൾ: നോഡുകൾ, പോയിന്ററുകൾ, മെമ്മറി ഘടന',
    difficulty: 'Medium',
    estimatedMinutes: 15,
    learningObjective: 'Understand pointer mechanics, constant-time insertions at head, and dynamic memory advantages over arrays.',
    malayalamObjective: 'പോയിന്ററുകളുടെ പ്രവർത്തനം, വേഗതയേറിയ ഇൻസെർഷൻ, അറേകളേക്കാൾ ലിങ്ക്ഡ് ലിസ്റ്റിനുള്ള മെമ്മറി മുൻഗണനകൾ എന്നിവ മനസ്സിലാക്കുക.',
    sections: [
      {
        heading: '1. What is a Node?',
        body: 'In computer science, a node is a compound data container holding two things: the payload data (e.g. an integer, string, or object) and a memory reference (pointer) to the subsequent node.',
        code: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None  # Pointer to next node

# Connecting nodes manually:
head = Node(10)
head.next = Node(20)
head.next.next = Node(30)`,
        malayalamSummary: 'ഓരോ നോഡിലും രണ്ട് പ്രധാന കാര്യങ്ങളുണ്ട്: മൂല്യം (Value), അടുത്ത നോഡിന്റെ വിലാസം കാണിക്കുന്ന പോയിന്റർ (Next Pointer).',
        keyPoints: [
          'Elements are scattered throughout heap memory, not contiguous.',
          'Pointers link nodes into a single linear chain.',
          'The last node has its `next` pointer set to `None`.',
        ],
      },
      {
        heading: '2. Array vs. Linked List: The Fundamental Trade-off',
        body: 'Arrays excel at random indexed access (O(1)) because every element can be calculated instantly via base_address + index * size. However, inserting at the start of an array requires shifting all N elements (O(N)). In a linked list, inserting at the head simply repoints the new node to current head and reassigns head in O(1) constant time!',
        code: `def insert_at_head(head, new_val):
    new_node = Node(new_val)
    new_node.next = head
    return new_node  # O(1) operation!`,
        malayalamSummary: 'അറേയിൽ തുടക്കത്തിൽ ഘടകം ചേർക്കാൻ O(N) വേണമെങ്കിൽ, ലിങ്ക്ഡ് ലിസ്റ്റിൽ അത് O(1) സമയം കൊണ്ട് ചെയ്യാം.',
        keyPoints: [
          'Head insertion: Linked List = O(1), Array = O(N).',
          'Element access by index: Array = O(1), Linked List = O(N).',
          'Extra space: Linked list requires ~8 bytes per pointer on 64-bit systems.',
        ],
      },
      {
        heading: '3. Floyd’s Tortoise and Hare Cycle Detection',
        body: 'If a corrupt pointer loops back to an earlier node, standard traversal causes an infinite loop. Floyd\'s Cycle Detection uses two pointers: a slow pointer moving 1 step and a fast pointer moving 2 steps. If a cycle exists, they are guaranteed to meet inside the loop.',
        code: `def has_cycle(head):
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next          # 1 step
        fast = fast.next.next     # 2 steps
        if slow == fast:
            return True           # Cycle detected!
    return False`,
        malayalamSummary: 'ഒരു പോയിന്റർ ഒരടിയും മറ്റൊന്ന് രണ്ടടിയും വെച്ച് മുന്നോട്ട് പോയാൽ, ലൂപ്പ് ഉണ്ടെങ്കിൽ അവ പരസ്പരം കണ്ടുമുട്ടും.',
      },
    ],
    practiceQuestions: [
      {
        question: 'Why does inserting at index 0 of an array take O(N) time while linked list head insertion takes O(1)?',
        options: [
          'Because arrays require shifting every existing element one index to the right in memory',
          'Because arrays are always stored in cloud databases',
          'Because linked lists do not store real data',
          'Because Python forbids array resizing',
        ],
        answerIndex: 0,
        explanation: 'In contiguous memory, index 0 is at fixed offset. To insert there, all subsequent elements from 0 to N-1 must shift rightward by one memory word.',
      },
      {
        question: 'What is the time complexity to access the k-th element in a Singly Linked List of length N?',
        options: ['O(1)', 'O(k)', 'O(N²)', 'O(log k)'],
        answerIndex: 1,
        explanation: 'Because memory is non-contiguous, you must follow the pointer chain k times from the head node, taking O(k) steps.',
      },
    ],
    completed: false,
  },
  {
    id: 'lesson-ds-stacks-queues',
    topicId: 'data-structures',
    title: 'Stacks (LIFO) & Queues (FIFO): Principles & Applications',
    malayalamTitle: 'സ്റ്റാക്കുകളും ക്യൂകളും: തത്വങ്ങളും പ്രയോഗങ്ങളും',
    difficulty: 'Easy',
    estimatedMinutes: 12,
    learningObjective: 'Master stack call frames, balanced parentheses validation, and FIFO queue buffering.',
    malayalamObjective: 'സ്റ്റാക്ക് (LIFO), ക്യൂ (FIFO) എന്നിവയുടെ പ്രവർത്തനങ്ങളും നിത്യജീവിത കമ്പ്യூട്ടിംഗ് ഉപയോഗങ്ങളും മനസ്സിലാക്കുക.',
    sections: [
      {
        heading: '1. The Stack: Last-In, First-Out (LIFO)',
        body: 'Imagine a spring-loaded plate dispenser in a cafeteria. You place plates on top and take plates from top. The last plate placed is the first one taken.',
        code: `stack = []
stack.append("Page 1") # push
stack.append("Page 2") # push
current = stack.pop()  # returns "Page 2" (LIFO)`,
        malayalamSummary: 'സ്റ്റാക്കിൽ അവസാനമെത്തിയ കാര്യമാണ് ആദ്യം പുറത്തെടുക്കുന്നത് (ഉദാ: ബ്രൗസറിലെ Back ബട്ടൺ, Undo ഹിസ്റ്ററി).',
      },
      {
        heading: '2. The Queue: First-In, First-Out (FIFO)',
        body: 'A queue behaves like people standing in line at a movie ticket counter. First person in line gets served first. Essential for print queues, breadcrumbs, and breadth-first search (BFS).',
        code: `from collections import deque
queue = deque()
queue.append("Task A") # enqueue
queue.append("Task B") # enqueue
first = queue.popleft() # "Task A" (FIFO)`,
        malayalamSummary: 'ക്യൂവിൽ ആദ്യം വന്ന ആളാണ് ആദ്യം സേവനം സ്വീകരിക്കുന്നത് (ഉദാ: പ്രിന്റർ ക്യൂ, ടാസ്ക് ഷെഡ്യൂളർ).',
      },
    ],
    practiceQuestions: [
      {
        question: 'Which problem is naturally solved using a Stack data structure?',
        options: [
          'Checking for balanced parentheses in code e.g. "{[()]}"',
          'Round-robin CPU task scheduling',
          'Finding the shortest path in an unweighted grid with BFS',
          'Sorting numbers in O(1) memory',
        ],
        answerIndex: 0,
        explanation: 'Balanced parentheses match the most recently opened symbol with the next closing symbol, which is the definition of LIFO.',
      },
    ],
    completed: false,
  },
  {
    id: 'lesson-algo-big-o',
    topicId: 'algorithms',
    title: 'Algorithmic Complexity & Big-O Notation',
    malayalamTitle: 'അൽഗോരിതങ്ങളുടെ കാര്യക്ഷമതയും ബിഗ്-ഒ നൊട്ടേഷനും',
    difficulty: 'Medium',
    estimatedMinutes: 18,
    learningObjective: 'Analyze how algorithms scale with large input sizes N and classify O(1), O(log N), O(N), and O(N²).',
    malayalamObjective: 'ഇൻപുട്ട് വലുതാകുമ്പോൾ പ്രോഗ്രാമിന്റെ സമയം എങ്ങനെ മാറുന്നുവെന്ന് ബിഗ്-ഒ രീതിയിൽ കണക്കാക്കാൻ പഠിക്കുക.',
    sections: [
      {
        heading: '1. Why Big-O Matters for Inclusive, Scalable Computing',
        body: 'Hardware gets faster, but algorithmic scaling dominates as data sizes grow. An O(N²) algorithm on 100,000 items takes 10,000,000,000 operations, whereas an O(N log N) algorithm takes only ~1,700,000 operations — a 5,000x difference!',
        malayalamSummary: 'കംപ്യൂട്ടറിന്റെ വേഗത കൂടിയാലും മോശം അൽഗോരിതം വലിയ ഡാറ്റ വരുമ്പോൾ പ്രവർത്തനക്ഷമമല്ലാതാകും.',
      },
      {
        heading: '2. Binary Search: The Power of Logarithmic Scaling',
        body: 'Binary Search repeatedly cuts the remaining elements by half. If you double the array size from 1,000,000 to 2,000,000 items, binary search requires just ONE extra comparison step!',
        code: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1  # O(log N) time, O(1) space`,
        malayalamSummary: 'ഓരോ തവണയും പകുതിയായി കുറയുന്നതിനാൽ 10 ലക്ഷം സംഖ്യകളിൽ നിന്ന് ഒരു സംഖ്യ കണ്ടെത്താൻ പരമാവധി 20 തവണ മാത്രം പരിശോധിച്ചാൽ മതിയാകും.',
      },
    ],
    practiceQuestions: [
      {
        question: 'If an algorithm takes 10 operations for N=10 and 1,000 operations for N=1,000, what is its growth rate?',
        options: ['O(N) Linear Time', 'O(1) Constant', 'O(N²) Quadratic', 'O(2^N) Exponential'],
        answerIndex: 0,
        explanation: 'When the operations scale directly proportionally to N, it is linear O(N) time.',
      },
    ],
    completed: false,
  },
  {
    id: 'lesson-py-core',
    topicId: 'python',
    title: 'Pythonic Mastery: Generators, Closures & Comprehensions',
    malayalamTitle: 'പൈത്തൺ പ്രോഗ്രാമിംഗ്: ജനറേറ്ററുകൾ, കോംപ്രിഹെൻഷൻ',
    difficulty: 'Medium',
    estimatedMinutes: 14,
    learningObjective: 'Write memory-efficient code using generators, understand reference identity, and write expressive comprehensions.',
    malayalamObjective: 'മെമ്മറി കാര്യക്ഷമമായി ഉപയോഗിക്കുന്ന ജനറേറ്ററുകൾ, ലിസ്റ്റ് കോംപ്രിഹെൻഷനുകൾ എന്നിവ എഴുതാൻ പഠിക്കുക.',
    sections: [
      {
        heading: '1. Lazy Evaluation with Generators',
        body: 'When processing gigabytes of data or infinite streams, generating a full list crashes with an Out-Of-Memory error. Generators stream one item at a time on demand using `yield`.',
        code: `def read_large_log(file_obj):
    for line in file_obj:
        if "ERROR" in line:
            yield line.strip()

# Only one line exists in memory at any millisecond!`,
        malayalamSummary: 'മുഴുവൻ ഡാറ്റയും ഒന്നിച്ച് റാമ്മിലേക്ക് എടുക്കാതെ ആവശ്യാനുസരണം ഓരോന്നായി മാത്രം പ്രോസസ്സ് ചെയ്യുന്ന രീതിയാണിത്.',
      },
    ],
    practiceQuestions: [
      {
        question: 'What keyword turns a standard Python function into a generator iterator?',
        options: ['return', 'yield', 'stream', 'generate'],
        answerIndex: 1,
        explanation: 'The `yield` statement suspends function execution and passes an item to the caller while preserving internal variable state.',
      },
    ],
    completed: false,
  },
  {
    id: 'lesson-dbms-schemas',
    topicId: 'dbms',
    title: 'Relational Schemas, Normalization & ACID Guarantees',
    malayalamTitle: 'റിലേഷണൽ സ്കീമകൾ, നോർമലൈസേഷൻ, ACID തത്വങ്ങൾ',
    difficulty: 'Medium',
    estimatedMinutes: 16,
    learningObjective: 'Eliminate duplicate data using 1NF, 2NF, and 3NF, and understand transactional durability.',
    malayalamObjective: 'ഡാറ്റ ആവർത്തനം ഒഴിവാക്കാൻ നോർമലൈസേഷൻ പ്രയോഗിക്കുകയും ഇടപാടുകളുടെ സുരക്ഷിതത്വം (ACID) ഉറപ്പാക്കുകയും ചെയ്യുക.',
    sections: [
      {
        heading: '1. The Why of Normalization',
        body: 'If a student\'s address is stored in 50 separate enrollment records, updating their address requires updating 50 rows. If one fails, the database becomes corrupt (Update Anomaly). Normalization splits data into specialized tables linked by foreign keys.',
        malayalamSummary: 'ഒരേ വിവരം പലയിടത്ത് ആവർത്തിച്ച് സൂക്ഷിക്കുമ്പോഴുണ്ടാകുന്ന തെറ്റുകൾ തിരുത്താനാണ് നോർമലൈസേഷൻ ചെയ്യുന്നത്.',
      },
      {
        heading: '2. ACID: The Pillars of Trust',
        body: 'Atomicity (all or nothing), Consistency (preserves constraints), Isolation (concurrent safety), and Durability (saved to disk, survives power outages).',
        malayalamSummary: 'ബാങ്കിംഗ് ഇടപാടുകൾ ഉൾപ്പെടെയുള്ള എല്ലാ ഡാറ്റാബേസ് പ്രവർത്തനങ്ങളുടെയും വിശ്വാസ്യത ഉറപ്പാക്കുന്ന 4 നിയമങ്ങളാണിത്.',
      },
    ],
    practiceQuestions: [
      {
        question: 'If a bank transfer moves $500 from Account A to Account B, and the server crashes after debiting A but before crediting B, which ACID property rolls back the debit?',
        options: ['Atomicity', 'Isolation', 'Durability', 'Normalization'],
        answerIndex: 0,
        explanation: 'Atomicity ensures that partial transactions are discarded via ROLLBACK so money is not lost.',
      },
    ],
    completed: false,
  },
];
