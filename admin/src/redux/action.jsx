// USER Profile Actions
export const updatingUserProfile = (profileData) => {
  return {
    type: "UPDATE_USER_PROFILE",
    payload: profileData,
  };
};
export const deletingUserProfile = (profileData) => {
  return {
    type: "REMOVE_USER_PROFILE",
  };
};
export const logoutUser = () => ({
  type: "LOGOUT_USER",
});
export const updatingSelectedPujas = (selectedPujas) => {
  return {
    type: "UPDATE_SELECTED_PUJAS",
    payload: selectedPujas,
  };
};
export const updateToken = (token) => ({
  type: "UPDATE_TOKEN",
  payload: token,
});

