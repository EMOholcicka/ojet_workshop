FROM python:3.9

WORKDIR /fast_api
COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./fast_api /fast_api/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]