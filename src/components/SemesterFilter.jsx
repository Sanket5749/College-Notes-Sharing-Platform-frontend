import React from 'react';

export const SemesterFilter = ({
  selectedSemester,
  onSelectSemester,
  isAuthenticated,
  onRequireAuth,
}) => {
  const semesters = [
    { label: 'All Semesters', value: '' },
    { label: 'Semester 1', value: '1' },
    { label: 'Semester 2', value: '2' },
    { label: 'Semester 3', value: '3' },
    { label: 'Semester 4', value: '4' },
    { label: 'Semester 5', value: '5' },
    { label: 'Semester 6', value: '6' },
    { label: 'Semester 7', value: '7' },
    { label: 'Semester 8', value: '8' },
  ];

  const handleClick = (semValue) => {
    if (!isAuthenticated && onRequireAuth) {
      onRequireAuth('login');
      return;
    }
    onSelectSemester(semValue);
  };

  return (
    <section className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
        {semesters.map((sem) => {
          const isActive = selectedSemester === sem.value;
          return (
            <button
              key={sem.value}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md shadow-indigo-500/25 border border-transparent'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800/80 hover:border-slate-700'
              }`}
              onClick={() => handleClick(sem.value)}
            >
              {sem.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};

