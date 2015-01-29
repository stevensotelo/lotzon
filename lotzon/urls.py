from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
	# Index
	#url(r'^$', 'lotzon.views.index', name='index'),
    #Home
    url(r'^$', include('home.urls',namespace="home")),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^maps/data/', include('maps_data.urls',namespace="maps_data")),
    url(r'^maps/render/', include('maps_render.urls',namespace="maps_render")),
)