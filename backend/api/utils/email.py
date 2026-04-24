import smtplib
from email.message import EmailMessage

from fastapi import HTTPException, status

from api.config import settings


def send_password_reset_otp(email: str, username: str, otp: str):
    if not settings.SMTP_HOST or not settings.SMTP_FROM_EMAIL:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Email service is not configured.",
        )

    message = EmailMessage()
    message["Subject"] = "Fluency AI password reset OTP"
    message["From"] = settings.SMTP_FROM_EMAIL
    message["To"] = email
    message.set_content(
        "\n".join(
            [
                f"Hi {username},",
                "",
                f"Your Fluency AI password reset OTP is {otp}.",
                f"It will expire in {settings.PASSWORD_RESET_OTP_EXPIRE_MINUTES} minutes.",
                "",
                "If you did not request this, you can ignore this email.",
            ]
        )
    )

    try:
        if settings.SMTP_USE_SSL:
            with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
                    server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(message)
            return

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            if settings.SMTP_USE_TLS:
                server.starttls()
            if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.send_message(message)
    except smtplib.SMTPException as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to send OTP email right now.",
        ) from exc
