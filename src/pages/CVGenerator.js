export function CVGenerator() {
  return `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h1 class="text-3xl font-bold text-purple-800 mb-4 text-center">Welcome to EmpowerHer Career Hub</h1>
            <p class="text-gray-600 text-center mb-8">
              Our AI-powered platform is designed to help women showcase their talents, break barriers, and achieve their career goals. 
              We focus on highlighting your unique strengths and matching you with companies committed to diversity and inclusion.
            </p>
          </div>

          <form id="cv-form" class="bg-white rounded-lg shadow-lg p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="col-span-2">
                <label class="block text-lg font-medium text-gray-700 mb-2">Personal Information</label>
                <div class="bg-purple-50 p-6 rounded-lg space-y-4">
                  <div>
                    <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" id="fullName" required
                      class="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg">
                  </div>

                  <div>
                    <label for="contactInfo" class="block text-sm font-medium text-gray-700">Contact Information</label>
                    <input type="text" id="contactInfo" required placeholder="Email, Phone, LinkedIn"
                      class="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg">
                  </div>
                </div>
              </div>

              <div class="col-span-2">
                <label class="block text-lg font-medium text-gray-700 mb-2">Professional Profile</label>
                <div class="bg-purple-50 p-6 rounded-lg space-y-4">
                  <div>
                    <label for="cvType" class="block text-sm font-medium text-gray-700">CV Type</label>
                    <select id="cvType" required
                      class="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg">
                      <option value="professional">Professional</option>
                      <option value="executive">Executive Leadership</option>
                      <option value="technical">Technical Expert</option>
                      <option value="creative">Creative Professional</option>
                      <option value="academic">Academic/Research</option>
                    </select>
                  </div>

                  <div>
                    <label for="summary" class="block text-sm font-medium text-gray-700">Professional Summary</label>
                    <textarea id="summary" rows="4" required placeholder="Share your career highlights and aspirations..."
                      class="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg"></textarea>
                  </div>
                </div>
              </div>

              <div class="col-span-2">
                <label class="block text-lg font-medium text-gray-700 mb-2">Skills & Expertise</label>
                <div class="bg-purple-50 p-6 rounded-lg">
                  <label for="skills" class="block text-sm font-medium text-gray-700">Select Your Skills</label>
                  <select id="skills" multiple required size="8"
                    class="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg">
                    <optgroup label="Leadership & Management">
                      <option value="team-leadership">Team Leadership</option>
                      <option value="project-management">Project Management</option>
                      <option value="strategic-planning">Strategic Planning</option>
                      <option value="change-management">Change Management</option>
                    </optgroup>
                    <optgroup label="Technical Skills">
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="react">React</option>
                      <option value="node">Node.js</option>
                      <option value="sql">SQL</option>
                      <option value="aws">AWS</option>
                    </optgroup>
                    <optgroup label="Soft Skills">
                      <option value="communication">Communication</option>
                      <option value="problem-solving">Problem Solving</option>
                      <option value="adaptability">Adaptability</option>
                      <option value="creativity">Creativity</option>
                    </optgroup>
                  </select>
                  <p class="mt-2 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple skills</p>
                </div>
              </div>

              <div class="col-span-2">
                <label class="block text-lg font-medium text-gray-700 mb-2">Experience & Achievements</label>
                <div class="bg-purple-50 p-6 rounded-lg space-y-4">
                  <div>
                    <label for="experience" class="block text-sm font-medium text-gray-700">Professional Experience</label>
                    <textarea id="experience" rows="6" required placeholder="Detail your work history, leadership roles, and key achievements..."
                      class="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg"></textarea>
                  </div>

                  <div>
                    <label for="achievements" class="block text-sm font-medium text-gray-700">Key Achievements</label>
                    <textarea id="achievements" rows="4" placeholder="Share specific accomplishments, metrics, and impact..."
                      class="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg"></textarea>
                  </div>
                </div>
              </div>

              <div class="col-span-2">
                <label class="block text-lg font-medium text-gray-700 mb-2">Education & Development</label>
                <div class="bg-purple-50 p-6 rounded-lg space-y-4">
                  <div>
                    <label for="education" class="block text-sm font-medium text-gray-700">Education</label>
                    <textarea id="education" rows="3" required placeholder="List your educational background..."
                      class="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg"></textarea>
                  </div>

                  <div>
                    <label for="certifications" class="block text-sm font-medium text-gray-700">Certifications & Training</label>
                    <textarea id="certifications" rows="2" placeholder="List relevant certifications and professional development..."
                      class="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg"></textarea>
                  </div>

                  <div>
                    <label for="awards" class="block text-sm font-medium text-gray-700">Awards & Recognition</label>
                    <textarea id="awards" rows="2" placeholder="Share awards, honors, and recognition..."
                      class="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-8">
              <button type="submit" 
                class="w-full bg-purple-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg">
                Generate Professional CV & Find Matching Jobs
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}