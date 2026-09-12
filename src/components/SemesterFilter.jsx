import React from 'react';

export const SemesterFilter = ({ selectedSemester, onSelectSemester }) => {
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

  return (
    <section className="semester-filter-section">
      <div className="container">
        <div className="semester-pills-wrap">
          {semesters.map((sem) => (
            <button
              key={sem.value}
              className={`semester-pill ${selectedSemester === sem.value ? 'active' : ''}`}
              onClick={() => onSelectSemester(sem.value)}
            >
              {sem.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
