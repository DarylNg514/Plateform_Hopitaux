from django.shortcuts import render, redirect
from django.http import JsonResponse
import requests
from django.contrib.auth.decorators import login_required
from django.contrib import messages
import json

BASE_URL = 'http://localhost:5000/patient'


def creer_patient(request):
    if request.method == 'POST':
        data = {
            'name': request.POST['nom'],
            'email': request.POST['email'],
            'phone': request.POST['telephone'],
            'address': request.POST['adresse'],
            'password': request.POST['password'],
            'Hopital': request.session.get('user_id')  # Assurez-vous que l'utilisateur connecté a cet attribut
        }
        response = requests.post(f'{BASE_URL}/patients', json=data)  # Utiliser `json=data` pour envoyer les données en JSON
        if response.status_code == 201:
            patient_info = response.json().get('patient')
            message = f"Patient Enregistrer avec succès!\n Identifiant: {patient_info['identifiant']},\n Mot de passe: {patient_info['password']}"
            messages.success(request, message)
            return redirect('get_all_patients')
        else:
            return render(request, 'creer_patient.html', {'error_message': response.json().get('error', 'Erreur de création')})
    
    # Ajouter l'hôpital connecté au contexte
    context = {'hopital': request.session.get('user_id')}
    return render(request, 'creer_patient.html', context)

def update_patient(request, id):
    if request.method == 'POST':
        data = {
            'name': request.POST['nom'],
            'email': request.POST['email'],
            'phone': request.POST['telephone'],
            'address': request.POST['adresse'],
            'Hopital': request.session.get('user_id')  # Assurez-vous que l'utilisateur connecté a cet attribut
        }
                
        response = requests.put(f'{BASE_URL}/patients/{id}', json=data)  # Utiliser `json=data` pour envoyer les données en JSON
        if response.status_code == 200:
            messages.success(request, "Hôpital modifié avec succès!")

            return redirect('get_all_patients')
        else:
            return render(request, 'update_patient.html', {'error_message': response.json().get('error', 'Erreur de mise à jour')})
    
    response = requests.get(f'{BASE_URL}/patients/{id}')
    patient = response.json()
    context = {'patient': patient, 'hopital': request.session.get('user_id')}
    return render(request, 'update_patient.html', context)

def get_all_patients(request):
    try:
        hopital_id = request.session.get('user_id')  # Récupère l'ID de l'hôpital connecté depuis la session
        response = requests.get(f'{BASE_URL}/patients/hopital/{hopital_id}')  # Requête vers la nouvelle route backend
        response.raise_for_status()  # Vérifie si la requête a échoué
        patients = response.json()  # Essaye de décoder la réponse en JSON
    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur de requête: {e}"})
    except ValueError:
        return render(request, 'error.html', {'error_message': "La réponse du serveur n'est pas en format JSON valide."})
    
    context = {'patients': patients}
    return render(request, 'get_all_patients.html', context)


def get_patient_by_id(request, id):
    hopital_id = request.session.get('user_id')
    response = requests.get(f'{BASE_URL}/patients/{hopital_id}')
    patient = response.json()
    if response.status_code == 404:
        return JsonResponse({'error': 'Patient non trouvé'}, status=404)
    return render(request, 'get_all_patients.html', {'patient': patient})

def delete_patient(request, id):
    response = requests.delete(f'{BASE_URL}/patients/{id}')
    if response.status_code == 200:
        messages.success(request, "Hôpital supprimé avec succès!")
        return redirect('get_all_patients')
    else:
        messages.error(request, "Erreur lors de la suppression de l'hôpital!")
        return JsonResponse(response.json(), status=response.status_code)
       
       
# dossier
       
BASEDO_URL = 'http://localhost:5000/dossier'
BASEM_URL = 'http://localhost:5000/medecin'
BASEI_URL = 'http://localhost:5000/infirmier'
BASEP_URL = 'http://localhost:5000/personnel'
BASEL_URL = 'http://localhost:5000/lit'
BASEC_URL = 'http://localhost:5000/consultation'
BASED_URL = 'http://localhost:5000/departement'
BASER_URL = 'http://localhost:5000/rendezvous'

def creer_dossier(request):
    if request.method == 'POST':
        data = {
            'Patient': request.POST['patient_id'],
            'Medecin': request.POST['medecin_id'],
            'Infirmier': request.POST['infirmier_id'],
            'disease': request.POST['disease'],
            'internal': request.POST.get('internal', False),  # valeur par défaut si la clé est manquante
            'openDate': request.POST['openDate'],
            'status': request.POST['status'],
            'Hopital': request.session.get('user_id')  # Assurez-vous que l'utilisateur connecté a cet attribut
        }

        response = requests.post(f'{BASEDO_URL}/dossiers', json=data)  # Utiliser `json=data` pour envoyer les données en JSON
        if response.status_code == 201:
            dossier_info = response.json().get('dossier')
            message = "Dossier Enregistré avec succès!"
            messages.success(request, message)
            return redirect('get_all_dossiers')
        else:
            return render(request, 'creer_dossier.html', {'error_message': response.json().get('error', 'Erreur de création')})

    # Récupérer les patients, médecins et infirmiers pour les listes déroulantes
    try:
        patients_response = requests.get(f'{BASE_URL}/patients')
        medecins_response = requests.get(f'{BASEM_URL}/medecins')
        infirmiers_response = requests.get(f'{BASEI_URL}/infirmiers')

        if patients_response.status_code != 200 or medecins_response.status_code != 200 or infirmiers_response.status_code != 200:
            raise ValueError("Erreur lors de la récupération des données")

        patients = patients_response.json()
        medecins = medecins_response.json()
        infirmiers = infirmiers_response.json()

    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur de requête: {e}"})
    except ValueError as e:
        return render(request, 'error.html', {'error_message': str(e)})

    context = {
        'patients': patients,
        'medecins': medecins,
        'infirmiers': infirmiers,
        'hopital': request.session.get('user_id')
    }
    return render(request, 'creer_dossier.html', context)

