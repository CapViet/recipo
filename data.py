# import pandas as pd
# from sqlalchemy import create_engine

# # Database connection
# DATABASE_URL = "postgresql://neondb_owner:npg_NkIG0ingP6Zf@ep-summer-scene-a5ejl2zg-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
# engine = create_engine(DATABASE_URL)

# # Load CSV
# df = pd.read_csv("D:\\recipo\\public\\fixed_output.csv")

# # Upload to NeonDB
# df.to_sql("recipe", engine, if_exists="append", index=False)
import csv
import json
import re

def clean_and_format_list_string(list_str):
    # Remove leading and trailing whitespace and triple quotes
    list_str = list_str.replace('"""','"')
    
    # Replace escaped quotes with regular quotes
    list_str = list_str.replace('\\"', '"')
    
    # Ensure that items are properly quoted
    items = [item.strip() for item in list_str.split(',')]
    quoted_items = [f'"{item}"' for item in items]
    
    # Join the quoted items back into a string that looks like a JSON array
    return f'[{", ".join(quoted_items)}]'

def process_recipe_csv(input_file, output_file):
    with open(input_file, mode='r', newline='', encoding='utf-8') as infile, \
         open(output_file, mode='w', newline='', encoding='utf-8') as outfile:
        
        reader = csv.reader(infile)
        writer = csv.writer(outfile)

        for row in reader:
            if len(row) < 10:  # Ensure there are enough columns
                continue
            
            # Extracting the relevant fields
            recipe_id = row[0]
            title = row[1]
            slug = row[2]
            description = row[3]
            prep_time = row[4]
            difficulty = row[5]
            country = row[6]
            servings = row[7]
            calories = row[8]
            ingredients_str = row[9]  # Keep the original string
            instructions_str = row[10]  # Keep the original string
            
            # Format the ingredients and instructions
            formatted_ingredients_str = clean_and_format_list_string(ingredients_str)
            formatted_instructions_str = clean_and_format_list_string(instructions_str)
            
            # Convert string representation of list to actual list
            ingredients = json.loads(formatted_ingredients_str)  # Use json.loads to convert to list
            instructions = json.loads(formatted_instructions_str)  # Use json.loads to convert to list
            
            # Writing the processed row to the output file
            writer.writerow([
                recipe_id,
                title,
                slug,
                description,
                prep_time,
                difficulty,
                country,
                servings,
                calories,
                json.dumps(ingredients),  # Convert list back to string representation
                json.dumps(instructions)   # Convert list back to string representation
            ])
if __name__ == "__main__":
    input_csv = 'D:\\recipo\\public\\fixed_output_3.csv'  # Input CSV file
    output_csv = 'D:\\recipo\\public\\fixed_output_4.csv'  # Output CSV file
    process_recipe_csv(input_csv, output_csv)
    print(f"Processed recipes from {input_csv} and saved to {output_csv}.")

