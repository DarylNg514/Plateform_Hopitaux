from django.shortcuts import render, redirect
from django.http import JsonResponse
import requests
from django.contrib.auth.decorators import login_required
from django.contrib import messages
import json
from django.core.paginator import Paginator


BASE_URL = 'http://localhost:5000'
BASEDO_URL = f'{BASE_URL}/dossier'
BASEM_URL = f'{BASE_URL}/medecin'
BASEI_URL = f'{BASE_URL}/infirmier'
BASEP_URL = f'{BASE_URL}/personnel'
BASEPA_URL = f'{BASE_URL}/patient'
BASEL_URL = f'{BASE_URL}/lit'
BASEC_URL = f'{BASE_URL}/consultation'
BASED_URL = f'{BASE_URL}/departement'
BASER_URL = f'{BASE_URL}/rendezvous'
BASEH_URL = f'{BASE_URL}/horaire/horaires'
BASEHO_URL = f'{BASE_URL}/auth'
BASEME_URL = f'{BASE_URL}/message'





def get_medecin_connecte(request):
    medecin_id = request.session.get('user_id')
    if not medecin_id:
        return redirect('login')

    response = requests.get(f'{BASEM_URL}/medecins/{medecin_id}')
    medecin = response.json() if response.status_code == 200 else None
    return render(request, 'profil_medecin.html', {'medecin': medecin})

def update_medecin_connecte(request):
    medecin_id = request.session.get('user_id')
    if not medecin_id:
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

        response = requests.put(f'{BASEM_URL}/medecins/{medecin_id}', json=data)

        if response.status_code == 200:
            messages.success(request, "Informations modifiées avec succès!")
            return redirect('profil_medecin')
        else:
            try:
                error_message = response.json().get('error', 'Erreur inconnue')
            except json.JSONDecodeError:
                error_message = 'Erreur de décodage de la réponse'
            return render(request, 'modifier_profil.html', {'error_message': error_message, 'medecin': data})

    response = requests.get(f'{BASEM_URL}/medecins/{medecin_id}')
    medecin = response.json() if response.status_code == 200 else None

    response_departments = requests.get('http://localhost:5000/departement/departments')
    departments = response_departments.json() if response_departments.status_code == 200 else []

    return render(request, 'modifier_profil.html', {'medecin': medecin, 'departments': departments})

def get_patient_connecte(request):
    patient_id = request.session.get('user_id')
    if not patient_id:
        return redirect('login')

    response = requests.get(f'{BASEPA_URL}/patients/{patient_id}')
    patient = response.json() if response.status_code == 200 else None
    return render(request, 'profil_patient.html', {'patient': patient})

def update_patient_connecte(request):
    patient_id = request.session.get('user_id')
    if not patient_id:
        return redirect('login')

    if request.method == 'POST':
        data = {
            'name': request.POST['name'],
            'email': request.POST['email'],
            'phone': request.POST['phone'],
            'address': request.POST['address']
        }

        response = requests.put(f'{BASEPA_URL}/patients/{patient_id}', json=data)

        if response.status_code == 200:
            messages.success(request, "Informations modifiées avec succès!")
            return redirect('profil_patient')
        else:
            try:
                error_message = response.json().get('error', 'Erreur inconnue')
            except json.JSONDecodeError:
                error_message = 'Erreur de décodage de la réponse'
            return render(request, 'modifier_profil_patient.html', {'error_message': error_message, 'patient': data})

    response = requests.get(f'{BASEPA_URL}/patients/{patient_id}')
    patient = response.json() if response.status_code == 200 else None

    return render(request, 'modifier_profil_patient.html', {'patient': patient})


def get_personnel_connecte(request):
    personnel_id = request.session.get('user_id')
    if not personnel_id:
        return redirect('login')

    response = requests.get(f'{BASEP_URL}/personnels/{personnel_id}')
    personnel = response.json() if response.status_code == 200 else None
    return render(request, 'profil_personnel.html', {'personnel': personnel})

