from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, BlogPost, User
from flask_caching import Cache
from marshmallow import ValidationError
from app.schemas import blog_post_schema
from app.activity_logger import log_user_activity
from app import app


blog = Blueprint('blog', __name__)
cache = Cache(config={'CACHE_TYPE': 'redis', 'CACHE_REDIS_URL': 'redis://localhost:6379/1'})
cache.init_app(app)


def can_post(user_id):
    user = User.query.get(user_id)
    return user.is_admin if user else False


@blog.route('/post', methods=['GET'])
@cache.cached(timeout=60)
def get_posts():
    """
    Retrieve all blog posts.

    **Response:**
    ```json
    [
      {
        "id": 1,
        "title": "New Blog Post",
        "content": "This is the content of the new blog post.",
        "author": "john_doe",
        "url": "/blog/post/1"
      }
    ]
    ```
    """
    posts = BlogPost.query.all()
    app.logger.info("Retrieved all blog posts")
    return jsonify([{"id": post.id, "title": post.title,
                     "content": post.content, "author": post.author.username, "url": post.get_absolute_url()} for post in posts]), 200


@blog.route('/post', methods=['POST'])
@jwt_required()
def create_post():
    """
    Create a new blog post.

    **Headers:**
    Authorization: Bearer your_jwt_token

    **Request:**
    ```json
    {
      "title": "New Blog Post",
      "content": "This is the content of the new blog post."
    }
    ```

    **Response:**
    ```json
    {
      "msg": "Post Created Successfully",
      "id": 1
    }
    ```
    """
    current_user_id = get_jwt_identity()
    if not can_post(current_user_id):
        return jsonify({"msg": "You don't have the permission to post"}), 403

    data = request.get_json()
    try:
        blog_post_schema.load(data)
    except ValidationError as err:
        return jsonify(err.messages), 400

    new_post = BlogPost(title=data['title'], content=data['content'], author_id=current_user_id)
    db.session.add(new_post)
    db.session.commit()

    cache.delete_memoized(get_posts)
    cache.delete_memoized(search_posts)

    app.logger.info(f"User {current_user_id} created a new post with ID {new_post.id}")
    log_user_activity(current_user_id, f'Created a new post with ID {new_post.id}')

    return jsonify({"msg": "Post Created Successfully", "id": new_post.id}), 201


@blog.route('/post/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    """
    Update an existing blog post.

    **Headers:**
    Authorization: Bearer your_jwt_token

    **Request:**
    ```json
    {
      "title": "Updated Blog Post",
      "content": "This is the updated content of the blog post."
    }
    ```

    **Response:**
    ```json
    {
      "msg": "Post Updated Successfully"
    }
    ```
    """
    current_user_id = get_jwt_identity()
    post = BlogPost.query.get(post_id)

    if not post:
        return jsonify({"msg": "Post not found"}), 404

    if post.author_id != current_user_id and not can_post(current_user_id):
        return jsonify({"msg": "You don't have the permission to update this post"}), 403

    data = request.get_json()
    try:
        blog_post_schema.load(data)
    except ValidationError as err:
        return jsonify(err.messages), 400

    post.title = data.get('title', post.title)
    post.content = data.get('content', post.content)
    db.session.commit()

    cache.delete_memoized(get_posts)
    cache.delete_memoized(search_posts)

    app.logger.info(f"User {current_user_id} updated post with ID {post_id}")
    log_user_activity(current_user_id, f'Updated post with ID {post_id}')

    return jsonify({"msg": "Post Updated Successfully"}), 200


@blog.route('/post/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    """
    Delete an existing blog post.

    **Headers:**
    Authorization: Bearer your_jwt_token

    **Response:**
    ```json
    {
      "msg": "Post Deleted Successfully"
    }
    ```
    """
    current_user_id = get_jwt_identity()
    post = BlogPost.query.get(post_id)

    if not post:
        return jsonify({"msg": "Post not found"}), 404

    if post.author_id != current_user_id and not can_post(current_user_id):
        return jsonify({"msg": "You don't have the permission to delete this post"}), 403

    db.session.delete(post)
    db.session.commit()

    cache.delete_memoized(get_posts)
    cache.delete_memoized(search_posts)

    app.logger.info(f"User {current_user_id} deleted post with ID {post_id}")
    log_user_activity(current_user_id, f'Deleted post with ID {post_id}')

    return jsonify({"msg": "Post Deleted Successfully"}), 200


@blog.route('/search', methods=['GET'])
@cache.cached(timeout=60)
def search_posts():
    """
    Search for blog posts by title or content.

    **Request:**
    `GET /blog/search?q={query}`

    **Response:**
    ```json
    [
      {
        "id": 1,
        "title": "New Blog Post",
        "content": "This is the content of the new blog post.",
        "author": "john_doe",
        "url": "/blog/post/1"
      }
    ]
    ```
    """
    query = request.args.get('q', '')
    posts = BlogPost.query.filter(BlogPost.title.contains(query) | BlogPost.content.contains(query)).all()
    app.logger.info(f"Search query: {query} - Found {len(posts)} posts")
    return jsonify([{"id": post.id, "title": post.title,
                     "content": post.content, "author": post.author.username, "url": post.get_absolute_url()} for post in posts]), 200
