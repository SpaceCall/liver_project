FROM python:3.9

WORKDIR /app


COPY requirements.txt requirements.txt
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y
RUN pip install -r requirements.txt
RUN pip install numpy --upgrade
RUN pip install lightgbm

COPY . .


CMD ["python3", "server.py"]