def update_personnel_connecte(request):
    personnel_id = request.session.get('user_id')
    if not personnel_id:
        return redirect('login')

    if request.method == 'POST':
        data = {
            'name': request.POST['name'],
            'email': request.POST['email'],
            'phone': request.POST['phone'],
            'address': request.POST['address']
        }

        response = requests.put(f'{BASEP_URL}/personnels/{personnel_id}', json=data)

        if response.status_code == 200:
            messages.success(request, "Informations modifiées avec succès!")
            return redirect('profil_personnel')
        else:
            try:
                error_message = response.json().get('error', 'Erreur inconnue')
            except json.JSONDecodeError:
                error_message = 'Erreur de décodage de la réponse'
            return render(request, 'modifier_profil_personnel.html', {'error_message': error_message, 'personnel': data})

    response = requests.get(f'{BASEP_URL}/personnels/{personnel_id}')
    personnel = response.json() if response.status_code == 200 else None

    return render(request, 'modifier_profil_personnel.html', {'personnel': personnel})

def get_infirmier_connecte(request):
    infirmier_id = request.session.get('user_id')
    if not infirmier_id:
        return redirect('login')

    response = requests.get(f'{BASEI_URL}/infirmiers/{infirmier_id}')
    infirmier = response.json() if response.status_code == 200 else None
    print(infirmier)
    return render(request, 'profil_infirmier.html', {'infirmier': infirmier})

def update_infirmier_connecte(request):
    infirmier_id = request.session.get('user_id')
    if not infirmier_id:
        return redirect('login')

    if request.method == 'POST':
        data = {
            'name': request.POST['name'],
            'email': request.POST['email'],
            'phone': request.POST['phone'],
            'address': request.POST['address'],
        }

        response = requests.put(f'{BASEI_URL}/infirmiers/{infirmier_id}', json=data)

        if response.status_code == 200:
            messages.success(request, "Informations modifiées avec succès!")
            return redirect('profil_infirmier')
        else:
            try:
                error_message = response.json().get('error', 'Erreur inconnue')
            except json.JSONDecodeError:
                error_message = 'Erreur de décodage de la réponse'
            return render(request, 'modifier_profil_infirmier.html', {'error_message': error_message, 'infirmier': data})

    response = requests.get(f'{BASEI_URL}/infirmiers/{infirmier_id}')
    infirmier = response.json() if response.status_code == 200 else None

    return render(request, 'modifier_profil_infirmier.html', {'infirmier': infirmier})


def get_consultation_by_medecin(request):
    medecin_id = request.session.get('user_id')
    if not medecin_id:
        return redirect('login')

    try:
        response = requests.get(f'{BASEM_URL}/medecins/{medecin_id}/consultations')
        response.raise_for_status()
        consultations = response.json()
    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur de requête: {e}"})
    except ValueError:
        return render(request, 'error.html', {'error_message': "La réponse du serveur n'est pas en format JSON valide."})

    context = {'consultations': consultations}
    return render(request, 'consultations_medecin.html', context)

def get_consultation_by_patient(request):
    patient_id = request.session.get('user_id')
    if not patient_id:
        return redirect('login')

    try:
        response = requests.get(f'{BASEPA_URL}/patients/{patient_id}/consultations')
        response.raise_for_status()
        consultations = response.json()
    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur de requête: {e}"})
    except ValueError:
        return render(request, 'error.html', {'error_message': "La réponse du serveur n'est pas en format JSON valide."})

    context = {'consultations': consultations}
    return render(request, 'consultations_patient.html', context)

def get_dossier_by_patient(request):
    patient_id = request.session.get('user_id')
    if not patient_id:
        return redirect('login')

    try:
        response = requests.get(f'{BASEPA_URL}/patients/{patient_id}/dossiers')
        response.raise_for_status()
        dossiers = response.json()
    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur de requête: {e}"})
    except ValueError:
        return render(request, 'error.html', {'error_message': "La réponse du serveur n'est pas en format JSON valide."})

    context = {'dossiers': dossiers}
    return render(request, 'dossiers_patient.html', context)

def get_dossier_by_medecin(request):
    medecin_id = request.session.get('user_id')
    if not medecin_id:
        return redirect('login')

    try:
        response = requests.get(f'{BASEM_URL}/medecins/{medecin_id}/dossiers')
        response.raise_for_status()
        dossiers = response.json()
    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur de requête: {e}"})
    except ValueError:
        return render(request, 'error.html', {'error_message': "La réponse du serveur n'est pas en format JSON valide."})

    context = {'dossiers': dossiers}
    return render(request, 'dossiers_medecin.html', context)

