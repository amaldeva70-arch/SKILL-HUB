import { TopicInfo, TopicId } from '../types';

export const TOPICS: Record<TopicId, TopicInfo> = {
  python: {
    id: 'python',
    name: 'Python Programming',
    malayalamName: 'പൈത്തൺ പ്രോഗ്രാമിംഗ്',
    tagline: 'Syntax, Data Types, Comprehensions & Functions',
    description: 'Core syntax, list comprehensions, lambda functions, OOP principles, and exception handling.',
    color: '#0284c7', // Sky 600
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    accentBorder: 'border-l-sky-500',
    iconName: 'Terminal',
  },
  'data-structures': {
    id: 'data-structures',
    name: 'Data Structures',
    malayalamName: 'ഡാറ്റ സ്ട്രക്ചറുകൾ',
    tagline: 'Arrays, Linked Lists, Stacks, Queues & Trees',
    description: 'Memory layout, node pointers, dynamic arrays, FIFO/LIFO behaviors, and binary search trees.',
    color: '#4f46e5', // Indigo 600
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    accentBorder: 'border-l-indigo-600',
    iconName: 'Layers',
  },
  algorithms: {
    id: 'algorithms',
    name: 'Algorithms',
    malayalamName: 'അൽഗോരിതങ്ങൾ',
    tagline: 'Time Complexity, Sorting, Searching & Recursion',
    description: 'Big-O notation, divide-and-conquer, binary search, recursive base cases, and greedy patterns.',
    color: '#7c3aed', // Violet 600
    badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
    accentBorder: 'border-l-violet-600',
    iconName: 'Cpu',
  },
  dbms: {
    id: 'dbms',
    name: 'Database Management Systems (DBMS)',
    malayalamName: 'ഡാറ്റാബേസ് മാനേജ്മെന്റ് സിസ്റ്റംസ്',
    tagline: 'SQL, Normalization, ACID & Indexing',
    description: 'Relational algebra, joins, transactional ACID guarantees, primary keys, and B-Tree indexing.',
    color: '#0d9488', // Teal 600
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
    accentBorder: 'border-l-teal-600',
    iconName: 'Database',
  },
};

export const TOPIC_LIST: TopicInfo[] = Object.values(TOPICS);
