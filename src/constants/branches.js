/**
 * Allowed Engineering Branches and Curriculum Constants
 * Strictly restricted to:
 * 1. Computer Engineering
 * 2. Mechanical Engineering
 * 3. Civil Engineering
 * 4. Electrical Engineering
 * 5. Electronics & Telecommunication (ENTC)
 * 6. Artificial Intelligence & Data Science (AIDS)
 * 7. Artificial Intelligence & Machine Learning (AIML)
 * 8. Data Science (DS)
 * 9. Information Technology (IT)
 * Semesters 1 to 8
 */

export const ALLOWED_BRANCHES = [
  {
    id: 'computer-engineering',
    name: 'Computer Engineering',
    shortName: 'Computer',
    code: 'COMP',
    description: 'Algorithms, Software Systems, Cloud & Computing Systems',
    gradient: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  {
    id: 'mechanical-engineering',
    name: 'Mechanical Engineering',
    shortName: 'Mechanical',
    code: 'MECH',
    description: 'Thermodynamics, Robotics, CAD/CAM & Machine Design',
    gradient: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    id: 'civil-engineering',
    name: 'Civil Engineering',
    shortName: 'Civil',
    code: 'CIVIL',
    description: 'Structures, Geotechnical, Surveying & Infrastructure',
    gradient: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    id: 'electrical-engineering',
    name: 'Electrical Engineering',
    shortName: 'Electrical',
    code: 'ELEC',
    description: 'Power Systems, Control Systems, Machines & EV Tech',
    gradient: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-400',
    badgeClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  },
  {
    id: 'entc',
    name: 'Electronics & Telecommunication (ENTC)',
    shortName: 'ENTC',
    code: 'ENTC',
    description: 'Signal Processing, VLSI, Wireless Comms & Embedded Systems',
    gradient: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  {
    id: 'aids',
    name: 'Artificial Intelligence & Data Science (AIDS)',
    shortName: 'AI & Data Science',
    code: 'AIDS',
    description: 'AI Foundations, Big Data, Deep Learning & Predictive Analytics',
    gradient: 'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  },
  {
    id: 'aiml',
    name: 'Artificial Intelligence & Machine Learning (AIML)',
    shortName: 'AI & ML',
    code: 'AIML',
    description: 'Neural Networks, NLP, Generative AI, Robotics & MLOps',
    gradient: 'from-violet-500/20 to-indigo-500/20 border-violet-500/30 text-violet-400',
    badgeClass: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  },
  {
    id: 'ds',
    name: 'Data Science (DS)',
    shortName: 'Data Science',
    code: 'DS',
    description: 'Statistical Inference, ETL, Stream Processing & Analytics',
    gradient: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30 text-cyan-400',
    badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
  {
    id: 'it',
    name: 'Information Technology (IT)',
    shortName: 'IT',
    code: 'IT',
    description: 'Web & Mobile Dev, Cloud Computing, DevOps & Cyber Security',
    gradient: 'from-sky-500/20 to-blue-500/20 border-sky-500/30 text-sky-400',
    badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  },
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

/**
 * Helper to get branch details by id, code, or department name
 */
export const getBranchInfo = (departmentOrCode) => {
  if (!departmentOrCode) return null;
  const target = departmentOrCode.toLowerCase().trim();

  return (
    ALLOWED_BRANCHES.find(
      (b) =>
        b.id === target ||
        b.code.toLowerCase() === target ||
        b.name.toLowerCase() === target ||
        b.shortName.toLowerCase() === target ||
        target.includes(b.code.toLowerCase())
    ) || null
  );
};

/**
 * Get branch badge style or fallback for Common Engineering
 */
export const getBranchBadgeDetails = (department) => {
  if (!department) {
    return {
      code: 'GEN',
      shortName: 'General',
      badgeClass: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };
  }

  if (department.toLowerCase().includes('common')) {
    return {
      code: 'FE',
      shortName: 'Common FE',
      badgeClass: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    };
  }

  const branch = getBranchInfo(department);
  if (branch) {
    return {
      code: branch.code,
      shortName: branch.shortName,
      badgeClass: branch.badgeClass,
    };
  }

  return {
    code: department.substring(0, 4).toUpperCase(),
    shortName: department,
    badgeClass: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };
};