def get_all_dossiers(request):
    try:
        hopital_id = request.session.get('user_id')
        response = requests.get(f'{BASEDO_URL}/dossiers/hopital/{hopital_id}')
        response.raise_for_status()
        dossiers = response.json()
    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur de requête: {e}"})
    except ValueError:
        return render(request, 'error.html', {'error_message': "La réponse du serveur n'est pas en format JSON valide."})
    
    context = {'dossiers': dossiers}
    return render(request, 'get_all_dossiers.html', context)


def get_dossier_by_id(request, id):
    response = requests.get(f'{BASEDO_URL}/dossiers/{id}')
    dossier = response.json()
    if response.status_code == 404:
        return JsonResponse({'error': 'Dossier non trouvé'}, status=404)
    return render(request, 'get_dossier_by_id.html', {'dossier': dossier})

def update_dossier(request, id):
    if request.method == 'POST':
        data = {
            'disease': request.POST['disease'],
            'internal': request.POST.get('internal', 'false') == 'on',
            'status': request.POST['status'],
            #'Patient': request.POST['patient_id'],
            #'Medecin': request.POST['medecin_id'],
            'Hopital': request.session.get('user_id')
        }
        response = requests.put(f'{BASEDO_URL}/dossiers/{id}', json=data)
        if response.status_code == 200:
            message = "Dossier mis à jour avec succès"
            messages.success(request, message)
            return redirect('get_all_dossiers')
        else:
            error_message = response.json().get('error', 'Erreur de mise à jour')
            return render(request, 'update_dossier.html', {'error_message': error_message})
    
    response = requests.get(f'{BASEDO_URL}/dossiers/{id}')
    if response.status_code != 200:
        return render(request, 'error.html', {'error_message': 'Dossier non trouvé'})

    dossier = response.json()

    patients_response = requests.get('http://localhost:5000/patient/patients')
    medecins_response = requests.get('http://localhost:5000/medecin/medecins')
    infirmiers_response = requests.get('http://localhost:5000/infirmier/infirmiers')

    if patients_response.status_code != 200 or medecins_response.status_code != 200 or infirmiers_response.status_code != 200:
        return render(request, 'error.html', {'error_message': 'Erreur lors de la récupération des données des patients, médecins ou infirmiers'})

    patients = patients_response.json()
    medecins = medecins_response.json()
    infirmiers = infirmiers_response.json()

    context = {
        'dossier': dossier,
        'patients': patients,
        'medecins': medecins,
        'infirmiers': infirmiers
    }
    return render(request, 'update_dossier.html', context)


def delete_dossier(request, id):
    response = requests.delete(f'{BASEDO_URL}/dossiers/{id}')
    if response.status_code == 200:
        messages.success(request, "Dossier supprimé avec succès!")
    else:
        messages.error(request, "Erreur lors de la suppression du dossier!")
    return redirect('get_all_dossiers')


## utilisateurs

def creer_medecin(request):
    if request.method == 'POST':
        availability = []
        days = request.POST.getlist('day')
        start_hours = request.POST.getlist('start_hour')
        end_hours = request.POST.getlist('end_hour')

        for day, start_hour, end_hour in zip(days, start_hours, end_hours):
            if day and start_hour and end_hour:
                availability.append({"day": day, "hours": f"{start_hour}-{end_hour}"})

        data = {
            'name': request.POST['name'],
            'email': request.POST['email'],
            'phone': request.POST['phone'],
            'address': request.POST['address'],
            'specialty': request.POST['specialty'],
            'password': request.POST['password'],
            'Hopital': request.session.get('user_id'),
            'availability': availability
        }

        response = requests.post(f'{BASEM_URL}/medecins', json=data)

        if response.status_code == 201:
            medecin_info = response.json().get('medecin')
            message = f"Médecin créé avec succès!\n Identifiant: {medecin_info['identifiant']},\n Mot de passe: {medecin_info['password']}"
            messages.success(request, message)
            return redirect('get_all_medecins')
        else:
            error_message = response.json().get('error')
            return render(request, 'creer_medecin.html', {'error_message': error_message})

    response_departments = requests.get('http://localhost:5000/departement/departments')
    departments = response_departments.json() if response_departments.status_code == 200 else []
    return render(request, 'creer_medecin.html', {'departments': departments})

