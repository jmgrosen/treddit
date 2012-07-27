import datetime
from django.db import models
from djangotoolbox.fields import ListField


class User(models.Model):
	steam_id = models.IntegerField(primary_key=True)
	reputation = models.IntegerField(default=0)
	trades = ListField()
	is_staff = models.BooleanField(default=False)
	is_active = models.BooleanField(default=True)
	is_superuser = models.BooleanField(default=False)
	last_login = models.DateTimeField(default=datetime.datetime.now)
	date_joined = models.DateTimeField(default=datetime.datetime.now)

	username = models.CharField(max_length=255, blank=True)
	# denormalized webapi data go here

	def __unicode__(self):
		return self.username if self.username else u"?:{0}".format(self.steam_id)

	#def get_absolute_url(self):
	#	return "/users/%d/".format(self.steam_id)

	def is_anonymous(self):
		return False

	def is_authenticated(self):
		return True

	def get_and_delete_messages(self):
		messages = []
		for m in self.message_set.all():
			messages.append(m.message)
			m.delete()
		return messages


class Nonce(models.Model):
	server_url = models.URLField()
	timestamp  = models.IntegerField()
	salt = models.CharField(max_length=50)

	def __unicode__(self):
		return u"Nonce: {0}".format(self.nonce)


class Association(models.Model):
	server_url = models.TextField(max_length=2047)
	handle = models.CharField(max_length=255)
	secret = models.TextField(max_length=255) # Stored base64 encoded
	issued = models.IntegerField()
	lifetime = models.IntegerField()
	assoc_type = models.TextField(max_length=64)

	def __unicode__(self):
		return u"Association: {0}, {1}".format(self.server_url, self.handle)
