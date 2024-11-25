Fitness App API Documentation

Base URL: http://localhost:3000/api

Authentication:
All authenticated routes require a JWT token in the Authorization header:
Authorization: Bearer <your_jwt_token>

Error Responses:
All endpoints may return the following error responses:
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Missing or invalid token
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 500 Internal Server Error: Server error

1. Authentication Routes

1.1 Register User
URL: /auth/register
Method: POST
Headers:
  - Content-Type: application/json
Body:
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "age": 30,
  "gender": "male",
  "height": 180,
  "weight": 75,
  "weightGoal": 70,
  "mainGoal": "weight loss",
  "fitnessLevel": "intermediate",
  "preferredWorkoutSplit": "push/pull/legs"
}
Success Response:
  - Code: 201
  - Content: { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }

1.2 Login User
URL: /auth/login
Method: POST
Headers:
  - Content-Type: application/json
Body:
{
  "email": "john@example.com",
  "password": "securepassword123"
}
Success Response:
  - Code: 200
  - Content: { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }

2. User Routes

2.1 Get User Profile
URL: /users/profile
Method: GET
Headers:
  - Authorization: Bearer <jwt_token>
Success Response:
  - Code: 200
  - Content:
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0k1",
  "username": "johndoe",
  "email": "john@example.com",
  "age": 30,
  "gender": "male",
  "height": 180,
  "weight": 75,
  "weightGoal": 70,
  "mainGoal": "weight loss",
  "fitnessLevel": "intermediate",
  "preferredWorkoutSplit": "push/pull/legs"
}

2.2 Update User Profile
URL: /users/profile
Method: PUT
Headers:
  - Authorization: Bearer <jwt_token>
  - Content-Type: application/json
Body:
{
  "weight": 73,
  "fitnessLevel": "advanced"
}
Success Response:
  - Code: 200
  - Content:
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0k1",
  "username": "johndoe",
  "email": "john@example.com",
  "age": 30,
  "gender": "male",
  "height": 180,
  "weight": 73,
  "weightGoal": 70,
  "mainGoal": "weight loss",
  "fitnessLevel": "advanced",
  "preferredWorkoutSplit": "push/pull/legs"
}

3. Exercise Routes

3.1 Create Exercise (Admin only)
URL: /exercises
Method: POST
Headers:
  - Authorization: Bearer <jwt_token>
  - Content-Type: application/json
Body:
{
  "name": "Barbell Squat",
  "description": "A compound lower body exercise that targets the quadriceps, hamstrings, and glutes.",
  "muscleGroup": ["Legs", "Core"],
  "equipment": "Barbell",
  "workoutType": "Strength",
  "difficulty": "Intermediate",
  "weightType": "external",
  "youtubeLink": "https://www.youtube.com/watch?v=example",
  "imageUrl": "https://example.com/barbell-squat.jpg",
  "caloriesBurnedPerMinute": 8,
  "instructions": [
    "Stand with feet shoulder-width apart",
    "Lower your body as if sitting back into a chair",
    "Keep your chest up and back straight",
    "Push through your heels to return to the starting position"
  ],
  "variations": ["Front Squat", "Goblet Squat"],
  "tips": ["Keep your knees in line with your toes", "Breathe out as you push up"]
}
Success Response:
  - Code: 201
  - Content:
{
  "_id": "60b2c3d4e5f6g7h8i9j0k1l2",
  "name": "Barbell Squat",
  "description": "A compound lower body exercise that targets the quadriceps, hamstrings, and glutes.",
  "muscleGroup": ["Legs", "Core"],
  "equipment": "Barbell",
  "workoutType": "Strength",
  "difficulty": "Intermediate",
  "weightType": "external",
  "youtubeLink": "https://www.youtube.com/watch?v=example",
  "imageUrl": "https://example.com/barbell-squat.jpg",
  "caloriesBurnedPerMinute": 8,
  "instructions": [
    "Stand with feet shoulder-width apart",
    "Lower your body as if sitting back into a chair",
    "Keep your chest up and back straight",
    "Push through your heels to return to the starting position"
  ],
  "variations": ["Front Squat", "Goblet Squat"],
  "tips": ["Keep your knees in line with your toes", "Breathe out as you push up"],
  "createdBy": "60a1b2c3d4e5f6g7h8i9j0k1",
  "isApproved": true,
  "createdAt": "2023-05-20T10:30:00Z",
  "updatedAt": "2023-05-20T10:30:00Z"
}

