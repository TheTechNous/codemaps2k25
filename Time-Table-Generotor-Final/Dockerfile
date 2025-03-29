# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r Backend/requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variable
ENV NAME World

# Run app.py when the container launches
CMD ["hypercorn", "Backend.app:app", "--bind", "0.0.0.0:8000", "--reload"]

# Use the official image as a parent image
FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu

# Install Rust
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y

# Add Rust to the PATH
ENV PATH="/root/.cargo/bin:${PATH}"
