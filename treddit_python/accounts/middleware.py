class OpenIDMiddleware(object):
    """
    Populate request.openid and request.openids with their openid. This comes 
    either from their cookie or from their session, depending on the presence 
    of OPENID_USE_SESSIONS.
    """
    def process_request(self, request):
        request.openid = request.session.get('openid', None)