def update_medecin(request, id):
    token = request.session.get('token')
    if not token:
        return redirect('login')

    if request.method == 'POST':
        availability = []
        days = request.POST.getlist('day')
        start_hours = request.POST.getlist('start_hour')
        end_hours = request.POST.getlist('end_hour')

        for day, start_hour, end_hour in zip(days, start_hours, end_hours):
            if day and start_hour and end_hour:
                availability.append({"day": day, "hours": f"{start_hour}-{end_hour}"})

        data = {
            'name': request.POST['name'],
            'email': request.POST['email'],
            'phone': request.POST['phone'],
            'address': request.POST['address'],
            'specialty': request.POST['specialty'],
            'availability': availability
        }

        response = requests.put(f'{BASEM_URL}/medecins/{id}', json=data, headers={'Authorization': f'Bearer {token}'})

        if response.status_code == 200:
            messages.success(request, "Médecin modifié avec succès!")
            return redirect('get_all_medecins')
        else:
            try:
                error_message = response.json().get('error', 'Erreur inconnue')
            except json.JSONDecodeError:
                error_message = 'Erreur de décodage de la réponse'
            return render(request, 'modifier_medecin.html', {'error_message': error_message, 'medecin': data})

    response = requests.get(f'{BASEM_URL}/medecins/{id}', headers={'Authorization': f'Bearer {token}'})
    medecin = response.json() if response.status_code == 200 else None

    response_departments = requests.get('http://localhost:5000/departement/departments')
    departments = response_departments.json() if response_departments.status_code == 200 else []
    
    return render(request, 'modifier_medecin.html', {'medecin': medecin, 'departments': departments})

def get_all_medecins(request):
    try:
        hopital_id = request.session.get('user_id')
        response = requests.get(f'{BASEM_URL}/medecins/hopital/{hopital_id}')
        response.raise_for_status()
        medecins = response.json()
    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur de requête: {e}"})
    except ValueError:
        return render(request, 'error.html', {'error_message': "La réponse du serveur n'est pas en format JSON valide."})
    
    context = {'medecins': medecins}
    return render(request, 'get_all_medecins.html', context)


def delete_medecin(request, id):
    response = requests.delete(f'{BASEM_URL}/medecins/{id}')
    if response.status_code == 200:
        messages.success(request, 'Médecin supprimé avec succès')
    else:
        messages.error(request, 'Erreur lors de la suppression du médecin')
    return redirect('get_all_medecins')


def creer_infirmier(request):
    if request.method == 'POST':
        availability = []
        days = request.POST.getlist('day')
        start_hours = request.POST.getlist('start_hour')
        end_hours = request.POST.getlist('end_hour')
        for day, start_hour, end_hour in zip(days, start_hours, end_hours):
            if day and start_hour and end_hour:
                availability.append({"day": day, "hours": f"{start_hour}-{end_hour}"})
        data = {
            'name': request.POST['name'],
            'email': request.POST['email'],
            'phone': request.POST['phone'],
            'address': request.POST['address'],
            'availability': availability,
            'password': request.POST['password'],
            'Hopital': request.session.get('user_id')
        }
        response = requests.post(f'{BASEI_URL}/infirmiers', json=data)
        if response.status_code == 201:
            infirmier_info = response.json().get('infirmier')
            messages.success(request, f"Infirmier créé avec succès! Identifiant: {infirmier_info['identifiant']}, Mot de passe: {infirmier_info['password']}")
            return redirect('get_all_infirmiers')
        else:
            return render(request, 'creer_infirmier.html', {'error_message': response.json().get('error', 'Erreur de création')})
    return render(request, 'creer_infirmier.html')

def get_all_infirmiers(request):
    try:
        hopital_id = request.session.get('user_id')
        response = requests.get(f'{BASEI_URL}/infirmiers/hopital/{hopital_id}')
        response.raise_for_status()
        infirmiers = response.json()
    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur de requête: {e}"})
    except ValueError:
        return render(request, 'error.html', {'error_message': "La réponse du serveur n'est pas en format JSON valide."})
    
    context = {'infirmiers': infirmiers}
    return render(request, 'get_all_infirmiers.html', context)


def update_infirmier(request, infirmier_id):
    token = request.session.get('token')
    if not token:
        return redirect('login')

    if request.method == 'POST':
        availability = []
        days = request.POST.getlist('day')
        start_hours = request.POST.getlist('start_hour')
        end_hours = request.POST.getlist('end_hour')

        for day, start_hour, end_hour in zip(days, start_hours, end_hours):
            if day and start_hour and end_hour:
                availability.append({"day": day, "hours": f"{start_hour}-{end_hour}"})

        data = {
            'name': request.POST['name'],
            'email': request.POST['email'],
            'phone': request.POST['phone'],
            'address': request.POST['address'],
            'specialty': request.POST['specialty'],
            'availability': availability
        }

        response = requests.put(f'{BASEI_URL}/infirmiers/{infirmier_id}', json=data, headers={'Authorization': f'Bearer {token}'})
        
        if response.status_code == 200:
            messages.success(request, 'Infirmier mis à jour avec succès')
            return redirect('get_all_infirmiers')
        else:
            error_message = response.json().get('error', 'Erreur de mise à jour')
            return render(request, 'update_infirmier.html', {'error_message': error_message, 'infirmier': data})

    response = requests.get(f'{BASEI_URL}/infirmiers/{infirmier_id}', headers={'Authorization': f'Bearer {token}'})
    infirmier = response.json() if response.status_code == 200 else None
    return render(request, 'update_infirmier.html', {'infirmier': infirmier})

