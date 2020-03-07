FROM registry.ibiz5.com:5000/sadept2/ubuntu:magick

ENV SPRING_OUTPUT_ANSI_ENABLED=ALWAYS \
    IBZ_SLEEP=0 \
    JAVA_OPTS=""

CMD echo "The application will start in ${IBZ_SLEEP}s..." && \
    sleep ${IBZ_SLEEP} && \
    java ${JAVA_OPTS} -Djava.security.egd=file:/dev/./urandom -jar /ibzocr.jar

EXPOSE 8080

ADD ibzocr.jar /ibzocr.jar
