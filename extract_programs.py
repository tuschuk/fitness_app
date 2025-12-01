"""
Script to extract all 27 workout programs from App.js and save as JSON
"""
import re
import json
from pathlib import Path

def extract_programs_from_appjs(appjs_path):
    """Extract all workout program objects from App.js"""
    with open(appjs_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    programs = {}
    
    # Find all program objects - they start with return { and have id: 'XXX'
    # Pattern to match program definitions
    pattern = r"id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*days:\s*(\d+),\s*description:\s*'([^']+)',\s*focus:\s*'([^']+)',\s*workouts:\s*(\{.*?\}(?=\s*\}\s*;|\s*\}|\s*return))"
    
    # More comprehensive pattern to match entire program objects
    program_pattern = r"id:\s*'([^']+)',[^}]*?name:\s*'([^']+)',[^}]*?days:\s*(\d+),[^}]*?description:\s*'([^']+)',[^}]*?focus:\s*'([^']+)',[^}]*?workouts:\s*(\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\})"
    
    # Better approach: find all return { blocks that contain id, name, days, description, focus, workouts
    # Look for return statements followed by object literals
    return_blocks = re.finditer(r"return\s+\{([^}]*?id:\s*'[^']+'.*?)\};", content, re.DOTALL)
    
    # Actually, let's parse it more carefully by finding the assignWorkoutTemplate function
    # and extracting all return blocks within it
    
    # Find the assignWorkoutTemplate function
    function_match = re.search(r"const assignWorkoutTemplate[^{]*\{([\s\S]*?)(?=const |function |\n\n)", content)
    if not function_match:
        print("Could not find assignWorkoutTemplate function")
        return {}
    
    function_content = function_match.group(1)
    
    # Find all return blocks with program definitions
    # Look for blocks that have: id, name, days, description, focus, workouts
    return_pattern = r"return\s*\{[^}]*?id:\s*'([^']+)',[^}]*?name:\s*'([^']+)',[^}]*?days:\s*(\d+),[^}]*?description:\s*'([^']+)',[^}]*?focus:\s*'([^']+)',[^}]*?workouts:\s*(\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\})"
    
    matches = re.finditer(r"return\s*\{([\s\S]*?id:\s*'([^']+)'[\s\S]*?)\}\s*;", function_content, re.MULTILINE)
    
    for match in matches:
        block = match.group(1)
        # Extract id
        id_match = re.search(r"id:\s*'([^']+)'", block)
        if not id_match:
            continue
        
        program_id = id_match.group(1)
        
        # Extract name
        name_match = re.search(r"name:\s*'([^']+)'", block)
        name = name_match.group(1) if name_match else ''
        
        # Extract days
        days_match = re.search(r"days:\s*(\d+)", block)
        days = int(days_match.group(1)) if days_match else 0
        
        # Extract description
        desc_match = re.search(r"description:\s*'([^']+)'", block)
        description = desc_match.group(1) if desc_match else ''
        
        # Extract focus
        focus_match = re.search(r"focus:\s*'([^']+)'", block)
        focus = focus_match.group(1) if focus_match else ''
        
        # Extract workouts object - this is more complex
        workouts_match = re.search(r"workouts:\s*\{([\s\S]*?)\}\s*(?:,|\}|;)", block)
        if not workouts_match:
            continue
        
        workouts_str = workouts_match.group(1)
        
        # Parse workouts object - it's a JavaScript object with string keys and array values
        workouts = {}
        
        # Find all key-value pairs: 'Key': [values]
        workout_items = re.finditer(r"'([^']+)':\s*\[(.*?)\](?=\s*[,}])", workouts_str, re.DOTALL)
        
        for item in workout_items:
            day_key = item.group(1)
            exercises_str = item.group(2)
            
            # Extract individual exercise strings
            exercises = re.findall(r"'([^']+)'", exercises_str)
            workouts[day_key] = exercises
        
        # Determine level and goal from program_id
        level = 'Beginner'
        goal = 'strength'
        
        if 'INT_' in program_id:
            level = 'Intermediate'
        elif 'ADV_' in program_id:
            level = 'Advanced'
        
        if 'MUSCLE' in program_id or 'HYPERTROPHY' in program_id:
            goal = 'muscle_building'
        elif 'WEIGHTLOSS' in program_id or 'WEIGHT_LOSS' in program_id:
            goal = 'weight_loss'
        elif 'STRENGTH' in program_id:
            goal = 'strength'
        
        programs[program_id] = {
            'name': name,
            'level': level,
            'days': days,
            'goal': goal,
            'description': description,
            'focus': focus,
            'workouts': workouts
        }
    
    return programs

def main():
    appjs_path = Path(__file__).parent / 'src' / 'App.js'
    
    if not appjs_path.exists():
        print(f"Error: {appjs_path} not found")
        return
    
    print(f"Extracting programs from {appjs_path}...")
    programs = extract_programs_from_appjs(appjs_path)
    
    print(f"Found {len(programs)} programs")
    
    # Save as JSON
    json_path = Path(__file__).parent / 'workout_programs.json'
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(programs, f, indent=2, ensure_ascii=False)
    
    print(f"Saved programs to {json_path}")
    
    # Also save as Python file for direct import
    python_path = Path(__file__).parent / 'workout_programs.py'
    with open(python_path, 'w', encoding='utf-8') as f:
        f.write("# Auto-generated workout programs from fitness-app\n")
        f.write("WORKOUT_PROGRAMS = ")
        f.write(json.dumps(programs, indent=2, ensure_ascii=False))
        f.write("\n")
    
    print(f"Saved programs to {python_path}")
    
    # Print summary
    print("\nPrograms found:")
    for program_id, program in sorted(programs.items()):
        print(f"  {program_id}: {program['name']} ({program['level']}, {program['days']} days, {program['goal']})")

if __name__ == '__main__':
    main()