def delete_infirmier(request, infirmier_id):
    response = requests.delete(f'{BASEI_URL}/infirmiers/{infirmier_id}')
    if response.status_code == 200:
        messages.success(request, 'Infirmier supprimé avec succès')
    else:
        messages.error(request, 'Erreur lors de la suppression de l\'infirmier')
    return redirect('get_all_infirmiers')


# Afficher tous les personnels
def get_all_personnels(request):
    try:
        hopital_id = request.session.get('user_id')
        response = requests.get(f'{BASEP_URL}/personnels/hopital/{hopital_id}')
        response.raise_for_status()
        personnels = response.json()
    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur de requête: {e}"})
    except ValueError:
        return render(request, 'error.html', {'error_message': "La réponse du serveur n'est pas en format JSON valide."})
    
    context = {'personnels': personnels}
    return render(request, 'get_all_personnels.html', context)



# Créer un nouveau personnel
def creer_personnel(request):
    if request.method == 'POST':
        availability = []
        days = request.POST.getlist('day')
        start_hours = request.POST.getlist('start_hour')
        end_hours = request.POST.getlist('end_hour')

        for day, start_hour, end_hour in zip(days, start_hours, end_hours):
            if day and start_hour and end_hour:
                availability.append({"day": day, "hours": f"{start_hour}-{end_hour}"})

        data = {
            'name': request.POST['name'],
            'email': request.POST['email'],
            'phone': request.POST['phone'],
            'address': request.POST['address'],
            'poste': request.POST['poste'],  # Assurez-vous que 'poste' est correct ici
            'password': request.POST['password'],
            'Hopital': request.session.get('user_id'),
            'availability': availability
        }

        response = requests.post(f'{BASEP_URL}/personnels', json=data)

        if response.status_code == 201:
            personnel_info = response.json().get('personnel')
            message = f"Personnel créé avec succès!\n Identifiant: {personnel_info['identifiant']},\n Mot de passe: {personnel_info['password']}"
            messages.success(request, message)
            return redirect('get_all_personnels')
        else:
            error_message = response.json().get('error')
            return render(request, 'creer_personnel.html', {'error_message': error_message})

    return render(request, 'creer_personnel.html')

# Lire un personnel par ID
def get_personnel_by_id(request, personnel_id):
    try:
        response = requests.get(f'{BASEP_URL}/personnels/{personnel_id}')
        response.raise_for_status()  # Lève une exception pour les codes de statut HTTP 4xx/5xx
        personnel = response.json()
        return render(request, 'get_personnel.html', {'personnel': personnel})
    except requests.exceptions.RequestException as e:
        return render(request, 'get_personnel.html', {'error_message': str(e)})

# Mettre à jour un personnel
def update_personnel(request, personnel_id):
    token = request.session.get('token')
    if not token:
        return redirect('login')

    if request.method == 'POST':
        availability = []
        days = request.POST.getlist('day')
        start_hours = request.POST.getlist('start_hour')
        end_hours = request.POST.getlist('end_hour')

        for day, start_hour, end_hour in zip(days, start_hours, end_hours):
            if day and start_hour and end_hour:
                availability.append({"day": day, "hours": f"{start_hour}-{end_hour}"})

        data = {
            'name': request.POST['name'],
            'email': request.POST['email'],
            'phone': request.POST['phone'],
            'address': request.POST['address'],
            'poste': request.POST['poste'],
            'availability': availability
        }

        response = requests.put(f'{BASEP_URL}/personnels/{personnel_id}', json=data, headers={'Authorization': f'Bearer {token}'})

        print('Response status code:', response.status_code)
        print('Response content:', response.content)

        if response.status_code == 200:
            messages.success(request, "Personnel mis à jour avec succès!")
            return redirect('get_all_personnels')
        else:
            try:
                error_message = response.json().get('error', 'Erreur inconnue')
            except json.JSONDecodeError:
                error_message = 'Erreur de décodage de la réponse'
            return render(request, 'update_personnel.html', {'error_message': error_message, 'personnel': data})

    response = requests.get(f'{BASEP_URL}/personnels/{personnel_id}', headers={'Authorization': f'Bearer {token}'})
    personnel = response.json() if response.status_code == 200 else None
    return render(request, 'update_personnel.html', {'personnel': personnel})

# Supprimer un personnel
def delete_personnel(request, personnel_id):
    try:
        response = requests.delete(f'{BASEP_URL}/personnels/{personnel_id}')
        response.raise_for_status()  # Lève une exception pour les codes de statut HTTP 4xx/5xx
        messages.success(request, "Personnel supprimé avec succès !")
        return redirect('get_all_personnels')
    except requests.exceptions.RequestException as e:
        return redirect('get_all_personnels', {'error_message': str(e)})
    


