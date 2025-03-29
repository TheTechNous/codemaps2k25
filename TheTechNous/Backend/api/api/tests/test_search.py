from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Index

class AdvancedSearchTests(TestCase):
    """
    Test case for advanced search functionality.
    """

    def setUp(self):
        """
        Set up the test case with necessary initial data.
        """
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.es = Elasticsearch()
        self.index = Index('users')
        self.index.create()

    def tearDown(self):
        """
        Clean up after each test case.
        """
        self.index.delete()

    def test_search_no_query(self):
        """
        Test search functionality without any query parameters.
        """
        response = self.client.get('/api/search/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'success')
        self.assertEqual(len(response.data['data']), 0)

    def test_search_with_query(self):
        """
        Test search functionality with a query parameter.
        """
        self.es.index(index='users', id=1, body={'username': 'testuser', 'email': 'testuser@example.com'})
        self.es.indices.refresh(index='users')
        response = self.client.get('/api/search/', {'q': 'testuser'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'success')
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['username'], 'testuser')

    def test_search_with_filter(self):
        """
        Test search functionality with a filter parameter.
        """
        self.es.index(index='users', id=1, body={'username': 'testuser', 'email': 'testuser@example.com', 'is_active': True})
        self.es.index(index='users', id=2, body={'username': 'inactiveuser', 'email': 'inactiveuser@example.com', 'is_active': False})
        self.es.indices.refresh(index='users')
        response = self.client.get('/api/search/', {'filter_by': 'is_active'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'success')
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['username'], 'testuser')

    def test_search_with_sort(self):
        """
        Test search functionality with a sort parameter.
        """
        self.es.index(index='users', id=1, body={'username': 'user1', 'email': 'user1@example.com'})
        self.es.index(index='users', id=2, body={'username': 'user2', 'email': 'user2@example.com'})
        self.es.indices.refresh(index='users')
        response = self.client.get('/api/search/', {'sort_by': 'username'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'success')
        self.assertEqual(len(response.data['data']), 2)
        self.assertEqual(response.data['data'][0]['username'], 'user1')
        self.assertEqual(response.data['data'][1]['username'], 'user2')

    def test_search_with_highlighting(self):
        """
        Test search functionality with highlighting.
        """
        self.es.index(index='users', id=1, body={'username': 'highlightuser', 'email': 'highlightuser@example.com'})
        self.es.indices.refresh(index='users')
        response = self.client.get('/api/search/', {'q': 'highlightuser'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'success')
        self.assertIn('<em>highlightuser</em>', response.data['data'][0]['username'])
