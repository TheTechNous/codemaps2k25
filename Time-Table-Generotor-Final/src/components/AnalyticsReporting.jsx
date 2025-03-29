import React, { useEffect, useState } from 'react';
import { fetchAnalyticsData, exportAnalyticsReport } from '../api/analytics';
import { Button } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { motion } from 'framer-motion';

const AnalyticsReporting = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAnalyticsData = async () => {
      try {
        const data = await fetchAnalyticsData();
        setAnalyticsData(data);
      } catch (error) {
        setError('Error fetching analytics data');
      } finally {
        setLoading(false);
      }
    };

    getAnalyticsData();
  }, []);

  const handleExport = async (format) => {
    try {
      await exportAnalyticsReport(format);
    } catch (error) {
      setError('Error exporting analytics report');
    }
  };

  if (loading) {
    return <div>Loading analytics data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const courseDistributionData = {
    labels: Object.keys(analyticsData.courseDistribution),
    datasets: [
      {
        label: 'Course Distribution',
        data: Object.values(analyticsData.courseDistribution),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const instructorWorkloadData = {
    labels: Object.keys(analyticsData.instructorWorkload),
    datasets: [
      {
        label: 'Instructor Workload',
        data: Object.values(analyticsData.instructorWorkload),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const constraintSatisfactionData = {
    labels: ['Satisfied', 'Not Satisfied'],
    datasets: [
      {
        label: 'Constraint Satisfaction',
        data: [
          analyticsData.constraintSatisfaction * 100,
          (1 - analyticsData.constraintSatisfaction) * 100,
        ],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Analytics and Reporting</h2>
      <div>
        <h3>Course Distribution</h3>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Bar data={courseDistributionData} />
        </motion.div>
      </div>
      <div>
        <h3>Instructor Workload</h3>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Bar data={instructorWorkloadData} />
        </motion.div>
      </div>
      <div>
        <h3>Constraint Satisfaction</h3>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Pie data={constraintSatisfactionData} />
        </motion.div>
      </div>
      <Button variant="contained" color="primary" onClick={() => handleExport('pdf')}>
        Export as PDF
      </Button>
      <Button variant="contained" color="secondary" onClick={() => handleExport('excel')}>
        Export as Excel
      </Button>
    </motion.div>
  );
};

export default AnalyticsReporting;
