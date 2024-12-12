const postApiAccess = (permission) => {
  if (permission.create_data == false) {
    return false;
  }
  return true;
};
const updateApiAccess = (permission) => {
  if (permission.update_data == false) {
    return false;
  }
  return true;
};
const getApiAccess = (permission) => {
  if (permission.read_data == false) {
    return false;
  }
  return true;
};
const deleteApiAccess = (permission) => {
  if (permission.delete_data == false) {
    return false;
  }
  return true;
};

module.exports = {
  postApiAccess,
  getApiAccess,
  updateApiAccess,
  deleteApiAccess,
};
