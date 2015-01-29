from django.shortcuts import render

# Create your views here.

def view(request,id):
    return render(request, 'maps_render/view.html',{'id':id})