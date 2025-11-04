from datetime import datetime

class ChatMessage:
    def __init__(self, user_message, bot_response, timestamp=None):
        self.user_message = user_message
        self.bot_response = bot_response
        self.timestamp = timestamp or datetime.now()

    def to_dict(self):
        return {
            'user_message': self.user_message,
            'bot_response': self.bot_response,
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }