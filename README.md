# Fitness App

A React-based fitness application that uses AI to classify fitness levels and assign personalized workout programs based on user metrics and preferences.

## Features

- **AI-Powered Fitness Classification**: Automatically classifies users into Beginner, Intermediate, or Advanced fitness levels
- **Personalized Workout Programs**: Assigns customized workout programs based on fitness level, training days, and goals
- **User Authentication**: Secure registration and login system
- **Workout Tracking**: Save and track workout progress over time
- **Classification History**: View past fitness classifications and track progress
- **Workout History**: Review completed workouts and past programs

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (version 14 or higher)
- **npm** (version 6 or higher) - comes with Node.js
- **Backend API Server** - The application requires a backend server running on `http://localhost:5000` (or configure via environment variable)

## Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd fitness-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

The application connects to a backend API server. By default, it expects the backend to be running at `http://localhost:5000`.

To configure a different backend URL, create a `.env` file in the root directory:

```env
REACT_APP_API_BASE_URL=http://your-backend-url:port
```

## Running the Application

### Development Mode

Start the development server:

```bash
npm start
```

The application will open in your browser at [http://localhost:3000](http://localhost:3000).

The page will automatically reload when you make changes to the code.

### Production Build

To create a production build:

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Running Tests

Run the test suite:

```bash
npm test
```

## Backend Requirements

This application requires a backend API server to function properly. The backend should provide the following endpoints:

- `/api/auth/register` - User registration
- `/api/auth/login` - User login
- `/api/auth/me` - Get current user
- `/api/profile` - Profile management
- `/api/ai/classify` - Fitness level classification
- `/api/ai/assign-workout` - Workout program assignment
- `/api/workouts` - Workout management
- `/api/programs/current` - Get current program
- `/api/programs/past` - Get past programs

**Important**: Ensure the backend server is running before starting the frontend application. If the backend is unavailable, the application will use a fallback rule-based classification system (see Model Limitations below).

## AI Model Summary

### Model Architecture

The application uses a **K-means Clustering and Decision Tree** AI model (`fitness_app_AI_model`) for fitness level classification. The model is hosted on the backend server and processes the following input features:

- **Gender**: Male or Female
- **Squat**: Maximum squat weight (lbs)
- **Bench**: Maximum bench press weight (lbs)
- **Deadlift**: Maximum deadlift weight (lbs)
- **Bodyweight**: User's body weight (lbs)
- **Training Years**: Years of training experience

### Classification Output

The model classifies users into three fitness levels:

1. **Beginner**: For users new to strength training or with lower total lift numbers
2. **Intermediate**: For users with moderate strength levels and some training experience
3. **Advanced**: For experienced lifters with high strength levels

The classification also provides:
- **Confidence Score**: Percentage confidence in the classification (typically 75-95%)
- **Total Lift**: Sum of squat, bench, and deadlift (lbs)
- **Wilks Coefficient**: Strength-to-bodyweight ratio (total lift / bodyweight)

### Model Limitations

1. **Backend Dependency**: The primary AI model requires a backend server. If the backend is unavailable, the application falls back to a rule-based classification system with reduced accuracy.

2. **Fallback System**: The fallback classification uses simple threshold-based rules:
   - **Male users**: 
     - Beginner: Total < 900 lbs
     - Intermediate: 900-1400 lbs
     - Advanced: > 1400 lbs
   - **Female users**:
     - Beginner: Total < 600 lbs
     - Intermediate: 600-900 lbs
     - Advanced: > 900 lbs
   - Confidence scores are lower (60-85%) in fallback mode

3. **Input Validation**: The model assumes valid numeric inputs. Invalid or missing data may result in incorrect classifications.

4. **Gender Binary**: The model currently supports binary gender classification (Male/Female). Gender-adjusted thresholds may not accurately represent all users.

5. **Training Experience**: While training years are considered, the model primarily relies on strength metrics. Users with unusual training backgrounds may receive less accurate classifications.

6. **Static Thresholds**: The fallback system uses fixed thresholds that may not account for:
   - Age-related strength differences
   - Body composition variations
   - Injury history or physical limitations
   - Sport-specific strength requirements

7. **No Real-time Learning**: The model does not learn from user feedback or adapt based on user progress over time.

8. **Limited Context**: The classification is based solely on the provided metrics and does not consider:
   - Cardiovascular fitness
   - Flexibility or mobility
   - Training frequency or consistency
   - Nutrition or recovery factors

### Recommendations

- Always ensure the backend server is running for optimal classification accuracy
- Provide accurate and up-to-date strength metrics for best results
- Consider the classification as a starting point and adjust based on individual needs
- Consult with fitness professionals for personalized guidance beyond the model's recommendations

## Project Structure

```
fitness-app/
├── public/              # Static files and workout program templates
├── src/
│   ├── api.js          # API client and backend communication
│   ├── App.js          # Main application component
│   ├── App.css         # Application styles
│   └── index.js        # Application entry point
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## Troubleshooting

### Backend Connection Issues

If you see connection errors:
1. Verify the backend server is running on the configured port
2. Check the `REACT_APP_API_BASE_URL` environment variable
3. Ensure CORS is properly configured on the backend
4. The application will use fallback classification if the backend is unavailable

### Build Errors

If `npm run build` fails:
- Clear the `node_modules` folder and `package-lock.json`
- Run `npm install` again
- Check Node.js version compatibility

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team or refer to the backend API documentation.
