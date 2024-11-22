import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { auth } from '../config/firebase.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getRecommendedJobs } from './jobMatching.js';

const genAI = new GoogleGenerativeAI('AIzaSyD_SFd6BZ7VCuMgyROPmx0bB3KGoesVcm8');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
const db = getFirestore();

export async function generateCV(formData) {
  try {
    const prompt = `Generate a professional CV in markdown format using this information:
      Full Name: ${formData.fullName}
      Contact: ${formData.contactInfo}
      CV Type: ${formData.cvType}
      Summary: ${formData.summary}
      Skills: ${formData.skills.join(', ')}
      Experience: ${formData.experience}
      Education: ${formData.education}
      Certifications: ${formData.certifications || 'N/A'}
      Awards: ${formData.awards || 'N/A'}
      
      Please format the CV professionally with clear sections and bullet points.
      Also include a section highlighting key achievements and quantifiable results.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const cvContent = response.text();

    // Get job recommendations based on CV
    const jobMatches = await getRecommendedJobs(formData);

    return {
      cv: cvContent,
      jobMatches
    };
  } catch (error) {
    console.error('CV Generation Error:', error);
    throw new Error('Failed to generate CV. Please try again.');
  }
}

export async function saveCV(cvData) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be logged in to save CV');

    const cvRef = await addDoc(collection(db, 'cvs'), {
      userId: user.uid,
      cvData,
      createdAt: new Date().toISOString(),
    });

    return cvRef.id;
  } catch (error) {
    console.error('Save CV Error:', error);
    throw new Error('Failed to save CV. Please try again.');
  }
}