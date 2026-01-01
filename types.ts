
export interface Job {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_city?: string;
  job_country?: string;
  job_description: string;
  job_apply_link: string;
  employer_logo?: string;
  job_employment_type: string;
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
  };
  job_min_salary?: number;
  job_max_salary?: number;
  job_salary_currency?: string;
  isAiSuggested?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  image: string;
}

export enum PageView {
  HOME = 'home',
  JOBS = 'jobs',
  BLOG = 'blog',
  BLOG_POST = 'blog_post',
  ABOUT = 'about',
  CONTACT = 'contact',
  FAQ = 'faq',
  LEGAL = 'legal',
  PRIVACY = 'privacy',
  TERMS = 'terms',
  COOKIES = 'cookies',
  ADMIN = 'admin'
}
