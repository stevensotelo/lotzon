from django.conf.urls import patterns, url

from layers.views import LayersView

urlpatterns=patterns('',
	url(r'(?P<format>\w+)/$',LayersView.as_view(), name = 'api_layers'),
)