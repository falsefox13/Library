# -*- coding:utf-8 -*-
from app import db
from app.models import User
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, SelectField
from wtforms import ValidationError
from wtforms.validators import Email, Length, DataRequired, EqualTo


class LoginForm(FlaskForm):
    email = StringField('Email',
                        validators=[DataRequired(message=u"Fill the email!"), Length(1, 64),
                                    Email(message=u"Are you sure it's an email?")])
    password = PasswordField(u'Password',
                             validators=[DataRequired(message=u"Field must be between 6 and 32 characters long!"),
                                         Length(6, 32)])
    remember_me = BooleanField(u"Remember me", default=True)
    submit = SubmitField(u'Submit')


class RegistrationForm(FlaskForm):
    email = StringField('Email',
                        validators=[DataRequired(message=u"Fill the email!"), Length(1, 64),
                                    Email(message=u"Are you sure it's an email?")])
    name = StringField(u'Name', validators=[DataRequired(message=u"Please enter your name!"), Length(1, 64)])
    password = PasswordField(u'Password',
                             validators=[DataRequired(message=u"Fill the password!"),
                                         EqualTo('password2', message=u'Passwords do not match'),
                                         Length(6, 32)])
    password2 = PasswordField(u'Confirm password', validators=[DataRequired(message=u"Please confirm again!")])
    category = SelectField('Category',
                        choices=[("0", "none"),
                                 ("1", 'Student'),
                                 ("2", 'Large families')])
    submit = SubmitField(u'Submit')

    def validate_email(self, filed):
        if User.query.filter(db.func.lower(User.email) == db.func.lower(filed.data)).first():
            raise ValidationError(u'Email is not valid')


class ChangePasswordForm(FlaskForm):
    old_password = PasswordField(u'Old password', validators=[DataRequired(message=u"Fill the password!")])
    new_password = PasswordField(u'New password', validators=[DataRequired(message=u"Fill the password!"),
                                                     EqualTo('confirm_password', message=u'Passwords do not match'),
                                                     Length(6, 32)])
    confirm_password = PasswordField(u'Confirm password', validators=[DataRequired(message=u"Fill the password!")])
    submit = SubmitField(u"Submit")

    def validate_old_password(self, filed):
        from flask_login import current_user
        if not current_user.verify_password(filed.data):
            raise ValidationError(u'Wrong old password')
