"""
URL configuration for Projet_RCW project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from authapp import views as vsa
from hopital import views as vsh




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
    path('patients/<str:patient_id>/', vsh.get_patient_by_id, name='get_patient_by_id'),
    path('patients/modifier/<str:id>/', vsh.update_patient, name='update_patient'),
    path('patients/supprimer/<str:id>/', vsh.delete_patient, name='supprimer_patient'),
    
     # dossier 
    path('creer_dossier/', vsh.creer_dossier, name='creer_dossier'),
    path('dossiers/', vsh.get_all_dossiers, name='get_all_dossiers'),
    path('dossiers/<str:dossier_id>/', vsh.get_dossier_by_id, name='get_dossier_by_id'),
    path('dossiers/modifier/<str:dossier_id>/', vsh.update_dossier, name='update_dossier'),
    path('dossiers/supprimer/<str:dossier_id>/', vsh.delete_dossier, name='delete_dossier'),
    
    
]


