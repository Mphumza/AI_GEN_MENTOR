import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyD_SFd6BZ7VCuMgyROPmx0bB3KGoesVcm8');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

async function fetchJobs() {
  try {
    const response = await fetch('https://arbeitnow.com/api/job-board-api', {
      headers: {
        'Accept': 'application/json',
        'Origin': window.location.origin
      }
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
      salary: job.salary || 'Not specified'
    }));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    // Return some fallback jobs in case the API fails
    return [
      {
        id: 'fallback-1',
        title: 'Software Engineer',
        company: 'Tech Company',
        location: 'Remote',
        type: 'Full-time',
        description: 'Looking for a skilled software engineer to join our team.',
        requirements: ['JavaScript', 'React', 'Node.js'],
        url: '#',
        remote: true,
        salary: 'Competitive'
      },
      {
        id: 'fallback-2',
        title: 'Product Manager',
        company: 'Innovation Corp',
        location: 'New York',
        type: 'Full-time',
        description: 'Seeking an experienced product manager to lead our product development.',
        requirements: ['Product Management', 'Agile', 'Leadership'],
        url: '#',
        remote: false,
        salary: 'Based on experience'
      }
    ];
  }
}

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
    return response.text();
  } catch (error) {
    console.error('Job Match Analysis Error:', error);
    return `
Match Score: N/A
Key Matches: Unable to analyze matches at this time
Gaps: Analysis temporarily unavailable
Suggestions: Please try again later`;
  }
}

export async function getRecommendedJobs(cvData) {
  try {
    const jobs = await fetchJobs();
    const matchPromises = jobs.map(job => analyzeJobMatch(cvData, job));
    const matches = await Promise.all(matchPromises);

    return jobs.map((job, index) => ({
      ...job,
      matchAnalysis: matches[index]
    }));
  } catch (error) {
    console.error('Job Recommendations Error:', error);
    throw new Error('Failed to get job recommendations. Please try again later.');
  }
}