from django.shortcuts import render, redirect
from django.http import JsonResponse
import requests
from django.contrib.auth.decorators import login_required
from django.contrib import messages

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
        response = requests.get(f'{BASE_URL}/patients')
        response.raise_for_status()  # Vérifie si la requête a échoué
        patients = response.json()  # Essaye de décoder la réponse en JSON
    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur de requête: {e}"})
    except ValueError:
        return render(request, 'error.html', {'error_message': "La réponse du serveur n'est pas en format JSON valide."})
    
    context = {'patients': patients}
    return render(request, 'get_all_patients.html', context)

def get_patient_by_id(request, id):
    response = requests.get(f'{BASE_URL}/patients/{id}')
    patient = response.json()
    if response.status_code == 404:
        return JsonResponse({'error': 'Patient non trouvé'}, status=404)
    return render(request, 'get_patient_by_id.html', {'patient': patient})

def delete_patient(request, id):
    response = requests.delete(f'{BASE_URL}/patients/{id}')
    if response.status_code == 200:
        messages.success(request, "Hôpital supprimé avec succès!")
        return redirect('get_all_patients')
    else:
        messages.error(request, "Erreur lors de la suppression de l'hôpital!")
        return JsonResponse(response.json(), status=response.status_code)
       
       
# dossier
       
BASED_URL = 'http://localhost:5000/dossier'

@login_required
def creer_dossier(request):
    if request.method == 'POST':
        data = {
            'Patient': request.POST['patient'],
            'Medecin': request.POST['medecin'],
            'Infirmier': request.POST.get('infirmier', None),
            'disease': request.POST['disease'],
            'internal': request.POST['internal'],
            'openDate': request.POST['openDate'],
            'status': request.POST['status'],
            'Hopital': request.session.get('user_id')  # Assurez-vous que l'utilisateur connecté a cet attribut
        }
        response = requests.post(f'{BASED_URL}/dossiers', json=data)
        if response.status_code == 201:
            message = "Dossier créé avec succès"
            messages.success(request, message)
            return redirect('home')
        else:
            error_message = response.json().get('error', 'Erreur de création')
            return render(request, 'creer_dossier.html', {'error_message': error_message})
    
    patients = requests.get('http://localhost:5000/patients').json()
    medecins = requests.get('http://localhost:5000/medecins').json()
    infirmiers = requests.get('http://localhost:5000/infirmiers').json()

    context = {
        'patients': patients,
        'medecins': medecins,
        'infirmiers': infirmiers,
        'hopital': request.session.get('user_id')
    }
    return render(request, 'creer_dossier.html', context)

@login_required
def get_all_dossiers(request):
    try:
        response = requests.get(f'{BASED_URL}/dossiers')
        response.raise_for_status()
        dossiers = response.json()
    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur de requête: {e}"})
    except ValueError:
        return render(request, 'error.html', {'error_message': "La réponse du serveur n'est pas en format JSON valide."})

    context = {'dossiers': dossiers}
    return render(request, 'get_all_dossiers.html', context)

@login_required
def get_dossier_by_id(request, dossier_id):
    response = requests.get(f'{BASED_URL}/dossiers/{dossier_id}')
    dossier = response.json()
    if response.status_code == 404:
        return JsonResponse({'error': 'Dossier non trouvé'}, status=404)
    return render(request, 'get_dossier_by_id.html', {'dossier': dossier})

@login_required
def update_dossier(request, dossier_id):
    if request.method == 'POST':
        data = {
            'Patient': request.POST['patient'],
            'Medecin': request.POST['medecin'],
            'Infirmier': request.POST.get('infirmier', None),
            'disease': request.POST['disease'],
            'internal': request.POST['internal'],
            'openDate': request.POST['openDate'],
            'status': request.POST['status'],
            'Hopital': request.session.get('user_id')
        }
        response = requests.put(f'{BASED_URL}/dossiers/{dossier_id}', json=data)
        if response.status_code == 200:
            message = "Dossier mis à jour avec succès"
            messages.success(request, message)
            return redirect('home')
        else:
            error_message = response.json().get('error', 'Erreur de mise à jour')
            return render(request, 'update_dossier.html', {'error_message': error_message})
    
    response = requests.get(f'{BASED_URL}/dossiers/{dossier_id}')
    dossier = response.json()

    patients = requests.get('http://localhost:5000/patient/patients').json()
    medecins = requests.get('http://localhost:5000/medecin/medecins').json()
    infirmiers = requests.get('http://localhost:5000/infirmier/infirmiers').json()

    context = {
        'dossier': dossier,
        'patients': patients,
        'medecins': medecins,
        'infirmiers': infirmiers
    }
    return render(request, 'update_dossier.html', context)

@login_required
def delete_dossier(request, dossier_id):
    response = requests.delete(f'{BASED_URL}/dossiers/{dossier_id}')
    if response.status_code == 200:
        messages.success(request, "Dossier supprimé avec succès!")
    else:
        messages.error(request, "Erreur lors de la suppression du dossier!")
    return redirect('home')