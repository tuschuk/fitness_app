"""
Simple script to extract workout programs from App.js and create JSON file
This script should be run to generate workout_programs.json
"""
import json
import re
from pathlib import Path

def extract_all_programs(appjs_path):
    """Extract all 27 workout programs from App.js"""
    
    with open(appjs_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    programs = {}
    
    # Find all program IDs first
    program_ids = re.findall(r"id:\s*'(BEG_|INT_|ADV_)[^']+'", content)
    
    # For each program ID pattern, extract the full program
    # Look for blocks that start with id: 'XXX' and contain the full program structure
    
    # Split content to find program blocks more reliably
    # Programs are within return statements in the assignWorkoutTemplate function
    
    # Pattern to find each program: id, name, days, description, focus, workouts
    # Use a more targeted approach: find blocks that have all required fields
    
    # Find the function first
    func_match = re.search(r'const assignWorkoutTemplate.*?\{(.*)', content, re.DOTALL)
    if not func_match:
        print("Could not find assignWorkoutTemplate function")
        return {}
    
    func_content = func_match.group(1)
    
    # Find all return blocks - they should contain program definitions
    # Look for: return { ... id: 'XXX' ... name: ... days: ... description: ... focus: ... workouts: ... }
    
    # Use a simpler approach: extract all id patterns and their context
    id_pattern = r"id:\s*'([^']+)'"
    ids_found = set(re.findall(id_pattern, func_content))
    
    print(f"Found {len(ids_found)} program IDs: {sorted(ids_found)}")
    
    # For each ID, try to extract the full program object
    for program_id in ids_found:
        # Find the return block that contains this ID
        # Look backward and forward from the ID to find the complete object
        pattern = rf"return\s*\{{[^{{}}]*id:\s*'{re.escape(program_id)}'[^{{}}]*\}};"
        
        # More comprehensive: find return { then match balanced braces until we find the ID
        # Then continue until we have the complete object
        
        # Simpler: find the context around each ID
        id_index = func_content.find(f"id: '{program_id}'")
        if id_index == -1:
            continue
        
        # Find the start of the return statement before this ID
        start_idx = func_content.rfind('return {', max(0, id_index - 5000), id_index)
        if start_idx == -1:
            continue
        
        # Find the matching closing brace
        brace_count = 0
        in_string = False
        string_char = None
        end_idx = start_idx + len('return {')
        
        for i in range(end_idx, min(end_idx + 20000, len(func_content))):
            char = func_content[i]
            
            # Track strings
            if char in ("'", '"') and (i == 0 or func_content[i-1] != '\\'):
                if not in_string:
                    in_string = True
                    string_char = char
                elif char == string_char:
                    in_string = False
                    string_char = None
            
            # Track braces (only outside strings)
            if not in_string:
                if char == '{':
                    brace_count += 1
                elif char == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        end_idx = i + 1
                        break
        
        program_block = func_content[start_idx:end_idx]
        
        # Extract fields from this block
        name_match = re.search(r"name:\s*'([^']+)'", program_block)
        days_match = re.search(r"days:\s*(\d+)", program_block)
        desc_match = re.search(r"description:\s*'([^']+)'", program_block)
        focus_match = re.search(r"focus:\s*'([^']+)'", program_block)
        workouts_match = re.search(r"workouts:\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}", program_block, re.DOTALL)
        
        if not all([name_match, days_match, desc_match, focus_match, workouts_match]):
            print(f"[WARN] Incomplete data for {program_id}, skipping")
            continue
        
        # Extract workouts
        workouts_str = workouts_match.group(1)
        workouts = {}
        
        # Find all 'key': [values] patterns
        workout_pattern = r"'([^']+)':\s*\[(.*?)\]"
        
        for match in re.finditer(workout_pattern, workouts_str, re.DOTALL):
            day_key = match.group(1)
            exercises_block = match.group(2)
            
            # Extract all string values from the array
            exercises = re.findall(r"'([^']+)'", exercises_block)
            workouts[day_key] = exercises
        
        # Determine level and goal
        level = 'Beginner'
        goal = 'strength'
        
        if program_id.startswith('INT_'):
            level = 'Intermediate'
        elif program_id.startswith('ADV_'):
            level = 'Advanced'
        
        if 'MUSCLE' in program_id or 'HYPERTROPHY' in program_id:
            goal = 'muscle_building'
        elif 'WEIGHTLOSS' in program_id or 'WEIGHT_LOSS' in program_id:
            goal = 'weight_loss'
        elif 'STRENGTH' in program_id:
            goal = 'strength'
        
        programs[program_id] = {
            'name': name_match.group(1),
            'level': level,
            'days': int(days_match.group(1)),
            'goal': goal,
            'description': desc_match.group(1),
            'focus': focus_match.group(1),
            'workouts': workouts
        }
        
        print(f"[OK] Extracted {program_id}: {programs[program_id]['name']}")
    
    return programs

def main():
    appjs_path = Path(__file__).parent / 'src' / 'App.js'
    
    if not appjs_path.exists():
        print(f"Error: {appjs_path} not found")
        return
    
    print(f"Extracting programs from {appjs_path}...")
    programs = extract_all_programs(appjs_path)
    
    if not programs:
        print("❌ No programs extracted!")
        return
    
    print(f"\n[SUCCESS] Successfully extracted {len(programs)} programs")
    
    # Save as JSON
    json_path = Path(__file__).parent / 'workout_programs.json'
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(programs, f, indent=2, ensure_ascii=False)
    
    print(f"[SAVED] Saved to {json_path}")
    
    # Print summary
    print("\nPrograms Summary:")
    for program_id in sorted(programs.keys()):
        p = programs[program_id]
        print(f"  {program_id}: {p['name']} ({p['level']}, {p['days']} days, {p['goal']})")

if __name__ == '__main__':
    main()