def get_dossier_by_infirmier(request):
    infirmier_id = request.session.get('user_id')
    if not infirmier_id:
        return redirect('login')
    try:
        response = requests.get(f'{BASEI_URL}/infirmiers/{infirmier_id}/dossiers')
        response.raise_for_status()
        dossiers = response.json()
    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur de requête: {e}"})
    except ValueError:
        return render(request, 'error.html', {'error_message': "La réponse du serveur n'est pas en format JSON valide."})

    context = {'dossiers': dossiers}
    return render(request, 'dossiers_infirmier.html', context)

def get_rendezvous_by_medecin(request):
    medecin_id = request.session.get('user_id')
    if not medecin_id:
        return redirect('login')

    try:
        response = requests.get(f'{BASEM_URL}/medecins/{medecin_id}/rendezvous')
        response.raise_for_status()
        rendezvous = response.json()
    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur de requête: {e}"})
    except ValueError:
        return render(request, 'error.html', {'error_message': "La réponse du serveur n'est pas en format JSON valide."})

    context = {'rendezvous': rendezvous}
    return render(request, 'rendezvous_medecin.html', context)

def get_rendezvous_by_patient(request):
    patient_id = request.session.get('user_id')
    if not patient_id:
        return redirect('login')

    try:
        response = requests.get(f'{BASEPA_URL}/patients/{patient_id}/rendezvous')
        response.raise_for_status()
        rendezvous = response.json()
    except requests.exceptions.RequestException as e:
        return render(request, 'error.html', {'error_message': f"Erreur de requête: {e}"})
    except ValueError:
        return render(request, 'error.html', {'error_message': "La réponse du serveur n'est pas en format JSON valide."})

    context = {'rendezvous': rendezvous}
    return render(request, 'rendezvous_patient.html', context)

def deplacer_patient(request):
    token = request.session.get('token')
    # Récupérer la liste des patients
    response_patients = requests.get(f'{BASEPA_URL}/patients')
    patients = response_patients.json() if response_patients.status_code == 200 else []

    # Récupérer la liste des hôpitaux
    headers = {'Authorization': f'Bearer {token}'}
    response_hopitaux = requests.get(f'{BASEHO_URL}/hopitaux',headers=headers)
    hopitaux = response_hopitaux.json() if response_hopitaux.status_code == 200 else []

    if request.method == 'POST':
        patient_id = request.POST.get('patient_id')
        new_hopital_id = request.POST.get('new_hopital_id')

        if not patient_id or not new_hopital_id:
            messages.error(request, "Les champs patient_id et new_hopital_id sont obligatoires.")
            return redirect('deplacer_patient')

        # Effectuer la requête pour déplacer le patient
        response = requests.post(f'{BASEPA_URL}/deplacer', json={
            'patientId': patient_id,
            'newHopitalId': new_hopital_id
        })

        if response.status_code == 200:
            messages.success(request, "Patient déplacé avec succès.")
        else:
            messages.error(request, "Erreur lors du déplacement du patient.")
            try:
                error_message = response.json().get('error', 'Erreur inconnue')
            except ValueError:
                error_message = 'Erreur de décodage de la réponse'
            messages.error(request, error_message)

        return redirect('get_all_patients_transfer')

    return render(request, 'deplacer_patient.html', {'patients': patients, 'hopitaux': hopitaux})

def envoyer_message(request):
    token = request.session.get('token')
    headers = {'Authorization': f'Bearer {token}'}
    
    sender_id = request.session.get('user_id')
    sender_role = request.session.get('role').lower()
    
    if request.method == 'POST':
        content = request.POST.get('content')
        receiver_id = request.POST.get('receiver_id')
        receiver_type = request.POST.get('receiver_type')

        if not content or not receiver_id or not receiver_type:
            return render(request, 'error.html', {'error_message': 'Tous les champs sont obligatoires.'})

        if sender_role == 'admin':
            data = {
                'senderAdmin': sender_id,
                'receiverHopital': receiver_id,
                'content': content
            }
            response = requests.post(f'{BASEME_URL}/admin/messages', json=data, headers=headers)
        elif sender_role == 'hopital':
            data = {
                'senderHopital': sender_id,
                'receiverUser': receiver_id,
                'content': content
            }
            response = requests.post(f'{BASEME_URL}/hopital/messages', json=data, headers=headers)
        else:
            return render(request, 'error.html', {'error_message': 'Role d\'expéditeur non valide.'})

        if response.status_code != 201:
            return render(request, 'error.html', {'error_message': 'Erreur lors de l\'envoi du message.', 'debug_info': response.json()})

        messages.success(request, "Message envoyé avec succès!")
        return redirect('afficher_messages')

    # Récupérer les destinataires potentiels pour l'affichage dans le formulaire
    receivers = []
    if sender_role == 'admin':
        response_hopitals = requests.get(f'{BASEHO_URL}/hopitaux', headers=headers)
        receivers = response_hopitals.json() if response_hopitals.status_code == 200 else []
    elif sender_role == 'hopital':
        response_users = requests.get(f'{BASEHO_URL}/users', headers=headers)
        receivers = response_users.json() if response_users.status_code == 200 else []

    # Ajouter le receiver_type au contexte du template
    for receiver in receivers:
        receiver['type'] = 'hopital' if sender_role == 'admin' else 'user'

    return render(request, 'envoyer_message.html', {'receivers': receivers})


