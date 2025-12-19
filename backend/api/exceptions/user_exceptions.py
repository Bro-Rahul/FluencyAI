class UserAlreadyExistsException(Exception):
    def __init__(self, username: str):
        self.username = username
        self.username = "User Already Exists for this credencial"
        self.error_code = 400
