const Dashboard = require('../models/Dashboard');

const getDashboardById = async (req, res) => {
  try {
    const dashboard = await Dashboard.findById(req.params.id).populate('charts.queryId');
    if (!dashboard || dashboard.user.toString() !== req.user.id) {
       return res.status(404).json({ message: 'Dashboard not found' });
    }
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveDashboard = async (req, res) => {
  try {
    const dashboard = await Dashboard.create({
      name: req.body.name || 'My Dashboard',
      user: req.user.id,
      charts: req.body.charts || []
    });
    res.status(201).json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboards = async (req, res) => {
  try {
    const dashboards = await Dashboard.find({ user: req.user.id });
    res.json(dashboards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardById, saveDashboard, getDashboards };