def afficher_messages(request):
    user_id = request.session.get('user_id')
    user_role = request.session.get('role').lower()

    if user_role == 'hopital':
        received_response = requests.get(f'{BASEME_URL}/hopital/messages/received?receiverHopital={user_id}', headers={'Authorization': f'Bearer {request.session.get("token")}'})
        sent_response = requests.get(f'{BASEME_URL}/hopital/messages/sent?senderHopital={user_id}', headers={'Authorization': f'Bearer {request.session.get("token")}'})
    elif user_role == 'admin':
        received_response = requests.get(f'{BASEME_URL}/admin/messages/received?receiverUser={user_id}', headers={'Authorization': f'Bearer {request.session.get("token")}'})
        sent_response = requests.get(f'{BASEME_URL}/admin/messages/sent?senderAdmin={user_id}', headers={'Authorization': f'Bearer {request.session.get("token")}'})
    else:
        return render(request, 'error.html', {'error_message': "Rôle d'utilisateur non valide pour l'affichage des messages."})

    if received_response.status_code == 200 and sent_response.status_code == 200:
        received_messages = received_response.json()
        sent_messages = sent_response.json()
    else:
        received_messages = []
        sent_messages = []
        messages.error(request, "Erreur lors de la récupération des messages.")

    # Pagination pour les messages reçus
    paginator_received = Paginator(received_messages, 7)  # 10 messages par page
    page_number_received = request.GET.get('page_received')
    page_obj_received = paginator_received.get_page(page_number_received)

    # Pagination pour les messages envoyés
    paginator_sent = Paginator(sent_messages, 10)  # 10 messages par page
    page_number_sent = request.GET.get('page_sent')
    page_obj_sent = paginator_sent.get_page(page_number_sent)

    return render(request, 'afficher_messages.html', {
        'page_obj_received': page_obj_received,
        'page_obj_sent': page_obj_sent
    })
    
def lire_message(request, message_id):
    user_role = request.session.get('role').lower()
    token = request.session.get('token')
    headers = {'Authorization': f'Bearer {token}'}

    if user_role == 'hopital':
        response = requests.get(f'{BASEME_URL}/hopital/messages/{message_id}', headers=headers)
    elif user_role == 'admin':
        response = requests.get(f'{BASEME_URL}/admin/messages/{message_id}', headers=headers)
    else:
        return render(request, 'error.html', {'error_message': "Role d'utilisateur non valide pour l'affichage des messages."})

    if response.status_code == 404:
        return render(request, 'error.html', {'error_message': "Message non trouvé."})

    message = response.json() if response.status_code == 200 else None

    return render(request, 'lire_message.html', {'message': message})

def supprimer_message(request, message_id):
    user_role = request.session.get('role').lower()
    token = request.session.get('token')
    headers = {'Authorization': f'Bearer {token}'}

    if user_role == 'hopital':
        # Suppression d'un message envoyé ou reçu par un hôpital
        response = requests.delete(f'{BASEME_URL}/hopital/messages/{message_id}', headers=headers)
    elif user_role == 'admin':
        # Suppression d'un message envoyé ou reçu par un administrateur
        response = requests.delete(f'{BASEME_URL}/admin/messages/{message_id}', headers=headers)
    else:
        return render(request, 'error.html', {'error_message': "Rôle d'utilisateur non valide pour la suppression des messages."})

    if response.status_code == 204:
        messages.success(request, "Message supprimé avec succès.")
    elif response.status_code == 404:
        messages.error(request, "Message non trouvé.")
    else:
        messages.error(request, "Erreur lors de la suppression du message.")

    return redirect('afficher_messages')
