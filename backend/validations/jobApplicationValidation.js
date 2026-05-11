const jbAplctnValidation = (body) => {
  const { appliedBy, fullName, email, phoneNumber, totalExperience, currentSalary, expectedSalary, skills, location } = body;
  if (!appliedBy || !fullName || !email || !phoneNumber || !totalExperience || !currentSalary || !expectedSalary || !skills || !location) {
    return { success: false, message: "Missing required fields" };
  }
  return { success: true };
};

module.exports = { jbAplctnValidation };
