from celery import Celery, Task

def celery_init_app(app):
    class FlaskTask(Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(
        app.import_name,
        broker="redis://localhost:6379/1",
        backend="redis://localhost:6379/2",
        timezone="Asia/Kolkata",
        broker_connection_retry_on_startup=True
    )
    celery_app.Task = FlaskTask

    celery_app.conf.update(app.config)

    return celery_app
