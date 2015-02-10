from django.conf.urls import patterns, url

urlpatterns=patterns('maps_render.views',
	url(r'^', 'index', name='index'),
)