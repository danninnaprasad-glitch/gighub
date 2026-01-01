
import { JSEARCH_API_KEY } from "../constants";
import { Job } from "../types";

export const fetchJobs = async (query: string = "remote developer", page: number = 1): Promise<Job[]> => {
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&num_pages=${page}`;
  
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': JSEARCH_API_KEY,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error("JSearch API error");
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};
