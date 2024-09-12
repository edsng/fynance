export const loginWithGoogle = async (credential) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: credential }),
    });

    if (!response.ok) {
      throw new Error('Failed to login with Google');
    }

    const data = await response.json();
    return { user: data.user, token: data.token };
  } catch (error) {
    console.error('Error logging in with Google:', error);
    throw error;
  }
}

export const logout = () => {
  localStorage.removeItem('userToken');
};

export const getUser = async () => {
  const token = localStorage.getItem('userToken');
  if (!token) return null;
  
  try {
    const response = await fetch('http://localhost:3000/api/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('userToken');
        return null;
      }
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting user data', error);
    return null;
  }
};