from django.conf.urls.defaults import *

urlpatterns = patterns('accounts.views',
	url(r'^say-hi/$', 'signin', name='signin'),
	url(r'^hello/$', 'complete', name='openid_complete'),
	url(r'^bye/$', 'signout', name='signout'),
)
