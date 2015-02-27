from django.conf.urls import patterns, url

from points.views import PointsView

urlpatterns=patterns('',
	url(r'(?P<format>\w+)/$',PointsView.as_view(), name = 'api'),
)