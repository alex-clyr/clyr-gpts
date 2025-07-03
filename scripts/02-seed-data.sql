-- Insert sample assistants
INSERT INTO assistants (name, description, category, subscription_type, openai_assistant_id) VALUES
('Code Assistant', 'Expert programming assistant that helps with coding, debugging, and software architecture.', 'Development', 'free', 'asst_code_sample_id'),
('Writing Coach', 'Professional writing assistant for essays, articles, and creative content.', 'Writing', 'premium', 'asst_writing_sample_id'),
('Data Analyst', 'Specialized in data analysis, visualization, and statistical insights.', 'Analytics', 'per_assistant', 'asst_data_sample_id'),
('Marketing Guru', 'Expert in digital marketing, SEO, and content strategy.', 'Marketing', 'premium', 'asst_marketing_sample_id'),
('Language Tutor', 'Multilingual assistant for language learning and translation.', 'Education', 'free', 'asst_language_sample_id'),
('Health Advisor', 'General health and wellness guidance assistant.', 'Health', 'per_assistant', 'asst_health_sample_id');

-- Create storage bucket for chat files
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-files', 'chat-files', true);

-- Create storage policy for chat files
CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'chat-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'chat-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
