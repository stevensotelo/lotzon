from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'lotzon.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
	
	# Index
	#url(r'^$', 'lotzon.views.index', name='index'),
    #Home
    #url(r'^home/', include('home.urls')),
    url(r'^$', include('home.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include('api.urls')),
)