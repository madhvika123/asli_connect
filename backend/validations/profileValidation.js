const updtUsrValidation = (body) => {
    const { name, email, phoneNo, userName } = body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const startDigitRegex = /^[6-9]/;
    const tenDigitRegex = /^\d{10}$/;
    const userNameRegex = /^(?!.*\.$)[a-zA-Z0-9._]{3,30}$/;

    if(!name || !email || !phoneNo || !userName) {
        return { status: 400, success: false, message: 'Please provide required fields' };
    } 

    if (!emailRegex.test(email.trim())) {
        return { status: 400, success: false, message: "Invalid Email Format" };
    }

    if (!startDigitRegex.test(phoneNo.trim())) {
        return { status: 400, success: false, message: "Phone number must start with 6,7,8,9 digits only" };
    }
    if (!tenDigitRegex.test(phoneNo.trim())) {
        return { status: 400, success: false, message: "Phone number must be 10 digits" };
    }

    if (!userNameRegex.test(userName.trim())) {
        return { status: 400, success: false, message: "Username must be 3–20 characters using letters, numbers, dot or underscore" };
    }

    return { success: true };
    
};

const chngePswdValidation = (body) => { 
    const { currentPassword, newPassword, confirmPassword } = body;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return { status: 400, success: false, message: 'Please provide all required fields' };
    }
    
    if (currentPassword === newPassword) {
        return { status: 400, success: false, message: "New password must be different from current password" };
    }
    
    if (!passwordRegex.test(confirmPassword)) {
        return { status: 400, success: false, message: "New password must contain uppercase, lowercase, number and special character" };
    }

    if (!passwordRegex.test(newPassword)) {
        return { status: 400, success: false, message: "New password must contain uppercase, lowercase, number and special character" };
    }

    if (newPassword !== confirmPassword) {
        return { status: 400, success: false, message: "New password and confirm password must match" };
    }

    return { success: true };
};

module.exports = { updtUsrValidation, chngePswdValidation };