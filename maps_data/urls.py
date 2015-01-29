from django.conf.urls import patterns, url

urlpatterns=patterns('maps_data.views',
	url(r'^$', 'index', name='index'),
    url(r'^add', 'add', name='add'),
    url(r'^get/(?P<id>\d+)/$', 'get', name='get'),
)