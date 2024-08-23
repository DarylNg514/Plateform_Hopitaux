"""
URL configuration for Projet_RCW project.

The `urlpatterns` list routes URLs to vsh. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function vsh
    1. Add an import:  from my_app import vsh
    2. Add a URL to urlpatterns:  path('', vsh.home, name='home')
Class-based vsh
    1. Add an import:  from other_app.vsh import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from authapp import views as vsa
from hopital import views as vsh
from users import views as vsu




urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', vsa.login, name='login'),
    path('', vsa.home, name='home'),
    path('logout/', vsa.logout, name='logout'),
    path('creer_hopital/', vsa.creer_hopital, name='creer_hopital'),
    path('modifier-hopital/<str:id>/', vsa.modifier_hopital, name='modifier_hopital'),
    path('supprimer-hopital/<str:id>/', vsa.supprimer_hopital, name='supprimer_hopital'),
    
   # hopital
    path('creer_patient/', vsh.creer_patient, name='creer_patient'),
    path('patients/', vsh.get_all_patients, name='get_all_patients'),
    path('patients/transfer', vsh.get_all_patients_transfer, name='get_all_patients_transfer'),
    path('patients/<str:id>/', vsh.get_patient_by_id, name='get_patient_by_id'),
    path('patients/modifier/<str:id>/', vsh.update_patient, name='update_patient'),
    path('patients/supprimer/<str:id>/', vsh.delete_patient, name='supprimer_patient'),
    
     # dossier 
    path('creer_dossier/', vsh.creer_dossier, name='creer_dossier'),
    path('dossiers/', vsh.get_all_dossiers, name='get_all_dossiers'),
    path('dossiers/<str:id>/', vsh.get_dossier_by_id, name='get_dossier_by_id'),
    path('dossiers/modifier/<str:id>/', vsh.update_dossier, name='update_dossier'),
    path('dossiers/supprimer/<str:id>/', vsh.delete_dossier, name='delete_dossier'),
    
    #utilisateur
    path('creer_medecin/', vsh.creer_medecin, name='creer_medecin'),
    path('medecins/', vsh.get_all_medecins, name='get_all_medecins'),
    path('medecins/update/<str:id>/', vsh.update_medecin, name='update_medecin'),
    path('medecins/delete/<str:id>/', vsh.delete_medecin, name='delete_medecin'),
    
    path('creer_infirmier/', vsh.creer_infirmier, name='creer_infirmier'),
    path('infirmiers/', vsh.get_all_infirmiers, name='get_all_infirmiers'),
    path('infirmiers/update/<str:infirmier_id>/', vsh.update_infirmier, name='update_infirmier'),
    path('infirmiers/delete/<str:infirmier_id>/', vsh.delete_infirmier, name='delete_infirmier'),

    path('creer_personnel/', vsh.creer_personnel, name='creer_personnel'),
    path('personnels/', vsh.get_all_personnels, name='get_all_personnels'),
    path('personnels/update/<str:personnel_id>/', vsh.update_personnel, name='update_personnel'),
    path('personnels/delete/<str:personnel_id>/', vsh.delete_personnel, name='delete_personnel'),
    
    path('horaire/', vsh.faire_horaire, name='faire_horaire'),
    path('modifier_horaire/', vsh.modifier_horaire, name='modifier_horaire'),
    
     # URLs pour les rendez-vous
    path('rendezvous/creer/', vsh.creer_rendezvous, name='creer_rendezvous'),
    path('rendezvous/', vsh.get_all_rendezvous, name='get_all_rendezvous'),
    path('rendezvous/<str:id>/', vsh.get_rendezvous_by_id, name='get_rendezvous_by_id'),
    path('rendezvous/<str:id>/modifier/', vsh.update_rendezvous, name='update_rendezvous'),
    path('rendezvous/<str:id>/supprimer/', vsh.delete_rendezvous, name='delete_rendezvous'),
    
     # URLs pour les lits
    path('lits/creer/', vsh.creer_lit, name='creer_lit'),
    path('lits/', vsh.get_all_lits, name='get_all_lits'),
    path('lits/<str:id>/', vsh.get_lit_by_id, name='get_lit_by_id'),
    path('lits/<str:id>/modifier/', vsh.update_lit, name='update_lit'),
    path('lits/<str:id>/supprimer/', vsh.delete_lit, name='delete_lit'),
    
    # URLs pour les départements
    path('departements/creer/', vsh.creer_department, name='creer_departement'),
    path('departements/', vsh.get_all_departments, name='get_all_departements'),
    path('departements/<str:id>/', vsh.get_department_by_id, name='get_departement_by_id'),
    path('departements/<str:id>/modifier/', vsh.update_department, name='update_departement'),
    path('departements/<str:id>/supprimer/', vsh.delete_department, name='delete_departement'),

    # URLs pour les consultations
    path('consultations/creer/', vsh.creer_consultation, name='creer_consultation'),
    path('consultations/', vsh.get_all_consultations, name='get_all_consultations'),
    path('consultations/<str:id>/', vsh.get_consultation_by_id, name='get_consultation_by_id'),
    path('consultations/<str:id>/modifier/', vsh.update_consultation, name='update_consultation'),
    path('consultations/<str:id>/supprimer/', vsh.delete_consultation, name='delete_consultation'),
    
    path('horaires/creer/', vsh.creer_horaire, name='creer_horaire'),
    path('horaires/', vsh.faire_horaire, name='get_all_horaires'),
    path('horaires/<str:id>/modifier/', vsh.update_horaire, name='update_horaire'),
    
    path('medecin/mon_profil/', vsu.get_medecin_connecte, name='profil_medecin'),
    path('medecin/modifier/', vsu.update_medecin_connecte, name='update_current_medecin'),
    
    # URLs pour les patients
    path('patient/profil/', vsu.get_patient_connecte, name='profil_patient'),
    path('patient/modifier/', vsu.update_patient_connecte, name='update_patient_connecte'),

    # URLs pour les personnels
    path('personnel/profil/', vsu.get_personnel_connecte, name='profil_personnel'),
    path('personnel/modifier/', vsu.update_personnel_connecte, name='update_personnel_connecte'),

    # URLs pour les infirmiers
    path('infirmier/profil/', vsu.get_infirmier_connecte, name='profil_infirmier'),
    path('infirmier/modifier/', vsu.update_infirmier_connecte, name='update_infirmier_connecte'),
    
    path('medecin/consultations/', vsu.get_consultation_by_medecin, name='consultations_medecin'),
    path('patient/consultations/', vsu.get_consultation_by_patient, name='consultations_patient'),
    path('patient/dossiers/', vsu.get_dossier_by_patient, name='dossiers_patient'),
    path('medecin/dossiers/', vsu.get_dossier_by_medecin, name='dossiers_medecin'),
    path('infirmier/dossiers/', vsu.get_dossier_by_infirmier, name='dossiers_infirmier'),
    
    path('medecin/rendezvous/', vsu.get_rendezvous_by_medecin, name='rendezvous_medecin'),
    path('patient/rendezvous/', vsu.get_rendezvous_by_patient, name='rendezvous_patient'),
    path('patient/deplacer/', vsu.deplacer_patient, name='deplacer_patient'),
    
    path('messages/', vsu.afficher_messages, name='afficher_messages'),
    path('messages/envoyer/', vsu.envoyer_message, name='envoyer_message'),
    path('messages/<str:message_id>/lire/', vsu.lire_message, name='lire_message'),
    path('messages/<str:message_id>/supprimer/', vsu.supprimer_message, name='supprimer_message'),


]


