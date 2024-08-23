import snowflake.connector
import os



snowflake_config = {
    'user': 'MEHDI',
    'password': 'Tecc1254',
    'account': 'ugrzepw-dq76838',
    'database': 'DISEASE_PREDICTOR'
}



# Function to establish a connection to Snowflake
def connect_to_snowflake():
    conn = snowflake.connector.connect(
        user=snowflake_config['user'],
        password=snowflake_config['password'],
        account=snowflake_config['account'],
        database=snowflake_config['database']
    )
    return conn

def insert_patient_data(patient_data):
    print("Inserting patient data:", patient_data)  # Debugging
    conn = connect_to_snowflake()
    cursor = conn.cursor()
    try:
        insert_query = """
        INSERT INTO patient(name, age, address, email, probable_disease, phone_number)
        VALUES(%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, patient_data)
        conn.commit()
        print("Patient data inserted successfully")  # Debugging
    except Exception as e:
        print(f"Error inserting patient data: {e}")  # Error message
    finally:
        cursor.close()
        conn.close()


# Function to insert appointment data
def insert_appointment_data(appointment_data):
    conn = connect_to_snowflake()
    cursor = conn.cursor()
    try:
        insert_query = """
        INSERT INTO appointment(ID_PATIENT, APPOINTMENT_DATE, SPECIALIST)
        VALUES(%s, %s, %s)
        """
        cursor.execute(insert_query, appointment_data)
        conn.commit()
    finally:
        cursor.close()
        conn.close()

# Function to retrieve patient ID based on email
def retrieve_patient_id(email):
    conn = connect_to_snowflake()
    cursor = conn.cursor()
    try:
        query = "SELECT ID FROM PATIENT WHERE EMAIL = %s"
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        return result[0] if result else None
    finally:
        cursor.close()
        conn.close()
