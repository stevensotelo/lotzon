from django.conf.urls import patterns, url

urlpatterns=patterns('maps_data.views',
	url(r'^$', 'index', name='data_maps'),
)