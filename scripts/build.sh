#!/bin/bash
mkdir db feed audioFiles youtube-dl-binary
cd youtube-dl-binary && curl -L https://yt-dl.org/downloads/latest/youtube-dl && chmod a+rx ./youtube-dl
