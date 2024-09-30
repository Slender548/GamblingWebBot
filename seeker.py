import os
import re

def get_fetch_routes(component_dir):
    fetch_routes = set()
    fetch_regex = re.compile(r"fetch\(['\"](.*)['\"]")

    for root, _, files in os.walk(component_dir):
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                    content = f.read()
                    fetch_routes.update(re.findall(fetch_regex, content))
    
    return fetch_routes

def get_fastapi_routes(main_file):
    fastapi_routes = set()
    route_regex = re.compile(r"@app\.(get|post|put|delete|patch)\(['\"](.*)['\"]")

    with open(main_file, 'r', encoding='utf-8') as f:
        content = f.read()
        for match in re.findall(route_regex, content):
            fastapi_routes.add(match[1])
    
    return fastapi_routes

def compare_routes(component_dir, main_file):
    fetch_routes = get_fetch_routes(component_dir)
    fastapi_routes = get_fastapi_routes(main_file)
    
    exist_routes = []
    not_exist_routes = []
    
    for route in fetch_routes:
        if route in fastapi_routes:
            exist_routes.append(route)
        else:
            not_exist_routes.append(route)
    
    # Print results
    print("Routes that exist in main.py:")
    for route in exist_routes:
        print(f"  Route '{route}' is used and exists in main.py")
    
    print("\nRoutes that do not exist in main.py:")
    for route in not_exist_routes:
        print(f"  Route '{route}' is used but does not exist in main.py")

    total_routes = len(exist_routes) + len(not_exist_routes)
    print(f"\nTotal fetch routes used: {total_routes}")
    print(f"Total fetch routes found: {len(exist_routes)}")
    print(f"Total fetch routes not found: {len(not_exist_routes)}")

if __name__ == '__main__':
    component_dir = 'frontend/src/components'
    main_file = 'backend/main.py'
    compare_routes(component_dir, main_file)
