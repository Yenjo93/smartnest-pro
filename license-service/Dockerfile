FROM python:3.13-slim
RUN groupadd --gid 10001 smartnest && useradd --uid 10001 --gid 10001 --no-create-home smartnest && mkdir /data && chown smartnest:smartnest /data
WORKDIR /app
COPY server.py /app/server.py
USER 10001:10001
ENV SMARTNEST_BIND=0.0.0.0 SMARTNEST_PORT=8080 SMARTNEST_DB=/data/licenses.sqlite3 PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
EXPOSE 8080
VOLUME ["/data"]
CMD ["python", "server.py", "serve"]
