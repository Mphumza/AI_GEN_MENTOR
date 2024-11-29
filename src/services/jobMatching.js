import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyD_SFd6BZ7VCuMgyROPmx0bB3KGoesVcm8');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Fetch jobs from the API
export async function fetchJobs() {
  try {
    const response = await fetch('https://arbeitnow.com/api/job-board-api', {
      headers: {
        'Accept': 'application/json',
        'Origin': window.location.origin,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.data || !Array.isArray(data.data)) {
      console.warn('Invalid API response format');
      return [];
    }

    return data.data.map(job => ({
      id: job.slug || String(Math.random()),
      title: job.title || 'Untitled Position',
      company: job.company_name || 'Company Not Specified',
      location: job.location || 'Location Not Specified',
      type: Array.isArray(job.job_types) ? job.job_types.join(', ') : 'Full-time',
      description: job.description || 'No description available',
      requirements: Array.isArray(job.tags) ? job.tags : [],
      url: job.url || '#',
      remote: Boolean(job.remote),
      salary: job.salary || 'Not specified',
    }));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

// Analyze job match using Google Generative AI
export async function analyzeJobMatch(cv, job) {
  try {
    const prompt = `
    Analyze the match between this CV and job posting. 
    CV Summary: ${cv.summary}
    CV Skills: ${cv.skills.join(', ')}
    CV Experience: ${cv.experience}
    
    Job Title: ${job.title}
    Job Description: ${job.description}
    Job Requirements: ${job.requirements.join(', ')}
    Remote: ${job.remote ? 'Yes' : 'No'}
    
    Provide a concise analysis in this format:
    Match Score: [0-100]%
    Key Matches: [bullet points of matching skills]
    Gaps: [bullet points of missing requirements]
    Suggestions: [brief improvement recommendations]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    // Extract match score
    const matchScore = parseInt(analysis.match(/Match Score: (\d+)%/)?.[1] || '0', 10);

    return {
      analysis,
      matchScore,
    };
  } catch (error) {
    console.error('Job Match Analysis Error:', error);
    return {
      analysis: `
Match Score: N/A
Key Matches: Unable to analyze matches at this time
Gaps: Analysis temporarily unavailable
Suggestions: Please try again later`,
      matchScore: 0,
    };
  }
}

// Get recommended jobs based on CV data
export async function getRecommendedJobs(cvData) {
  try {
    const jobs = await fetchJobs();
    const matchPromises = jobs.map(job => analyzeJobMatch(cvData, job));
    const matches = await Promise.all(matchPromises);

    // Combine job data with match analysis and score
    const rankedJobs = jobs.map((job, index) => ({
      ...job,
      ...matches[index],
    }));

    // Sort jobs by match score in descending order
    return rankedJobs.sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    console.error('Job Recommendations Error:', error);
    throw new Error('Failed to get job recommendations. Please try again later.');
  }
}

// JobMatches component to display job listings and match scores
export function JobMatches({ jobs }) {
  if (!jobs) return '<div>Loading jobs...</div>';

  return `
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">Job Matches</h2>
      <ul class="space-y-4">
        ${jobs.map(job => `
          <li class="border p-4 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold">${job.title}</h3>
            <p class="text-sm text-gray-600">${job.company} - ${job.location}</p>
            <p class="mt-2">${job.description.slice(0, 150)}...</p>
            <div class="mt-2">
              <h4 class="font-medium">Match Score: ${job.matchScore || 'N/A'}%</h4>
              <p>${job.analysis || 'Analyzing match...'}</p>
            </div>
            <a href="${job.url}" target="_blank" class="text-blue-600 underline mt-4 block">
              View Job
            </a>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}
