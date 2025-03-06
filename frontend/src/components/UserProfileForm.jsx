const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token'); // or however you store your token
    const response = await axios.post(
      'https://dhairya-9pat.onrender.com/api/users/profile',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    // Handle success
    console.log('Profile created:', response.data);
  } catch (error) {
    // Handle error
    console.error('Error creating profile:', error);
  }
}; 