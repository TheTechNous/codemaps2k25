import pandas as pd
import numpy as np


from api.models import UserActivityLog


def clean_activity_data(activity_data):
    """
    Clean the activity data by removing duplicates and handling missing values.

    :param activity_data: DataFrame containing activity data.
    :return: Cleaned DataFrame.
    """
    activity_data.drop_duplicates(inplace=True)
    activity_data.fillna(method='ffill', inplace=True)
    return activity_data


def transform_activity_data(activity_data):
    """
    Transform the activity data by converting timestamps to datetime and extracting features.

    :param activity_data: DataFrame containing activity data.
    :return: Transformed DataFrame.
    """
    activity_data['timestamp'] = pd.to_datetime(activity_data['timestamp'])
    activity_data['hour'] = activity_data['timestamp'].dt.hour
    activity_data['day_of_week'] = activity_data['timestamp'].dt.dayofweek
    return activity_data


def aggregate_activity_data(activity_data):
    """
    Aggregate the activity data by user and activity type.

    :param activity_data: DataFrame containing activity data.
    :return: Aggregated DataFrame.
    """
    aggregated_data = activity_data.groupby(['user_id', 'activity']).agg({
        'timestamp': ['min', 'max', 'count']
    }).reset_index()
    aggregated_data.columns = ['user_id', 'activity', 'first_activity', 'last_activity', 'activity_count']
    return aggregated_data


def preprocess_activity_data():
    """
    Preprocess the activity data by cleaning, transforming, and aggregating it.

    :return: Preprocessed DataFrame.
    """
    activity_logs = UserActivityLog.query.all()
    activity_data = pd.DataFrame([{
        'user_id': log.user_id,
        'activity': log.activity,
        'timestamp': log.timestamp
    } for log in activity_logs])

    cleaned_data = clean_activity_data(activity_data)
    transformed_data = transform_activity_data(cleaned_data)
    aggregated_data = aggregate_activity_data(transformed_data)

    return aggregated_data
