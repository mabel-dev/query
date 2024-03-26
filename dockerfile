FROM python:3.11

RUN mkdir /app
WORKDIR /app
ADD . /app/


RUN pip install -r requirements.txt

RUN useradd --create-home chucknorris
USER chucknorris

ENV PYTHONUNBUFFERED=1
ENV LOG_SINK=WASURE

WORKDIR /app/src
ENV PYTHONPATH /app/src
CMD ["python", "/app/src/main.py"]