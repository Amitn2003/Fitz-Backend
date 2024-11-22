# Fitness App API Documentation

## Base URL

`http://localhost:3000/api`

## Authentication

All authenticated routes require a JWT token in the Authorization header.

Header: `Authorization: Bearer <your_jwt_token>`

## Error Responses

All endpoints may return the following error responses:

- 400 Bad Request: Invalid input data
- 401 Unauthorized: Missing or invalid token
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 500 Internal Server Error: Server error


## Authentication Routes

### Register User

- **URL**: `/auth/register`
- **Method**: `POST`
- **Headers**:

- `Content-Type: application/json`



- **Body**:


```json
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
```

- **Success Response**:

- **Code**: 201
- **Content**: `{ "token": "<jwt_token>" }`





### Login User

- **URL**: `/auth/login`
- **Method**: `POST`
- **Headers**:

- `Content-Type: application/json`



- **Body**:


```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

- **Success Response**:

- **Code**: 200
- **Content**: `{ "token": "<jwt_token>" }`





## User Routes

### Get User Profile

- **URL**: `/users/profile`
- **Method**: `GET`
- **Headers**:

- `Authorization: Bearer <jwt_token>`



- **Success Response**:

- **Code**: 200
- **Content**:





```json
{
  "_id": "user_id",
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
```

### Update User Profile

- **URL**: `/users/profile`
- **Method**: `PUT`
- **Headers**:

- `Authorization: Bearer <jwt_token>`
- `Content-Type: application/json`



- **Body**:


```json
{
  "weight": 73,
  "fitnessLevel": "advanced"
}
```

- **Success Response**:

- **Code**: 200
- **Content**: Updated user object (similar to Get User Profile response)





## Exercise Routes

### Create Exercise (Admin only)

- **URL**: `/exercises`
- **Method**: `POST`
- **Headers**:

- `Authorization: Bearer <jwt_token>`
- `Content-Type: application/json`



- **Body**:


```json
{
  "name": "Barbell Squat",
  "description": "A compound lower body exercise that targets the quadriceps, hamstrings, and glutes.",
  "muscleGroup": "Legs",
  "equipment": "Barbell"
}
```

- **Success Response**:

- **Code**: 201
- **Content**: Created exercise object





### Get All Exercises

- **URL**: `/exercises`
- **Method**: `GET`
- **Headers**:

- `Authorization: Bearer <jwt_token>`



- **Query Parameters**:

- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 10)



- **Success Response**:

- **Code**: 200
- **Content**:





```json
{
  "exercises": [
    {
      "_id": "exercise_id",
      "name": "Barbell Squat",
      "description": "A compound lower body exercise that targets the quadriceps, hamstrings, and glutes.",
      "muscleGroup": "Legs",
      "equipment": "Barbell"
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalExercises": 50
}
```

### Get Single Exercise

- **URL**: `/exercises/:id`
- **Method**: `GET`
- **Headers**:

- `Authorization: Bearer <jwt_token>`



- **Success Response**:

- **Code**: 200
- **Content**: Single exercise object





### Update Exercise (Admin only)

- **URL**: `/exercises/:id`
- **Method**: `PUT`
- **Headers**:

- `Authorization: Bearer <jwt_token>`
- `Content-Type: application/json`



- **Body**:


```json
{
  "description": "Updated description for the exercise."
}
```

- **Success Response**:

- **Code**: 200
- **Content**: Updated exercise object





### Delete Exercise (Admin only)

- **URL**: `/exercises/:id`
- **Method**: `DELETE`
- **Headers**:

- `Authorization: Bearer <jwt_token>`



- **Success Response**:

- **Code**: 200
- **Content**: `{ "message": "Exercise deleted successfully" }`





## Routine Routes

### Create Routine

- **URL**: `/routines`
- **Method**: `POST`
- **Headers**:

- `Authorization: Bearer <jwt_token>`
- `Content-Type: application/json`



- **Body**:


```json
{
  "name": "Full Body Workout",
  "description": "A comprehensive full body workout routine",
  "exercises": [
    {
      "exercise": "exercise_id_1",
      "sets": 3,
      "reps": 10
    },
    {
      "exercise": "exercise_id_2",
      "sets": 4,
      "reps": 12
    }
  ]
}
```

- **Success Response**:

- **Code**: 201
- **Content**: Created routine object





### Get All Routines

- **URL**: `/routines`
- **Method**: `GET`
- **Headers**:

- `Authorization: Bearer <jwt_token>`



- **Query Parameters**:

- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 10)



- **Success Response**:

- **Code**: 200
- **Content**:





```json
{
  "routines": [
    {
      "_id": "routine_id",
      "name": "Full Body Workout",
      "description": "A comprehensive full body workout routine",
      "exercises": [
        {
          "exercise": {
            "_id": "exercise_id_1",
            "name": "Barbell Squat"
          },
          "sets": 3,
          "reps": 10
        },
        {
          "exercise": {
            "_id": "exercise_id_2",
            "name": "Bench Press"
          },
          "sets": 4,
          "reps": 12
        }
      ],
      "user": "user_id"
    }
  ],
  "currentPage": 1,
  "totalPages": 3,
  "totalRoutines": 25
}
```

### Get Single Routine

- **URL**: `/routines/:id`
- **Method**: `GET`
- **Headers**:

- `Authorization: Bearer <jwt_token>`



- **Success Response**:

- **Code**: 200
- **Content**: Single routine object (similar to the routine object in Get All Routines)





### Update Routine

- **URL**: `/routines/:id`
- **Method**: `PUT`
- **Headers**:

- `Authorization: Bearer <jwt_token>`
- `Content-Type: application/json`



- **Body**:


```json
{
  "name": "Updated Full Body Workout",
  "exercises": [
    {
      "exercise": "exercise_id_1",
      "sets": 4,
      "reps": 8
    },
    {
      "exercise": "exercise_id_3",
      "sets": 3,
      "reps": 15
    }
  ]
}
```

- **Success Response**:

- **Code**: 200
- **Content**: Updated routine object





### Delete Routine

- **URL**: `/routines/:id`
- **Method**: `DELETE`
- **Headers**:

- `Authorization: Bearer <jwt_token>`



- **Success Response**:

- **Code**: 200
- **Content**: `{ "message": "Routine deleted successfully" }`





## Workout Routes

### Log Workout

- **URL**: `/workouts`
- **Method**: `POST`
- **Headers**:

- `Authorization: Bearer <jwt_token>`
- `Content-Type: application/json`



- **Body**:


```json
{
  "routine": "routine_id",
  "exercises": [
    {
      "exercise": "exercise_id_1",
      "sets": [
        { "weight": 100, "reps": 10 },
        { "weight": 100, "reps": 8 },
        { "weight": 95, "reps": 8 }
      ]
    },
    {
      "exercise": "exercise_id_2",
      "sets": [
        { "weight": 60, "reps": 12 },
        { "weight": 60, "reps": 10 },
        { "weight": 55, "reps": 10 }
      ]
    }
  ]
}
```

- **Success Response**:

- **Code**: 201
- **Content**: Created workout object





### Get All Workouts

- **URL**: `/workouts`
- **Method**: `GET`
- **Headers**:

- `Authorization: Bearer <jwt_token>`



- **Query Parameters**:

- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 10)



- **Success Response**:

- **Code**: 200
- **Content**:





```json
{
  "workouts": [
    {
      "_id": "workout_id",
      "user": "user_id",
      "routine": {
        "_id": "routine_id",
        "name": "Full Body Workout"
      },
      "date": "2023-05-20T10:30:00Z",
      "exercises": [
        {
          "exercise": {
            "_id": "exercise_id_1",
            "name": "Barbell Squat"
          },
          "sets": [
            { "weight": 100, "reps": 10 },
            { "weight": 100, "reps": 8 },
            { "weight": 95, "reps": 8 }
          ]
        },
        {
          "exercise": {
            "_id": "exercise_id_2",
            "name": "Bench Press"
          },
          "sets": [
            { "weight": 60, "reps": 12 },
            { "weight": 60, "reps": 10 },
            { "weight": 55, "reps": 10 }
          ]
        }
      ]
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalWorkouts": 50
}
```

### Get Single Workout

- **URL**: `/workouts/:id`
- **Method**: `GET`
- **Headers**:

- `Authorization: Bearer <jwt_token>`



- **Success Response**:

- **Code**: 200
- **Content**: Single workout object (similar to the workout object in Get All Workouts)





### Update Workout

- **URL**: `/workouts/:id`
- **Method**: `PUT`
- **Headers**:

- `Authorization: Bearer <jwt_token>`
- `Content-Type: application/json`



- **Body**:


```json
{
  "exercises": [
    {
      "exercise": "exercise_id_1",
      "sets": [
        { "weight": 105, "reps": 10 },
        { "weight": 105, "reps": 8 },
        { "weight": 100, "reps": 8 }
      ]
    }
  ]
}
```

- **Success Response**:

- **Code**: 200
- **Content**: Updated workout object





### Delete Workout

- **URL**: `/workouts/:id`
- **Method**: `DELETE`
- **Headers**:

- `Authorization: Bearer <jwt_token>`



- **Success Response**:

- **Code**: 200
- **Content**: `{ "message": "Workout deleted successfully" }`





This API documentation covers all the endpoints we've implemented in the Fitness app backend. You can use these examples to test the API and make any necessary modifications. Remember to replace placeholders like `<jwt_token>`, `exercise_id`, `routine_id`, and `workout_id` with actual values when making requests.

To test these endpoints, you can use tools like Postman or curl. Make sure to set up your environment variables (like the JWT token) for easier testing across multiple requests.

Is there anything specific you'd like me to explain further or any modifications you'd like to make to the API?