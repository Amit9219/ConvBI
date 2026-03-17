import { motion } from 'framer-motion';
import { 
  Database, 
  MessageSquare, 
  BarChart3, 
  Zap, 
  ShieldCheck, 
  Globe 
} from 'lucide-react';

const features = [
  {
    icon: <Database className="text-indigo-600" size={24} />,
    title: "One-Click Data Import",
    description: "Upload CSV or JSON files effortlessly. Our system automatically parses and structures your data for instant analysis."
  },
  {
    icon: <MessageSquare className="text-indigo-600" size={24} />,
    title: "Conversational Querying",
    description: "Skip the complex SQL. Just ask 'What were the sales last quarter?' and get immediate, accurate answers."
  },
  {
    icon: <BarChart3 className="text-indigo-600" size={24} />,
    title: "Dynamic Visualizations",
    description: "Beautiful, interactive charts generated on the fly. Zoom, filter, and customize views without breaking a sweat."
  },
  {
    icon: <Zap className="text-indigo-600" size={24} />,
    title: "Real-Time Processing",
    description: "Experience lightning-fast speeds. Our optimized aggregation engine processes millions of rows in milliseconds."
  },
  {
    icon: <ShieldCheck className="text-indigo-600" size={24} />,
    title: "Enterprise Security",
    description: "Your data is encrypted at rest and in transit. Role-based access ensures only the right people see your insights."
  },
  {
    icon: <Globe className="text-indigo-600" size={24} />,
    title: "Collaborative Sharing",
    description: "Share dashboards with your team via secure links. Work together to uncover hidden trends and patterns."
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-slate-900 mb-6"
          >
            Powerful Features for <br />
            <span className="text-indigo-600">Data-Driven Teams</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500"
          >
            Everything you need to turn raw data into strategic decisions. No complex setup, no steeper learning curve.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group"
            >
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
