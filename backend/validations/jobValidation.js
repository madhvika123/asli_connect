const jobCreateValidation = (body) => {
  const { jobTitle, companyName, jobType, jobSummary, requiredSkills, experienceLevel, workLocation, salaryRange, postValidityDate } = body;
  if (!jobTitle|| !companyName || !jobType || !jobSummary || !requiredSkills || !experienceLevel || !workLocation || !salaryRange || !postValidityDate) {
    return { status: 400, success: false, message: 'Please provide required fields' };
  } else {
    return { success: true };
  }
};

const jobUpdateValidation = (body) => {
  const { jobTitle, companyName, jobType, jobSummary, requiredSkills, experienceLevel, workLocation, salaryRange, postValidityDate } = body;    
  if (!jobTitle|| !companyName || !jobType || !jobSummary || !requiredSkills || !experienceLevel || !workLocation || !salaryRange || !postValidityDate) {
    return { status: 400, success: false, message: 'Please provide required fields' };
  } else {
    return { success: true };
  }
};  

module.exports = { jobCreateValidation, jobUpdateValidation };