from django.shortcuts import render, redirect
import requests
from django.conf import settings
import jwt
import json
from django.contrib import messages

def login(request):
    if request.method == 'POST':
        identifiant = request.POST['identifiant']
        password = request.POST['password']
        
        response = requests.post('http://localhost:5000/auth/login', json={
            'identifiant': identifiant,
            'password': password
        })

        if response.status_code == 200:
            token = response.json().get('token')
            user = response.json().get('user')
            print(user)

            # Stocker le token et le rôle dans la session
            request.session['token'] = token
            request.session['role'] = user['role']
            request.session['user_id'] = user['_id']
            if user['role'] == 'admin':
                return redirect('home')
            elif user['role'] == 'hopital': 
                return redirect('get_all_medecins')
            elif user['role'] == 'medecin':
                return redirect('profil_medecin')
            elif user['role'] == 'infirmier':
                return redirect('profil_infirmier')
            elif user['role'] == 'personnel':
                return redirect('profil_personnel')
            elif user['role'] == 'patient':
                return redirect('profil_patient')
            else:
                None
                
        else:
            error_message = response.json().get('error')
            return render(request, 'login.html', {'error_message': error_message})

    return render(request, 'login.html')

def home(request):
    token = request.session.get('token')
    role = request.session.get('role')

    if not token:
        return redirect('login')

    # Récupérer les hôpitaux depuis le backend
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get('http://localhost:5000/auth/hopitaux', headers=headers)

    if response.status_code == 200:
        hopitaux = response.json()
        print(hopitaux)
    else:
        hopitaux = []
        error_message = 'Erreur lors de la récupération des hôpitaux'

    return render(request, 'home.html', {'role': role, 'hopitaux': hopitaux,  'messages': messages.get_messages(request), 'error_message': error_message if response.status_code != 200 else None})

def logout(request):
    try:
        del request.session['token']
        del request.session['role']
    except KeyError:
        pass
    return redirect('login')

def creer_hopital(request):
    if request.method == 'POST':
        nom_hopital = request.POST['nom_hopital']
        telephone = request.POST['telephone']
        date_de_creation = request.POST['date_de_creation']
        adresse = request.POST['adresse']
        codepostal = request.POST['codepostal']
        email = request.POST['email']
        password = request.POST['password']
        status = request.POST['status'].lower() == 'true'

        data = {
            'nom_hopital': nom_hopital,
            'telephone': telephone,
            'date_de_creation': date_de_creation,
            'adresse': adresse,
            'codepostal': codepostal,
            'email': email,
            'password': password,
            'status': status
        }

        response = requests.post('http://localhost:5000/auth/creer_hopital', json=data)

        if response.status_code == 201:
            hopital_info = response.json().get('hopital')
            message = f"Hôpital créé avec succès!\n Identifiant: {hopital_info['identifiant']},\n Mot de passe: {hopital_info['password']}"
            messages.success(request, message)
            return redirect('home')
        else:
            error_message = response.json().get('error')
            return render(request, 'creer_hopital.html', {'error_message': error_message})

    return render(request, 'creer_hopital.html')
def modifier_hopital(request, id):
    token = request.session.get('token')
    if not token:
        return redirect('login')

    if request.method == 'POST':
        nom_hopital = request.POST['nom_hopital']
        telephone = request.POST['telephone']
        adresse = request.POST['adresse']
        codepostal = request.POST['codepostal']
        email = request.POST['email']
        status = request.POST['status'].lower() == 'true'

        data = {
            'nom_hopital': nom_hopital,
            'telephone': telephone,
            'adresse': adresse,
            'codepostal': codepostal,
            'email': email,
            'status': status
        }

        response = requests.put(f'http://localhost:5000/auth/hopital/{id}', json=data, headers={'Authorization': f'Bearer {token}'})

        # Log the response for debugging
        print('Response status code:', response.status_code)
        print('Response content:', response.content)

        if response.status_code == 200:
            messages.success(request, "Hôpital modifié avec succès!")
            return redirect('home')
        else:
            try:
                error_message = response.json().get('error', 'Erreur inconnue')
            except json.JSONDecodeError:
                error_message = 'Erreur de décodage de la réponse'
            return render(request, 'modifier_hopital.html', {'error_message': error_message, 'hopital': data})

    response = requests.get(f'http://localhost:5000/auth/hopital/{id}', headers={'Authorization': f'Bearer {token}'})
    hopital = response.json() if response.status_code == 200 else None
    return render(request, 'modifier_hopital.html', {'hopital': hopital})

def supprimer_hopital(request, id):
    token = request.session.get('token')
    if not token:
        return redirect('login')

    response = requests.delete(f'http://localhost:5000/auth/hopital/{id}', headers={'Authorization': f'Bearer {token}'})

    if response.status_code == 200:
        messages.success(request, "Hôpital supprimé avec succès!")
    else:
        messages.error(request, "Erreur lors de la suppression de l'hôpital!")

    return redirect('home')









'''
hopital1
infirmier1
medecin1
patient1
personnel1
$2b$10$Yf1zLUb.zYmSc2l2o0kM4e28UjZrVIfnTJs1/.SPu/TOYWTi1n.Ui

'''