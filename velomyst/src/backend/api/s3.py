import os
import boto3

from api.utils.pool import run_in_thread

_S3 = boto3.client(
    service_name="s3",
    region_name=os.getenv("AWS_REGION_NAME"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

@run_in_thread
def _generate_presigned_url(meth: str, key: str):
    return _S3.generate_presigned_url(
        ClientMethod=meth,
        Params={
            "Bucket": os.getenv("BUCKET_NAME"),
            "Key": key
        }
    )

async def generate_view_url(key: str):
    return await _generate_presigned_url("get_object", key)

async def generate_upload_url(key: str):
    return await _generate_presigned_url("put_object", key)