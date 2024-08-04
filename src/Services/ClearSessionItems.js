export const ClearSessionItems = () =>  {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('userID');
    localStorage.removeItem('IsPreferenceSet');
    return;
  }  