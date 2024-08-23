# authapp/context_processors.py
def role(request):
    return {
        'role': request.session.get('role')
    }
