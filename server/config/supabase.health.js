const supabase = require('./supabase');

const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase
      .from('test_connection')
      .select('id')
      .limit(1);

    if (error) throw error;

    console.log('✅ Supabase connected successfully');
  } catch (err) {
    console.error('❌ Supabase connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = checkSupabaseConnection;
