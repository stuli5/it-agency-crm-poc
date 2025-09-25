// backend/server.ts
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const { Pool } = pg;

// PostgreSQL connection
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'it_agency_crm', // Váš názov databázy
  user: 'jaro',      // Váš PostgreSQL user
  password: 'jJ255151001jJ',  // Vaše PostgreSQL heslo - ZMEŇTE!
});

// Test DB connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
  } else {
    console.log('Successfully connected to PostgreSQL database');
    release();
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// ============ CLIENTS ENDPOINTS ============
app.get('/api/clients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const { name, email, phone, company, address, ico, dic, ic_dph } = req.body;
    
    const result = await pool.query(
      `INSERT INTO clients (name, email, phone, company, address, ico, dic, ic_dph) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [name, email, phone, company, address, ico, dic, ic_dph]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, address, ico, dic, ic_dph } = req.body;
    
    const result = await pool.query(
      `UPDATE clients 
       SET name = $1, email = $2, phone = $3, company = $4, 
           address = $5, ico = $6, dic = $7, ic_dph = $8, updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [name, email, phone, company, address, ico, dic, ic_dph, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============ PROJECTS ENDPOINTS ============
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        c.name as client_name,
        c.company as client_company,
        array_agg(
          DISTINCT jsonb_build_object(
            'person_id', ba.person_id,
            'person_name', pe.name,
            'role', ba.role,
            'allocation', ba.allocation_percentage
          )
        ) FILTER (WHERE ba.person_id IS NOT NULL) as team_members
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      LEFT JOIN bodyshop_assignments ba ON p.id = ba.project_id
      LEFT JOIN people pe ON ba.person_id = pe.id
      GROUP BY p.id, c.name, c.company
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { 
      name, client_id, status, start_date, end_date, 
      budget, spent, progress, team_size, description, technologies 
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO projects 
       (name, client_id, status, start_date, end_date, budget, spent, progress, team_size, description, technologies)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [name, client_id, status, start_date, end_date, budget || 0, spent || 0, progress || 0, team_size || 1, description, technologies || []]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, client_id, status, start_date, end_date, 
      budget, spent, progress, team_size, description, technologies 
    } = req.body;
    
    const result = await pool.query(
      `UPDATE projects
       SET name = $1, client_id = $2, status = $3, start_date = $4, end_date = $5,
           budget = $6, spent = $7, progress = $8, team_size = $9, 
           description = $10, technologies = $11, updated_at = NOW()
       WHERE id = $12
       RETURNING *`,
      [name, client_id, status, start_date, end_date, budget, spent, progress, team_size, description, technologies, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============ PEOPLE ENDPOINTS ============
app.get('/api/people', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM people ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching people:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   GET    http://localhost:${PORT}/api/clients`);
  console.log(`   GET    http://localhost:${PORT}/api/projects`);
  console.log(`   GET    http://localhost:${PORT}/api/people`);
});