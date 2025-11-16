import React, { useState } from 'react';
import { Activity, Dumbbell, Target, Calendar, AlertCircle, Check, ArrowRight, Download, TrendingUp } from 'lucide-react';

const FitnessAIApp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [fitnessData, setFitnessData] = useState({
    gender: '',
    squat: '',
    bench: '',
    deadlift: '',
    bodyweight: '',
    trainingYears: ''
  });
  const [workoutPreferences, setWorkoutPreferences] = useState({
    trainingDays: 3,
    goal: 'strength'
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Classification logic (mimics Python K-means classifier)
  const classifyFitnessLevel = (data) => {
    const total = parseFloat(data.squat) + parseFloat(data.bench) + parseFloat(data.deadlift);
    const wilks = total / parseFloat(data.bodyweight);
    const years = parseFloat(data.trainingYears);
    const gender = data.gender;

    let level = 'Beginner';
    let confidence = 75;

    // Gender-adjusted thresholds (women typically have lower absolute strength)
    if (gender === 'female') {
      if (total < 600) {
      level = 'Beginner';
      confidence = 85;
    } else if (total < 900) {
      level = 'Intermediate';
        confidence = 80;
      } else {
      level = 'Advanced';
      confidence = 82;
      }
    } else {
      // Male or other - use original thresholds
      if (total < 900) {
        level = 'Beginner';
        confidence = 85;
      } else if (total < 1400) {
        level = 'Intermediate';
        confidence = 80;
      } else {
        level = 'Advanced';
        confidence = 82;
      }
    }

    // Adjust confidence based on experience
    if (years < 1 && level !== 'Beginner') confidence -= 10;
    if (years > 5 && level === 'Beginner') confidence -= 15;

    confidence = Math.max(60, Math.min(95, confidence));

    return { level, confidence, total, wilks: wilks.toFixed(2) };
  };

  // Workout template assignment logic (mimics Python Decision Tree)
  const assignWorkoutTemplate = (fitnessLevel, preferences, years) => {
    const { trainingDays, goal } = preferences;

    // Beginner templates
    if (fitnessLevel === 'Beginner') {
      if (trainingDays === 3) {
        if (goal === 'muscle_building') {
      return {
            id: 'BEG_MUSCLE_3DAY',
            name: 'Beginner Muscle Building - 3 Day',
            days: 3,
            description: '4-week progressive muscle building program',
            focus: 'Building muscle mass with higher volume',
        workouts: {
              'Week 1 - Day 1 (Push)': ['Bench Press 3x10', 'DB Military Press 3x10', 'Pushups 2xAMRAP', 'Lateral Raises 3x8', 'Chest Flies 3x15'],
              'Week 1 - Day 2 (Pull)': ['Deadlift 3x8', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Rear Delt Flies 3x12'],
              'Week 1 - Day 3 (Legs)': ['Squat 3x10', 'Lunges 3x12', 'Back Extensions 3x10', 'Leg Extensions 3x15', 'Leg Curls 3x15', 'Calf Raises 3x15'],
              'Week 2 - Day 1 (Push)': ['Bench Press 3x10', 'DB Military Press 3x10', 'Pushups 2xAMRAP', 'Lateral Raises 3x8', 'Chest Flies 3x15'],
              'Week 2 - Day 2 (Pull)': ['Deadlift 3x8', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Rear Delt Flies 3x12'],
              'Week 2 - Day 3 (Legs)': ['Squat 3x10', 'Lunges 3x12', 'Back Extensions 3x10', 'Leg Extensions 3x15', 'Leg Curls 3x15', 'Calf Raises 3x15'],
              'Week 3 - Day 1 (Push)': ['Bench Press 3x10', 'DB Military Press 3x10', 'Pushups 2xAMRAP', 'Lateral Raises 3x8', 'Chest Flies 3x15'],
              'Week 3 - Day 2 (Pull)': ['Deadlift 3x8', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Rear Delt Flies 3x12'],
              'Week 3 - Day 3 (Legs)': ['Squat 3x10', 'Lunges 3x12', 'Back Extensions 3x10', 'Leg Extensions 3x15', 'Leg Curls 3x15', 'Calf Raises 3x15'],
              'Week 4 - Day 1 (Push)': ['Bench Press 1x1 (Test)', 'DB Military Press 3x10', 'Pushups 2xAMRAP', 'Lateral Raises 3x8', 'Chest Flies 3x15'],
              'Week 4 - Day 2 (Pull)': ['Deadlift 1x1 (Test)', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Rear Delt Flies 3x12'],
              'Week 4 - Day 3 (Legs)': ['Squat 1x1 (Test)', 'Lunges 3x12', 'Back Extensions 3x10', 'Leg Extensions 3x15', 'Leg Curls 3x15', 'Calf Raises 3x15']
            }
          };
        } else if (goal === 'weight_loss') {
          return {
            id: 'BEG_WEIGHTLOSS_3DAY',
            name: 'Beginner Weight Loss - 3 Day',
            days: 3,
            description: '4-week circuit training program for fat loss',
            focus: 'Burning calories and building lean muscle',
            workouts: {
              'Week 1 - Day 1 (Circuit)': ['Circuit 1: DB Bench Press 3x12', 'Goblet Squats 3x15', 'DB Rows 3x10', 'Lunges 3x8', 'Circuit 2: Bicep Curls 3x12', 'Skullcrushers 3x15', 'Pushups 3xAMRAP'],
              'Week 1 - Day 2 (Circuit)': ['Circuit 1: Deadlift 3x6', 'DB Military Press 3x15', 'Step Ups 3x10', 'Lateral Raises 3x8', 'Circuit 2: Calf Raises 3x12', 'Glute Bridges 3x15', 'Burpees 3x1:00'],
              'Week 1 - Day 3 (Circuit)': ['Circuit 1: Squats 3x12', 'Renegade Rows 3x15', 'Hip Thrusts 3x10', 'Hammer Curls 3x8', 'Circuit 2: Lat Pulldowns 3x12', 'Cable Rows 3x15', 'Pullovers 3x20'],
              'Week 2 - Day 1 (Circuit)': ['Circuit 1: DB Bench Press 3x12', 'Goblet Squats 3x15', 'DB Rows 3x10', 'Lunges 3x8', 'Circuit 2: Bicep Curls 3x12', 'Skullcrushers 3x15', 'Pushups 3xAMRAP'],
              'Week 2 - Day 2 (Circuit)': ['Circuit 1: Deadlift 3x6', 'DB Military Press 3x15', 'Step Ups 3x10', 'Lateral Raises 3x8', 'Circuit 2: Calf Raises 3x12', 'Glute Bridges 3x15', 'Burpees 3x1:00'],
              'Week 2 - Day 3 (Circuit)': ['Circuit 1: Squats 3x12', 'Renegade Rows 3x15', 'Hip Thrusts 3x10', 'Hammer Curls 3x8', 'Circuit 2: Lat Pulldowns 3x12', 'Cable Rows 3x15', 'Pullovers 3x20'],
              'Week 3 - Day 1 (Circuit)': ['Circuit 1: DB Bench Press 3x12', 'Goblet Squats 3x15', 'DB Rows 3x10', 'Lunges 3x8', 'Circuit 2: Bicep Curls 3x12', 'Skullcrushers 3x15', 'Pushups 3xAMRAP'],
              'Week 3 - Day 2 (Circuit)': ['Circuit 1: Deadlift 3x6', 'DB Military Press 3x15', 'Step Ups 3x10', 'Lateral Raises 3x8', 'Circuit 2: Calf Raises 3x12', 'Glute Bridges 3x15', 'Burpees 3x1:00'],
              'Week 3 - Day 3 (Circuit)': ['Circuit 1: Squats 3x12', 'Renegade Rows 3x15', 'Hip Thrusts 3x10', 'Hammer Curls 3x8', 'Circuit 2: Lat Pulldowns 3x12', 'Cable Rows 3x15', 'Pullovers 3x20'],
              'Week 4 - Day 1 (Test)': ['Bench Press 1x1 (Test)', 'DB Military Press 3x10', 'Pushups 2xAMRAP', 'Lateral Raises 3x8', 'Chest Flies 3x15'],
              'Week 4 - Day 2 (Test)': ['Deadlift 1x1 (Test)', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Rear Delt Flies 3x12'],
              'Week 4 - Day 3 (Test)': ['Squat 1x1 (Test)', 'Lunges 3x12', 'Back Extensions 3x10', 'Leg Extensions 3x15', 'Leg Curls 3x15', 'Calf Raises 3x15']
            }
          };
        } else {
      return {
            id: 'BEG_STRENGTH_3DAY',
            name: 'Beginner Full Body - 3 Day',
            days: 3,
            description: '4-week progressive strength program',
            focus: 'Building strength with linear progression',
        workouts: {
              'Week 1 - Day 1 (Push)': ['Bench Press 4x5', 'DB Military Press 3x10', 'Pushups 2xAMRAP', 'Lateral Raises 3x8', 'Chest Flies 3x15'],
              'Week 1 - Day 2 (Pull)': ['Deadlift 4x3', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Rear Delt Flies 3x12'],
              'Week 1 - Day 3 (Legs)': ['Squat 4x5', 'Lunges 3x12', 'Back Extensions 3x10', 'Leg Extensions 3x15', 'Leg Curls 3x15', 'Calf Raises 3x15'],
              'Week 2 - Day 1 (Push)': ['Bench Press 4x5', 'DB Military Press 3x10', 'Pushups 2xAMRAP', 'Lateral Raises 3x8', 'Chest Flies 3x15'],
              'Week 2 - Day 2 (Pull)': ['Deadlift 4x3', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Rear Delt Flies 3x12'],
              'Week 2 - Day 3 (Legs)': ['Squat 4x5', 'Lunges 3x12', 'Back Extensions 3x10', 'Leg Extensions 3x15', 'Leg Curls 3x15', 'Calf Raises 3x15'],
              'Week 3 - Day 1 (Push)': ['Bench Press 4x5', 'DB Military Press 3x10', 'Pushups 2xAMRAP', 'Lateral Raises 3x8', 'Chest Flies 3x15'],
              'Week 3 - Day 2 (Pull)': ['Deadlift 4x3', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Rear Delt Flies 3x12'],
              'Week 3 - Day 3 (Legs)': ['Squat 4x5', 'Lunges 3x12', 'Back Extensions 3x10', 'Leg Extensions 3x15', 'Leg Curls 3x15', 'Calf Raises 3x15'],
              'Week 4 - Day 1 (Push)': ['Bench Press 1x1 (Test)', 'DB Military Press 3x10', 'Pushups 2xAMRAP', 'Lateral Raises 3x8', 'Chest Flies 3x15'],
              'Week 4 - Day 2 (Pull)': ['Deadlift 1x1 (Test)', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Rear Delt Flies 3x12'],
              'Week 4 - Day 3 (Legs)': ['Squat 1x1 (Test)', 'Lunges 3x12', 'Back Extensions 3x10', 'Leg Extensions 3x15', 'Leg Curls 3x15', 'Calf Raises 3x15']
            }
          };
        }
      } else if (trainingDays === 4) {
        if (goal === 'muscle_building') {
        return {
            id: 'BEG_MUSCLE_4DAY',
            name: 'Beginner Upper/Lower - 4 Day',
            days: 4,
            description: '4-week progressive muscle building program',
            focus: 'Building muscle mass with higher volume',
          workouts: {
              'Week 1 - Day 1 (Upper Push)': ['Bench Press 3x10', 'DB Military Press 3x10', 'Pushups 2xAMRAP', 'Lateral Raises 3x8', 'Chest Flies 3x15'],
              'Week 1 - Day 2 (Lower Body)': ['Squat 3x10', 'Lunges 3x12', 'Leg Extensions 3x15', 'Leg Curls 3x15', 'Calf Raises 3x15'],
              'Week 1 - Day 3 (Upper Pull)': ['Deadlift 3x8', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Rear Delt Flies 3x12'],
              'Week 1 - Day 4 (Lower Body & Core)': ['Squat 3x12', 'Back Extensions 3x10', 'Lunges 3x12', 'Leg Extensions 2x15', 'Leg Curls 2x15', 'Calf Raises 3x15'],
              'Week 2 - Day 1 (Upper Push)': ['Bench Press 3x10', 'DB Military Press 3x10', 'Pushups 2xAMRAP', 'Lateral Raises 3x8', 'Chest Flies 3x15'],
              'Week 2 - Day 2 (Lower Body)': ['Squat 3x10', 'Lunges 3x12', 'Leg Extensions 3x15', 'Leg Curls 3x15', 'Calf Raises 3x15'],
              'Week 2 - Day 3 (Upper Pull)': ['Deadlift 3x8', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Rear Delt Flies 3x12'],
              'Week 2 - Day 4 (Lower Body & Core)': ['Squat 3x12', 'Back Extensions 3x10', 'Lunges 3x12', 'Leg Extensions 2x15', 'Leg Curls 2x15', 'Calf Raises 3x15'],
              'Week 3 - Day 1 (Upper Push)': ['Bench Press 3x10', 'DB Military Press 3x10', 'Pushups 2xAMRAP', 'Lateral Raises 3x8', 'Chest Flies 3x15'],
              'Week 3 - Day 2 (Lower Body)': ['Squat 3x10', 'Lunges 3x12', 'Leg Extensions 3x15', 'Leg Curls 3x15', 'Calf Raises 3x15'],
              'Week 3 - Day 3 (Upper Pull)': ['Deadlift 3x8', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Rear Delt Flies 3x12'],
              'Week 3 - Day 4 (Lower Body & Core)': ['Squat 3x12', 'Back Extensions 3x10', 'Lunges 3x12', 'Leg Extensions 2x15', 'Leg Curls 2x15', 'Calf Raises 3x15'],
              'Week 4 - Day 1 (Upper Push)': ['Bench Press 1x1 (Test)', 'DB Military Press 3x10', 'Pushups 2xAMRAP', 'Lateral Raises 3x8', 'Chest Flies 3x15'],
              'Week 4 - Day 2 (Lower Body)': ['Squat 1x1 (Test)', 'Lunges 3x12', 'Leg Extensions 3x15', 'Leg Curls 3x15', 'Calf Raises 3x15'],
              'Week 4 - Day 3 (Upper Pull)': ['Deadlift 1x1 (Test)', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Rear Delt Flies 3x12'],
              'Week 4 - Day 4 (Lower Body & Core)': ['Squat 3x12', 'Back Extensions 3x10', 'Lunges 3x12', 'Leg Extensions 2x15', 'Leg Curls 2x15', 'Calf Raises 3x15']
            }
          };
        } else if (goal === 'weight_loss') {
          return {
            id: 'BEG_WEIGHTLOSS_4DAY',
            name: 'Beginner Weight Loss - 4 Day',
            days: 4,
            description: '4-week circuit training program for fat loss',
            focus: 'Burning calories and building lean muscle',
            workouts: {
              'Week 1 - Day 1 (Full Body Circuit)': ['Circuit 1: DB Bench Press 3x12', 'Goblet Squats 3x15', 'DB Rows 3x10', 'Lunges 3x8', 'Circuit 2: Bicep Curls 3x12', 'Skullcrushers 3x15', 'Pushups 3xAMRAP'],
              'Week 1 - Day 2 (Lower Body Focus)': ['Circuit 1: Goblet Squats 3x15', 'Step Ups 3x10', 'Lunges 3x12', 'Calf Raises 3x15', 'Circuit 2: Glute Bridges 3x15', 'Hip Thrusts 3x12', 'Burpees 3x1:00'],
              'Week 1 - Day 3 (Upper Body & Core)': ['Circuit 1: Deadlift 3x6', 'DB Military Press 3x15', 'Lateral Raises 3x8', 'DB Rows 3x10', 'Circuit 2: Lat Pulldowns 3x12', 'Cable Rows 3x15', 'Pullovers 3x20'],
              'Week 1 - Day 4 (Total Body Metabolic)': ['Circuit 1: Squats 3x12', 'Renegade Rows 3x15', 'Hip Thrusts 3x10', 'Hammer Curls 3x8', 'Circuit 2: Pushups 3xAMRAP', 'Burpees 3x1:00', 'Mountain Climbers 3x0:45'],
              'Week 2 - Day 1 (Full Body Circuit)': ['Circuit 1: DB Bench Press 3x12', 'Goblet Squats 3x15', 'DB Rows 3x10', 'Lunges 3x8', 'Circuit 2: Bicep Curls 3x12', 'Skullcrushers 3x15', 'Pushups 3xAMRAP'],
              'Week 2 - Day 2 (Lower Body Focus)': ['Circuit 1: Goblet Squats 3x15', 'Step Ups 3x10', 'Lunges 3x12', 'Calf Raises 3x15', 'Circuit 2: Glute Bridges 3x15', 'Hip Thrusts 3x12', 'Burpees 3x1:00'],
              'Week 2 - Day 3 (Upper Body & Core)': ['Circuit 1: Deadlift 3x6', 'DB Military Press 3x15', 'Lateral Raises 3x8', 'DB Rows 3x10', 'Circuit 2: Lat Pulldowns 3x12', 'Cable Rows 3x15', 'Pullovers 3x20'],
              'Week 2 - Day 4 (Total Body Metabolic)': ['Circuit 1: Squats 3x12', 'Renegade Rows 3x15', 'Hip Thrusts 3x10', 'Hammer Curls 3x8', 'Circuit 2: Pushups 3xAMRAP', 'Burpees 3x1:00', 'Mountain Climbers 3x0:45'],
              'Week 3 - Day 1 (Full Body Circuit)': ['Circuit 1: DB Bench Press 3x12', 'Goblet Squats 3x15', 'DB Rows 3x10', 'Lunges 3x8', 'Circuit 2: Bicep Curls 3x12', 'Skullcrushers 3x15', 'Pushups 3xAMRAP'],
              'Week 3 - Day 2 (Lower Body Focus)': ['Circuit 1: Goblet Squats 3x15', 'Step Ups 3x10', 'Lunges 3x12', 'Calf Raises 3x15', 'Circuit 2: Glute Bridges 3x15', 'Hip Thrusts 3x12', 'Burpees 3x1:00'],
              'Week 3 - Day 3 (Upper Body & Core)': ['Circuit 1: Deadlift 3x6', 'DB Military Press 3x15', 'Lateral Raises 3x8', 'DB Rows 3x10', 'Circuit 2: Lat Pulldowns 3x12', 'Cable Rows 3x15', 'Pullovers 3x20'],
              'Week 3 - Day 4 (Total Body Metabolic)': ['Circuit 1: Squats 3x12', 'Renegade Rows 3x15', 'Hip Thrusts 3x10', 'Hammer Curls 3x8', 'Circuit 2: Pushups 3xAMRAP', 'Burpees 3x1:00', 'Mountain Climbers 3x0:45'],
              'Week 4 - Day 1 (Upper Push)': ['Bench Press 1x1 (Test)', 'DB Military Press 3x10', 'Pushups 2xAMRAP', 'Lateral Raises 3x8', 'Chest Flies 3x15'],
              'Week 4 - Day 2 (Upper Pull)': ['Deadlift 1x1 (Test)', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Rear Delt Flies 3x12'],
              'Week 4 - Day 3 (Lower Body)': ['Squat 1x1 (Test)', 'Lunges 3x12', 'Back Extensions 3x10', 'Leg Extensions 3x15', 'Leg Curls 3x15', 'Calf Raises 3x15'],
              'Week 4 - Day 4 (Active Recovery/Cardio)': ['Light Cardio 1x20-30 min (Low intensity)', 'Stretching 1x10 min (Full body)', 'Walking 1x15 min (Cool down)']
            }
          };
        } else {
          return {
            id: 'BEG_STRENGTH_4DAY',
            name: 'Beginner Upper/Lower - 4 Day',
            days: 4,
            description: '4-week progressive strength program',
            focus: 'Building strength with linear progression',
            workouts: {
              'Week 1 - Day 1 (Upper Push)': ['Bench Press 4x5', 'DB Military Press 3x10', 'Pushups 2xAMRAP', 'Lateral Raises 3x8', 'Chest Flies 3x15'],
              'Week 1 - Day 2 (Lower Body)': ['Squat 4x5', 'Lunges 3x12', 'Leg Extensions 3x15', 'Leg Curls 3x15', 'Calf Raises 3x15'],
              'Week 1 - Day 3 (Upper Pull)': ['Deadlift 4x3', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Rear Delt Flies 3x12'],
              'Week 1 - Day 4 (Lower Body & Core)': ['Squat 3x8', 'Back Extensions 3x10', 'Lunges 3x12', 'Leg Extensions 2x15', 'Leg Curls 2x15', 'Calf Raises 3x15'],
              'Week 2 - Day 1 (Upper Push)': ['Bench Press 4x5', 'DB Military Press 3x10', 'Pushups 2xAMRAP', 'Lateral Raises 3x8', 'Chest Flies 3x15'],
              'Week 2 - Day 2 (Lower Body)': ['Squat 4x5', 'Lunges 3x12', 'Leg Extensions 3x15', 'Leg Curls 3x15', 'Calf Raises 3x15'],
              'Week 2 - Day 3 (Upper Pull)': ['Deadlift 4x3', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Rear Delt Flies 3x12'],
              'Week 2 - Day 4 (Lower Body & Core)': ['Squat 3x8', 'Back Extensions 3x10', 'Lunges 3x12', 'Leg Extensions 2x15', 'Leg Curls 2x15', 'Calf Raises 3x15'],
              'Week 3 - Day 1 (Upper Push)': ['Bench Press 4x5', 'DB Military Press 3x10', 'Pushups 2xAMRAP', 'Lateral Raises 3x8', 'Chest Flies 3x15'],
              'Week 3 - Day 2 (Lower Body)': ['Squat 4x5', 'Lunges 3x12', 'Leg Extensions 3x15', 'Leg Curls 3x15', 'Calf Raises 3x15'],
              'Week 3 - Day 3 (Upper Pull)': ['Deadlift 4x3', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Rear Delt Flies 3x12'],
              'Week 3 - Day 4 (Lower Body & Core)': ['Squat 3x8', 'Back Extensions 3x10', 'Lunges 3x12', 'Leg Extensions 2x15', 'Leg Curls 2x15', 'Calf Raises 3x15'],
              'Week 4 - Day 1 (Upper Push)': ['Bench Press 1x1 (Test)', 'DB Military Press 3x10', 'Pushups 2xAMRAP', 'Lateral Raises 3x8', 'Chest Flies 3x15'],
              'Week 4 - Day 2 (Lower Body)': ['Squat 1x1 (Test)', 'Lunges 3x12', 'Leg Extensions 3x15', 'Leg Curls 3x15', 'Calf Raises 3x15'],
              'Week 4 - Day 3 (Upper Pull)': ['Deadlift 1x1 (Test)', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Rear Delt Flies 3x12'],
              'Week 4 - Day 4 (Lower Body & Core)': ['Squat 3x8', 'Back Extensions 3x10', 'Lunges 3x12', 'Leg Extensions 2x15', 'Leg Curls 2x15', 'Calf Raises 3x15']
            }
          };
        }
      } else {
        // 5 days
        if (goal === 'muscle_building') {
        return {
            id: 'BEG_MUSCLE_5DAY',
            name: 'Beginner Push/Pull/Legs - 5 Day',
            days: 5,
            description: '4-week progressive muscle building program',
            focus: 'Building muscle mass with higher volume',
          workouts: {
              'Week 1 - Day 1 (Chest & Triceps)': ['Bench Press 3x10', 'Incline DB Press 3x12', 'Chest Flies 3x15', 'Pushups 2xAMRAP', 'Skullcrushers 3x12', 'Tricep Pushdowns 3x15'],
              'Week 1 - Day 2 (Back & Biceps)': ['Deadlift 3x8', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Bicep Curls 3x12', 'Hammer Curls 3x12'],
              'Week 1 - Day 3 (Legs - Quad Focus)': ['Squat 3x10', 'Lunges 3x12', 'Leg Extensions 3x15', 'Leg Press 3x12', 'Calf Raises 4x15'],
              'Week 1 - Day 4 (Shoulders & Abs)': ['DB Military Press 4x10', 'Lateral Raises 3x8', 'Rear Delt Flies 3x12', 'Front Raises 3x12', 'Shrugs 3x15', 'Planks 3x0:45', 'Hanging Leg Raises 3x12'],
              'Week 1 - Day 5 (Legs - Hamstring & Glute Focus)': ['Romanian Deadlift 3x10', 'Leg Curls 3x15', 'Hip Thrusts 3x12', 'Bulgarian Split Squats 3x10', 'Back Extensions 3x12', 'Calf Raises 3x15'],
              'Week 2 - Day 1 (Chest & Triceps)': ['Bench Press 3x10', 'Incline DB Press 3x12', 'Chest Flies 3x15', 'Pushups 2xAMRAP', 'Skullcrushers 3x12', 'Tricep Pushdowns 3x15'],
              'Week 2 - Day 2 (Back & Biceps)': ['Deadlift 3x8', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Bicep Curls 3x12', 'Hammer Curls 3x12'],
              'Week 2 - Day 3 (Legs - Quad Focus)': ['Squat 3x10', 'Lunges 3x12', 'Leg Extensions 3x15', 'Leg Press 3x12', 'Calf Raises 4x15'],
              'Week 2 - Day 4 (Shoulders & Abs)': ['DB Military Press 4x10', 'Lateral Raises 3x8', 'Rear Delt Flies 3x12', 'Front Raises 3x12', 'Shrugs 3x15', 'Planks 3x0:45', 'Hanging Leg Raises 3x12'],
              'Week 2 - Day 5 (Legs - Hamstring & Glute Focus)': ['Romanian Deadlift 3x10', 'Leg Curls 3x15', 'Hip Thrusts 3x12', 'Bulgarian Split Squats 3x10', 'Back Extensions 3x12', 'Calf Raises 3x15'],
              'Week 3 - Day 1 (Chest & Triceps)': ['Bench Press 3x10', 'Incline DB Press 3x12', 'Chest Flies 3x15', 'Pushups 2xAMRAP', 'Skullcrushers 3x12', 'Tricep Pushdowns 3x15'],
              'Week 3 - Day 2 (Back & Biceps)': ['Deadlift 3x8', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Bicep Curls 3x12', 'Hammer Curls 3x12'],
              'Week 3 - Day 3 (Legs - Quad Focus)': ['Squat 3x10', 'Lunges 3x12', 'Leg Extensions 3x15', 'Leg Press 3x12', 'Calf Raises 4x15'],
              'Week 3 - Day 4 (Shoulders & Abs)': ['DB Military Press 4x10', 'Lateral Raises 3x8', 'Rear Delt Flies 3x12', 'Front Raises 3x12', 'Shrugs 3x15', 'Planks 3x0:45', 'Hanging Leg Raises 3x12'],
              'Week 3 - Day 5 (Legs - Hamstring & Glute Focus)': ['Romanian Deadlift 3x10', 'Leg Curls 3x15', 'Hip Thrusts 3x12', 'Bulgarian Split Squats 3x10', 'Back Extensions 3x12', 'Calf Raises 3x15'],
              'Week 4 - Day 1 (Chest Test & Accessories)': ['Bench Press 1x1 (Test)', 'Incline DB Press 3x12', 'Chest Flies 3x15', 'Pushups 2xAMRAP', 'Tricep Pushdowns 3x15'],
              'Week 4 - Day 2 (Deadlift Test & Back Accessories)': ['Deadlift 1x1 (Test)', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Bicep Curls 3x12', 'Hammer Curls 3x12'],
              'Week 4 - Day 3 (Squat Test & Leg Accessories)': ['Squat 1x1 (Test)', 'Lunges 3x12', 'Leg Extensions 3x15', 'Leg Curls 3x15', 'Calf Raises 3x15'],
              'Week 4 - Day 4 (Shoulders & Abs)': ['DB Military Press 3x10', 'Lateral Raises 3x8', 'Rear Delt Flies 3x12', 'Front Raises 3x12', 'Planks 3x1:00', 'Hanging Leg Raises 3x12'],
              'Week 4 - Day 5 (Active Recovery & Mobility)': ['Light Cardio 1x20-30 min (Low intensity)', 'Full Body Stretching 1x15 min (All major muscles)', 'Foam Rolling 1x10 min (Recovery work)', 'Yoga or Mobility Work 1x15 min (Optional)']
            }
          };
        } else if (goal === 'weight_loss') {
          return {
            id: 'BEG_WEIGHTLOSS_5DAY',
            name: 'Beginner Weight Loss - 5 Day',
            days: 5,
            description: '4-week circuit training program for fat loss',
            focus: 'Burning calories and building lean muscle',
            workouts: {
              'Week 1 - Day 1 (Upper Body Circuit)': ['Circuit 1: DB Bench Press 3x12', 'DB Rows 3x10', 'DB Military Press 3x15', 'Lateral Raises 3x8', 'Circuit 2: Bicep Curls 3x12', 'Skullcrushers 3x15', 'Pushups 3xAMRAP', 'Plank 3x0:45'],
              'Week 1 - Day 2 (Lower Body Metabolic)': ['Circuit 1: Goblet Squats 3x15', 'Lunges 3x12', 'Step Ups 3x10', 'Calf Raises 3x15', 'Circuit 2: Glute Bridges 3x15', 'Hip Thrusts 3x12', 'Jump Squats 3x10', 'Burpees 3x1:00'],
              'Week 1 - Day 3 (Full Body Power)': ['Circuit 1: Deadlift 3x6', 'DB Bench Press 3x12', 'Squats 3x12', 'Lat Pulldowns 3x12', 'Circuit 2: Mountain Climbers 3x0:45', 'Burpees 3x1:00', 'High Knees 3x0:45'],
              'Week 1 - Day 4 (Upper Body & Core Blast)': ['Circuit 1: Renegade Rows 3x15', 'DB Military Press 3x15', 'Cable Rows 3x15', 'Pullovers 3x20', 'Circuit 2: Pushups 3xAMRAP', 'Plank 3x1:00', 'Russian Twists 3x20', 'Bicycle Crunches 3x20'],
              'Week 1 - Day 5 (Total Body HIIT)': ['Circuit 1: Squats 3x12', 'Pushups 3xAMRAP', 'Lunges 3x12', 'Hammer Curls 3x8', 'Circuit 2: Burpees 3x1:00', 'Mountain Climbers 3x0:45', 'Jump Squats 3x10', 'High Knees 3x0:45'],
              'Week 2 - Day 1 (Upper Body Circuit)': ['Circuit 1: DB Bench Press 3x12', 'DB Rows 3x10', 'DB Military Press 3x15', 'Lateral Raises 3x8', 'Circuit 2: Bicep Curls 3x12', 'Skullcrushers 3x15', 'Pushups 3xAMRAP', 'Plank 3x0:45'],
              'Week 2 - Day 2 (Lower Body Metabolic)': ['Circuit 1: Goblet Squats 3x15', 'Lunges 3x12', 'Step Ups 3x10', 'Calf Raises 3x15', 'Circuit 2: Glute Bridges 3x15', 'Hip Thrusts 3x12', 'Jump Squats 3x10', 'Burpees 3x1:00'],
              'Week 2 - Day 3 (Full Body Power)': ['Circuit 1: Deadlift 3x6', 'DB Bench Press 3x12', 'Squats 3x12', 'Lat Pulldowns 3x12', 'Circuit 2: Mountain Climbers 3x0:45', 'Burpees 3x1:00', 'High Knees 3x0:45'],
              'Week 2 - Day 4 (Upper Body & Core Blast)': ['Circuit 1: Renegade Rows 3x15', 'DB Military Press 3x15', 'Cable Rows 3x15', 'Pullovers 3x20', 'Circuit 2: Pushups 3xAMRAP', 'Plank 3x1:00', 'Russian Twists 3x20', 'Bicycle Crunches 3x20'],
              'Week 2 - Day 5 (Total Body HIIT)': ['Circuit 1: Squats 3x12', 'Pushups 3xAMRAP', 'Lunges 3x12', 'Hammer Curls 3x8', 'Circuit 2: Burpees 3x1:00', 'Mountain Climbers 3x0:45', 'Jump Squats 3x10', 'High Knees 3x0:45'],
              'Week 3 - Day 1 (Upper Body Circuit)': ['Circuit 1: DB Bench Press 3x12', 'DB Rows 3x10', 'DB Military Press 3x15', 'Lateral Raises 3x8', 'Circuit 2: Bicep Curls 3x12', 'Skullcrushers 3x15', 'Pushups 3xAMRAP', 'Plank 3x0:45'],
              'Week 3 - Day 2 (Lower Body Metabolic)': ['Circuit 1: Goblet Squats 3x15', 'Lunges 3x12', 'Step Ups 3x10', 'Calf Raises 3x15', 'Circuit 2: Glute Bridges 3x15', 'Hip Thrusts 3x12', 'Jump Squats 3x10', 'Burpees 3x1:00'],
              'Week 3 - Day 3 (Full Body Power)': ['Circuit 1: Deadlift 3x6', 'DB Bench Press 3x12', 'Squats 3x12', 'Lat Pulldowns 3x12', 'Circuit 2: Mountain Climbers 3x0:45', 'Burpees 3x1:00', 'High Knees 3x0:45'],
              'Week 3 - Day 4 (Upper Body & Core Blast)': ['Circuit 1: Renegade Rows 3x15', 'DB Military Press 3x15', 'Cable Rows 3x15', 'Pullovers 3x20', 'Circuit 2: Pushups 3xAMRAP', 'Plank 3x1:00', 'Russian Twists 3x20', 'Bicycle Crunches 3x20'],
              'Week 3 - Day 5 (Total Body HIIT)': ['Circuit 1: Squats 3x12', 'Pushups 3xAMRAP', 'Lunges 3x12', 'Hammer Curls 3x8', 'Circuit 2: Burpees 3x1:00', 'Mountain Climbers 3x0:45', 'Jump Squats 3x10', 'High Knees 3x0:45'],
              'Week 4 - Day 1 (Upper Push Test)': ['Bench Press 1x1 (Test)', 'DB Military Press 3x10', 'Pushups 2xAMRAP', 'Lateral Raises 3x8', 'Chest Flies 3x15'],
              'Week 4 - Day 2 (Deadlift Test & Conditioning)': ['Deadlift 1x1 (Test)', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Burpees 3x0:45', 'Mountain Climbers 3x0:45'],
              'Week 4 - Day 3 (Squat Test & Leg Accessories)': ['Squat 1x1 (Test)', 'Lunges 3x12', 'Leg Extensions 3x15', 'Leg Curls 3x15', 'Calf Raises 3x15'],
              'Week 4 - Day 4 (Active Recovery)': ['Light Cardio 1x20-30 min (Low intensity)', 'Full Body Stretching 1x15 min (All major muscles)', 'Walking 1x15 min (Cool down)', 'Foam Rolling 1x10 min (Recovery work)'],
              'Week 4 - Day 5 (Cardio & Core Finisher)': ['Jump Rope 5x1:00 (30 sec rest)', 'Burpees 3x0:45', 'High Knees 3x0:45', 'Plank 3x1:00', 'Russian Twists 3x20', 'Bicycle Crunches 3x20']
            }
          };
        } else {
          return {
            id: 'BEG_STRENGTH_5DAY',
            name: 'Beginner Push/Pull/Legs - 5 Day',
            days: 5,
            description: '4-week progressive strength program',
            focus: 'Building strength with linear progression',
            workouts: {
              'Week 1 - Day 1 (Chest & Triceps)': ['Bench Press 4x5', 'Pushups 2xAMRAP', 'Chest Flies 3x15', 'Skullcrushers 3x12', 'Tricep Dips 3x10'],
              'Week 1 - Day 2 (Back & Biceps)': ['Deadlift 4x3', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Bicep Curls 3x12', 'Hammer Curls 3x10'],
              'Week 1 - Day 3 (Legs - Quad Focus)': ['Squat 4x5', 'Lunges 3x12', 'Leg Extensions 3x15', 'Calf Raises 4x15'],
              'Week 1 - Day 4 (Shoulders & Abs)': ['DB Military Press 4x10', 'Lateral Raises 3x8', 'Rear Delt Flies 3x12', 'Front Raises 3x10', 'Planks 3x0:45', 'Russian Twists 3x20'],
              'Week 1 - Day 5 (Legs - Hamstring & Glute Focus)': ['Romanian Deadlift 3x8', 'Leg Curls 3x15', 'Hip Thrusts 3x12', 'Back Extensions 3x10', 'Calf Raises 3x15'],
              'Week 2 - Day 1 (Chest & Triceps)': ['Bench Press 4x5', 'Pushups 2xAMRAP', 'Chest Flies 3x15', 'Skullcrushers 3x12', 'Tricep Dips 3x10'],
              'Week 2 - Day 2 (Back & Biceps)': ['Deadlift 4x3', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Bicep Curls 3x12', 'Hammer Curls 3x10'],
              'Week 2 - Day 3 (Legs - Quad Focus)': ['Squat 4x5', 'Lunges 3x12', 'Leg Extensions 3x15', 'Calf Raises 4x15'],
              'Week 2 - Day 4 (Shoulders & Abs)': ['DB Military Press 4x10', 'Lateral Raises 3x8', 'Rear Delt Flies 3x12', 'Front Raises 3x10', 'Planks 3x0:45', 'Russian Twists 3x20'],
              'Week 2 - Day 5 (Legs - Hamstring & Glute Focus)': ['Romanian Deadlift 3x8', 'Leg Curls 3x15', 'Hip Thrusts 3x12', 'Back Extensions 3x10', 'Calf Raises 3x15'],
              'Week 3 - Day 1 (Chest & Triceps)': ['Bench Press 4x5', 'Pushups 2xAMRAP', 'Chest Flies 3x15', 'Skullcrushers 3x12', 'Tricep Dips 3x10'],
              'Week 3 - Day 2 (Back & Biceps)': ['Deadlift 4x3', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Bicep Curls 3x12', 'Hammer Curls 3x10'],
              'Week 3 - Day 3 (Legs - Quad Focus)': ['Squat 4x5', 'Lunges 3x12', 'Leg Extensions 3x15', 'Calf Raises 4x15'],
              'Week 3 - Day 4 (Shoulders & Abs)': ['DB Military Press 4x10', 'Lateral Raises 3x8', 'Rear Delt Flies 3x12', 'Front Raises 3x10', 'Planks 3x0:45', 'Russian Twists 3x20'],
              'Week 3 - Day 5 (Legs - Hamstring & Glute Focus)': ['Romanian Deadlift 3x8', 'Leg Curls 3x15', 'Hip Thrusts 3x12', 'Back Extensions 3x10', 'Calf Raises 3x15'],
              'Week 4 - Day 1 (Chest Test & Accessories)': ['Bench Press 1x1 (Test)', 'Pushups 2xAMRAP', 'Chest Flies 3x15', 'Tricep Dips 3x10'],
              'Week 4 - Day 2 (Deadlift Test & Back Accessories)': ['Deadlift 1x1 (Test)', 'Lat Pulldowns 3x10', 'DB 1 Arm Rows 3x10', 'Pullovers 2x15', 'Bicep Curls 3x12'],
              'Week 4 - Day 3 (Squat Test & Leg Accessories)': ['Squat 1x1 (Test)', 'Lunges 3x12', 'Leg Extensions 3x15', 'Leg Curls 3x15', 'Calf Raises 3x15'],
              'Week 4 - Day 4 (Shoulders & Abs)': ['DB Military Press 3x10', 'Lateral Raises 3x8', 'Rear Delt Flies 3x12', 'Planks 3x1:00', 'Russian Twists 3x20'],
              'Week 4 - Day 5 (Active Recovery)': ['Light Cardio 1x20 min (Low intensity)', 'Full Body Stretching 1x15 min (All major muscles)', 'Foam Rolling 1x10 min (Recovery work)']
            }
          };
        }
      }
    }

    // Intermediate templates
    if (fitnessLevel === 'Intermediate') {
      if (trainingDays === 3) {
        if (goal === 'strength') {
          return {
            id: 'INT_STRENGTH_3DAY',
            name: 'Intermediate Full Body - 3 Day',
            days: 3,
            description: '6-week progressive strength program with periodization',
            focus: 'Breaking through plateaus with percentage-based loading',
            workouts: {
              'Week 1 - Day 1 (Full Body - Push Focus)': ['Bench Press 3x3 @70%, 80%, 90%', 'Squat 3x8', 'DB Incline Bench 4x5', 'Hip Thrusts 3x8', 'Lateral Raises 3x15', 'Leg Curls 3x15'],
              'Week 1 - Day 2 (Full Body - Pull Focus)': ['Deadlift 3x3 @70%, 80%, 90%', 'Barbell Rows 4x5', 'Bench Press 4x10 @55%', 'Pull Ups 3x4-8', 'DB Incline Curls 3x12', 'Tricep Extensions 3x12', 'Rear Delt Flies 3x20'],
              'Week 1 - Day 3 (Full Body - Leg Focus)': ['Squat 3x3 @70%, 80%, 90%', 'Military Press 3x3 @70%, 80%, 90%', 'Hack Squats 3x8', 'Weighted Dips 3x8', 'Lunges 3x12', 'Leg Extensions 3x15', 'Calf Raises 3x20'],
              'Week 2 - Day 1 (Full Body - Push Focus)': ['Bench Press 3x5 @65%, 75%, 85%', 'Squat 3x8', 'DB Incline Bench 4x5', 'Hip Thrusts 3x8', 'Lateral Raises 3x15', 'Leg Curls 3x15'],
              'Week 2 - Day 2 (Full Body - Pull Focus)': ['Deadlift 3x5 @65%, 75%, 85%', 'Barbell Rows 4x5', 'Bench Press 4x10 @60%', 'Pull Ups 3x4-8', 'DB Incline Curls 3x12', 'Tricep Extensions 3x12', 'Rear Delt Flies 3x20'],
              'Week 2 - Day 3 (Full Body - Leg Focus)': ['Squat 3x5 @65%, 75%, 85%', 'Military Press 3x5 @65%, 75%, 85%', 'Hack Squats 3x8', 'Weighted Dips 3x8', 'Lunges 3x12', 'Leg Extensions 3x15', 'Calf Raises 3x20'],
              'Week 3 - Day 1 (Full Body - Push Focus)': ['Bench Press 3x3 @72.5%, 82.5%, 92.5%', 'Squat 3x8', 'DB Incline Bench 4x5', 'Hip Thrusts 3x8', 'Lateral Raises 3x15', 'Leg Curls 3x15'],
              'Week 3 - Day 2 (Full Body - Pull Focus)': ['Deadlift 3x3 @72.5%, 82.5%, 92.5%', 'Barbell Rows 4x5', 'Bench Press 4x8 @65%', 'Pull Ups 3x4-8', 'DB Incline Curls 3x12', 'Tricep Extensions 3x12', 'Rear Delt Flies 3x20'],
              'Week 3 - Day 3 (Full Body - Leg Focus)': ['Squat 3x3 @72.5%, 82.5%, 92.5%', 'Military Press 3x3 @72.5%, 82.5%, 92.5%', 'Hack Squats 3x8', 'Weighted Dips 3x8', 'Lunges 3x12', 'Leg Extensions 3x15', 'Calf Raises 3x20'],
              'Week 4 - Day 1 (Full Body - Push Focus)': ['Bench Press 2x7 @55%', 'Squat 2x7 @55%', 'DB Incline Bench 3x8', 'Hip Thrusts 3x8', 'Lateral Raises 3x12', 'Leg Curls 3x12'],
              'Week 4 - Day 2 (Full Body - Pull Focus)': ['Deadlift 2x7 @55%', 'Barbell Rows 3x8', 'Bench Press 3x8 @70%', 'Pull Ups 3x4-8', 'DB Incline Curls 3x10', 'Tricep Extensions 3x10'],
              'Week 4 - Day 3 (Full Body - Leg Focus)': ['Squat 2x7 @55%', 'Military Press 2x7 @55%', 'Hack Squats 3x8', 'Weighted Dips 2x8', 'Lunges 3x10', 'Leg Extensions 3x12'],
              'Week 5 - Day 1 (Full Body - Push Focus)': ['Bench Press 3x5 @67.5%, 77.5%, 87.5%', 'Squat 3x8', 'DB Incline Bench 4x5', 'Hip Thrusts 3x8', 'Lateral Raises 3x15', 'Leg Curls 3x15'],
              'Week 5 - Day 2 (Full Body - Pull Focus)': ['Deadlift 3x5 @67.5%, 77.5%, 87.5%', 'Barbell Rows 4x5', 'Bench Press 4x5 @75%', 'Pull Ups 3x4-8', 'DB Incline Curls 3x12', 'Tricep Extensions 3x12', 'Rear Delt Flies 3x20'],
              'Week 5 - Day 3 (Full Body - Leg Focus)': ['Squat 3x5 @67.5%, 77.5%, 87.5%', 'Military Press 3x5 @67.5%, 77.5%, 87.5%', 'Hack Squats 3x8', 'Weighted Dips 3x8', 'Lunges 3x12', 'Leg Extensions 3x15', 'Calf Raises 3x20'],
              'Week 6 - Day 1 (Push Test)': ['Bench Press 3x5,3,1 @75%, 85%, Max', 'Squat 3x8 (Light weight)', 'DB Incline Bench 3x8', 'Lateral Raises 3x12', 'Chest Flies 3x15'],
              'Week 6 - Day 2 (Pull Test)': ['Deadlift 3x5,3,1 @75%, 85%, Max', 'Barbell Rows 4x5', 'Pull Ups 3x4-8', 'DB Incline Curls 3x12', 'Tricep Extensions 3x12', 'Rear Delt Flies 3x15'],
              'Week 6 - Day 3 (Leg/Shoulder Test)': ['Squat 3x5,3,1 @75%, 85%, Max', 'Military Press 3x5,3,1 @75%, 85%, Max', 'Hack Squats 3x8', 'Weighted Dips 3x8', 'Lunges 3x10', 'Calf Raises 3x15']
            }
          };
        } else if (goal === 'muscle_building') {
          return {
            id: 'INT_MUSCLE_3DAY',
            name: 'Intermediate Muscle Building - 3 Day',
            days: 3,
            description: '6-week progressive hypertrophy program',
            focus: 'Building muscle size with periodization',
            workouts: {
              'Week 1 - Day 1 (Full Body Push Focus)': ['Bench Press 4x8-10 (70-75%)', 'Squat 4x8-10 (70-75%)', 'DB Incline Bench 3x10-12', 'Leg Curls 3x12-15', 'DB Lateral Raises 3x12-15', 'Tricep Pushdowns 3x15-20'],
              'Week 1 - Day 2 (Full Body Pull Focus)': ['Deadlift 4x6-8 (70-75%)', 'Barbell Rows 4x8-10', 'Romanian Deadlift 3x10-12', 'Lat Pulldowns 3x10-12', 'DB Incline Curls 3x12-15', 'Calf Raises 3x15-20'],
              'Week 1 - Day 3 (Full Body Leg Focus)': ['Squat 4x8-10 (70-75%)', 'Military Press 4x8-10 (70-75%)', 'Leg Press 3x12-15', 'Weighted Dips 3x10-12', 'Lunges 3x12-15 (Each leg)', 'Rear Delt Flies 3x15-20'],
              'Week 2 - Day 1 (Full Body Push Focus)': ['Bench Press 4x8-10 (72-77%)', 'Squat 4x8-10 (72-77%)', 'DB Incline Bench 3x10-12', 'Leg Curls 3x12-15', 'DB Lateral Raises 3x12-15', 'Tricep Pushdowns 3x15-20'],
              'Week 2 - Day 2 (Full Body Pull Focus)': ['Deadlift 4x6-8 (72-77%)', 'Barbell Rows 4x8-10', 'Romanian Deadlift 3x10-12', 'Lat Pulldowns 3x10-12', 'DB Incline Curls 3x12-15', 'Calf Raises 3x15-20'],
              'Week 2 - Day 3 (Full Body Leg Focus)': ['Squat 4x8-10 (72-77%)', 'Military Press 4x8-10 (72-77%)', 'Leg Press 3x12-15', 'Weighted Dips 3x10-12', 'Lunges 3x12-15 (Each leg)', 'Rear Delt Flies 3x15-20'],
              'Week 3 - Day 1 (Full Body Push Focus)': ['Bench Press 5x6-8 (75-80%)', 'Squat 5x6-8 (75-80%)', 'DB Incline Bench 4x10-12', 'Leg Curls 3x12-15', 'DB Lateral Raises 4x12-15', 'Skullcrushers 3x12-15'],
              'Week 3 - Day 2 (Full Body Pull Focus)': ['Deadlift 5x5-6 (75-80%)', 'Barbell Rows 4x8-10', 'Romanian Deadlift 4x10-12', 'Lat Pulldowns 4x10-12', 'Ez Bar Curls 3x12-15', 'Calf Raises 3x15-20'],
              'Week 3 - Day 3 (Full Body Leg Focus)': ['Squat 5x6-8 (75-80%)', 'Military Press 5x6-8 (75-80%)', 'Leg Press 4x12-15', 'Weighted Dips 3x10-12', 'Bulgarian Split Squats 3x10-12 (Each leg)', 'Rear Delt Flies 4x15-20'],
              'Week 4 - Day 1 (Full Body Push Focus - Deload)': ['Bench Press 3x10-12 (60%)', 'Squat 3x10-12 (60%)', 'DB Incline Bench 2x10-12', 'Leg Curls 2x12-15', 'DB Lateral Raises 2x12-15'],
              'Week 4 - Day 2 (Full Body Pull Focus - Deload)': ['Deadlift 3x8-10 (60%)', 'Barbell Rows 3x10-12', 'Lat Pulldowns 2x10-12', 'DB Incline Curls 2x10-12', 'Calf Raises 2x15-20'],
              'Week 4 - Day 3 (Active Recovery)': ['Light Cardio 1x20-30 min (Low intensity)', 'Full Body Stretching 1x15 min (All major muscles)', 'Foam Rolling 1x10 min (Recovery work)', 'Yoga/Mobility 1x15 min (Optional)'],
              'Week 5 - Day 1 (Full Body Push Focus)': ['Bench Press 4x10-12 (70-75%)', 'Squat 4x10-12 (70-75%)', 'DB Incline Bench 4x12-15', 'Hack Squats 4x12-15', 'DB Lateral Raises 4x15-20', 'Tricep Pushdowns 4x15-20'],
              'Week 5 - Day 2 (Full Body Pull Focus)': ['Deadlift 4x8-10 (70-75%)', 'Barbell Rows 4x10-12', 'Romanian Deadlift 4x10-12', 'Lat Pulldowns 4x12-15', 'Barbell Curls 4x12-15', 'Calf Raises 4x15-20'],
              'Week 5 - Day 3 (Full Body Leg Focus)': ['Squat 4x10-12 (70-75%)', 'Military Press 4x10-12 (70-75%)', 'Leg Press 4x12-15', 'Weighted Dips 4x10-12', 'Bulgarian Split Squats 4x10-12 (Each leg)', 'Rear Delt Flies 4x15-20'],
              'Week 6 - Day 1 (Full Body Push Focus)': ['Bench Press 5x8-10 (75-80%)', 'Squat 5x8-10 (75-80%)', 'DB Incline Bench 4x12-15', 'Hack Squats 4x12-15', 'DB Lateral Raises 4x15-20', 'Skullcrushers 4x12-15 (Drop set final)'],
              'Week 6 - Day 2 (Full Body Pull Focus)': ['Deadlift 5x6-8 (75-80%)', 'Barbell Rows 4x10-12', 'Romanian Deadlift 5x8-10', 'Lat Pulldowns 4x12-15', 'Barbell Curls 4x12-15 (Drop set final)', 'Calf Raises 4x20-25'],
              'Week 6 - Day 3 (Full Body Leg Focus)': ['Squat 5x8-10 (75-80%)', 'Military Press 5x8-10 (75-80%)', 'Leg Press 4x12-15 (Drop set final)', 'Weighted Dips 4x10-12', 'Bulgarian Split Squats 4x10-12 (Each leg)', 'Rear Delt Flies 4x15-20']
            }
          };
        } else {
          return {
            id: 'INT_WEIGHTLOSS_3DAY',
            name: 'Intermediate Weight Loss - 3 Day',
            days: 3,
            description: '6-week HIIT circuit program',
            focus: 'Fat loss and muscle preservation',
            workouts: {
              'Week 1 - Day 1 (Upper Body Push HIIT)': ['Circuit A: Bench Press 4x12 (Work: 45s, Rest: 30s)', 'Circuit A: Push-Ups 4xMax (Explosive tempo)', 'Circuit A: Dumbbell Shoulder Press 4x15', 'Circuit B: Dips (Bodyweight or Assisted) 3x12', 'Circuit B: Lateral Raises 3x20 (Keep moving)', 'Circuit B: Tricep Pushdowns 3x15', 'Circuit B: Mountain Climbers 3x30 (Finisher)'],
              'Week 1 - Day 2 (Lower Body HIIT)': ['Circuit A: Squat 4x15 (Work: 45s, Rest: 30s)', 'Circuit A: Romanian Deadlift 4x12', 'Circuit A: Walking Lunges 4x20 total', 'Circuit B: Goblet Squats 3x15', 'Circuit B: Leg Press 3x20 (Higher volume)', 'Circuit B: Jump Squats 3x12 (Explosive)', 'Circuit B: Burpees 3x15 (Finisher)'],
              'Week 1 - Day 3 (Upper Body Pull & Core HIIT)': ['Circuit A: Bent-Over Barbell Row 4x12 (Work: 45s, Rest: 30s)', 'Circuit A: Pull-Ups or Lat Pulldown 4x10', 'Circuit A: Single-Arm DB Row 4x12/arm', 'Circuit B: Face Pulls 3x15', 'Circuit B: Barbell Curl 3x15', 'Circuit B: Plank to Push-Up 3x12', 'Circuit B: Russian Twists 3x30 (Finisher)'],
              'Week 2 - Day 1 (Upper Body Push HIIT)': ['Circuit A: Incline Bench Press 4x12 (Work: 40s, Rest: 25s)', 'Circuit A: Push-Ups 4xMax (Faster tempo)', 'Circuit A: Arnold Press 4x12', 'Circuit A: Dips 4xMax (Add weight if possible)', 'Circuit B: Front Raises 3x15', 'Circuit B: Close-Grip Bench 3x15', 'Circuit B: Burpees 3x12 (Finisher)'],
              'Week 2 - Day 2 (Lower Body HIIT)': ['Circuit A: Front Squat 4x12 (Work: 40s, Rest: 25s)', 'Circuit A: Sumo Deadlift 4x12', 'Circuit A: Bulgarian Split Squat 4x12/leg', 'Circuit B: Hack Squat 3x15', 'Circuit B: Leg Curls 3x20', 'Circuit B: Box Jumps 3x10', 'Circuit B: Jumping Lunges 3x20 total (Finisher)'],
              'Week 2 - Day 3 (Upper Body Pull & Core HIIT)': ['Circuit A: T-Bar Row 4x12 (Work: 40s, Rest: 25s)', 'Circuit A: Weighted Pull-Ups 4x8 (Add weight if possible)', 'Circuit A: Cable Row 4x15', 'Circuit B: Reverse Flyes 3x15', 'Circuit B: Hammer Curls 3x15', 'Circuit B: V-Ups 3x15', 'Circuit B: Bicycle Crunches 3x30 (Finisher)'],
              'Week 3 - Day 1 (Upper Body Push HIIT)': ['Circuit A: Flat Dumbbell Press 5x12 (Work: 40s, Rest: 20s)', 'Circuit A: Explosive Push-Ups 4xMax (Clap if possible)', 'Circuit A: Military Press 4x12', 'Circuit A: Weighted Dips 4x12', 'Circuit A: Upright Rows 4x15', 'Circuit B: Diamond Push-Ups 3xMax', 'Circuit B: Mountain Climbers 4x40 (Finisher)'],
              'Week 3 - Day 2 (Lower Body HIIT)': ['Circuit A: Back Squat 5x12 (Work: 40s, Rest: 20s)', 'Circuit A: Conventional Deadlift 4x10', 'Circuit A: Reverse Lunges 4x12/leg', 'Circuit A: Leg Press 4x20', 'Circuit B: Stiff-Leg Deadlift 3x15', 'Circuit B: Jump Squats 4x15', 'Circuit B: Burpee Box Jumps 3x10 (Finisher)'],
              'Week 3 - Day 3 (Upper Body Pull & Core HIIT)': ['Circuit A: Pendlay Row 5x10 (Work: 40s, Rest: 20s)', 'Circuit A: Chin-Ups 4xMax', 'Circuit A: Chest-Supported Row 4x12', 'Circuit A: Cable Face Pulls 4x20', 'Circuit A: EZ Bar Curl 4x15', 'Circuit A: Hanging Knee Raises 4x15', 'Circuit B: Plank Jacks 3x30 (Finisher)'],
              'Week 4 - Day 1 (Upper Body Push HIIT - Deload)': ['Bench Press 3x10 (Work: 40s, Rest: 40s - Controlled tempo)', 'Push-Ups 3x15', 'Dumbbell Press 3x12 (Lighter weight)', 'Dips 3x10', 'Lateral Raises 3x15', 'Overhead Extensions 3x12', 'Burpees 2x10 (Light finisher)'],
              'Week 4 - Day 2 (Lower Body HIIT - Deload)': ['Squat 3x12 (Work: 40s, Rest: 40s)', 'Romanian Deadlift 3x10 (Lighter weight)', 'Lunges 3x12/leg', 'Leg Press 3x15', 'Leg Curls 3x15', 'Bodyweight Squat Jumps 3x12', 'Jump Rope 2x1 min (Light finisher)'],
              'Week 4 - Day 3 (Upper Body Pull & Core HIIT - Deload)': ['Barbell Row 3x10 (Work: 40s, Rest: 40s)', 'Lat Pulldown 3x12 (Lighter weight)', 'Cable Row 3x12', 'Face Pulls 3x15', 'Dumbbell Curl 3x12', 'Dead Bug 3x12', 'Plank 2x45s (Light finisher)'],
              'Week 5 - Day 1 (Upper Body Push HIIT)': ['Circuit A: Bench Press 5x10 (Work: 35s, Rest: 20s)', 'Circuit A: Plyometric Push-Ups 4x10 (Maximum power)', 'Circuit A: Seated Press 5x12', 'Circuit A: Weighted Dips 4x15', 'Circuit A: Cable Lateral Raises 4x20', 'Circuit A: Skull Crushers 4x15', 'Circuit B: Burpee to Push-Up 4x12 (Finisher)'],
              'Week 5 - Day 2 (Lower Body HIIT)': ['Circuit A: Squat 5x10 (Work: 35s, Rest: 20s)', 'Circuit A: Deadlift 5x8 (Heavy but controlled)', 'Circuit A: Walking Lunges 4x24 total', 'Circuit A: Hack Squat 4x15', 'Circuit A: Good Mornings 4x12', 'Circuit A: Box Jumps 4x12', 'Circuit B: Squat Thrusters 4x15 (Finisher)'],
              'Week 5 - Day 3 (Upper Body Pull & Core HIIT)': ['Circuit A: Barbell Row 5x10 (Work: 35s, Rest: 20s)', 'Circuit A: Weighted Pull-Ups 5x6-8 (Heavy)', 'Circuit A: T-Bar Row 4x12', 'Circuit A: Cable Pullovers 4x15', 'Circuit A: Cable Curl 4x15', 'Circuit A: Toes to Bar 4x12 (Or knee raises)', 'Circuit B: Russian Twist 4x40 (Finisher)'],
              'Week 6 - Day 1 (Upper Body Push HIIT - Peak)': ['Circuit A: Bench Press 6x8 (Work: 30s, Rest: 15s)', 'Circuit A: Explosive Push-Ups 5xMax (All-out effort)', 'Circuit A: Push Press 5x10', 'Circuit A: Dips 5xMax (Heavy if possible)', 'Circuit A: Face Pulls Superset Lateral Raises 4x15 each (No rest between)', 'Circuit A: Close-Grip Press 4x12', 'Circuit B: Burpees 5x15 (Max effort finisher)'],
              'Week 6 - Day 2 (Lower Body HIIT - Peak)': ['Circuit A: Squat 6x8 (Work: 30s, Rest: 15s)', 'Circuit A: Deadlift 5x6 (Heavy)', 'Circuit A: Bulgarian Split Squat 5x10/leg', 'Circuit A: Leg Press 4x25 (High volume)', 'Circuit A: Romanian Deadlift 4x12', 'Circuit A: Jump Squats 5x15', 'Circuit B: Burpee Box Jump 4x12 (Max effort finisher)'],
              'Week 6 - Day 3 (Upper Body Pull & Core HIIT - Peak)': ['Circuit A: Barbell Row 6x8 (Work: 30s, Rest: 15s)', 'Circuit A: Weighted Pull-Ups 5x5 (Heavy weight)', 'Circuit A: Cable Row 5x15 (High tension)', 'Circuit A: Dumbbell Pullover 4x12', 'Circuit A: Barbell Curl 4x12', 'Circuit A: Hanging Leg Raises 5x12', 'Circuit B: Mountain Climbers 5xMax (Finisher)']
            }
          };
        }
      } else if (trainingDays === 4) {
        if (goal === 'strength') {
        return {
          id: 'INT_STRENGTH_4DAY',
            name: 'Intermediate Strength - 4 Day',
          days: 4,
            description: '6-week progressive strength program with periodization',
            focus: 'Breaking through plateaus with percentage-based loading',
          workouts: {
              'Week 1 - Day 1 (Upper Push)': ['Bench Press 3x3 @70%, 80%, 90%', 'Military Press 3x8', 'DB Incline Bench 4x5', 'Weighted Dips 3x8', 'Lateral Raises 3x15', 'Chest Flies 3x20'],
              'Week 1 - Day 2 (Lower Body)': ['Deadlift 3x3 @70%, 80%, 90%', 'Hack Squats 4x5', 'Lunges 3x8', 'Leg Extensions 3x15', 'Weighted Marches 3x20'],
              'Week 1 - Day 3 (Upper Pull/Volume Bench)': ['Bench Press 4x10 @55%', 'Barbell Rows 4x5', 'Pull Ups 3x4-8', 'DB Incline Curls 4x5', 'Tricep Extensions 3x8', 'Pull Throughs 3x15', 'Rear Delt Flies 3x20'],
              'Week 1 - Day 4 (Lower Body)': ['Squat 3x3 @70%, 80%, 90%', 'Hip Thrusts 4x5', 'Leg Curls 3x8', 'Back Extensions 3x15', 'Calf Raises 3x20'],
              'Week 2 - Day 1 (Upper Push)': ['Bench Press 3x5 @65%, 75%, 85%', 'Military Press 3x8', 'DB Incline Bench 4x5', 'Weighted Dips 3x8', 'Lateral Raises 3x15', 'Chest Flies 3x20'],
              'Week 2 - Day 2 (Lower Body)': ['Deadlift 3x5 @65%, 75%, 85%', 'Hack Squats 4x5', 'Lunges 3x8', 'Leg Extensions 3x15', 'Weighted Marches 3x20'],
              'Week 2 - Day 3 (Upper Pull/Volume Bench)': ['Bench Press 4x10 @60%', 'Barbell Rows 4x5', 'Pull Ups 3x4-8', 'DB Incline Curls 4x5', 'Tricep Extensions 3x8', 'Pull Throughs 3x15', 'Rear Delt Flies 3x20'],
              'Week 2 - Day 4 (Lower Body)': ['Squat 3x5 @65%, 75%, 85%', 'Hip Thrusts 4x5', 'Leg Curls 3x8', 'Back Extensions 3x15', 'Calf Raises 3x20'],
              'Week 3 - Day 1 (Upper Push)': ['Bench Press 3x3 @72.5%, 82.5%, 92.5%', 'Military Press 3x8', 'DB Incline Bench 4x5', 'Weighted Dips 3x8', 'Lateral Raises 3x15', 'Chest Flies 3x20'],
              'Week 3 - Day 2 (Lower Body)': ['Deadlift 3x3 @72.5%, 82.5%, 92.5%', 'Hack Squats 4x5', 'Lunges 3x8', 'Leg Extensions 3x15', 'Weighted Marches 3x20'],
              'Week 3 - Day 3 (Upper Pull/Volume Bench)': ['Bench Press 4x8 @65%', 'Barbell Rows 4x5', 'Pull Ups 3x4-8', 'DB Incline Curls 4x5', 'Tricep Extensions 3x8', 'Pull Throughs 3x15', 'Rear Delt Flies 3x20'],
              'Week 3 - Day 4 (Lower Body)': ['Squat 3x3 @72.5%, 82.5%, 92.5%', 'Hip Thrusts 4x5', 'Leg Curls 3x8', 'Back Extensions 3x15', 'Calf Raises 3x20'],
              'Week 4 - Day 1 (Upper Push)': ['Bench Press 2x7 @55%', 'Military Press 2x7 @55%', 'DB Incline Bench 4x5', 'Weighted Dips 3x8', 'Lateral Raises 3x15', 'Chest Flies 3x20'],
              'Week 4 - Day 2 (Lower Body)': ['Deadlift 2x7 @55%', 'Hack Squats 4x5', 'Lunges 3x8', 'Leg Extensions 3x15', 'Weighted Marches 3x20'],
              'Week 4 - Day 3 (Upper Pull/Volume Bench)': ['Bench Press 3x8 @70%', 'Barbell Rows 4x5', 'Pull Ups 3x4-8', 'DB Incline Curls 3x5', 'Tricep Extensions 2x8', 'Pull Throughs 3x15', 'Rear Delt Flies 3x20'],
              'Week 4 - Day 4 (Lower Body)': ['Squat 2x7 @55%', 'Hip Thrusts 4x5', 'Leg Curls 3x8', 'Back Extensions 3x15', 'Calf Raises 3x20'],
              'Week 5 - Day 1 (Upper Push)': ['Bench Press 3x5 @67.5%, 77.5%, 87.5%', 'Military Press 3x8', 'DB Incline Bench 4x5', 'Weighted Dips 3x8', 'Lateral Raises 3x15', 'Chest Flies 3x20'],
              'Week 5 - Day 2 (Lower Body)': ['Deadlift 3x5 @67.5%, 77.5%, 87.5%', 'Hack Squats 4x5', 'Lunges 3x8', 'Leg Extensions 3x15', 'Weighted Marches 3x20'],
              'Week 5 - Day 3 (Upper Pull/Volume Bench)': ['Bench Press 4x5 @75%', 'Barbell Rows 4x5', 'Pull Ups 3x4-8', 'DB Incline Curls 4x5', 'Tricep Extensions 3x8', 'Pull Throughs 3x15', 'Rear Delt Flies 3x20'],
              'Week 5 - Day 4 (Lower Body)': ['Squat 3x5 @67.5%, 77.5%, 87.5%', 'Hip Thrusts 4x5', 'Leg Curls 3x8', 'Back Extensions 3x15', 'Calf Raises 3x20'],
              'Week 6 - Day 1 (Upper Push)': ['Bench Press 3x5,3,1 @75%, 85%, Max', 'Military Press 3x5,3,1 @75%, 85%, Max', 'DB Incline Bench 4x5', 'Weighted Dips 3x8', 'Lateral Raises 3x15', 'Chest Flies 3x20'],
              'Week 6 - Day 2 (Lower Body)': ['Deadlift 3x5,3,1 @75%, 85%, Max', 'Hack Squats 4x5', 'Lunges 3x8', 'Leg Extensions 3x15', 'Weighted Marches 3x20'],
              'Week 6 - Day 3 (Upper Pull)': ['Barbell Rows 4x5', 'Pull Ups 3x4-8', 'DB Incline Curls 4x5', 'Tricep Extensions 3x8', 'Pull Throughs 3x15', 'Rear Delt Flies 3x20'],
              'Week 6 - Day 4 (Lower Body)': ['Squat 3x5,3,1 @75%, 85%, Max', 'Hip Thrusts 4x5', 'Leg Curls 3x8', 'Back Extensions 3x15', 'Calf Raises 3x20']
            }
          };
        } else if (goal === 'muscle_building') {
          return {
            id: 'INT_MUSCLE_4DAY',
            name: 'Intermediate Upper/Lower - 4 Day',
            days: 4,
            description: '6-week progressive hypertrophy program',
            focus: 'Building muscle size with periodization',
            workouts: {
              'Week 1 - Day 1 (Upper Push)': ['Bench Press 4x8-10 (70-75%)', 'Military Press 4x8-10 (70-75%)', 'DB Incline Bench 4x10-12', 'Weighted Dips 3x10-12', 'DB Lateral Raises 3x12-15', 'Chest Flies 3x15-20', 'Skullcrushers 3x12-15', 'Tricep Pushdowns 3x15-20'],
              'Week 1 - Day 2 (Lower Body)': ['Squat 4x8-10 (70-75%)', 'Romanian Deadlift 4x8-10', 'Hack Squats 4x10-12', 'Leg Curls 4x12-15', 'Lunges 3x12-15 (Each leg)', 'Leg Extensions 3x15-20', 'Calf Raises 4x15-20'],
              'Week 1 - Day 3 (Upper Pull)': ['Deadlift 4x6-8 (70-75%)', 'Barbell Rows 4x8-10', 'Lat Pulldowns 4x10-12', 'Pull Ups 3x6-10', 'DB Incline Curls 4x10-12', 'Rear Delt Flies 3x15-20', 'Ez Bar Curls 3x12-15'],
              'Week 1 - Day 4 (Lower Body)': ['Hip Thrusts 4x10-12', 'Leg Press 4x12-15', 'Bulgarian Split Squats 3x10-12 (Each leg)', 'Leg Curls 4x12-15', 'Leg Extensions 3x15-20', 'Back Extensions 3x12-15', 'Calf Raises 4x15-20'],
              'Week 2 - Day 1 (Upper Push)': ['Bench Press 4x8-10 (72-77%)', 'Military Press 4x8-10 (72-77%)', 'DB Incline Bench 4x10-12', 'Weighted Dips 3x10-12', 'DB Lateral Raises 3x12-15', 'Chest Flies 3x15-20', 'Skullcrushers 3x12-15', 'Tricep Pushdowns 3x15-20'],
              'Week 2 - Day 2 (Lower Body)': ['Squat 4x8-10 (72-77%)', 'Romanian Deadlift 4x8-10', 'Hack Squats 4x10-12', 'Leg Curls 4x12-15', 'Lunges 3x12-15 (Each leg)', 'Leg Extensions 3x15-20', 'Calf Raises 4x15-20'],
              'Week 2 - Day 3 (Upper Pull)': ['Deadlift 4x6-8 (72-77%)', 'Barbell Rows 4x8-10', 'Lat Pulldowns 4x10-12', 'Pull Ups 3x6-10', 'DB Incline Curls 4x10-12', 'Rear Delt Flies 3x15-20', 'Ez Bar Curls 3x12-15'],
              'Week 2 - Day 4 (Lower Body)': ['Hip Thrusts 4x10-12', 'Leg Press 4x12-15', 'Bulgarian Split Squats 3x10-12 (Each leg)', 'Leg Curls 4x12-15', 'Leg Extensions 3x15-20', 'Back Extensions 3x12-15', 'Calf Raises 4x15-20'],
              'Week 3 - Day 1 (Upper Push)': ['Bench Press 5x6-8 (75-80%)', 'Military Press 5x6-8 (75-80%)', 'DB Incline Bench 4x10-12', 'Weighted Dips 3x10-12', 'DB Lateral Raises 4x12-15', 'Chest Flies 3x15-20', 'Skullcrushers 4x12-15', 'Tricep Pushdowns 3x15-20'],
              'Week 3 - Day 2 (Lower Body)': ['Squat 5x6-8 (75-80%)', 'Romanian Deadlift 4x8-10', 'Hack Squats 4x10-12', 'Leg Curls 4x12-15', 'Lunges 3x12-15 (Each leg)', 'Leg Extensions 4x15-20', 'Calf Raises 4x15-20'],
              'Week 3 - Day 3 (Upper Pull)': ['Deadlift 5x5-6 (75-80%)', 'Barbell Rows 4x8-10', 'Lat Pulldowns 4x10-12', 'Pull Ups 3x6-10', 'DB Incline Curls 4x10-12', 'Rear Delt Flies 4x15-20', 'Ez Bar Curls 3x12-15'],
              'Week 3 - Day 4 (Lower Body)': ['Hip Thrusts 4x10-12', 'Leg Press 4x12-15', 'Bulgarian Split Squats 3x10-12 (Each leg)', 'Leg Curls 4x12-15', 'Leg Extensions 4x15-20', 'Back Extensions 3x12-15', 'Calf Raises 4x15-20'],
              'Week 4 - Day 1 (Upper Push - Deload)': ['Bench Press 3x10-12 (60%)', 'Military Press 3x10-12 (60%)', 'DB Incline Bench 3x10-12', 'Chest Flies 3x15-20', 'DB Lateral Raises 3x12-15', 'Tricep Pushdowns 3x12-15'],
              'Week 4 - Day 2 (Lower Body - Deload)': ['Squat 3x10-12 (60%)', 'Romanian Deadlift 3x10-12', 'Leg Press 3x12-15', 'Leg Curls 3x12-15', 'Leg Extensions 3x15-20', 'Calf Raises 3x15-20'],
              'Week 4 - Day 3 (Upper Pull - Deload)': ['Deadlift 3x8-10 (60%)', 'Barbell Rows 3x10-12', 'Lat Pulldowns 3x10-12', 'Pull Ups 3x6-8', 'DB Incline Curls 3x10-12', 'Rear Delt Flies 3x15-20'],
              'Week 4 - Day 4 (Active Recovery)': ['Light Cardio 1x20-30 min (Low intensity)', 'Full Body Stretching 1x15 min (All major muscles)', 'Foam Rolling 1x10 min (Recovery work)', 'Yoga/Mobility 1x15 min (Optional)'],
              'Week 5 - Day 1 (Upper Push)': ['Bench Press 4x10-12 (70-75%)', 'Military Press 4x10-12 (70-75%)', 'DB Incline Bench 4x12-15', 'Weighted Dips 4x10-12', 'DB Lateral Raises 4x12-15', 'DB Front Raises 3x12-15', 'Chest Flies 4x15-20', 'Skullcrushers 3x15-20', 'Tricep Pushdowns 3x20-25'],
              'Week 5 - Day 2 (Lower Body)': ['Squat 4x10-12 (70-75%)', 'Romanian Deadlift 4x10-12', 'Leg Press 4x12-15', 'Hack Squats 3x12-15', 'Leg Curls 4x12-15', 'Lunges 3x15-20 (Each leg)', 'Leg Extensions 4x20-25', 'Calf Raises 4x20-25'],
              'Week 5 - Day 3 (Upper Pull)': ['Deadlift 4x8-10 (70-75%)', 'Barbell Rows 4x10-12', 'Lat Pulldowns 4x12-15', 'DB 1 Arm Rows 3x12-15 (Each arm)', 'Pull Ups 3x8-12', 'Barbell Curls 4x10-12', 'Hammer Curls 3x12-15', 'Rear Delt Flies 4x15-20'],
              'Week 5 - Day 4 (Lower Body)': ['Hip Thrusts 4x12-15', 'Leg Press 4x12-15', 'Bulgarian Split Squats 4x10-12 (Each leg)', 'Leg Curls 4x15-20', 'Leg Extensions 4x20-25', 'Good Mornings 3x12-15', 'Back Extensions 3x15-20', 'Calf Raises 4x20-25'],
              'Week 6 - Day 1 (Upper Push)': ['Bench Press 5x8-10 (75-80%)', 'Military Press 5x8-10 (75-80%)', 'DB Incline Bench 4x12-15', 'Weighted Dips 4x10-12', 'DB Lateral Raises 4x15-20', 'DB Front Raises 4x15-20', 'Cable Crossovers 4x12-15', 'Chest Flies 4x15-20', 'Skullcrushers 4x12-15', 'Tricep Pushdowns 4x15-20 (Drop set final)'],
              'Week 6 - Day 2 (Lower Body)': ['Squat 5x8-10 (75-80%)', 'Romanian Deadlift 5x8-10', 'Leg Press 4x12-15', 'Hack Squats 4x12-15', 'Leg Curls 4x15-20', 'Lunges 3x15-20 (Each leg)', 'Leg Extensions 4x20-25 (Drop set final)', 'Calf Raises 4x20-25'],
              'Week 6 - Day 3 (Upper Pull)': ['Deadlift 5x6-8 (75-80%)', 'Barbell Rows 4x10-12', 'Lat Pulldowns 4x12-15', 'DB 1 Arm Rows 4x12-15 (Each arm)', 'Pull Ups 4x8-12', 'Barbell Curls 4x10-12', 'Hammer Curls 4x12-15', 'Cable Curls 3x15-20 (Drop set final)', 'Rear Delt Flies 4x15-20'],
              'Week 6 - Day 4 (Lower Body)': ['Hip Thrusts 5x10-12', 'Leg Press 4x12-15', 'Bulgarian Split Squats 4x10-12 (Each leg)', 'Leg Curls 4x15-20 (Drop set final)', 'Leg Extensions 4x20-25', 'Good Mornings 3x12-15', 'Back Extensions 4x15-20', 'Calf Raises 4x20-25 (Drop set final)']
          }
        };
      } else {
        return {
            id: 'INT_WEIGHTLOSS_4DAY',
            name: 'Intermediate Weight Loss - 4 Day',
            days: 4,
            description: '6-week HIIT circuit program',
            focus: 'Fat loss and muscle preservation',
            workouts: {
              'Week 1 - Day 1 (Upper Body Push HIIT)': ['Circuit A: Bench Press 4x12 (Work: 45s, Rest: 30s)', 'Circuit A: Incline Dumbbell Press 4x12', 'Circuit A: Dumbbell Shoulder Press 4x15', 'Circuit B: Push-Ups 3xMax (Explosive tempo)', 'Circuit B: Lateral Raises 3x20 (Keep moving)', 'Circuit B: Tricep Pushdowns 3x15', 'Circuit B: Dips 3x12'],
              'Week 1 - Day 2 (Lower Body HIIT)': ['Circuit A: Squat 4x15 (Work: 45s, Rest: 30s)', 'Circuit A: Romanian Deadlift 4x12', 'Circuit A: Walking Lunges 4x20 total', 'Circuit A: Leg Press 4x20', 'Circuit B: Goblet Squats 3x15', 'Circuit B: Leg Curls 3x15', 'Circuit B: Calf Raises 3x20', 'Circuit B: Jump Squats 3x12 (Explosive)'],
              'Week 1 - Day 3 (Upper Body Pull HIIT)': ['Circuit A: Bent-Over Barbell Row 4x12 (Work: 45s, Rest: 30s)', 'Circuit A: Pull-Ups or Lat Pulldown 4x10', 'Circuit A: Single-Arm DB Row 4x12/arm', 'Circuit A: Cable Row 4x15', 'Circuit B: Face Pulls 3x15', 'Circuit B: Barbell Curl 3x15', 'Circuit B: Hammer Curls 3x12', 'Circuit B: Reverse Flyes 3x15'],
              'Week 1 - Day 4 (Full Body Core & Conditioning HIIT)': ['Circuit A: Deadlift 4x10 (Work: 45s, Rest: 30s)', 'Circuit A: Front Squat 4x12', 'Circuit A: Push Press 4x12', 'Circuit A: Plank to Push-Up 4x12', 'Circuit B: Russian Twists 3x30', 'Circuit B: Hanging Knee Raises 3x15', 'Circuit B: Mountain Climbers 3x40', 'Circuit B: Burpees 3x15 (Finisher)'],
              'Week 2 - Day 1 (Upper Body Push HIIT)': ['Circuit A: Incline Bench Press 4x12 (Work: 40s, Rest: 25s)', 'Circuit A: Flat Dumbbell Press 4x12', 'Circuit A: Arnold Press 4x12', 'Circuit A: Dips 4xMax (Add weight if possible)', 'Circuit B: Push-Ups 3xMax (Faster tempo)', 'Circuit B: Front Raises 3x15', 'Circuit B: Close-Grip Bench 3x15', 'Circuit B: Overhead Tricep Extension 3x15'],
              'Week 2 - Day 2 (Lower Body HIIT)': ['Circuit A: Front Squat 4x12 (Work: 40s, Rest: 25s)', 'Circuit A: Sumo Deadlift 4x12', 'Circuit A: Bulgarian Split Squat 4x12/leg', 'Circuit A: Hack Squat 4x15', 'Circuit B: Leg Curls 3x20', 'Circuit B: Leg Extensions 3x20', 'Circuit B: Calf Raises 3x25', 'Circuit B: Box Jumps 3x10'],
              'Week 2 - Day 3 (Upper Body Pull HIIT)': ['Circuit A: T-Bar Row 4x12 (Work: 40s, Rest: 25s)', 'Circuit A: Weighted Pull-Ups 4x8 (Add weight if possible)', 'Circuit A: Cable Row 4x15', 'Circuit A: Chest-Supported Row 4x12', 'Circuit B: Reverse Flyes 3x15', 'Circuit B: Hammer Curls 3x15', 'Circuit B: Cable Curl 3x15', 'Circuit B: Face Pulls 3x20'],
              'Week 2 - Day 4 (Full Body Core & Conditioning HIIT)': ['Circuit A: Conventional Deadlift 4x10 (Work: 40s, Rest: 25s)', 'Circuit A: Goblet Squat 4x15', 'Circuit A: Military Press 4x12', 'Circuit A: V-Ups 4x15', 'Circuit B: Bicycle Crunches 3x30', 'Circuit B: Plank Shoulder Taps 3x20', 'Circuit B: Jumping Lunges 3x20 total', 'Circuit B: Burpees 3x12 (Finisher)'],
              'Week 3 - Day 1 (Upper Body Push HIIT)': ['Circuit A: Flat Dumbbell Press 5x12 (Work: 40s, Rest: 20s)', 'Circuit A: Incline Barbell Press 4x10', 'Circuit A: Military Press 4x12', 'Circuit A: Weighted Dips 4x12', 'Circuit A: Upright Rows 4x15', 'Circuit B: Explosive Push-Ups 3xMax (Clap if possible)', 'Circuit B: Cable Flyes 3x15', 'Circuit B: Diamond Push-Ups 3xMax', 'Circuit B: Dips 3x12'],
              'Week 3 - Day 2 (Lower Body HIIT)': ['Circuit A: Back Squat 5x12 (Work: 40s, Rest: 20s)', 'Circuit A: Conventional Deadlift 4x10', 'Circuit A: Reverse Lunges 4x12/leg', 'Circuit A: Leg Press 4x20', 'Circuit B: Stiff-Leg Deadlift 3x15', 'Circuit B: Leg Curls 3x20', 'Circuit B: Calf Raises 3x25', 'Circuit B: Jump Squats 4x15'],
              'Week 3 - Day 3 (Upper Body Pull HIIT)': ['Circuit A: Pendlay Row 5x10 (Work: 40s, Rest: 20s)', 'Circuit A: Chin-Ups 4xMax', 'Circuit A: Chest-Supported Row 4x12', 'Circuit A: Cable Face Pulls 4x20', 'Circuit A: EZ Bar Curl 4x15', 'Circuit B: Straight Arm Pulldown 3x15', 'Circuit B: Preacher Curl 3x12', 'Circuit B: Reverse Grip Row 3x12', 'Circuit B: Cable Curl 3x15'],
              'Week 3 - Day 4 (Full Body Core & Conditioning HIIT)': ['Circuit A: Deadlift 5x8 (Work: 40s, Rest: 20s)', 'Circuit A: Front Squat 4x12', 'Circuit A: Push Press 4x12', 'Circuit A: Hanging Knee Raises 4x15', 'Circuit B: Russian Twists 3x40', 'Circuit B: Plank Jacks 3x30', 'Circuit B: Mountain Climbers 4x40', 'Circuit B: Burpee Box Jumps 3x10 (Finisher)'],
              'Week 4 - Day 1 (Upper Body Push HIIT - Deload)': ['Bench Press 3x10 (Work: 40s, Rest: 40s - Controlled tempo)', 'Incline Dumbbell Press 3x12 (Lighter weight)', 'Dumbbell Shoulder Press 3x12', 'Dips 3x10', 'Lateral Raises 3x15', 'Tricep Extensions 3x12'],
              'Week 4 - Day 2 (Lower Body HIIT - Deload)': ['Squat 3x12 (Work: 40s, Rest: 40s)', 'Romanian Deadlift 3x10 (Lighter weight)', 'Lunges 3x12/leg', 'Leg Press 3x15', 'Leg Curls 3x15', 'Calf Raises 3x20'],
              'Week 4 - Day 3 (Upper Body Pull HIIT - Deload)': ['Barbell Row 3x10 (Work: 40s, Rest: 40s)', 'Lat Pulldown 3x12 (Lighter weight)', 'Cable Row 3x12', 'Face Pulls 3x15', 'Dumbbell Curl 3x12', 'Hammer Curl 3x12'],
              'Week 4 - Day 4 (Active Recovery & Core - Deload)': ['Bodyweight Squat Jumps 3x12 (Work: 40s, Rest: 40s)', 'Push-Ups 3x15 (Controlled tempo)', 'Dead Bug 3x12', 'Plank 3x45s', 'Bird Dog 3x12', 'Jump Rope 2x1 min (Light finisher)'],
              'Week 5 - Day 1 (Upper Body Push HIIT)': ['Circuit A: Bench Press 5x10 (Work: 35s, Rest: 20s)', 'Circuit A: Incline Dumbbell Press 5x10', 'Circuit A: Seated Press 5x12', 'Circuit A: Weighted Dips 4x15', 'Circuit A: Cable Lateral Raises 4x20', 'Circuit B: Plyometric Push-Ups 3x10 (Maximum power)', 'Circuit B: Skull Crushers 4x15', 'Circuit B: Cable Flyes 3x15', 'Circuit B: Burpee to Push-Up 4x12 (Finisher)'],
              'Week 5 - Day 2 (Lower Body HIIT)': ['Circuit A: Squat 5x10 (Work: 35s, Rest: 20s)', 'Circuit A: Deadlift 5x8 (Heavy but controlled)', 'Circuit A: Walking Lunges 4x24 total', 'Circuit A: Hack Squat 4x15', 'Circuit B: Good Mornings 4x12', 'Circuit B: Leg Curls 3x20', 'Circuit B: Calf Raises 3x25', 'Circuit B: Box Jumps 4x12'],
              'Week 5 - Day 3 (Upper Body Pull HIIT)': ['Circuit A: Barbell Row 5x10 (Work: 35s, Rest: 20s)', 'Circuit A: Weighted Pull-Ups 5x6-8 (Heavy)', 'Circuit A: T-Bar Row 4x12', 'Circuit A: Cable Pullovers 4x15', 'Circuit B: Cable Curl 4x15', 'Circuit B: Face Pulls 3x20', 'Circuit B: Preacher Curl 3x12', 'Circuit B: Reverse Flyes 3x15'],
              'Week 5 - Day 4 (Full Body Core & Conditioning HIIT)': ['Circuit A: Deadlift 5x8 (Work: 35s, Rest: 20s)', 'Circuit A: Front Squat 4x12', 'Circuit A: Push Press 4x12', 'Circuit A: Toes to Bar 4x12 (Or knee raises)', 'Circuit B: Russian Twist 4x40', 'Circuit B: Plank to Push-Up 3x15', 'Circuit B: Mountain Climbers 4x50', 'Circuit B: Squat Thrusters 4x15 (Finisher)'],
              'Week 6 - Day 1 (Upper Body Push HIIT - Peak)': ['Circuit A: Bench Press 6x8 (Work: 30s, Rest: 15s)', 'Circuit A: Incline Barbell Press 5x8', 'Circuit A: Push Press 5x10', 'Circuit A: Dips 5xMax (Heavy if possible)', 'Circuit A: Face Pulls Superset Lateral Raises 4x15 each (No rest between)', 'Circuit B: Explosive Push-Ups 3xMax (All-out effort)', 'Circuit B: Close-Grip Press 4x12', 'Circuit B: Cable Flyes 3x15', 'Circuit B: Burpees 5x15 (Max effort finisher)'],
              'Week 6 - Day 2 (Lower Body HIIT - Peak)': ['Circuit A: Squat 6x8 (Work: 30s, Rest: 15s)', 'Circuit A: Deadlift 5x6 (Heavy)', 'Circuit A: Bulgarian Split Squat 5x10/leg', 'Circuit A: Leg Press 4x25 (High volume)', 'Circuit B: Romanian Deadlift 4x12', 'Circuit B: Leg Curls 3x20', 'Circuit B: Calf Raises 3x30', 'Circuit B: Jump Squats 5x15'],
              'Week 6 - Day 3 (Upper Body Pull HIIT - Peak)': ['Circuit A: Barbell Row 6x8 (Work: 30s, Rest: 15s)', 'Circuit A: Weighted Pull-Ups 5x5 (Heavy weight)', 'Circuit A: Cable Row 5x15 (High tension)', 'Circuit A: Dumbbell Pullover 4x12', 'Circuit B: Barbell Curl 4x12', 'Circuit B: Face Pulls 3x20', 'Circuit B: Hammer Curl 3x15', 'Circuit B: Reverse Flyes 3x15'],
              'Week 6 - Day 4 (Full Body Core & Conditioning HIIT - Peak)': ['Circuit A: Deadlift 6x6 (Work: 30s, Rest: 15s)', 'Circuit A: Front Squat 5x10', 'Circuit A: Push Press 5x10', 'Circuit A: Hanging Leg Raises 5x12', 'Circuit B: Toes to Bar 3x12', 'Circuit B: Russian Twists 3x50', 'Circuit B: Mountain Climbers 5x50', 'Circuit B: Burpee Box Jump 4x12 (Max effort finisher)']
            }
          };
        }
      } else {
        // 5 days
        if (goal === 'strength') {
          return {
            id: 'INT_STRENGTH_5DAY',
            name: 'Intermediate Strength - 5 Day',
          days: 5,
            description: '6-week progressive strength program',
            focus: 'Breaking through plateaus with periodization',
          workouts: {
              'Week 1 - Day 1': ['Bench Press 3x3 (70%, 80%, 90%)', 'DB Incline Bench 4x5', 'Weighted Dips 3x8', 'Lateral Raises 3x15', 'Chest Flies 3x20'],
              'Week 1 - Day 2': ['Deadlift 3x3 (70%, 80%, 90%)', 'Hack Squats 4x5', 'Lunges 3x8', 'Leg Extensions 3x15', 'Weighted Marches 3x20'],
              'Week 1 - Day 3': ['Bench Press 4x10 (55%)', 'Barbell Rows 4x5', 'Pull Ups 3x4-8', 'Pull Throughs 3x15', 'Rear Delt Flies 3x20'],
              'Week 1 - Day 4': ['Squat 3x3 (70%, 80%, 90%)', 'Hip Thrusts 4x5', 'Leg Curls 3x8', 'Back Extensions 3x15', 'Calf Raises 3x20'],
              'Week 1 - Day 5': ['Military Press 3x3 (70%, 80%, 90%)', 'DB Incline Curls 4x5', 'Tricep Extensions 3x8', 'Ez Bar Curls 3x15', 'Skullcrushers 3x20'],
              'Week 2 - Day 1': ['Bench Press 3x5 (65%, 75%, 85%)', 'DB Incline Bench 4x5', 'Weighted Dips 3x8', 'Lateral Raises 3x15', 'Chest Flies 3x20'],
              'Week 2 - Day 2': ['Deadlift 3x5 (65%, 75%, 85%)', 'Hack Squats 4x5', 'Lunges 3x8', 'Leg Extensions 3x15', 'Weighted Marches 3x20'],
              'Week 2 - Day 3': ['Bench Press 4x10 (60%)', 'Barbell Rows 4x5', 'Pull Ups 3x4-8', 'Pull Throughs 3x15', 'Rear Delt Flies 3x20'],
              'Week 2 - Day 4': ['Squat 3x5 (65%, 75%, 85%)', 'Hip Thrusts 4x5', 'Leg Curls 3x8', 'Back Extensions 3x15', 'Calf Raises 3x20'],
              'Week 2 - Day 5': ['Military Press 3x5 (65%, 75%, 85%)', 'DB Incline Curls 4x5', 'Tricep Extensions 3x8', 'Ez Bar Curls 3x15', 'Skullcrushers 3x20'],
              'Week 3 - Day 1': ['Bench Press 3x3 (72.5%, 82.5%, 92.5%)', 'DB Incline Bench 4x5', 'Weighted Dips 3x8', 'Lateral Raises 3x15', 'Chest Flies 3x20'],
              'Week 3 - Day 2': ['Deadlift 3x3 (72.5%, 82.5%, 92.5%)', 'Hack Squats 4x5', 'Lunges 3x8', 'Leg Extensions 3x15', 'Weighted Marches 3x20'],
              'Week 3 - Day 3': ['Bench Press 4x8 (65%)', 'Barbell Rows 4x5', 'Pull Ups 3x4-8', 'Pull Throughs 3x15', 'Rear Delt Flies 3x20'],
              'Week 3 - Day 4': ['Squat 3x3 (72.5%, 82.5%, 92.5%)', 'Hip Thrusts 4x5', 'Leg Curls 3x8', 'Back Extensions 3x15', 'Calf Raises 3x20'],
              'Week 3 - Day 5': ['Military Press 3x3 (72.5%, 82.5%, 92.5%)', 'DB Incline Curls 4x5', 'Tricep Extensions 3x8', 'Ez Bar Curls 3x15', 'Skullcrushers 3x20'],
              'Week 4 - Day 1': ['Bench Press 2x7 (55%)', 'DB Incline Bench 4x5', 'Weighted Dips 3x8', 'Lateral Raises 3x15', 'Chest Flies 3x20'],
              'Week 4 - Day 2': ['Deadlift 2x7 (55%)', 'Hack Squats 4x5', 'Lunges 3x8', 'Leg Extensions 3x15', 'Weighted Marches 3x20'],
              'Week 4 - Day 3': ['Bench Press 3x8 (70%)', 'Barbell Rows 4x5', 'Pull Ups 3x4-8', 'Pull Throughs 3x15', 'Rear Delt Flies 3x20'],
              'Week 4 - Day 4': ['Squat 2x7 (55%)', 'Hip Thrusts 4x5', 'Leg Curls 3x8', 'Back Extensions 3x15', 'Calf Raises 3x20'],
              'Week 4 - Day 5': ['Military Press 2x7 (55%)', 'DB Incline Curls 4x5', 'Tricep Extensions 3x8', 'Ez Bar Curls 3x15', 'Skullcrushers 3x20'],
              'Week 5 - Day 1': ['Bench Press 3x5 (67.5%, 77.5%, 87.5%)', 'DB Incline Bench 4x5', 'Weighted Dips 3x8', 'Lateral Raises 3x15', 'Chest Flies 3x20'],
              'Week 5 - Day 2': ['Deadlift 3x5 (67.5%, 77.5%, 87.5%)', 'Hack Squats 4x5', 'Lunges 3x8', 'Leg Extensions 3x15', 'Weighted Marches 3x20'],
              'Week 5 - Day 3': ['Bench Press 4x5 (75%)', 'Barbell Rows 4x5', 'Pull Ups 3x4-8', 'Pull Throughs 3x15', 'Rear Delt Flies 3x20'],
              'Week 5 - Day 4': ['Squat 3x5 (67.5%, 77.5%, 87.5%)', 'Hip Thrusts 4x5', 'Leg Curls 3x8', 'Back Extensions 3x15', 'Calf Raises 3x20'],
              'Week 5 - Day 5': ['Military Press 3x5 (67.5%, 77.5%, 87.5%)', 'DB Incline Curls 4x5', 'Tricep Extensions 3x8', 'Ez Bar Curls 3x15', 'Skullcrushers 3x20'],
              'Week 6 - Day 1': ['Bench Press 3x5,3,1 (75%, 85%, Max)', 'DB Incline Bench 4x5', 'Weighted Dips 3x8', 'Lateral Raises 3x15', 'Chest Flies 3x20'],
              'Week 6 - Day 2': ['Deadlift 3x5,3,1 (75%, 85%, Max)', 'Hack Squats 4x5', 'Lunges 3x8', 'Leg Extensions 3x15', 'Weighted Marches 3x20'],
              'Week 6 - Day 3': ['Barbell Rows 4x5', 'Pull Ups 3x4-8', 'Pull Throughs 3x15', 'Rear Delt Flies 3x20'],
              'Week 6 - Day 4': ['Squat 3x5,3,1 (75%, 85%, Max)', 'Hip Thrusts 4x5', 'Leg Curls 3x8', 'Back Extensions 3x15', 'Calf Raises 3x20'],
              'Week 6 - Day 5': ['Military Press 3x5,3,1 (75%, 85%, Max)', 'DB Incline Curls 4x5', 'Tricep Extensions 3x8', 'Ez Bar Curls 3x15', 'Skullcrushers 3x20']
            }
          };
        } else if (goal === 'muscle_building') {
          return {
            id: 'INT_MUSCLE_5DAY',
            name: 'Intermediate Muscle Building - 5 Day',
            days: 5,
            description: '6-week progressive hypertrophy program',
            focus: 'Building muscle size with periodization',
            workouts: {
              'Week 1 - Day 1 (Chest & Triceps)': ['Bench Press 4x8-10 (70-75%)', 'DB Incline Bench 4x10-12', 'Weighted Dips 3x10-12', 'Lateral Raises 3x12-15', 'Chest Flies 3x15-20', 'Skullcrushers 3x12-15', 'Tricep Pushdowns 3x15-20'],
              'Week 1 - Day 2 (Back & Deadlift)': ['Deadlift 4x6-8 (70-75%)', 'Barbell Rows 4x8-10', 'Lat Pulldowns 4x10-12', 'Pull Ups 3x6-10', 'Pull Throughs 3x12-15', 'Rear Delt Flies 3x15-20'],
              'Week 1 - Day 3 (Legs - Quad Focus)': ['Squat 4x8-10 (70-75%)', 'Hack Squats 4x10-12', 'Lunges 3x12-15 (Each leg)', 'Leg Extensions 4x15-20', 'Weighted Marches 3x20-25'],
              'Week 1 - Day 4 (Shoulders & Arms)': ['Military Press 4x8-10 (70-75%)', 'DB Lateral Raises 4x12-15', 'DB Front Raises 3x12-15', 'Rear Delt Flies 3x15-20', 'DB Incline Curls 4x10-12', 'Tricep Extensions 4x10-12', 'Ez Bar Curls 3x12-15', 'Skullcrushers 3x12-15'],
              'Week 1 - Day 5 (Legs - Hamstring & Glute Focus)': ['Romanian Deadlift 4x8-10', 'Hip Thrusts 4x10-12', 'Leg Curls 4x12-15', 'Bulgarian Split Squats 3x10-12 (Each leg)', 'Back Extensions 3x12-15', 'Calf Raises 4x15-20'],
              'Week 2 - Day 1 (Chest & Triceps)': ['Bench Press 4x8-10 (72-77%)', 'DB Incline Bench 4x10-12', 'Weighted Dips 3x10-12', 'Lateral Raises 3x12-15', 'Chest Flies 3x15-20', 'Skullcrushers 3x12-15', 'Tricep Pushdowns 3x15-20'],
              'Week 2 - Day 2 (Back & Deadlift)': ['Deadlift 4x6-8 (72-77%)', 'Barbell Rows 4x8-10', 'Lat Pulldowns 4x10-12', 'Pull Ups 3x6-10', 'Pull Throughs 3x12-15', 'Rear Delt Flies 3x15-20'],
              'Week 2 - Day 3 (Legs - Quad Focus)': ['Squat 4x8-10 (72-77%)', 'Hack Squats 4x10-12', 'Lunges 3x12-15 (Each leg)', 'Leg Extensions 4x15-20', 'Weighted Marches 3x20-25'],
              'Week 2 - Day 4 (Shoulders & Arms)': ['Military Press 4x8-10 (72-77%)', 'DB Lateral Raises 4x12-15', 'DB Front Raises 3x12-15', 'Rear Delt Flies 3x15-20', 'DB Incline Curls 4x10-12', 'Tricep Extensions 4x10-12', 'Ez Bar Curls 3x12-15', 'Skullcrushers 3x12-15'],
              'Week 2 - Day 5 (Legs - Hamstring & Glute Focus)': ['Romanian Deadlift 4x8-10', 'Hip Thrusts 4x10-12', 'Leg Curls 4x12-15', 'Bulgarian Split Squats 3x10-12 (Each leg)', 'Back Extensions 3x12-15', 'Calf Raises 4x15-20'],
              'Week 3 - Day 1 (Chest & Triceps)': ['Bench Press 5x6-8 (75-80%)', 'DB Incline Bench 4x10-12', 'Weighted Dips 3x10-12', 'Lateral Raises 4x12-15', 'Chest Flies 3x15-20', 'Skullcrushers 4x12-15', 'Tricep Pushdowns 3x15-20'],
              'Week 3 - Day 2 (Back & Deadlift)': ['Deadlift 5x5-6 (75-80%)', 'Barbell Rows 4x8-10', 'Lat Pulldowns 4x10-12', 'Pull Ups 3x6-10', 'Pull Throughs 3x12-15', 'Rear Delt Flies 3x15-20'],
              'Week 3 - Day 3 (Legs - Quad Focus)': ['Squat 5x6-8 (75-80%)', 'Hack Squats 4x10-12', 'Lunges 3x12-15 (Each leg)', 'Leg Extensions 4x15-20', 'Weighted Marches 3x20-25'],
              'Week 3 - Day 4 (Shoulders & Arms)': ['Military Press 5x6-8 (75-80%)', 'DB Lateral Raises 4x12-15', 'DB Front Raises 3x12-15', 'Rear Delt Flies 4x15-20', 'DB Incline Curls 4x10-12', 'Tricep Extensions 4x10-12', 'Ez Bar Curls 3x12-15', 'Skullcrushers 3x12-15'],
              'Week 3 - Day 5 (Legs - Hamstring & Glute Focus)': ['Romanian Deadlift 4x8-10', 'Hip Thrusts 4x10-12', 'Leg Curls 4x12-15', 'Bulgarian Split Squats 3x10-12 (Each leg)', 'Back Extensions 3x12-15', 'Calf Raises 4x15-20'],
              'Week 4 - Day 1 (Chest & Triceps - Deload)': ['Bench Press 3x10-12 (60%)', 'DB Incline Bench 3x10-12', 'Chest Flies 3x15-20', 'Lateral Raises 3x12-15', 'Tricep Pushdowns 3x12-15'],
              'Week 4 - Day 2 (Back & Deadlift - Deload)': ['Deadlift 3x8-10 (60%)', 'Barbell Rows 3x10-12', 'Lat Pulldowns 3x10-12', 'Pull Ups 3x6-8', 'Rear Delt Flies 3x15-20'],
              'Week 4 - Day 3 (Legs - Quad Focus - Deload)': ['Squat 3x10-12 (60%)', 'Hack Squats 3x10-12', 'Leg Extensions 3x15-20', 'Lunges 3x12-15 (Each leg)'],
              'Week 4 - Day 4 (Shoulders & Arms - Deload)': ['Military Press 3x10-12 (60%)', 'DB Lateral Raises 3x12-15', 'DB Incline Curls 3x10-12', 'Tricep Extensions 3x10-12', 'Ez Bar Curls 3x12-15'],
              'Week 4 - Day 5 (Active Recovery)': ['Light Cardio 1x20-30 min (Low intensity)', 'Full Body Stretching 1x15 min (All major muscles)', 'Foam Rolling 1x10 min (Recovery work)', 'Yoga/Mobility 1x15 min (Optional)'],
              'Week 5 - Day 1 (Chest & Triceps)': ['Bench Press 4x10-12 (70-75%)', 'DB Incline Bench 4x12-15', 'Weighted Dips 4x10-12', 'Lateral Raises 4x12-15', 'Chest Flies 4x15-20', 'Skullcrushers 3x15-20', 'Tricep Pushdowns 3x20-25'],
              'Week 5 - Day 2 (Back & Deadlift)': ['Deadlift 4x8-10 (70-75%)', 'Barbell Rows 4x10-12', 'Lat Pulldowns 4x12-15', 'DB 1 Arm Rows 3x12-15 (Each arm)', 'Pull Throughs 3x15-20', 'Rear Delt Flies 4x15-20'],
              'Week 5 - Day 3 (Legs - Quad Focus)': ['Squat 4x10-12 (70-75%)', 'Leg Press 4x12-15', 'Hack Squats 3x12-15', 'Lunges 3x15-20 (Each leg)', 'Leg Extensions 4x20-25'],
              'Week 5 - Day 4 (Shoulders & Arms)': ['Military Press 4x10-12 (70-75%)', 'DB Shoulder Press 4x10-12', 'DB Lateral Raises 4x15-20', 'DB Front Raises 3x15-20', 'Rear Delt Flies 4x20-25', 'Barbell Curls 4x10-12', 'Close Grip Bench 4x10-12', 'Hammer Curls 3x12-15'],
              'Week 5 - Day 5 (Legs - Hamstring & Glute Focus)': ['Romanian Deadlift 4x10-12', 'Hip Thrusts 4x12-15', 'Leg Curls 4x15-20', 'Bulgarian Split Squats 4x10-12 (Each leg)', 'Back Extensions 3x15-20', 'Calf Raises 4x20-25'],
              'Week 6 - Day 1 (Chest & Triceps)': ['Bench Press 5x8-10 (75-80%)', 'DB Incline Bench 4x12-15', 'Weighted Dips 4x10-12', 'Cable Crossovers 4x12-15', 'Chest Flies 4x15-20', 'Skullcrushers 4x12-15', 'Tricep Pushdowns 4x15-20'],
              'Week 6 - Day 2 (Back & Deadlift)': ['Deadlift 5x6-8 (75-80%)', 'Barbell Rows 4x10-12', 'Lat Pulldowns 4x12-15', 'Pull Ups 4x8-12', 'DB 1 Arm Rows 3x12-15 (Each arm)', 'Pull Throughs 3x15-20', 'Rear Delt Flies 4x15-20'],
              'Week 6 - Day 3 (Legs - Quad Focus)': ['Squat 5x8-10 (75-80%)', 'Leg Press 4x12-15', 'Hack Squats 4x12-15', 'Lunges 3x15-20 (Each leg)', 'Leg Extensions 4x20-25 (Drop set final set)'],
              'Week 6 - Day 4 (Shoulders & Arms)': ['Military Press 5x8-10 (75-80%)', 'DB Shoulder Press 4x10-12', 'DB Lateral Raises 4x15-20', 'DB Front Raises 4x15-20', 'Rear Delt Flies 4x20-25', 'Barbell Curls 4x10-12', 'Close Grip Bench 4x10-12', 'Hammer Curls 4x12-15', 'Overhead Extensions 3x12-15'],
              'Week 6 - Day 5 (Legs - Hamstring & Glute Focus)': ['Romanian Deadlift 5x8-10', 'Hip Thrusts 4x12-15', 'Leg Curls 4x15-20 (Drop set final set)', 'Bulgarian Split Squats 4x10-12 (Each leg)', 'Good Mornings 3x12-15', 'Back Extensions 4x15-20', 'Calf Raises 4x20-25']
            }
          };
        } else {
          return {
            id: 'INT_WEIGHTLOSS_5DAY',
            name: 'Intermediate Weight Loss - 5 Day',
            days: 5,
            description: '6-week HIIT circuit program',
            focus: 'Fat loss and muscle preservation',
            workouts: {
              'Week 1 - Day 1 (Chest & Triceps HIIT)': ['Circuit A: Bench Press 4x12 (Work: 45s, Rest: 30s)', 'Circuit A: Incline Dumbbell Press 4x12', 'Circuit A: Dips 4xMax (Add weight if possible)', 'Circuit A: Cable Flyes 4x15', 'Circuit B: Push-Ups 3xMax (Explosive tempo)', 'Circuit B: Close-Grip Bench 3x12', 'Circuit B: Tricep Pushdowns 3x15', 'Circuit B: Overhead Tricep Extension 3x15'],
              'Week 1 - Day 2 (Back & Biceps HIIT)': ['Circuit A: Bent-Over Barbell Row 4x12 (Work: 45s, Rest: 30s)', 'Circuit A: Pull-Ups or Lat Pulldown 4x10', 'Circuit A: Single-Arm DB Row 4x12/arm', 'Circuit A: Cable Row 4x15', 'Circuit B: Face Pulls 3x15', 'Circuit B: Barbell Curl 3x15', 'Circuit B: Hammer Curls 3x12', 'Circuit B: Reverse Flyes 3x15'],
              'Week 1 - Day 3 (Legs - Quad Focus HIIT)': ['Circuit A: Squat 4x15 (Work: 45s, Rest: 30s)', 'Circuit A: Front Squat 4x12', 'Circuit A: Walking Lunges 4x20 total', 'Circuit A: Leg Press 4x20', 'Circuit B: Leg Extensions 3x20', 'Circuit B: Goblet Squats 3x15', 'Circuit B: Jump Squats 3x12 (Explosive)', 'Circuit B: Calf Raises 3x25'],
              'Week 1 - Day 4 (Shoulders & Abs HIIT)': ['Circuit A: Military Press 4x12 (Work: 45s, Rest: 30s)', 'Circuit A: Dumbbell Shoulder Press 4x15', 'Circuit A: Upright Rows 4x15', 'Circuit A: Arnold Press 4x12', 'Circuit B: Lateral Raises 3x20', 'Circuit B: Front Raises 3x15', 'Circuit B: Plank to Push-Up 3x12', 'Circuit B: Russian Twists 3x30'],
              'Week 1 - Day 5 (Legs - Posterior Chain & Core HIIT)': ['Circuit A: Deadlift 4x10 (Work: 45s, Rest: 30s)', 'Circuit A: Romanian Deadlift 4x12', 'Circuit A: Bulgarian Split Squat 4x12/leg', 'Circuit A: Leg Curls 4x15', 'Circuit B: Good Mornings 3x12', 'Circuit B: Hanging Knee Raises 3x15', 'Circuit B: Mountain Climbers 3x40', 'Circuit B: Burpees 3x15 (Finisher)'],
              'Week 2 - Day 1 (Chest & Triceps HIIT)': ['Circuit A: Incline Bench Press 4x12 (Work: 40s, Rest: 25s)', 'Circuit A: Flat Dumbbell Press 4x12', 'Circuit A: Decline Bench Press 4x12', 'Circuit A: Dips 4xMax (Add weight if possible)', 'Circuit B: Push-Ups 3xMax (Faster tempo)', 'Circuit B: Cable Flyes 3x15', 'Circuit B: Skull Crushers 3x15', 'Circuit B: Diamond Push-Ups 3xMax'],
              'Week 2 - Day 2 (Back & Biceps HIIT)': ['Circuit A: T-Bar Row 4x12 (Work: 40s, Rest: 25s)', 'Circuit A: Weighted Pull-Ups 4x8 (Add weight if possible)', 'Circuit A: Cable Row 4x15', 'Circuit A: Chest-Supported Row 4x12', 'Circuit B: Reverse Flyes 3x15', 'Circuit B: Face Pulls 3x20', 'Circuit B: EZ Bar Curl 3x15', 'Circuit B: Cable Curl 3x15'],
              'Week 2 - Day 3 (Legs - Quad Focus HIIT)': ['Circuit A: Front Squat 4x12 (Work: 40s, Rest: 25s)', 'Circuit A: Back Squat 4x12', 'Circuit A: Bulgarian Split Squat 4x12/leg', 'Circuit A: Hack Squat 4x15', 'Circuit B: Leg Extensions 3x20', 'Circuit B: Walking Lunges 3x20 total', 'Circuit B: Box Jumps 3x10', 'Circuit B: Calf Raises 3x25'],
              'Week 2 - Day 4 (Shoulders & Abs HIIT)': ['Circuit A: Push Press 4x12 (Work: 40s, Rest: 25s)', 'Circuit A: Seated Dumbbell Press 4x12', 'Circuit A: Arnold Press 4x12', 'Circuit A: Upright Rows 4x15', 'Circuit B: Lateral Raises 3x20', 'Circuit B: Front Raises 3x15', 'Circuit B: V-Ups 3x15', 'Circuit B: Bicycle Crunches 3x30'],
              'Week 2 - Day 5 (Legs - Posterior Chain & Core HIIT)': ['Circuit A: Conventional Deadlift 4x10 (Work: 40s, Rest: 25s)', 'Circuit A: Sumo Deadlift 4x12', 'Circuit A: Romanian Deadlift 4x12', 'Circuit A: Leg Curls 4x15', 'Circuit B: Good Mornings 3x12', 'Circuit B: Glute Bridges 3x15', 'Circuit B: Plank Shoulder Taps 3x20', 'Circuit B: Jumping Lunges 3x20 total (Finisher)'],
              'Week 3 - Day 1 (Chest & Triceps HIIT)': ['Circuit A: Flat Barbell Bench Press 5x12 (Work: 40s, Rest: 20s)', 'Circuit A: Incline Dumbbell Press 4x10', 'Circuit A: Decline Dumbbell Press 4x12', 'Circuit A: Weighted Dips 4x12', 'Circuit B: Explosive Push-Ups 3xMax (Clap if possible)', 'Circuit B: Cable Flyes 3x15', 'Circuit B: Close-Grip Bench 3x12', 'Circuit B: Overhead Tricep Extension 3x15'],
              'Week 3 - Day 2 (Back & Biceps HIIT)': ['Circuit A: Pendlay Row 5x10 (Work: 40s, Rest: 20s)', 'Circuit A: Chin-Ups 4xMax', 'Circuit A: Chest-Supported Row 4x12', 'Circuit A: Cable Pullovers 4x15', 'Circuit B: Cable Face Pulls 3x20', 'Circuit B: Reverse Flyes 3x15', 'Circuit B: Barbell Curl 3x15', 'Circuit B: Preacher Curl 3x12'],
              'Week 3 - Day 3 (Legs - Quad Focus HIIT)': ['Circuit A: Back Squat 5x12 (Work: 40s, Rest: 20s)', 'Circuit A: Front Squat 4x10', 'Circuit A: Reverse Lunges 4x12/leg', 'Circuit A: Leg Press 4x20', 'Circuit B: Leg Extensions 3x25', 'Circuit B: Goblet Squats 3x15', 'Circuit B: Jump Squats 4x15', 'Circuit B: Calf Raises 3x30'],
              'Week 3 - Day 4 (Shoulders & Abs HIIT)': ['Circuit A: Barbell Military Press 5x10 (Work: 40s, Rest: 20s)', 'Circuit A: Arnold Press 4x12', 'Circuit A: Push Press 4x12', 'Circuit A: Upright Rows 4x15', 'Circuit B: Cable Lateral Raises 3x20', 'Circuit B: Reverse Pec Deck 3x15', 'Circuit B: Hanging Knee Raises 4x15', 'Circuit B: Plank Jacks 3x30'],
              'Week 3 - Day 5 (Legs - Posterior Chain & Core HIIT)': ['Circuit A: Conventional Deadlift 5x8 (Work: 40s, Rest: 20s)', 'Circuit A: Romanian Deadlift 4x12', 'Circuit A: Bulgarian Split Squat 4x12/leg', 'Circuit A: Leg Curls 4x20', 'Circuit B: Stiff-Leg Deadlift 3x15', 'Circuit B: Hip Thrusts 3x15', 'Circuit B: Russian Twists 3x40', 'Circuit B: Burpee Box Jumps 3x10 (Finisher)'],
              'Week 4 - Day 1 (Chest & Triceps HIIT - Deload)': ['Bench Press 3x10 (Work: 40s, Rest: 40s - Controlled tempo)', 'Incline Dumbbell Press 3x12 (Lighter weight)', 'Cable Flyes 3x15', 'Dips 3x10', 'Tricep Pushdowns 3x15', 'Push-Ups 2x15 (Controlled)'],
              'Week 4 - Day 2 (Back & Biceps HIIT - Deload)': ['Barbell Row 3x10 (Work: 40s, Rest: 40s)', 'Lat Pulldown 3x12 (Lighter weight)', 'Cable Row 3x12', 'Face Pulls 3x15', 'Dumbbell Curl 3x12', 'Hammer Curl 2x12'],
              'Week 4 - Day 3 (Legs - Full HIIT - Deload)': ['Squat 3x12 (Work: 40s, Rest: 40s)', 'Romanian Deadlift 3x10 (Lighter weight)', 'Lunges 3x12/leg', 'Leg Press 3x15', 'Leg Curls 3x15', 'Calf Raises 2x20'],
              'Week 4 - Day 4 (Shoulders & Abs HIIT - Deload)': ['Dumbbell Press 3x12 (Work: 40s, Rest: 40s)', 'Lateral Raises 3x15', 'Front Raises 3x12', 'Plank 3x45s', 'Dead Bug 3x12', 'Russian Twists 2x30'],
              'Week 4 - Day 5 (Active Recovery & Core - Deload)': ['Bodyweight Squat 3x15 (Work: 40s, Rest: 40s)', 'Push-Ups 3x15 (Controlled tempo)', 'Inverted Rows 3x12', 'Bird Dog 3x12', 'Bicycle Crunches 3x30', 'Jump Rope 2x1 min (Light finisher)'],
              'Week 5 - Day 1 (Chest & Triceps HIIT)': ['Circuit A: Bench Press 5x10 (Work: 35s, Rest: 20s)', 'Circuit A: Incline Dumbbell Press 5x10', 'Circuit A: Decline Bench Press 4x12', 'Circuit A: Weighted Dips 4x15', 'Circuit B: Plyometric Push-Ups 3x10 (Maximum power)', 'Circuit B: Cable Flyes 4x15', 'Circuit B: Skull Crushers 4x15', 'Circuit B: Diamond Push-Ups 3xMax'],
              'Week 5 - Day 2 (Back & Biceps HIIT)': ['Circuit A: Barbell Row 5x10 (Work: 35s, Rest: 20s)', 'Circuit A: Weighted Pull-Ups 5x6-8 (Heavy)', 'Circuit A: T-Bar Row 4x12', 'Circuit A: Cable Pullovers 4x15', 'Circuit B: Face Pulls 3x20', 'Circuit B: Cable Curl 4x15', 'Circuit B: Preacher Curl 3x12', 'Circuit B: Reverse Flyes 3x15'],
              'Week 5 - Day 3 (Legs - Quad Focus HIIT)': ['Circuit A: Squat 5x10 (Work: 35s, Rest: 20s)', 'Circuit A: Front Squat 4x10', 'Circuit A: Walking Lunges 4x24 total', 'Circuit A: Hack Squat 4x15', 'Circuit B: Leg Extensions 3x25', 'Circuit B: Goblet Squats 3x15', 'Circuit B: Box Jumps 4x12', 'Circuit B: Calf Raises 3x30'],
              'Week 5 - Day 4 (Shoulders & Abs HIIT)': ['Circuit A: Barbell Military Press 5x10 (Work: 35s, Rest: 20s)', 'Circuit A: Seated Press 5x12', 'Circuit A: Push Press 4x12', 'Circuit A: Cable Lateral Raises 4x20', 'Circuit B: Upright Rows 3x15', 'Circuit B: Front Raises 3x15', 'Circuit B: Toes to Bar 4x12 (Or knee raises)', 'Circuit B: Russian Twist 4x40'],
              'Week 5 - Day 5 (Legs - Posterior Chain & Core HIIT)': ['Circuit A: Deadlift 5x8 (Work: 35s, Rest: 20s)', 'Circuit A: Romanian Deadlift 4x10 (Heavy but controlled)', 'Circuit A: Bulgarian Split Squat 4x12/leg', 'Circuit A: Leg Curls 4x20', 'Circuit B: Good Mornings 4x12', 'Circuit B: Hip Thrusts 3x15', 'Circuit B: Plank to Push-Up 3x15', 'Circuit B: Squat Thrusters 4x15 (Finisher)'],
              'Week 6 - Day 1 (Chest & Triceps HIIT - Peak)': ['Circuit A: Bench Press 6x8 (Work: 30s, Rest: 15s)', 'Circuit A: Incline Barbell Press 5x8', 'Circuit A: Decline Dumbbell Press 5x10', 'Circuit A: Dips 5xMax (Heavy if possible)', 'Circuit B: Explosive Push-Ups 3xMax (All-out effort)', 'Circuit B: Cable Flyes 3x15', 'Circuit B: Close-Grip Press 4x12', 'Circuit B: Burpees 5x15 (Max effort finisher)'],
              'Week 6 - Day 2 (Back & Biceps HIIT - Peak)': ['Circuit A: Barbell Row 6x8 (Work: 30s, Rest: 15s)', 'Circuit A: Weighted Pull-Ups 5x5 (Heavy weight)', 'Circuit A: Cable Row 5x15 (High tension)', 'Circuit A: Dumbbell Pullover 4x12', 'Circuit B: Face Pulls 3x20', 'Circuit B: Barbell Curl 4x12', 'Circuit B: Hammer Curl 3x15', 'Circuit B: Reverse Flyes 3x15'],
              'Week 6 - Day 3 (Legs - Quad Focus HIIT - Peak)': ['Circuit A: Squat 6x8 (Work: 30s, Rest: 15s)', 'Circuit A: Front Squat 5x8', 'Circuit A: Bulgarian Split Squat 5x10/leg', 'Circuit A: Leg Press 4x25 (High volume)', 'Circuit B: Leg Extensions 3x30', 'Circuit B: Walking Lunges 3x30 total', 'Circuit B: Jump Squats 5x15', 'Circuit B: Calf Raises 3x30'],
              'Week 6 - Day 4 (Shoulders & Abs HIIT - Peak)': ['Circuit A: Barbell Military Press 6x8 (Work: 30s, Rest: 15s)', 'Circuit A: Push Press 5x10', 'Circuit A: Arnold Press 5x10', 'Circuit A: Face Pulls Superset Lateral Raises 4x15 each (No rest between)', 'Circuit B: Upright Rows 3x15', 'Circuit B: Front Raises 3x15', 'Circuit B: Hanging Leg Raises 5x12', 'Circuit B: Toes to Bar 3x12'],
              'Week 6 - Day 5 (Legs - Posterior Chain & Core HIIT - Peak)': ['Circuit A: Deadlift 6x6 (Work: 30s, Rest: 15s)', 'Circuit A: Romanian Deadlift 5x10', 'Circuit A: Sumo Deadlift 4x10', 'Circuit A: Leg Curls 4x25', 'Circuit B: Good Mornings 3x15', 'Circuit B: Hip Thrusts 3x20', 'Circuit B: Russian Twists 3x50', 'Circuit B: Mountain Climbers 5x50', 'Circuit B: Burpee Box Jump 4x12 (Max effort finisher)']
            }
          };
        }
      }
    }

    // Advanced templates
    if (fitnessLevel === 'Advanced') {
      if (trainingDays === 3) {
        if (goal === 'strength') {
        return {
            id: 'ADV_STRENGTH_3DAY',
            name: 'Advanced Full Body - 3 Day',
            days: 3,
            description: 'High intensity full body training',
            focus: 'Maximal strength development',
            workouts: {
              'Day A': ['Squat 5x3 @85%', 'Bench 5x3 @85%', 'Rows 4x6', 'Accessories'],
              'Day B': ['Deadlift 5x2 @90%', 'OHP 4x5', 'Pull-ups 4x8', 'Accessories'],
              'Day C': ['Front Squat 4x5', 'Incline Bench 4x6', 'Accessories for weak points']
            }
          };
        } else if (goal === 'muscle_building') {
          return {
            id: 'ADV_MUSCLE_3DAY',
            name: 'Advanced Muscle Building - 3 Day',
            days: 3,
            description: 'High volume full body training',
            focus: 'Building size and strength',
            workouts: {
              'Day 1': ['Squat 5x5 @80%', 'Bench 5x5 @80%', 'Rows 4x8', 'Accessories 3x10'],
              'Day 2': ['Deadlift 5x3 @85%', 'OHP 4x6', 'Pull-ups 4x10', 'Accessories 3x12'],
              'Day 3': ['Front Squat 4x8', 'Incline Bench 4x10', 'Cable Rows 4x12', 'Arms 4x12']
            }
          };
        } else {
          return {
            id: 'ADV_WEIGHTLOSS_3DAY',
            name: 'Advanced Weight Loss - 3 Day',
            days: 3,
            description: 'Full body with cardio focus',
            focus: 'Fat loss and muscle preservation',
            workouts: {
              'Day 1': ['Squat 5x5 @75%', 'Bench 5x5 @75%', 'Rows 4x8', 'Cardio 30 min'],
              'Day 2': ['Deadlift 5x3 @80%', 'OHP 4x6', 'Pull-ups 4xAMRAP', 'HIIT 25 min'],
              'Day 3': ['Front Squat 4x8', 'Incline Bench 4x10', 'Cable Rows 4x12', 'Cardio 30 min', 'Full body circuit']
            }
          };
        }
      } else if (trainingDays === 4) {
        if (goal === 'strength') {
          return {
            id: 'ADV_STRENGTH_4DAY',
            name: 'Advanced Upper/Lower - 4 Day',
            days: 4,
            description: 'High intensity split training',
            focus: 'Maximal strength development',
            workouts: {
              'Upper A': ['Bench 5x3 @85%', 'OHP 4x5', 'Rows 4x6', 'Accessories'],
              'Lower A': ['Squat 5x3 @85%', 'Romanian Deadlift 4x6', 'Leg Press 3x10', 'Abs'],
              'Upper B': ['Incline Bench 4x5', 'Pull-ups 4x8', 'Accessories 3x10'],
              'Lower B': ['Deadlift 5x2 @90%', 'Front Squat 3x6', 'Accessories for weak points']
            }
          };
        } else if (goal === 'muscle_building') {
          return {
            id: 'ADV_MUSCLE_4DAY',
            name: 'Advanced Muscle Building - 4 Day (DUP)',
          days: 4,
          description: 'Daily Undulating Periodization',
            focus: 'Building size and strength',
          workouts: {
            'Day 1 (Squat Volume)': ['Squat 5x6 @75%', 'Pause Squat 3x4 @70%', 'Romanian Deadlift 4x8', 'Leg Press 3x12', 'Abs'],
            'Day 2 (Bench Volume)': ['Bench 5x6 @75%', 'Close Grip 4x8', 'Incline Press 3x10', 'Rows 4x10', 'Rear Delts 3x15'],
            'Day 3 (Deadlift Intensity)': ['Deadlift 5x3 @85%', 'Deficit Pulls 3x5', 'Front Squat 3x6', 'Barbell Row 4x8', 'Back Extensions 3x12'],
            'Day 4 (Bench Intensity)': ['Bench 5x3 @85%', 'OHP 4x6', 'Weighted Dips 3x8', 'Pull-ups 4x8', 'Triceps 3x12']
          }
        };
      } else {
          return {
            id: 'ADV_WEIGHTLOSS_4DAY',
            name: 'Advanced Weight Loss - 4 Day',
            days: 4,
            description: 'Upper/Lower split with cardio',
            focus: 'Fat loss and muscle preservation',
            workouts: {
              'Upper A': ['Bench 5x5 @75%', 'Rows 4x8', 'OHP 4x6', 'Cardio 25 min'],
              'Lower A': ['Squat 5x5 @75%', 'Romanian Deadlift 4x8', 'Lunges 3x12', 'Cardio 25 min'],
              'Upper B': ['Incline Bench 4x8', 'Pull-ups 4xAMRAP', 'DB Press 4x10', 'HIIT 25 min'],
              'Lower B': ['Deadlift 5x3 @80%', 'Leg Press 4x12', 'Step-ups 3x12', 'Cardio 25 min']
            }
          };
        }
      } else {
        // 5 days
        if (goal === 'strength') {
        return {
          id: 'ADV_STRENGTH_5DAY',
          name: 'Advanced Conjugate Method - 5 Day',
          days: 5,
          description: 'Westside Barbell inspired program',
          focus: 'Maximal strength development',
          workouts: {
            'Max Effort Lower': ['Main Movement (rotate weekly) 1RM', 'Accessory 1: 3x6-8', 'Accessory 2: 3x8-10', 'Abs/Lower back'],
            'Max Effort Upper': ['Main Movement (rotate weekly) 1-3RM', 'Accessory 1: 3x6-8', 'Accessory 2: 3x8-10', 'Rear delts/Triceps'],
            'Dynamic Effort Lower': ['Speed Squats 10x2 @60%', 'Speed Pulls 8x1 @70%', 'Unilateral work 3x8', 'GPP work'],
            'Dynamic Effort Upper': ['Speed Bench 9x3 @60%', 'Speed OHP 6x3 @70%', 'Horizontal pull 4x8', 'Arms'],
            'Recovery/Accessories': ['Light technical work', 'Weak point training', 'Conditioning', 'Mobility']
          }
        };
        } else if (goal === 'muscle_building') {
          return {
            id: 'ADV_MUSCLE_5DAY',
            name: 'Advanced Muscle Building - 5 Day',
            days: 5,
            description: 'Competition peaking program',
            focus: 'Building size and strength',
            workouts: {
              'Day 1 (Squat Volume)': ['Squat 5x6 @75%', 'Pause Squat 3x4 @70%', 'Romanian Deadlift 4x8', 'Leg Press 3x12'],
              'Day 2 (Bench Volume)': ['Bench 5x6 @75%', 'Close Grip 4x8', 'Incline Press 3x10', 'Rows 4x10'],
              'Day 3 (Deadlift Intensity)': ['Deadlift 5x3 @85%', 'Deficit Pulls 3x5', 'Front Squat 3x6', 'Back Extensions 3x12'],
              'Day 4 (Bench Intensity)': ['Bench 5x3 @85%', 'OHP 4x6', 'Weighted Dips 3x8', 'Pull-ups 4x8'],
              'Day 5 (Accessories)': ['Weak point training', 'Conditioning', 'Mobility work']
            }
          };
        } else {
          return {
            id: 'ADV_WEIGHTLOSS_5DAY',
            name: 'Advanced Weight Loss - 5 Day',
            days: 5,
            description: 'Push/Pull/Legs with cardio focus',
            focus: 'Fat loss and muscle building',
            workouts: {
              'Day 1 (Push)': ['Bench 5x5 @75%', 'OHP 4x6', 'Incline DB 4x10', 'Cardio 30 min'],
              'Day 2 (Pull)': ['Deadlift 5x3 @80%', 'Pull-ups 4xAMRAP', 'Rows 4x8', 'Cardio 30 min'],
              'Day 3 (Legs)': ['Squat 5x5 @75%', 'Romanian Deadlift 4x8', 'Lunges 3x12', 'HIIT 30 min'],
              'Day 4 (Push)': ['Incline Bench 4x8', 'DB Press 4x10', 'Triceps 4x12', 'Cardio 30 min'],
              'Day 5 (Pull)': ['Barbell Row 4x8', 'Lat Pulldown 4x10', 'Biceps 4x12', 'Full body circuit']
            }
          };
        }
      }
    }

    // Advanced template (fallback for any Advanced level)
    return {
      id: 'ADV_STRENGTH_5DAY',
      name: 'Advanced Conjugate Method - 5 Day',
      days: 5,
      description: 'Westside Barbell inspired program',
      focus: 'Maximal strength development',
      workouts: {
        'Max Effort Lower': ['Main Movement (rotate weekly) 1RM', 'Accessory 1: 3x6-8', 'Accessory 2: 3x8-10', 'Abs/Lower back'],
        'Max Effort Upper': ['Main Movement (rotate weekly) 1-3RM', 'Accessory 1: 3x6-8', 'Accessory 2: 3x8-10', 'Rear delts/Triceps'],
        'Dynamic Effort Lower': ['Speed Squats 10x2 @60%', 'Speed Pulls 8x1 @70%', 'Unilateral work 3x8', 'GPP work'],
        'Dynamic Effort Upper': ['Speed Bench 9x3 @60%', 'Speed OHP 6x3 @70%', 'Horizontal pull 4x8', 'Arms'],
        'Recovery/Accessories': ['Light technical work', 'Weak point training', 'Conditioning', 'Mobility']
      }
    };
  };

  const handleFitnessSubmit = (e) => {
    e.preventDefault();
    if (!fitnessData.gender) {
      alert('Please select your gender');
      return;
    }
    setLoading(true);

    setTimeout(() => {
      const classification = classifyFitnessLevel(fitnessData);
      setResults({ ...results, classification });
      setLoading(false);
      setCurrentStep(2);
    }, 800);
  };

  const handleWorkoutSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const template = assignWorkoutTemplate(
        results.classification.level,
        workoutPreferences,
        parseFloat(fitnessData.trainingYears)
      );
      setResults({ ...results, template });
      setLoading(false);
      setCurrentStep(3);
    }, 800);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFitnessData({ gender: '', squat: '', bench: '', deadlift: '', bodyweight: '', trainingYears: '' });
    setWorkoutPreferences({ trainingDays: 3, goal: 'strength' });
    setResults(null);
  };

  const downloadProgram = () => {
    const { classification, template } = results;
    let text = `MY PERSONALIZED FITNESS PROGRAM\n${'='.repeat(70)}\n\n`;
    text += `FITNESS PROFILE\n${'-'.repeat(70)}\n`;
    text += `Level: ${classification.level}\n`;
    text += `Total Lift: ${classification.total} lbs\n`;
    text += `Wilks Coefficient: ${classification.wilks}\n`;
    text += `Confidence: ${classification.confidence}%\n\n`;
    text += `WORKOUT PROGRAM\n${'-'.repeat(70)}\n`;
    text += `Program: ${template.name}\n`;
    text += `Days per Week: ${template.days}\n`;
    text += `Description: ${template.description}\n`;
    text += `Focus: ${template.focus}\n\n`;
    text += `WEEKLY SCHEDULE\n${'='.repeat(70)}\n\n`;
    
    Object.entries(template.workouts).forEach(([day, exercises]) => {
      text += `${day}:\n`;
      exercises.forEach(ex => text += `  • ${ex}\n`);
      text += `\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my_workout_program.txt';
    a.click();
  };

  const getLevelColor = (level) => {
    const colors = {
      'Beginner': 'bg-blue-500',
      'Intermediate': 'bg-green-500',
      'Advanced': 'bg-yellow-500'
    };
    return colors[level] || 'bg-gray-500';
  };

  const getLevelAdvice = (level) => {
    const advice = {
      'Beginner': [
        'Focus on learning proper form before adding weight',
        'Start with the empty bar and add weight gradually',
        'Rest 2-3 minutes between sets',
        'Film your lifts to check form'
      ],
      'Intermediate': [
        'Implement weekly or monthly progression',
        'Track all workouts',
        'Rest 3-5 minutes between heavy sets',
        'Address weak points with accessories'
      ],
      'Advanced': [
        'Use periodization and programming blocks',
        'Monitor recovery carefully',
        'Rest 5-7 minutes between max efforts',
        'Consider working with a coach'
      ]
    };
    return advice[level] || advice['Intermediate'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Dumbbell className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              AI Fitness System
            </h1>
          </div>
          <p className="text-xl text-blue-200">
            Powered by K-means Classification & Decision Tree AI
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-blue-400' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-500' : 'bg-gray-700'}`}>
                {currentStep > 1 ? <Check className="w-6 h-6" /> : '1'}
              </div>
              <span className="hidden sm:block font-medium">Classify Level</span>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-500" />
            <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-blue-400' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-700'}`}>
                {currentStep > 2 ? <Check className="w-6 h-6" /> : '2'}
              </div>
              <span className="hidden sm:block font-medium">Set Preferences</span>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-500" />
            <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-blue-400' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-700'}`}>
                3
              </div>
              <span className="hidden sm:block font-medium">Get Program</span>
            </div>
          </div>
        </div>

        {/* Step 1: Fitness Classification */}
        {currentStep === 1 && (
          <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-8 h-8 text-blue-400" />
              <h2 className="text-3xl font-bold text-white">Step 1: Fitness Level Classification</h2>
            </div>
            <p className="text-slate-300 mb-6">Enter your current one-rep max (1RM) for each lift:</p>

            <form onSubmit={handleFitnessSubmit} className="space-y-6">
              <div>
                <label className="block text-slate-300 mb-3 font-medium">Gender 👤</label>
                <div className="flex gap-3">
                  {[
                    { value: 'male', label: 'Male', emoji: '♂️' },
                    { value: 'female', label: 'Female', emoji: '♀️' },
                    { value: 'other', label: 'Other', emoji: '⚧️' }
                  ].map(gender => (
                    <button
                      key={gender.value}
                      type="button"
                      onClick={() => setFitnessData({...fitnessData, gender: gender.value})}
                      className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                        fitnessData.gender === gender.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {gender.emoji} {gender.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-300 mb-2 font-medium">Squat 1RM (lbs) 🏋️</label>
                  <input
                    type="number"
                    value={fitnessData.squat}
                    onChange={(e) => setFitnessData({...fitnessData, squat: e.target.value})}
                    required
                    min="0"
                    step="5"
                    className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 315"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 font-medium">Bench Press 1RM (lbs) 💪</label>
                  <input
                    type="number"
                    value={fitnessData.bench}
                    onChange={(e) => setFitnessData({...fitnessData, bench: e.target.value})}
                    required
                    min="0"
                    step="5"
                    className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 225"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 font-medium">Deadlift 1RM (lbs) 🔥</label>
                  <input
                    type="number"
                    value={fitnessData.deadlift}
                    onChange={(e) => setFitnessData({...fitnessData, deadlift: e.target.value})}
                    required
                    min="0"
                    step="5"
                    className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 405"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 font-medium">Bodyweight (lbs) ⚖️</label>
                  <input
                    type="number"
                    value={fitnessData.bodyweight}
                    onChange={(e) => setFitnessData({...fitnessData, bodyweight: e.target.value})}
                    required
                    min="0"
                    step="1"
                    className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 185"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 mb-2 font-medium">Years of Training 📅</label>
                  <input
                    type="number"
                    value={fitnessData.trainingYears}
                    onChange={(e) => setFitnessData({...fitnessData, trainingYears: e.target.value})}
                    required
                    min="0"
                    step="0.5"
                    className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 3"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Analyzing...' : 'Classify My Level'}
                <TrendingUp className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Workout Preferences */}
        {currentStep === 2 && results?.classification && (
          <div className="space-y-6">
            {/* Classification Results */}
            <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-4">Your Fitness Level</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className={`${getLevelColor(results.classification.level)} text-white px-6 py-3 rounded-xl text-2xl font-bold`}>
                  {results.classification.level}
                </div>
                <div className="text-slate-300">
                  <div className="text-sm">Confidence</div>
                  <div className="text-2xl font-bold text-white">{results.classification.confidence}%</div>
                </div>
                <div className="text-slate-300">
                  <div className="text-sm">Total</div>
                  <div className="text-2xl font-bold text-white">{results.classification.total} lbs</div>
                </div>
                <div className="text-slate-300">
                  <div className="text-sm">Wilks</div>
                  <div className="text-2xl font-bold text-white">{results.classification.wilks}</div>
                </div>
              </div>
            </div>

            {/* Preferences Form */}
            <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-blue-400" />
                <h2 className="text-3xl font-bold text-white">Step 2: Set Your Preferences</h2>
              </div>

              <form onSubmit={handleWorkoutSubmit} className="space-y-6">
                <div>
                  <label className="block text-slate-300 mb-3 font-medium">Training Days per Week 📅</label>
                  <div className="flex gap-3">
                    {[3, 4, 5].map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setWorkoutPreferences({...workoutPreferences, trainingDays: day})}
                        className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                          workoutPreferences.trainingDays === day
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {day} Days
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-3 font-medium">Primary Goal 🎯</label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { value: 'strength', label: 'Strength', emoji: '💪' },
                      { value: 'muscle_building', label: 'Muscle Building', emoji: '🏋️' },
                      { value: 'weight_loss', label: 'Weight Loss', emoji: '🔥' }
                    ].map(goal => (
                      <button
                        key={goal.value}
                        type="button"
                        onClick={() => setWorkoutPreferences({...workoutPreferences, goal: goal.value})}
                        className={`py-3 rounded-lg font-bold transition-all ${
                          workoutPreferences.goal === goal.value
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {goal.emoji} {goal.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-slate-700 text-white font-bold py-4 rounded-lg hover:bg-slate-600 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Assigning...' : 'Get My Program'}
                    <Calendar className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {currentStep === 3 && results?.template && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl text-white">
              <h2 className="text-3xl font-bold mb-4">🎉 Your Personalized Program is Ready!</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm opacity-80">Fitness Level</div>
                  <div className="text-2xl font-bold">{results.classification.level}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Training Days</div>
                  <div className="text-2xl font-bold">{results.template.days} days/week</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Total Lift</div>
                  <div className="text-2xl font-bold">{results.classification.total} lbs</div>
                </div>
              </div>
            </div>

            {/* Program Details */}
            <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
              <h3 className="text-3xl font-bold text-white mb-2">{results.template.name}</h3>
              <p className="text-blue-400 text-lg mb-4">{results.template.description}</p>
              <div className="bg-slate-700 rounded-lg p-4 mb-6">
                <div className="text-slate-300 text-sm mb-1">Training Focus:</div>
                <div className="text-white font-medium">{results.template.focus}</div>
              </div>

              {/* Workout Schedule */}
              <h4 className="text-2xl font-bold text-white mb-4">📅 Weekly Workout Schedule</h4>
              <div className="space-y-4">
                {Object.entries(results.template.workouts).map(([day, exercises]) => {
                  // Special handling for beginner weight loss circuit training
                  // Check if exercises contain circuit labels (not just day name)
                  const hasCircuitLabels = exercises.some(ex => ex.startsWith('Circuit 1:') || ex.startsWith('Circuit 2:') || ex.startsWith('Circuit A:') || ex.startsWith('Circuit B:'));
                  const isWeightLossCircuit = (results.template.id === 'BEG_WEIGHTLOSS_3DAY' || results.template.id === 'BEG_WEIGHTLOSS_4DAY' || results.template.id === 'BEG_WEIGHTLOSS_5DAY' || results.template.id === 'INT_WEIGHTLOSS_3DAY' || results.template.id === 'INT_WEIGHTLOSS_4DAY' || results.template.id === 'INT_WEIGHTLOSS_5DAY') && hasCircuitLabels;
                  
                  if (isWeightLossCircuit) {
                    // Group exercises by circuit
                    const circuits = [];
                    let currentCircuit = null;
                    
                    exercises.forEach((exercise) => {
                      if (exercise.startsWith('Circuit 1:') || exercise.startsWith('Circuit 2:') || exercise.startsWith('Circuit A:') || exercise.startsWith('Circuit B:')) {
                        // Extract circuit label and exercise - split only on first occurrence
                        const colonIndex = exercise.indexOf(': ');
                        if (colonIndex !== -1) {
                          const circuitLabel = exercise.substring(0, colonIndex + 1); // Include the colon
                          const exerciseName = exercise.substring(colonIndex + 2); // Skip ': '
                          
                          // Check if a circuit with this label already exists
                          const existingCircuit = circuits.find(c => c.label === circuitLabel);
                          if (existingCircuit) {
                            // Add exercise to existing circuit
                            existingCircuit.exercises.push(exerciseName);
                            currentCircuit = existingCircuit;
                          } else {
                            // Create new circuit
                            currentCircuit = {
                              label: circuitLabel,
                              exercises: [exerciseName]
                            };
                            circuits.push(currentCircuit);
                          }
                        }
                      } else if (currentCircuit) {
                        currentCircuit.exercises.push(exercise);
                      } else {
                        // Fallback if no circuit label found
                        if (circuits.length === 0) {
                          circuits.push({ label: null, exercises: [exercise] });
                        } else {
                          circuits[circuits.length - 1].exercises.push(exercise);
                        }
                      }
                    });
                    
                    return (
                  <div key={day} className="bg-slate-700 rounded-lg p-6">
                    <h5 className="text-xl font-bold text-blue-400 mb-3">{day}</h5>
                        {circuits.map((circuit, circuitIdx) => (
                          <div key={circuitIdx} className={circuitIdx > 0 ? 'mt-4' : ''}>
                            {circuit.label && (
                              <h6 className="text-lg font-semibold text-yellow-400 mb-2">{circuit.label}</h6>
                            )}
                    <ul className="space-y-2">
                              {circuit.exercises.map((exercise, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-300">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{exercise}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                      </div>
                    );
                  }
                  
                  // Default rendering for other programs
                  return (
                    <div key={day} className="bg-slate-700 rounded-lg p-6">
                      <h5 className="text-xl font-bold text-blue-400 mb-3">{day}</h5>
                      <ul className="space-y-2">
                        {exercises.map((exercise, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-300">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <span>{exercise}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Training Tips */}
            <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">💡 {results.classification.level}-Specific Tips</h3>
              </div>
              <ul className="space-y-3">
                {getLevelAdvice(results.classification.level).map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-sm font-bold">
                      {idx + 1}
                    </div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={downloadProgram}
                className="flex-1 bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Program
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-slate-700 text-white font-bold py-4 rounded-lg hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FitnessAIApp;
