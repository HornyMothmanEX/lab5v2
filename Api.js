const API_BASE_URL = "http://localhost:5000/api"; // Adjust to your backend URL

export const api = {
  // Register new user
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
  });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  },

  // Login user
  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return response.json();
  },

  // Get all users
  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch users");
    }

    return response.json();
  },

  // Get a specific user by ID
  async getUserById(id) {
    const response = await fetch(`${API_BASE_URL}/user/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch user");
    }

    return response.json();
  },

  // Get all places
  async getPlaces() {
    const response = await fetch(`${API_BASE_URL}/places`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch places");
    }

    return response.json();
  },

  // Add a new place
  async addPlace(placeData) {
    const response = await fetch(`${API_BASE_URL}/places`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(placeData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add place");
    }

    return response.json();
  },

  // Get a specific place by ID
  async getPlaceById(id) {
    const response = await fetch(`${API_BASE_URL}/places/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch place");
    }

    return response.json();
  },

  // Delete a place by ID
  async deletePlace(id) {
    const response = await fetch(`${API_BASE_URL}/places/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete place");
    }

    return response.json();
  },

  // Update a place by ID
  async updatePlace(id, placeData) {
    const response = await fetch(`${API_BASE_URL}/places/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(placeData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update place");
    }

    return response.json();
  },
  // Update user's profile picture
  async updateUserProfilePicture(userId, profileUrl) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "PUT",  // Ensure the HTTP method is PUT
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: userId, profileUrl }),  // Send the user ID and updated profile URL
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update profile picture");
    }
  
    return response.json();  // Return the updated user object
  }

};
