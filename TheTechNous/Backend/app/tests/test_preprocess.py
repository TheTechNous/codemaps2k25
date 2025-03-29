import unittest
import pandas as pd
from app.preprocess import (
    clean_activity_data,
    transform_activity_data,
    aggregate_activity_data,
)


class TestPreprocess(unittest.TestCase):
    def setUp(self):
        self.activity_data = pd.DataFrame(
            {
                "user_id": [1, 1, 2, 2, 3, 3],
                "activity": [
                    "login",
                    "logout",
                    "login",
                    "logout",
                    "login",
                    "logout",
                ],
                "timestamp": [
                    "2023-08-01 12:00:00",
                    "2023-08-01 12:05:00",
                    "2023-08-01 12:10:00",
                    "2023-08-01 12:15:00",
                    "2023-08-01 12:20:00",
                    "2023-08-01 12:25:00",
                ],
            }
        )

    def test_clean_activity_data(self):
        """
        Test the clean_activity_data function to ensure it removes duplicates
        and handles missing values correctly.
        """
        cleaned_data = clean_activity_data(self.activity_data.copy())
        self.assertEqual(len(cleaned_data), 6)
        self.assertFalse(cleaned_data.isnull().values.any())

    def test_transform_activity_data(self):
        """
        Test the transform_activity_data function to ensure it converts
        timestamps to datetime and extracts features correctly.
        """
        transformed_data = transform_activity_data(self.activity_data.copy())
        self.assertIn("hour", transformed_data.columns)
        self.assertIn("day_of_week", transformed_data.columns)
        self.assertEqual(transformed_data["hour"].iloc[0], 12)
        self.assertEqual(transformed_data["day_of_week"].iloc[0], 1)

    def test_aggregate_activity_data(self):
        """
        Test the aggregate_activity_data function to ensure it aggregates
        activity data by user and activity type correctly.
        """
        transformed_data = transform_activity_data(self.activity_data.copy())
        aggregated_data = aggregate_activity_data(transformed_data)
        self.assertEqual(len(aggregated_data), 6)
        self.assertIn("first_activity", aggregated_data.columns)
        self.assertIn("last_activity", aggregated_data.columns)
        self.assertIn("activity_count", aggregated_data.columns)


if __name__ == "__main__":
    unittest.main()
