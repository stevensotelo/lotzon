from django.conf.urls import patterns, url

urlpatterns=patterns('api.views',
	url(r'^check', 'check', name='check'),
)