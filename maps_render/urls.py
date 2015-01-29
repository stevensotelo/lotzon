from django.conf.urls import patterns, url

urlpatterns=patterns('maps_render.views',
	url(r'^(?P<id>\d+)/$', 'view', name='view'),
)