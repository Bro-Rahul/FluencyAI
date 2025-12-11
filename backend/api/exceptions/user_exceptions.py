class UserAlreadyExistsException(Exception):
    def __init__(self, username: str):
        self.username = username
        self.error_code = 400