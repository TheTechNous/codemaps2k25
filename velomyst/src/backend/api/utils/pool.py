import asyncio
from concurrent.futures import ThreadPoolExecutor
from functools import partial, wraps
from typing import Callable, Any


def run_in_thread(func: Callable[..., Any]) -> Callable[..., Any]:
    """ run in a thread """
    @wraps(func)
    async def wrapper(*args: Any, **kwargs: Any) -> Any:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(ThreadPoolExecutor(4), partial(func, *args, **kwargs))
    return wrapper
