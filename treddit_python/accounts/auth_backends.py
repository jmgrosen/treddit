from accounts.models import User
from django.conf import settings
from datetime import datetime


class SteamIdBackend:
	def authenticate(self, openid_key, request):
		steamid64 = openid_key.split("/")[-1]
		try:
			user = User.objects.get(steam_id = steamid64)
			# TODO schedule webapi call
		except User.DoesNotExist:
			user = User()
			user.steam_id = steamid64
			user.save()
			# TODO force synchronous webapi call
		return user
	
	def get_user(self, user_id):
		try:
			user = User.objects.get(pk=user_id)
			return user
		except User.DoesNotExist:
			return None