3.2 Get All Exercises
URL: /exercises
Method: GET
Headers:
  - Authorization: Bearer <jwt_token>
Query Parameters:
  - page: Page number (default: 1)
  - limit: Number of items per page (default: 10)
  - muscleGroup: Filter by muscle group (optional)
  - difficulty: Filter by difficulty (optional)
  - equipment: Filter by equipment (optional)
Success Response:
  - Code: 200
  - Content:
{
  "exercises": [
    {
      "_id": "60b2c3d4e5f6g7h8i9j0k1l2",
      "name": "Barbell Squat",
      "description": "A compound lower body exercise that targets the quadriceps, hamstrings, and glutes.",
      "muscleGroup": ["Legs", "Core"],
      "equipment": "Barbell",
      "difficulty": "Intermediate",
      "weightType": "external"
    },
    {
      "_id": "60c3d4e5f6g7h8i9j0k1l2m3",
      "name": "Push-up",
      "description": "A bodyweight exercise that targets the chest, shoulders, and triceps.",
      "muscleGroup": ["Chest", "Shoulders", "Arms"],
      "equipment": "None",
      "difficulty": "Beginner",
      "weightType": "bodyweight"
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalExercises": 50
}

3.3 Get Single Exercise
URL: /exercises/:id
Method: GET
Headers:
  - Authorization: Bearer <jwt_token>
Success Response:
  - Code: 200
  - Content:
{
  "_id": "60b2c3d4e5f6g7h8i9j0k1l2",
  "name": "Barbell Squat",
  "description": "A compound lower body exercise that targets the quadriceps, hamstrings, and glutes.",
  "muscleGroup": ["Legs", "Core"],
  "equipment": "Barbell",
  "workoutType": "Strength",
  "difficulty": "Intermediate",
  "weightType": "external",
  "youtubeLink": "https://www.youtube.com/watch?v=example",
  "imageUrl": "https://example.com/barbell-squat.jpg",
  "caloriesBurnedPerMinute": 8,
  "instructions": [
    "Stand with feet shoulder-width apart",
    "Lower your body as if sitting back into a chair",
    "Keep your chest up and back straight",
    "Push through your heels to return to the starting position"
  ],
  "variations": ["Front Squat", "Goblet Squat"],
  "tips": ["Keep your knees in line with your toes", "Breathe out as you push up"],
  "createdBy": {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k1",
    "username": "admin_user"
  },
  "isApproved": true,
  "createdAt": "2023-05-20T10:30:00Z",
  "updatedAt": "2023-05-20T10:30:00Z"
}

3.4 Update Exercise (Admin only)
URL: /exercises/:id
Method: PUT
Headers:
  - Authorization: Bearer <jwt_token>
  - Content-Type: application/json
Body:
{
  "description": "An updated description for the barbell squat exercise.",
  "difficulty": "Advanced",
  "tips": [
    "Keep your knees in line with your toes",
    "Breathe out as you push up",
    "Maintain a neutral spine throughout the movement"
  ]
}
Success Response:
  - Code: 200
  - Content: Updated exercise object (similar to Get Single Exercise response)

3.5 Delete Exercise (Admin only)
URL: /exercises/:id
Method: DELETE
Headers:
  - Authorization: Bearer <jwt_token>
Success Response:
  - Code: 200
  - Content: { "message": "Exercise deleted successfully" }

4. Routine Routes

4.1 Create Routine
URL: /routines
Method: POST
Headers:
  - Authorization: Bearer <jwt_token>
  - Content-Type: application/json
Body:
{
  "name": "Full Body Workout",
  "description": "A comprehensive full body workout routine",
  "exercises": [
    {
      "exercise": "60b2c3d4e5f6g7h8i9j0k1l2",
      "sets": 3,
      "reps": 10,
      "restBetweenSets": 60
    },
    {
      "exercise": "60c3d4e5f6g7h8i9j0k1l2m3",
      "sets": 3,
      "reps": 15,
      "restBetweenSets": 45
    }
  ],
  "difficulty": "Intermediate",
  "estimatedDuration": 60,
  "targetMuscleGroups": ["Legs", "Chest", "Back", "Arms", "Shoulders"],
  "workoutType": "Strength",
  "equipment": ["Barbell", "Dumbbells", "Bench"],
  "tags": ["Full Body", "Strength Training"],
  "isPublic": true
}
Success Response:
  - Code: 201
  - Content:
{
  "_id": "60d4e5f6g7h8i9j0k1l2m3n4",
  "name": "Full Body Workout",
  "description": "A comprehensive full body workout routine",
  "exercises": [
    {
      "exercise": {
        "_id": "60b2c3d4e5f6g7h8i9j0k1l2",
        "name": "Barbell Squat"
      },
      "sets": 3,
      "reps": 10,
      "restBetweenSets": 60
    },
    {
      "exercise": {
        "_id": "60c3d4e5f6g7h8i9j0k1l2m3",
        "name": "Push-up"
      },
      "sets": 3,
      "reps": 15,
      "restBetweenSets": 45
    }
  ],
  "difficulty": "Intermediate",
  "estimatedDuration": 60,
  "targetMuscleGroups": ["Legs", "Chest", "Back", "Arms", "Shoulders"],
  "workoutType": "Strength",
  "equipment": ["Barbell", "Dumbbells", "Bench"],
  "tags": ["Full Body", "Strength Training"],
  "isPublic": true,
  "createdBy": "60a1b2c3d4e5f6g7h8i9j0k1",
  "likes": 0,
  "timesUsed": 0,
  "createdAt": "2023-05-20T12:00:00Z",
  "updatedAt": "2023-05-20T12:00:00Z"
}

4.2 Get All Routines
URL: /routines
Method: GET
Headers:
  - Authorization: Bearer <jwt_token>
Query Parameters:
  - page: Page number (default: 1)
  - limit: Number of items per page (default: 10)
  - difficulty: Filter by difficulty (optional)
  - workoutType: Filter by workout type (optional)
Success Response:
  - Code: 200
  - Content:
{
  "routines": [
    {
      "_id": "60d4e5f6g7h8i9j0k1l2m3n4",
      "name": "Full Body Workout",
      "description": "A comprehensive full body workout routine",
      "difficulty": "Intermediate",
      "estimatedDuration": 60,
      "workoutType": "Strength",
      "createdBy": {
        "_id": "60a1b2c3d4e5f6g7h8i9j0k1",
        "username": "johndoe"
      },
      "likes": 5,
      "timesUsed": 10
    }
  ],
  "currentPage": 1,
  "totalPages": 3,
  "totalRoutines": 25
}

4.3 Get Single Routine
URL: /routines/:id
Method: GET
Headers:
  - Authorization: Bearer <jwt_token>
Success Response:
  - Code: 200
  - Content: Single routine object (similar to the routine object in Create Routine response)

4.4 Update Routine
URL: /routines/:id
Method: PUT
Headers:
  - Authorization: Bearer <jwt_token>
  - Content-Type: application/json
Body:
{
  "name": "Advanced Full Body Workout",
  "difficulty": "Advanced",
  "exercises": [
    {
      "exercise": "60b2c3d4e5f6g7h8i9j0k1l2",
      "sets": 4,
      "reps": 8,
      "restBetweenSets": 90
    },
    {
      "exercise": "60c3d4e5f6g7h8i9j0k1l2m3",
      "sets": 4,
      "reps": 20,
      "restBetweenSets": 60
    }
  ]
}
Success Response:
- Code: 200
  - Content: Updated routine object (similar to Get Single Routine response)

4.5 Delete Routine
URL: /routines/:id
Method: DELETE
Headers:
  - Authorization: Bearer <jwt_token>
Success Response:
  - Code: 200
  - Content: { "message": "Routine deleted successfully" }

5. Workout Routes

5.1 Log Workout
URL: /workouts
Method: POST
Headers:
  - Authorization: Bearer <jwt_token>
  - Content-Type: application/json
Body:
{
  "routine": "60d4e5f6g7h8i9j0k1l2m3n4",
  "duration": 65,
  "exercises": [
    {
      "exercise": "60b2c3d4e5f6g7h8i9j0k1l2",
      "sets": [
        { "weight": 100, "reps": 10, "restAfter": 90 },
        { "weight": 100, "reps": 8, "restAfter": 90 },
        { "weight": 95, "reps": 8, "restAfter": 90 }
      ]
    },
    {
      "exercise": "60c3d4e5f6g7h8i9j0k1l2m3",
      "sets": [
        { "reps": 15, "duration": 45, "restAfter": 60 },
        { "reps": 12, "duration": 45, "restAfter": 60 },
        { "reps": 10, "duration": 45, "restAfter": 60 }
      ]
    }
  ],
  "notes": "Great workout today!",
  "feelingRating": 4,
  "location": "Home Gym",
  "weather": "Sunny",
  "photoUrl": "https://example.com/workout-selfie.jpg"
}
Success Response:
  - Code: 201
  - Content:
{
  "_id": "60e5f6g7h8i9j0k1l2m3n4o5",
  "user": "60a1b2c3d4e5f6g7h8i9j0k1",
  "routine": {
    "_id": "60d4e5f6g7h8i9j0k1l2m3n4",
    "name": "Full Body Workout"
  },
  "duration": 65,
  "exercises": [
    {
      "exercise": {
        "_id": "60b2c3d4e5f6g7h8i9j0k1l2",
        "name": "Barbell Squat",
        "weightType": "external"
      },
      "sets": [
        { "weight": 100, "reps": 10, "restAfter": 90 },
        { "weight": 100, "reps": 8, "restAfter": 90 },
        { "weight": 95, "reps": 8, "restAfter": 90 }
      ]
    },
    {
      "exercise": {
        "_id": "60c3d4e5f6g7h8i9j0k1l2m3",
        "name": "Push-up",
        "weightType": "bodyweight"
      },
      "sets": [
        { "reps": 15, "duration": 45, "restAfter": 60 },
        { "reps": 12, "duration": 45, "restAfter": 60 },
        { "reps": 10, "duration": 45, "restAfter": 60 }
      ]
    }
  ],
  "notes": "Great workout today!",
  "feelingRating": 4,
  "location": "Home Gym",
  "weather": "Sunny",
  "photoUrl": "https://example.com/workout-selfie.jpg",
  "date": "2023-05-20T14:30:00Z",
  "createdAt": "2023-05-20T14:30:00Z",
  "updatedAt": "2023-05-20T14:30:00Z"
}

5.2 Get All Workouts
URL: /workouts
Method: GET
Headers:
  - Authorization: Bearer <jwt_token>
Query Parameters:
  - page: Page number (default: 1)
  - limit: Number of items per page (default: 10)
  - startDate: Filter by start date (YYYY-MM-DD)
  - endDate: Filter by end date (YYYY-MM-DD)
Success Response:
  - Code: 200
  - Content:
{
  "workouts": [
    {
      "_id": "60e5f6g7h8i9j0k1l2m3n4o5",
      "user": "60a1b2c3d4e5f6g7h8i9j0k1",
      "routine": {
        "_id": "60d4e5f6g7h8i9j0k1l2m3n4",
        "name": "Full Body Workout"
      },
      "duration": 65,
      "date": "2023-05-20T14:30:00Z",
      "feelingRating": 4
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalWorkouts": 50
}

5.3 Get Single Workout
URL: /workouts/:id
Method: GET
Headers:
  - Authorization: Bearer <jwt_token>
Success Response:
  - Code: 200
  - Content: Single workout object (similar to the workout object in Log Workout response)

5.4 Update Workout
URL: /workouts/:id
Method: PUT
Headers:
  - Authorization: Bearer <jwt_token>
  - Content-Type: application/json
Body:
{
  "duration": 70,
  "exercises": [
    {
      "exercise": "60b2c3d4e5f6g7h8i9j0k1l2",
      "sets": [
        { "weight": 105, "reps": 8, "restAfter": 90 },
        { "weight": 105, "reps": 7, "restAfter": 90 },
        { "weight": 100, "reps": 7, "restAfter": 90 }
      ]
    }
  ],
  "notes": "Increased weight on squats, feeling stronger!",
  "feelingRating": 5
}
Success Response:
  - Code: 200
  - Content: Updated workout object (similar to Get Single Workout response)

5.5 Delete Workout
URL: /workouts/:id
Method: DELETE
Headers:
  - Authorization: Bearer <jwt_token>
Success Response:
  - Code: 200
  - Content: { "message": "Workout deleted successfully" }

