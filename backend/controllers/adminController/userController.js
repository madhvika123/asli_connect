const logger = require('../../utils/logger');
const { userCreateValidation, userUpdateValidation, updatePasswordValidation } = require('../../validations/adminValidation/userValidation')
const { createUserService, getAllUsersService, updateUserService, deleteUsrService, userStatusService, updatePasswordService } = require('../../services/adminServices/userService');

const userCreateController = async (req, res) => {
    const crtVal = userCreateValidation(req.body);
    if (crtVal.success) {
        try {
            const user = await createUserService(req.body);
            res.status(user.status).json(user);
        }
        catch (err) {
            logger.error('Error in User Create API');
            return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
        }
    } else return res.status(400).send({ success: false, message: crtVal.message });

};

const userListController = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const usrLsts = await getAllUsersService({ page, limit});
        res.status(usrLsts.status).json(usrLsts);
    }
    catch (err) {
        logger.error('Error in Users List', err);
        return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

const userUpdateController = async (req, res) => {
    const updtVal = userUpdateValidation(req.body);
    if (updtVal.success) {
        try {
            const usrUpdt = await updateUserService(req.params.id, req.body);
            res.status(usrUpdt.status).json(usrUpdt);
        }
        catch (err) {
            logger.error('Error in User Update API');
            return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
        }
    } else return res.status(400).send({ success: false, message: updtVal.message });
};

const userDeleteController = async (req, res) => {
    try {
        const usrDel = await deleteUsrService(req.params.id);
        res.status(usrDel.status).json(usrDel);
    }
    catch (err) {
        logger.error('Error in Delete API', err);
        return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

const userStatusUpdateController = async (req, res) => {
    try {
        const { status } = req.body;
        const usrSts = await userStatusService(req.params.id, status);
        res.status(usrSts.status).json(usrSts);
    }
    catch (err) {
        logger.error('Error in Status Update API', err);
        return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

const updatePasswordController = async (req, res) => {
    const { userId, newPassword } = req.body;
    const pswdVal = updatePasswordValidation(req.body);
    if (pswdVal.success) {
        try {
            const usrUpdt = await updatePasswordService(userId, newPassword);
            res.status(usrUpdt.status).json(usrUpdt);
        }
        catch (err) {
            logger.error('Error in Password Update API');
            return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
        }
    } else return res.status(400).send({ success: false, message: pswdVal.message });
};

module.exports = { userCreateController, userListController, userUpdateController, userDeleteController, userStatusUpdateController, updatePasswordController };