# Faire horaire
def faire_horaire(request):
    token = request.session.get('token')
    if not token:
        return redirect('login')

    headers = {'Authorization': f'Bearer {token}'}
    
    # Récupérer les médecins, infirmiers et personnels avec leurs disponibilités
    response_medecins = requests.get(f'{BASEM_URL}/medecins', headers=headers)
    response_infirmiers = requests.get(f'{BASEI_URL}/infirmiers', headers=headers)
    response_personnels = requests.get(f'{BASEP_URL}/personnels', headers=headers)

    if response_medecins.status_code == 200 and response_infirmiers.status_code == 200 and response_personnels.status_code == 200:
        medecins = response_medecins.json()
        infirmiers = response_infirmiers.json()
        personnels = response_personnels.json()

        # Organiser les disponibilités par jour de la semaine
        planning = {'Monday': [], 'Tuesday': [], 'Wednesday': [], 'Thursday': [], 'Friday': [], 'Saturday': [], 'Sunday': []}
        
        for medecin in medecins:
            for availability in medecin['availability']:
                planning[availability['day']].append({
                    'name': medecin['name'],
                    'role': 'Médecin',
                    'hours': availability['hours']
                })

        for infirmier in infirmiers:
            for availability in infirmier['availability']:
                planning[availability['day']].append({
                    'name': infirmier['name'],
                    'role': 'Infirmier',
                    'hours': availability['hours']
                })

        for personnel in personnels:
            for availability in personnel['availability']:
                planning[availability['day']].append({
                    'name': personnel['name'],
                    'role': 'Personnel',
                    'hours': availability['hours']
                })
        
        return render(request, 'horaire.html', {'planning': planning})

    else:
        error_message = 'Erreur lors de la récupération des données'
        return render(request, 'horaire.html', {'error_message': error_message})




# modif horaire.py

def modifier_horaire(request):
    token = request.session.get('token')
    if not token:
        return redirect('login')

    headers = {'Authorization': f'Bearer {token}'}
    
    # Récupérer les médecins, infirmiers et personnels avec leurs disponibilités
    response_medecins = requests.get(f'{BASE_URL}/medecins', headers=headers)
    response_infirmiers = requests.get(f'{BASE_URL}/infirmiers', headers=headers)
    response_personnels = requests.get(f'{BASE_URL}/personnels', headers=headers)

    if response_medecins.status_code == 200 and response_infirmiers.status_code == 200 and response_personnels.status_code == 200:
        medecins = response_medecins.json()
        infirmiers = response_infirmiers.json()
        personnels = response_personnels.json()

        if request.method == 'POST':
            # Collecter les nouvelles disponibilités depuis le formulaire
            updated_availability = request.POST.getlist('availability')
            updated_data = []

            for entry in updated_availability:
                entry_data = entry.split(',')
                updated_data.append({
                    'id': entry_data[0],
                    'day': entry_data[1],
                    'start_hour': entry_data[2],
                    'end_hour': entry_data[3]
                })

            # Mettre à jour les disponibilités dans le backend
            for data in updated_data:
                role = data['id'].split('-')[0]
                obj_id = data['id'].split('-')[1]
                availability = {"day": data['day'], "hours": f"{data['start_hour']}-{data['end_hour']}"}

                if role == 'medecin':
                    requests.put(f'{BASE_URL}/medecins/{obj_id}', json={'availability': [availability]}, headers=headers)
                elif role == 'infirmier':
                    requests.put(f'{BASE_URL}/infirmiers/{obj_id}', json={'availability': [availability]}, headers=headers)
                elif role == 'personnel':
                    requests.put(f'{BASE_URL}/personnels/{obj_id}', json={'availability': [availability]}, headers=headers)

            messages.success(request, 'Emploi du temps mis à jour avec succès')
            return redirect('modifier_horaire')

        # Organiser les disponibilités par jour de la semaine
        planning = {'Monday': [], 'Tuesday': [], 'Wednesday': [], 'Thursday': [], 'Friday': [], 'Saturday': [], 'Sunday': []}
        
        for medecin in medecins:
            for availability in medecin['availability']:
                planning[availability['day']].append({
                    'id': f"medecin-{medecin['id']}",
                    'name': medecin['name'],
                    'role': 'Médecin',
                    'hours': availability['hours']
                })

        for infirmier in infirmiers:
            for availability in infirmier['availability']:
                planning[availability['day']].append({
                    'id': f"infirmier-{infirmier['id']}",
                    'name': infirmier['name'],
                    'role': 'Infirmier',
                    'hours': availability['hours']
                })

        for personnel in personnels:
            for availability in personnel['availability']:
                planning[availability['day']].append({
                    'id': f"personnel-{personnel['id']}",
                    'name': personnel['name'],
                    'role': 'Personnel',
                    'hours': availability['hours']
                })
        
        return render(request, 'modifier_horaire.html', {'planning': planning})

    else:
        error_message = 'Erreur lors de la récupération des données'
        return render(request, 'modifier_horaire.html', {'error_message': error_message})




# Lits

def creer_lit(request):
    if request.method == 'POST':
        patient_id = request.POST.get('patient_id', None)
        data = {
            'bedNumber': request.POST['bedNumber'],
            'Patient': patient_id if patient_id else None,
            'department': request.POST['department_id'],
            'Hopital': request.session.get('user_id'),
            'isAvailable': request.POST.get('isAvailable', 'false') == 'on'
        }
        response = requests.post(f'{BASEL_URL}/lits', json=data)
        if response.status_code == 201:
            messages.success(request, "Lit créé avec succès!")
            return redirect('get_all_lits')
        else:
            return render(request, 'creer_lit.html', {'error_message': response.json().get('error', 'Erreur de création')})

    patients = requests.get('http://localhost:5000/patient/patients').json()
    departments = requests.get('http://localhost:5000/departement/departments').json()
    context = {'patients': patients, 'departments': departments}
    return render(request, 'creer_lit.html', context)

