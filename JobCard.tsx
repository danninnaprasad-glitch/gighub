
import React from 'react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className={`glass-card p-7 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 border-t-8 ${job.isAiSuggested ? 'border-rose-400 bg-rose-50/20' : 'border-emerald-500'} group relative overflow-hidden`}>
      {job.isAiSuggested && (
        <div className="absolute top-4 right-4 bg-rose-400 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse uppercase tracking-tighter shadow-lg">
          Gemini Choice
        </div>
      )}
      
      <div className="flex items-start gap-5">
        {job.employer_logo ? (
          <img src={job.employer_logo} alt={job.employer_name} className="w-16 h-16 rounded-2xl object-contain bg-white p-2 border border-emerald-50 shadow-sm group-hover:scale-110 transition-transform" />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-2xl border border-emerald-100">
            {job.employer_name.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors leading-tight mb-1 tracking-tight">
            {job.job_title}
          </h3>
          <p className="text-emerald-700 font-bold flex items-center gap-1 text-sm">
            <span className="text-rose-400">@</span> {job.employer_name}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-emerald-50/50 text-emerald-700 text-[10px] font-black rounded-xl border border-emerald-100 uppercase">
              {job.job_employment_type}
            </span>
            <span className="px-3 py-1 bg-rose-50/50 text-rose-600 text-[10px] font-black rounded-xl border border-rose-100 uppercase">
              📍 {job.job_city || job.job_country || 'Remote'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-emerald-50">
        <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed font-medium">
          {job.job_description}
        </p>
        <div className="flex justify-between items-center">
          <a 
            href={job.job_apply_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100 active:scale-95"
          >
            Secure Role
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          <button className="text-emerald-200 hover:text-rose-400 transition-colors p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
