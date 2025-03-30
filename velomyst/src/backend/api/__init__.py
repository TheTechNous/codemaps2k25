from fastapi import FastAPI


quack = FastAPI(
    title="Quack Back",
    summary="Quack " * 10,
)