def get_all_lits(request):
    try:
        hopital_id = request.session.get('user_id')
        response = requests.get(f'{BASEL_URL}/lits/hopital/{hopital_id}')
        response.raise_for_status()
        lits = response.json()
    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur de requête: {e}"})
    except ValueError:
        return render(request, 'error.html', {'error_message': "La réponse du serveur n'est pas en format JSON valide."})
    
    context = {'lits': lits}
    return render(request, 'get_all_lits.html', context)


def get_lit_by_id(request, id):
    response = requests.get(f'{BASEL_URL}/lits/{id}')
    lit = response.json()
    if response.status_code == 404:
        return JsonResponse({'error': 'Lit non trouvé'}, status=404)
    return render(request, 'get_lit_by_id.html', {'lit': lit})

def update_lit(request, id):
    if request.method == 'POST':
        data = {
            'bedNumber': request.POST['bedNumber'],
            'Patient': request.POST['patient_id'],
            'department': request.POST['department_id'],
            'Hopital': request.session.get('user_id'),
            'isAvailable': request.POST.get('isAvailable', 'false') == 'on'
        }
        response = requests.put(f'{BASEL_URL}/lits/{id}', json=data)
        if response.status_code == 200:
            messages.success(request, "Lit mis à jour avec succès")
            return redirect('get_all_lits')
        else:
            error_message = response.json().get('error', 'Erreur de mise à jour')
            return render(request, 'update_lit.html', {'error_message': error_message})

    response = requests.get(f'{BASEL_URL}/lits/{id}')
    lit = response.json()
    patients = requests.get('http://localhost:5000/patient/patients').json()
    departments = requests.get('http://localhost:5000/departement/departments').json()
    context = {'lit': lit, 'patients': patients, 'departments': departments}
    return render(request, 'update_lit.html', context)

def delete_lit(request, id):
    response = requests.delete(f'{BASEL_URL}/lits/{id}')
    if response.status_code == 200:
        messages.success(request, "Lit supprimé avec succès!")
    else:
        messages.error(request, "Erreur lors de la suppression du lit!")
    return redirect('get_all_lits')



# Departement

def creer_department(request):
    if request.method == 'POST':
        data = {
            'name': request.POST['name'],
            'Hopital': request.session.get('user_id')
        }
        response = requests.post(f'{BASED_URL}/departments', json=data)
        if response.status_code == 201:
            messages.success(request, "Département créé avec succès!")
            return redirect('get_all_departements')
        else:
            return render(request, 'creer_department.html', {'error_message': response.json().get('error', 'Erreur de création')})

    return render(request, 'creer_department.html')

def get_department_by_id(request, id):
    response = requests.get(f'{BASED_URL}/departments/{id}')
    department = response.json()
    if response.status_code == 404:
        return JsonResponse({'error': 'Département non trouvé'}, status=404)
    return render(request, 'get_department_by_id.html', {'department': department})

def get_all_departments(request):
    try:
        hopital_id = request.session.get('user_id')
        response = requests.get(f'{BASED_URL}/departments/hopital/{hopital_id}')
        response.raise_for_status()
        departments = response.json()
    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur de requête: {e}"})
    except ValueError:
        return render(request, 'error.html', {'error_message': "La réponse du serveur n'est pas en format JSON valide."})
    
    context = {'departments': departments}
    return render(request, 'get_all_departments.html', context)



def update_department(request, id):
    if request.method == 'POST':
        data = {
            'name': request.POST['name'],
            'Hopital': request.session.get('user_id')
        }
        response = requests.put(f'{BASED_URL}/departments/{id}', json=data)
        if response.status_code == 200:
            messages.success(request, "Département mis à jour avec succès")
            return redirect('get_all_departements')
        else:
            error_message = response.json().get('error', 'Erreur de mise à jour')
            return render(request, 'update_department.html', {'error_message': error_message})

    response = requests.get(f'{BASED_URL}/departments/{id}')
    department = response.json()
    context = {'department': department}
    return render(request, 'update_department.html', context)

def delete_department(request, id):
    response = requests.delete(f'{BASED_URL}/departments/{id}')
    if response.status_code == 200:
        messages.success(request, "Département supprimé avec succès!")
    else:
        messages.error(request, "Erreur lors de la suppression du département!")
    return redirect('get_all_departements')



# consultation 

