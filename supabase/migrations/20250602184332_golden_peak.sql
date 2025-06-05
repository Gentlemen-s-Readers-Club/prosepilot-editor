-- Create storage bucket for book covers
INSERT INTO storage.buckets (id, name, public) 
VALUES ('covers', 'covers', true);

-- Allow authenticated users to upload files to the covers bucket
CREATE POLICY "Users can upload book covers"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'covers' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own book covers
CREATE POLICY "Users can update their own book covers"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'covers' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own book covers
CREATE POLICY "Users can delete their own book covers"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'covers' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public access to book covers
CREATE POLICY "Public can view book covers"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'covers');