# Generating a fictitious list of medical specialists for each disease

import pandas as pd
import random

# List of diseases
diseases = ["Psoriasis", "Varicose Veins", "Typhoid", "Chicken pox", "Impetigo", "Dengue", "Fungal infection",
            "Common Cold", "Pneumonia", "Dimorphic Hemorrhoids", "Arthritis", "Acne", "Bronchial Asthma",
            "Hypertension", "Migraine", "Cervical spondylosis", "Jaundice", "Malaria", "urinary tract infection",
            "allergy", "gastroesophageal reflux disease", "drug reaction", "peptic ulcer disease", "diabetes"]

# Function to generate random specialist details
def generate_specialist(disease):
    names = ["Dr. Smith", "Dr. Johnson", "Dr. Williams", "Dr. Brown", "Dr. Jones", "Dr. Garcia", "Dr. Miller"]
    addresses = ["123 Main St", "456 Elm St", "789 Oak St", "101 Maple Ave", "202 Pine Ave", "303 Birch Blvd", "404 Cedar Ln"]
    phone_numbers = ["555-0100", "555-0101", "555-0102", "555-0103", "555-0104", "555-0105", "555-0106"]
    years_experience = random.randint(5, 25)
    med_schools = ["Med University A", "Med University B", "Med University C", "Med University D", "Med University E"]
    specialities = [disease]

    return {
        "Name": random.choice(names),
        "Office Address": random.choice(addresses),
        "Phone Number": random.choice(phone_numbers),
        "Years of Experience": years_experience,
        "Med School": random.choice(med_schools),
        "Speciality": random.choice(specialities)
    }

# Generating the data
specialist_data = []
for disease in diseases:
    # Generate 2-3 specialists for each disease
    for _ in range(random.randint(2, 3)):
        specialist_data.append(generate_specialist(disease))

# Creating a DataFrame
specialist_df = pd.DataFrame(specialist_data)

# Saving to a CSV file
specialist_csv_file_path = 'data/Medical_Specialists.csv'
specialist_df.to_csv(specialist_csv_file_path, index=False)

specialist_csv_file_path
