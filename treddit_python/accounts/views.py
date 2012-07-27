from django.http import HttpResponse, HttpResponseRedirect, get_host
from django.shortcuts import render_to_response as render
from django.template import RequestContext
from django.core.urlresolvers import reverse
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from django.contrib import messages

import urllib
import openid
if openid.__version__ < '2.0.0':
	raise ImportError, 'You need python-openid 2.0.0 or newer'

from openid.consumer.consumer import Consumer, \
	SUCCESS, CANCEL, FAILURE, SETUP_NEEDED
from openid.consumer.discover import DiscoveryFailure
from yadis import xri

from util import OpenID, DjangoOpenIDStore, from_openid_response
from middleware import OpenIDMiddleware

from django.utils.html import escape

STEAM_PROVIDER_URL = "http://steamcommunity.com/openid/"

def get_url_host(request):
	if request.is_secure():
		protocol = 'https'
	else:
		protocol = 'http'
	host = escape(get_host(request))
	return '%s://%s' % (protocol, host)

def get_full_url(request):
	return get_url_host(request) + request.get_full_path()
		
next_url_re = re.compile('^/[-\w/]+$')

def is_valid_next_url(next):
	# When we allow this:
	#   /openid/?next=/welcome/
	# For security reasons we want to restrict the next= bit to being a local 
	# path, not a complete URL.
	return bool(next_url_re.match(next))

def signin(request, redirect_to=None):
	trust_root = getattr(
		settings, 'OPENID_TRUST_ROOT', get_url_host(request) + '/'
	)
	# foo derbis.
	redirect_to = redirect_to or reverse('openid_complete')
	# In case they were lazy...
	if not redirect_to.startswith('http://') or redirect_to.startswith('https://'):
		redirect_to =  get_url_host(request) + redirect_to

	if request.GET.get('next') and is_valid_next_url(request.GET['next']):
		if '?' in redirect_to:
			join = '&'
		else:
			join = '?'
		redirect_to += join + urllib.urlencode({
			'next': request.GET['next']
		})
    
	if xri.identifierScheme(STEAM_PROVIDER_URL) == 'XRI' and getattr(
		settings, 'OPENID_DISALLOW_INAMES', False
		):
		return on_failure(request, 'i-names are not supported')
    
	consumer = Consumer(request.session, DjangoOpenIDStore())

	try:
		auth_request = consumer.begin(STEAM_PROVIDER_URL)
	except DiscoveryFailure:
		return on_failure(request, 'The OpenID was invalid')

	redirect_url = auth_request.redirectURL(trust_root, redirect_to)
	return HttpResponseRedirect(redirect_url)

def complete(request):
	consumer = Consumer(request.session, DjangoOpenIDStore())
	#dummydebug
	#for r in request.GET.items():
	#    print r

	# JanRain library raises a warning if passed unicode objects as the keys, 
	# so we convert to bytestrings before passing to the library
	query_dict = dict([
		(k.encode('utf8'), v.encode('utf8')) for k, v in request.GET.items()
	])

	url = get_url_host(request) + request.path
	openid_response = consumer.complete(query_dict, url)
	if openid_response.status == SUCCESS:
		return on_success(request, openid_response.identity_url, openid_response)
	elif openid_response.status == CANCEL:
		return on_failure(request, 'The request was cancelled')
	elif openid_response.status == FAILURE:
		return on_failure(request, openid_response.message)
	elif openid_response.status == SETUP_NEEDED:
		return on_failure(request, 'Setup needed')
	else:
		assert False, "Bad openid status: %s" % openid_response.status

def on_success(request, identity_url, openid_response):
	request.session['openid'] = from_openid_response(openid_response)

	# Set up request.openids and request.openid, reusing middleware logic
	OpenIDMiddleware().process_request(request)

	if request.openid:
		#check for already existing associations
		openid_key = str(request.openid)
		#authenticate and login
		user = authenticate(openid_key=openid_key, request=request)
		if user:
			login(request, user)
			messages.success(request, "Hello!")
			next = request.GET.get('next', '').strip()
			if not next or not is_valid_next_url(next):
				next = reverse('index')
			return HttpResponseRedirect(next)
	return HttpResponseRedirect(reverse('index'))

def on_failure(request, message, template_name='accounts/failure.html'):
	messages.error(request, message)
	return render(template_name, {}, RequestContext(request))

def signout(request):
	request.session['openid'] = None
	logout(request)
	next = request.GET.get('next', '/')
	if not is_valid_next_url(next):
		next = '/'
	return HttpResponseRedirect(next)