def creer_consultation(request):
    if request.method == 'POST':
        rendezvous_id = request.POST['rendezvous_id']
        try:
            rendezvous_response = requests.get(f'{BASER_URL}/rendezvous/{rendezvous_id}')
            rendezvous_response.raise_for_status()
            rendezvous = rendezvous_response.json()
            print(f"Rendezvous Data: {rendezvous}")  # Debugging log
        except requests.exceptions.RequestException as e:
            return render(request, 'error.html', {'error_message': f"Erreur lors de la récupération des données de rendez-vous: {e}"})
        except ValueError as e:
            return render(request, 'error.html', {'error_message': "Erreur de format JSON pour les données de rendez-vous"})

        # Ensure the retrieved rendezvous data has 'id' for both Medecin and Patient
        medecin_id = rendezvous.get('Medecin', {}).get('_id', None)
        patient_id = rendezvous.get('Patient', {}).get('_id', None)

        if not medecin_id or not patient_id:
            return render(request, 'creer_consultation.html', {'error_message': 'Médecin ou Patient ID manquant dans les données de rendez-vous'})

        data = {
            'Rendezvous': rendezvous_id,
            'Medecin': medecin_id,
            'Patient': patient_id,
            'description': request.POST['description'],
            'status': request.POST['status'],
            'payment': request.POST.get('payment', 'false') == 'true',
            'Hopital': request.session.get('user_id')
        }

        response = requests.post(f'{BASEC_URL}/consultations', json=data)
        if response.status_code == 201:
            message = "Consultation créée avec succès!"
            messages.success(request, message)
            return redirect('get_all_consultations')
        else:
            return render(request, 'creer_consultation.html', {'error_message': response.json().get('error', 'Erreur de création')})
    
    try:
        rendezvous_response = requests.get(f'{BASER_URL}/rendezvous')
        rendezvous_response.raise_for_status()
        rendezvous = rendezvous_response.json()
    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur lors de la récupération des rendez-vous: {e}"})
    except ValueError as e:
        return render(request, 'error.html', {'error_message': "Erreur de format JSON pour les données de rendez-vous"})

    context = {
        'rendezvous': rendezvous
    }
    return render(request, 'creer_consultation.html', context)

def get_consultation_by_id(request, id):
    response = requests.get(f'{BASEC_URL}/consultations/{id}')
    consultation = response.json()
    if response.status_code == 404:
        return JsonResponse({'error': 'Consultation non trouvée'}, status=404)
    return render(request, 'get_consultation_by_id.html', {'consultation': consultation})

def get_all_consultations(request):
    try:
        hopital_id = request.session.get('user_id')
        response = requests.get(f'{BASEC_URL}/consultations/hopital/{hopital_id}')
        response.raise_for_status()
        consultations = response.json()
    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur de requête: {e}"})
    except ValueError:
        return render(request, 'error.html', {'error_message': "La réponse du serveur n'est pas en format JSON valide."})
    
    context = {'consultations': consultations}
    return render(request, 'get_all_consultations.html', context)


# Update an existing consultation
def update_consultation(request, id):
    if request.method == 'POST':
        rendezvous_id = request.POST['rendezvous_id']

        # Retrieve rendezvous details to ensure Patient and Medecin are valid
        rendezvous_response = requests.get(f'{BASER_URL}/rendezvous/{rendezvous_id}')
        if rendezvous_response.status_code != 200:
            messages.error(request, "Erreur de requête: Rendez-vous non trouvé")
            return redirect('update_consultation', id=id)
        
        rendezvous_data = rendezvous_response.json()
        
        data = {
            'Medecin': rendezvous_data['Medecin']['_id'],
            'Patient': rendezvous_data['Patient']['_id'],
            'description': request.POST['description'],
            'Rendezvous': rendezvous_id,
            'status': request.POST['status'],
            'payment': True if request.POST.get('payment') == 'on' else False,
            'Hopital': request.session.get('user_id')
        }

        response = requests.put(f'{BASEC_URL}/consultations/{id}', json=data)
        if response.status_code == 200:
            messages.success(request, "Consultation mise à jour avec succès")
            return redirect('get_all_consultations')
        else:
            return render(request, 'update_consultation.html', {'error_message': response.json().get('error', 'Erreur de mise à jour')})
    
    try:
        response = requests.get(f'{BASEC_URL}/consultations/{id}')
        response.raise_for_status()
        consultation = response.json()

        rendezvous_response = requests.get(f'{BASER_URL}/rendezvous')
        if rendezvous_response.status_code != 200:
            raise ValueError("Erreur lors de la récupération des rendez-vous")

        rendezvous = rendezvous_response.json()
    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur de requête: {e}"})
    except ValueError as e:
        return render(request, 'error.html', {'error_message': str(e)})

    context = {
        'consultation': consultation,
        'rendezvous': rendezvous
    }
    return render(request, 'update_consultation.html', context)
def delete_consultation(request, id):
    response = requests.delete(f'{BASEC_URL}/consultations/{id}')
    if response.status_code == 200:
        messages.success(request, "Consultation supprimée avec succès!")
    else:
        messages.error(request, "Erreur lors de la suppression de la consultation!")
    return redirect('get_all_consultations')



# Rendez vous

def creer_rendezvous(request):
    if request.method == 'POST':
        data = {
            'date': request.POST['date'],
            'heures': request.POST['heures'],
            'Patient': request.POST['patient_id'],
            'Medecin': request.POST['medecin_id'],
            'Hopital': request.session.get('user_id')
        }
        response = requests.post(f'{BASER_URL}/rendezvous', json=data)
        if response.status_code == 201:
            messages.success(request, "Rendez-vous créé avec succès!")
            return redirect('get_all_rendezvous')
        else:
            return render(request, 'creer_rendezvous.html', {'error_message': response.json().get('error', 'Erreur de création')})

    patients = requests.get('http://localhost:5000/patient/patients').json()
    medecins = requests.get('http://localhost:5000/medecin/medecins').json()
    heures = [f"{hour:02d}:00" for hour in range(8, 19)]

    context = {
        'patients': patients,
        'medecins': medecins,
        'heures': heures
    }
    return render(request, 'creer_rendezvous.html', context)

