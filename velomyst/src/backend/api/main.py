from typing import Annotated
from uuid import uuid4

from fastapi import Form, HTTPException
from fastapi.responses import RedirectResponse
from pydantic import EmailStr

from api import quack, s3
from api.core.security.hashing import Security
from api.database import Database
from api.models.account import Account
from api.models.article import Article
from api.models.comment import Comment
from api.models.reference_link import ReferenceLink
from api.models.media import MediaMeta
from api.utils.parser import extract_media_ids

sec = Security()
DB = Database(name="test-env")

# TODO: aggregate match


@quack.get("/")
async def home():
    return {"quack": "quack"}


@quack.get("/upload-media-url")
async def generate_upload_media_url(ext: str, file_name: str):
    # add media type check
    fid = f"{uuid4().hex}.{ext.rstrip('.')}"
    await DB.s3.create(MediaMeta(file_id=fid, ext=ext, name=file_name))
    return {"url": await s3.generate_upload_url(fid)}


@quack.get("/media-view/{file_id}")
async def media_view(file_id: str):
    url = await s3.generate_view_url(file_id)
    # hack
    url = url.split("?", 1)[0]
    return RedirectResponse(url)


@quack.get("/post")
async def get_post(article_id: str):
    return await DB.article.find(article_id)


@quack.get("/posts")
async def explore_posts(): ...


@quack.post("/publish-article")
async def publish_article(
    body: Annotated[str, Form()],
    custom_link: Annotated[str, Form()],
    author_id: Annotated[str, Form()],
    banner_image_id: Annotated[str, Form()],
    categories: Annotated[list[int], Form()],
    reference_links: Annotated[list[ReferenceLink], Form()] = None,
):
    if not reference_links:
        reference_links = []
    media_ids = extract_media_ids(body)
    await DB.article.create(
        Article(
            text=body,
            custom_link=custom_link,
            author_id=author_id,
            banner_img=await DB.s3.find(banner_image_id),
            categories=[await DB.categories.find(cid) for cid in categories],
            reference_links=reference_links,
            embedded_img=[await DB.s3.find(fid) for fid in media_ids],
        )
    )


@quack.post("/create-account")
async def create_account(
    email: Annotated[EmailStr, Form()],
    username: Annotated[str, Form(pattern=r"[a-z0-9\.]+")],
    password: Annotated[str, Form()],
):
    await DB.account.create(
        Account(
            email=email.lower(),
            username=username,
            password=sec.hash_password(password.encode()),
        )
    )
    return {"token": "token"}


@quack.post("/add-comment")
async def add_comment(
    user_id: Annotated[str, Form()],
    article_id: Annotated[str, Form()],
    text: Annotated[str, Form()],
    media: MediaMeta | None = None,
):
    r = await DB.comments.create(
        Comment(user_id=user_id, article_id=article_id, text=text, media=media)
    )
    return {"comment_id": r.inserted_id}


@quack.post("/sign-in")
async def sign_in(email: Annotated[EmailStr, Form()], password: Annotated[str, Form()]):
    account = await DB.account.find_by_email(email.lower())
    if account.password != sec.hash_password(password):
        raise HTTPException(status_code=401, detail="Gu Away.")
    return {"token": "token"}