def get_all_rendezvous(request):
    try:
        hopital_id = request.session.get('user_id')
        response = requests.get(f'{BASER_URL}/rendezvous/hopital/{hopital_id}')
        response.raise_for_status()
        rendezvous = response.json()
    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur de requête: {e}"})
    except ValueError:
        return render(request, 'error.html', {'error_message': "La réponse du serveur n'est pas en format JSON valide."})
    
    context = {'rendezvous': rendezvous}
    return render(request, 'get_all_rendezvous.html', context)


def get_rendezvous_by_id(request, id):
    response = requests.get(f'{BASER_URL}/rendezvous/{id}')
    rendezvous = response.json()
    if response.status_code == 404:
        return JsonResponse({'error': 'Rendez-vous non trouvé'}, status=404)
    return render(request, 'get_rendezvous_by_id.html', {'rendezvous': rendezvous})

def update_rendezvous(request, id):
    if request.method == 'POST':
        data = {
            'date': request.POST['date'],
            'heures': request.POST['heures'],
            'Patient': request.POST['patient_id'],
            'Medecin': request.POST['medecin_id'],
            'Hopital': request.session.get('user_id')
        }
        response = requests.put(f'{BASER_URL}/rendezvous/{id}', json=data)
        if response.status_code == 200:
            messages.success(request, "Rendez-vous mis à jour avec succès")
            return redirect('get_all_rendezvous')
        else:
            error_message = response.json().get('error', 'Erreur de mise à jour')
            return render(request, 'update_rendezvous.html', {'error_message': error_message})

    response = requests.get(f'{BASER_URL}/rendezvous/{id}')
    rendezvous = response.json()
    patients = requests.get('http://localhost:5000/patient/patients').json()
    medecins = requests.get('http://localhost:5000/medecin/medecins').json()
    heures = [f"{hour:02d}:00" for hour in range(8, 19)]

    context = {
        'rendezvous': rendezvous,
        'patients': patients,
        'medecins': medecins,
        'heures': heures
    }
    return render(request, 'update_rendezvous.html', context)

def delete_rendezvous(request, id):
    response = requests.delete(f'{BASER_URL}/rendezvous/{id}')
    if response.status_code == 200:
        messages.success(request, "Rendez-vous supprimé avec succès!")
    else:
        messages.error(request, "Erreur lors de la suppression du rendez-vous!")
    return redirect('get_all_rendezvous')




BASEH_URL = 'http://localhost:5000/horaire/horaires'

def creer_horaire(request):
    if request.method == 'POST':
        data = {
            'day': request.POST['day'],
            'start_hour': request.POST['start_hour'],
            'end_hour': request.POST['end_hour'],
            'type': request.POST['type'],
            'referenceId': request.POST['referenceId'],
        }

        response = requests.post(BASEH_URL, json=data)

        if response.status_code == 201:
            messages.success(request, "Horaire créé avec succès!")
            return redirect('get_all_horaires')
        else:
            error_message = response.json().get('error', 'Erreur lors de la création de l\'horaire')
            return render(request, 'creer_horaire.html', {'error_message': error_message})

    medecins = requests.get('http://localhost:5000/medecin/medecins').json()
    infirmiers = requests.get('http://localhost:5000/infirmier/infirmiers').json()
    personnels = requests.get('http://localhost:5000/personnel/personnels').json()
    
    return render(request, 'creer_horaire.html', {'medecins': medecins, 'infirmiers': infirmiers, 'personnels': personnels})

def update_horaire(request, id):
    if request.method == 'POST':
        data = {
            'day': request.POST['day'],
            'start_hour': request.POST['start_hour'],
            'end_hour': request.POST['end_hour'],
            'type': request.POST['type'],
            'referenceId': request.POST['referenceId'],
        }

        response = requests.put(f'{BASEH_URL}/{id}', json=data)

        if response.status_code == 200:
            messages.success(request, "Horaire modifié avec succès!")
            return redirect('get_all_horaires')
        else:
            error_message = response.json().get('error', 'Erreur lors de la modification de l\'horaire')
            return render(request, 'modifier_horaire.html', {'error_message': error_message, 'horaire': data})

    response = requests.get(f'{BASEH_URL}/{id}')
    horaire = response.json() if response.status_code == 200 else None
    
    medecins = requests.get('http://localhost:5000/medecin/medecins').json()
    infirmiers = requests.get('http://localhost:5000/infirmier/infirmiers').json()
    personnels = requests.get('http://localhost:5000/personnel/personnels').json()
    
    return render(request, 'modifier_horaire.html', {'horaire': horaire, 'medecins': medecins, 'infirmiers': infirmiers, 'personnels': personnels})


def get_all_horaires(request):
    response = requests.get(BASEH_URL)
    horaires = response.json() if response.status_code == 200 else []
    return render(request, 'get_all_horaires.html', {'horaires': horaires})

def get_all_patients_transfer(request):
    try:
        response = requests.get(f'{BASE_URL}/patients')
        response.raise_for_status()
        patients = response.json()  
    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur de requête: {e}"})
    except ValueError:
        return render(request, 'error.html', {'error_message': "La réponse du serveur n'est pas en format JSON valide."})
    
    context = {'patients': patients}
    return render(request, 'get_all_patients_transfer.html', context)